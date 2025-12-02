#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Conversor de produtos WordPress/WooCommerce para Sanity Studio
Lê o CSV exportado do WooCommerce e converte para JSON compatível com Sanity
"""

import csv
import json
import re
import uuid
from datetime import datetime
import os
from pathlib import Path
import html
import logging

# Configuração de logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

class WordPressToSanity:
    def __init__(self, csv_file=None, output_file=None):
        self.csv_file = csv_file
        self.output_file = output_file or 'produtos_wordpress_para_sanity.json'
        self.products = []
        self.errors = []
        
        # Mapeamento de categorias do WordPress para Sanity
        self.category_mapping = {
            'vestuário': 'vestuario',
            'vestuario': 'vestuario',
            'acessórios': 'equipamento',
            'acessorios': 'equipamento',
            'suplementos': 'suplementos',
            'suplemento': 'suplementos',
            'nutrição': 'suplementos',
            'nutricao': 'suplementos',
            'alquimia da saúde': 'suplementos',
            'alquimia da saude': 'suplementos',
            'destaque': 'suplementos',  # Categoria padrão para "Destaque"
            'bikes': 'bikes',
            'bicicletas': 'bikes',
            'equipamentos': 'equipamento',
            'equipamento': 'equipamento',
            'bolsas': 'bolsas',
            'mochilas': 'bolsas',
            'livro': 'livro',
            'livros': 'livro',
        }
    
    def clean_html(self, text):
        """Remove tags HTML e limpa o texto"""
        if not text:
            return ""
        
        # Remove tags HTML
        text = re.sub(r'<[^>]+>', '', str(text))
        
        # Decodifica entidades HTML
        text = html.unescape(text)
        
        # Remove quebras de linha excessivas e espaços
        text = re.sub(r'\n+', '\n', text)
        text = re.sub(r'\s+', ' ', text)
        
        # Remove &nbsp; e outros caracteres especiais
        text = text.replace('&nbsp;', ' ')
        text = text.replace('\xa0', ' ')
        
        return text.strip()
    
    def normalize_category(self, categories_str):
        """Normaliza as categorias do WordPress para Sanity"""
        if not categories_str:
            return 'equipamento'  # Categoria padrão
        
        # Divide por vírgula e limpa
        categories = [cat.strip().lower() for cat in str(categories_str).split(',')]
        
        # Procura por categoria mapeada
        for category in categories:
            normalized = self.normalize_string(category)
            if normalized in self.category_mapping:
                return self.category_mapping[normalized]
        
        # Se não encontrou, retorna a primeira categoria ou padrão
        if categories and categories[0]:
            first_cat = self.normalize_string(categories[0])
            return self.category_mapping.get(first_cat, 'equipamento')
        
        return 'equipamento'
    
    def normalize_string(self, text):
        """Normaliza string para comparação"""
        if not text:
            return ""
        return re.sub(r'[^\w\s]', '', str(text).lower().strip())
    
    def create_slug(self, title):
        """Cria um slug válido para Sanity"""
        if not title:
            return f"produto-{uuid.uuid4().hex[:8]}"
        
        slug = self.normalize_string(title)
        slug = re.sub(r'\s+', '-', slug)
        slug = slug[:96]  # Limite do Sanity
        
        return slug or f"produto-{uuid.uuid4().hex[:8]}"
    
    def extract_price(self, price_str):
        """Extrai preço do formato brasileiro"""
        if not price_str:
            return 0.0
        
        # Remove tudo exceto números, vírgulas e pontos
        price_clean = re.sub(r'[^\d,.]', '', str(price_str))
        
        if not price_clean:
            return 0.0
        
        try:
            # Se tem vírgula, assume formato brasileiro (123,45)
            if ',' in price_clean:
                # Remove pontos (separadores de milhares) e converte vírgula para ponto
                price_clean = price_clean.replace('.', '').replace(',', '.')
            
            return float(price_clean)
        except ValueError:
            logger.warning(f"Não foi possível converter preço: {price_str}")
            return 0.0
    
    def extract_images(self, images_str):
        """Extrai URLs de imagens"""
        if not images_str:
            return []
        
        # Divide por vírgulas e limpa
        image_urls = []
        urls = str(images_str).split(',')
        
        for url in urls:
            url = url.strip()
            if url and url.startswith('http'):
                image_urls.append(url)
        
        return image_urls
    
    def create_image_reference(self, image_urls, title):
        """Cria referência placeholder para imagem"""
        if not image_urls:
            return None
        
        # Usa a primeira imagem como principal
        main_image_url = image_urls[0]
        
        # Cria um ID de referência baseado na URL
        image_id = re.sub(r'[^\w-]', '-', main_image_url.split('/')[-1])
        image_id = f"image-{image_id[:50]}-800x600-jpg"
        
        return {
            "_type": "image",
            "alt": title,
            "asset": {
                "_ref": image_id,
                "_type": "reference"
            }
        }
    
    def extract_variants(self, row):
        """Extrai variantes dos atributos do produto"""
        variants = []
        
        # Verifica atributos (Tamanho, Cor, Sabor, etc.)
        for i in range(1, 5):  # Verifica até 4 atributos
            attr_name_col = f"Nome do atributo {i}"
            attr_values_col = f"Valores do atributo {i}"
            
            if attr_name_col in row and attr_values_col in row:
                attr_name = row[attr_name_col]
                attr_values = row[attr_values_col]
                
                if attr_name and attr_values:
                    # Divide os valores por vírgula
                    values = [v.strip() for v in str(attr_values).split(',')]
                    
                    for value in values:
                        if value:
                            variants.append({
                                "_key": uuid.uuid4().hex[:12],
                                "_type": "variant",
                                "name": f"{attr_name}: {value}",
                                "inStock": True,
                                "priceModifier": 0
                            })
        
        return variants
    
    def process_csv_row(self, row, row_number):
        """Processa uma linha do CSV"""
        try:
            # Pula produtos do tipo 'variation' (variações)
            if row.get('Tipo') == 'variation':
                return None
            
            # Dados básicos
            wp_id = row.get('ID', '')
            title = row.get('Nome', '').strip()
            description = self.clean_html(row.get('Descrição', ''))
            short_description = self.clean_html(row.get('Descrição curta', ''))
            price = self.extract_price(row.get('Preço', '0'))
            categories = row.get('Categorias', '')
            images = self.extract_images(row.get('Imagens', ''))
            in_stock = row.get('Em estoque?', '1') == '1'
            featured = row.get('Em destaque?', '0') == '1'
            
            # Valida dados obrigatórios
            if not title:
                self.errors.append(f"Linha {row_number}: Produto sem nome")
                return None
            
            # Cria o produto Sanity
            product = {
                "_createdAt": datetime.utcnow().isoformat() + "Z",
                "_id": str(uuid.uuid4()),
                "_rev": str(uuid.uuid4()),
                "_type": "product",
                "_updatedAt": datetime.utcnow().isoformat() + "Z",
                "title": title,
                "slug": {
                    "_type": "slug",
                    "current": self.create_slug(title)
                },
                "price": price,
                "category": self.normalize_category(categories),
                "inStock": in_stock,
                "featured": featured,
                "description": description or short_description,
                "brand": "Power House Brasil"
            }
            
            # Adiciona imagem se disponível
            image_ref = self.create_image_reference(images, title)
            if image_ref:
                product["image"] = image_ref
            
            # Adiciona variantes se existirem
            variants = self.extract_variants(row)
            if variants:
                product["variants"] = variants
            
            # Metadados do WordPress (para referência)
            product["_wordpress"] = {
                "id": wp_id,
                "original_categories": categories,
                "image_urls": images,
                "type": row.get('Tipo', '')
            }
            
            logger.info(f"✅ Processado: {title} (Categoria: {product['category']})")
            return product
            
        except Exception as e:
            error_msg = f"Erro na linha {row_number}: {str(e)}"
            logger.error(error_msg)
            self.errors.append(error_msg)
            return None
    
    def convert_csv_to_json(self):
        """Converte o CSV para JSON"""
        logger.info(f"🚀 Iniciando conversão: {self.csv_file}")
        
        if not os.path.exists(self.csv_file):
            raise FileNotFoundError(f"Arquivo não encontrado: {self.csv_file}")
        
        processed_count = 0
        skipped_count = 0
        
        try:
            with open(self.csv_file, 'r', encoding='utf-8') as file:
                # Detecta o delimitador
                sample = file.read(2048)
                file.seek(0)
                
                sniffer = csv.Sniffer()
                delimiter = sniffer.sniff(sample).delimiter
                
                reader = csv.DictReader(file, delimiter=delimiter)
                
                logger.info(f"📊 Colunas encontradas: {len(reader.fieldnames)}")
                logger.info(f"🔍 Delimitador detectado: '{delimiter}'")
                
                for row_number, row in enumerate(reader, start=2):
                    product = self.process_csv_row(row, row_number)
                    
                    if product:
                        self.products.append(product)
                        processed_count += 1
                    else:
                        skipped_count += 1
                        
        except Exception as e:
            logger.error(f"Erro ao ler CSV: {e}")
            raise
        
        # Salva o resultado
        self.save_json()
        
        # Relatório final
        self.print_summary(processed_count, skipped_count)
    
    def save_json(self):
        """Salva os produtos em JSON"""
        output_path = Path(self.output_file)
        
        try:
            with open(output_path, 'w', encoding='utf-8') as file:
                json.dump(self.products, file, ensure_ascii=False, indent=2)
            
            logger.info(f"✅ JSON salvo: {output_path.absolute()}")
            
        except Exception as e:
            logger.error(f"Erro ao salvar JSON: {e}")
            raise
    
    def print_summary(self, processed_count, skipped_count):
        """Imprime o resumo da conversão"""
        print("\n" + "="*70)
        print("📊 RESUMO DA CONVERSÃO WORDPRESS → SANITY")
        print("="*70)
        print(f"✅ Produtos processados: {processed_count}")
        print(f"⏭️ Produtos pulados: {skipped_count}")
        print(f"❌ Erros: {len(self.errors)}")
        print(f"📁 Arquivo de saída: {self.output_file}")
        
        if self.errors:
            print(f"\n❌ Erros encontrados:")
            for error in self.errors[:10]:  # Mostra apenas os primeiros 10 erros
                print(f"   • {error}")
            
            if len(self.errors) > 10:
                print(f"   ... e mais {len(self.errors) - 10} erros")
        
        # Estatísticas por categoria
        if self.products:
            print(f"\n📂 Produtos por categoria:")
            category_stats = {}
            for product in self.products:
                cat = product.get('category', 'indefinida')
                category_stats[cat] = category_stats.get(cat, 0) + 1
            
            for category, count in sorted(category_stats.items()):
                print(f"   • {category}: {count} produtos")
        
        print("\n🎯 Próximos passos:")
        print("   1. Revisar o JSON gerado")
        print("   2. Fazer upload das imagens para Sanity")
        print("   3. Importar produtos no Sanity Studio")
        print("   4. Verificar e corrigir referências de imagem")
        print("="*70)

def main():
    """Função principal"""
    print("🚀 WORDPRESS TO SANITY CONVERTER")
    print("="*50)
    
    # Input do arquivo CSV
    csv_file = input("📁 Digite o caminho do arquivo CSV do WordPress: ").strip()
    
    if not csv_file:
        csv_file = "wc-product-export-13-8-2025-1755062181561.csv"
        print(f"📁 Usando arquivo padrão: {csv_file}")
    
    # Valida arquivo
    if not os.path.exists(csv_file):
        print(f"❌ Arquivo não encontrado: {csv_file}")
        return
    
    # Nome do arquivo de saída
    output_file = f"produtos_wordpress_para_sanity_{datetime.now().strftime('%Y%m%d_%H%M')}.json"
    
    try:
        converter = WordPressToSanity(csv_file, output_file)
        converter.convert_csv_to_json()
        
        print("\n✅ Conversão concluída com sucesso!")
        
    except Exception as e:
        print(f"\n❌ Erro durante a conversão: {e}")
        logger.exception("Erro detalhado:")

if __name__ == "__main__":
    main()