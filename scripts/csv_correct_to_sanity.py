#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Conversor do CSV correto (powerhouse_scicon_gravtah_pg1_4.csv) para Sanity
Usa as fotos já baixadas em public/img/products/wordpress/
"""

import csv
import json
import re
import uuid
from datetime import datetime
from pathlib import Path
import os

class CorrectCSVToSanity:
    def __init__(self):
        self.csv_file = 'powerhouse_scicon_gravtah_pg1_4.csv'
        self.images_dir = Path('public/img/products/wordpress')
        self.output_file = f'produtos_corretos_para_sanity_{datetime.now().strftime("%Y%m%d_%H%M")}.json'
        self.mapping_file = f'produtos_corretos_mapping_{datetime.now().strftime("%Y%m%d_%H%M")}.json'
        
        # Mapeamento de categorias
        self.category_mapping = {
            'equipamento': 'equipamento',
            'bolsas': 'bolsas',
            'óculos': 'equipamento',
            'pneus': 'bikes',
            'acessórios': 'equipamento',
            'livro': 'livro'
        }
        
        self.products = []
        self.image_mapping = {}
        
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
                price_clean = price_clean.replace('.', '').replace(',', '.')
            
            return float(price_clean)
        except ValueError:
            return 0.0
    
    def normalize_category(self, category_str):
        """Normaliza categoria para o padrão Sanity"""
        if not category_str:
            return 'equipamento'
        
        normalized = self.normalize_string(category_str)
        return self.category_mapping.get(normalized, 'equipamento')
    
    def sanitize_filename(self, filename):
        """Sanitiza o nome do arquivo"""
        filename = re.sub(r'[^\w\s-]', '', filename)
        filename = re.sub(r'[-\s]+', '-', filename)
        return filename.lower().strip('-')
    
    def find_matching_image(self, product_title, category):
        """Encontra imagem correspondente no diretório de imagens"""
        # Normaliza o título do produto para busca
        normalized_title = self.sanitize_filename(product_title)
        
        # Lista todas as imagens na categoria
        category_dir = self.images_dir / category
        if not category_dir.exists():
            category_dir = self.images_dir / 'equipamento'  # Fallback
        
        if not category_dir.exists():
            return None
        
        # Procura por imagens que contenham palavras-chave do título
        title_words = normalized_title.split('-')
        
        for image_file in category_dir.glob('*'):
            if image_file.is_file() and image_file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']:
                image_name = self.sanitize_filename(image_file.stem)
                
                # Verifica se há palavras em comum
                image_words = image_name.split('-')
                common_words = set(title_words) & set(image_words)
                
                # Se há pelo menos 2 palavras em comum, considera match
                if len(common_words) >= 2:
                    return f"/img/products/wordpress/{category}/{image_file.name}"
        
        # Se não encontrou, pega a primeira imagem da categoria
        for image_file in category_dir.glob('*'):
            if image_file.is_file() and image_file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']:
                return f"/img/products/wordpress/{category}/{image_file.name}"
        
        return None
    
    def create_image_reference(self, image_path, title):
        """Cria referência de imagem para Sanity"""
        if not image_path:
            return None
        
        # Cria um ID de referência baseado no caminho
        image_id = re.sub(r'[^\w-]', '-', image_path.split('/')[-1])
        image_id = f"image-wp-{image_id[:50]}-800x600-jpg"
        
        return {
            "_type": "image",
            "alt": title,
            "asset": {
                "_ref": image_id,
                "_type": "reference"
            }
        }
    
    def process_csv(self):
        """Processa o CSV e converte para formato Sanity"""
        print(f'🔍 Processando CSV: {self.csv_file}')
        
        try:
            with open(self.csv_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                csv_products = list(reader)
            
            print(f'📊 {len(csv_products)} produtos encontrados no CSV')
            
            for i, row in enumerate(csv_products, 1):
                title = row.get('title', '').strip()
                if not title:
                    continue
                
                price = self.extract_price(row.get('price', '0'))
                category = self.normalize_category(row.get('category', 'Equipamento'))
                description = row.get('description', '').strip()
                
                # Busca imagem correspondente
                image_path = self.find_matching_image(title, category)
                
                # Cria produto Sanity
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
                    "category": category,
                    "inStock": True,
                    "featured": False,
                    "description": description or f"Produto Power House Brasil: {title}",
                    "brand": row.get('brand', 'Power House Brasil')
                }
                
                # Adiciona imagem se encontrada
                if image_path:
                    product["image"] = self.create_image_reference(image_path, title)
                    
                    # Guarda mapeamento
                    self.image_mapping[title] = {
                        'local_path': image_path,
                        'category': category,
                        'price': f"R$ {price:.2f}".replace('.', ',')
                    }
                
                # Metadados do CSV original
                product["_csv_data"] = {
                    "sku": row.get('sku', ''),
                    "original_category": row.get('category', ''),
                    "subcategory": row.get('subcategory', ''),
                    "external_ref": row.get('externalRef', ''),
                    "status": row.get('status', 'draft')
                }
                
                self.products.append(product)
                
                print(f'✅ [{i:2d}/{len(csv_products)}] {title} (Categoria: {category})')
                if image_path:
                    print(f'    📷 Imagem: {image_path}')
                else:
                    print(f'    ⚠️ Sem imagem encontrada')
            
            print(f'\n📦 Total processado: {len(self.products)} produtos')
            
        except Exception as e:
            print(f'❌ Erro ao processar CSV: {e}')
            raise
    
    def save_files(self):
        """Salva os arquivos JSON"""
        try:
            # Salva produtos para Sanity
            with open(self.output_file, 'w', encoding='utf-8') as f:
                json.dump(self.products, f, ensure_ascii=False, indent=2)
            print(f'✅ Produtos salvos: {self.output_file}')
            
            # Salva mapeamento de imagens
            with open(self.mapping_file, 'w', encoding='utf-8') as f:
                json.dump(self.image_mapping, f, ensure_ascii=False, indent=2)
            print(f'✅ Mapeamento salvo: {self.mapping_file}')
            
        except Exception as e:
            print(f'❌ Erro ao salvar arquivos: {e}')
            raise
    
    def print_summary(self):
        """Imprime resumo do processamento"""
        print('\n' + '='*70)
        print('📊 RESUMO DO PROCESSAMENTO')
        print('='*70)
        print(f'✅ Produtos processados: {len(self.products)}')
        print(f'📷 Produtos com imagem: {len(self.image_mapping)}')
        print(f'⚠️ Produtos sem imagem: {len(self.products) - len(self.image_mapping)}')
        
        # Estatísticas por categoria
        categories = {}
        for product in self.products:
            cat = product['category']
            categories[cat] = categories.get(cat, 0) + 1
        
        print(f'\n📂 Por categoria:')
        for cat, count in categories.items():
            with_image = len([p for p in self.products if p['category'] == cat and p['title'] in self.image_mapping])
            print(f'   • {cat}: {count} produtos ({with_image} com imagem)')
        
        print(f'\n📁 Arquivos gerados:')
        print(f'   • {self.output_file}')
        print(f'   • {self.mapping_file}')
        
        print('\n🎯 Próximos passos:')
        print('   1. Fazer upload para Sanity usando upload_to_sanity.js')
        print('   2. Verificar produtos no Sanity Studio')
        print('   3. Testar no frontend')
        print('='*70)

def main():
    """Função principal"""
    print('🚀 CONVERSOR CSV CORRETO PARA SANITY')
    print('='*60)
    
    converter = CorrectCSVToSanity()
    
    try:
        converter.process_csv()
        converter.save_files()
        converter.print_summary()
        
        print('\n✅ Conversão concluída com sucesso!')
        
    except Exception as e:
        print(f'\n❌ Erro durante a conversão: {e}')

if __name__ == "__main__":
    main()