#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
WordPress HTML Photo Extractor
Extrai URLs das imagens do HTML do WordPress/WooCommerce e organiza por categoria
Diferencia produtos por página/categoria automaticamente
"""

import json
import os
import requests
import re
import time
from urllib.parse import urljoin, urlparse
from pathlib import Path
import hashlib
from bs4 import BeautifulSoup
from datetime import datetime
import uuid

class WordPressHTMLExtractor:
    def __init__(self, html_file="html.html", csv_file="wc-product-export-13-8-2025-1755062181561.csv"):
        self.html_file = html_file
        self.csv_file = csv_file
        self.output_dir = Path("public/img/products/wordpress")
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        
        # Mapeamento de categorias WordPress para Sanity
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
            'destaque': 'suplementos',
            'bikes': 'bikes',
            'bicicletas': 'bikes',
            'equipamentos': 'equipamento',
            'equipamento': 'equipamento',
            'bolsas': 'bolsas',
            'mochilas': 'bolsas',
            'capa-para-sapatilha': 'vestuario',
            'pneus-mtb': 'bikes',
            'pneus-gravel': 'bikes',
            'oculos-scicon': 'equipamento',
            'mala-bike-scicon': 'bolsas',
            'luvas-supacaz': 'vestuario',
            'scicon-gravtah': 'equipamento',
            'livro': 'livro',
            'livros': 'livro'
        }
        
        # Produtos do CSV para referência
        self.csv_products = {}
        
        # Produtos extraídos do HTML
        self.html_products = {}

    def load_csv_products(self):
        """Carrega produtos do CSV para referência"""
        if not os.path.exists(self.csv_file):
            print(f"⚠️ Arquivo CSV não encontrado: {self.csv_file}")
            return
        
        try:
            import csv
            with open(self.csv_file, 'r', encoding='utf-8') as file:
                # Detecta delimitador
                sample = file.read(2048)
                file.seek(0)
                sniffer = csv.Sniffer()
                delimiter = sniffer.sniff(sample).delimiter
                
                reader = csv.DictReader(file, delimiter=delimiter)
                
                for row in reader:
                    wp_id = row.get('ID', '')
                    title = row.get('Nome', '').strip()
                    categories = row.get('Categorias', '')
                    price = row.get('Preço', '0')
                    
                    if title and wp_id:
                        self.csv_products[wp_id] = {
                            'title': title,
                            'categories': categories,
                            'price': price,
                            'normalized_title': self.normalize_title(title)
                        }
                
                print(f"✅ Carregados {len(self.csv_products)} produtos do CSV")
                
        except Exception as e:
            print(f"❌ Erro ao carregar CSV: {e}")

    def normalize_title(self, title):
        """Normaliza títulos para facilitar comparação"""
        if not title:
            return ""
        
        # Remove caracteres especiais, converte para lowercase
        normalized = re.sub(r'[^\w\s]', '', title.lower())
        normalized = re.sub(r'\s+', ' ', normalized).strip()
        
        # Remove palavras comuns que podem variar
        words_to_remove = ['box', 'sachês', 'saches', 'cápsulas', 'vegetais', 'caps', 'g', 'mg', 'ml', 'kg']
        for word in words_to_remove:
            normalized = normalized.replace(f' {word} ', ' ')
            normalized = normalized.replace(f' {word}', '')
            normalized = normalized.replace(f'{word} ', '')
        
        return normalized.strip()

    def extract_category_from_classes(self, item_element):
        """Extrai categoria das classes CSS do item"""
        classes = item_element.get('class', [])
        
        for class_name in classes:
            # Remove prefixos comuns
            clean_class = class_name.replace('product_cat-', '').replace('product-cat-', '')
            
            # Verifica se é uma categoria conhecida
            if clean_class in self.category_mapping:
                return self.category_mapping[clean_class]
        
        return 'equipamento'  # Categoria padrão

    def extract_products_from_html(self):
        """Extrai produtos e URLs das imagens do HTML"""
        try:
            with open(self.html_file, 'r', encoding='utf-8') as f:
                html_content = f.read()
        except FileNotFoundError:
            print(f"❌ Arquivo {self.html_file} não encontrado!")
            return {}

        # Parse do HTML
        soup = BeautifulSoup(html_content, 'html.parser')
        products = {}
        
        # Diferentes seletores para produtos WordPress/WooCommerce
        selectors = [
            'li.product',  # Padrão WooCommerce
            '.product-item',
            '.woocommerce-LoopProduct-link',
            'div.listagem-item'  # Seu HTML customizado
        ]
        
        product_items = []
        for selector in selectors:
            items = soup.select(selector)
            if items:
                product_items.extend(items)
                print(f"🔍 Encontrados {len(items)} produtos com seletor: {selector}")
        
        if not product_items:
            print("❌ Nenhum produto encontrado no HTML")
            return {}
        
        print(f"🔍 Total de {len(product_items)} produtos encontrados")
        
        for i, item in enumerate(product_items):
            try:
                # Extrai o nome do produto (múltiplos seletores)
                title_element = (
                    item.find('h2', class_='woocommerce-loop-product__title') or
                    item.find('a', class_='nome-produto') or
                    item.find('a', class_='woocommerce-LoopProduct-link') or
                    item.find('h2') or
                    item.find('h3')
                )
                
                if not title_element:
                    continue
                
                title = title_element.get_text(strip=True)
                if not title:
                    # Tenta extrair do atributo href se for um link
                    if title_element.name == 'a':
                        href = title_element.get('href', '')
                        # Extrai título da URL
                        title = href.split('/')[-2] if href.endswith('/') else href.split('/')[-1]
                        title = title.replace('-', ' ').title()
                
                if not title:
                    continue
                
                # Extrai a URL da imagem principal (múltiplos seletores)
                img_element = (
                    item.find('img', class_='wp-post-image') or
                    item.find('img', class_='attachment-shop_catalog') or
                    item.find('img', class_='imagem-principal') or
                    item.find('img')
                )
                
                if not img_element:
                    continue
                
                img_url = img_element.get('src')
                if not img_url:
                    continue
                
                # Extrai categoria das classes CSS
                category = self.extract_category_from_classes(item)
                
                # Extrai preço se disponível
                price_element = item.find('span', class_='price') or item.find('.price')
                price = ''
                if price_element:
                    price = price_element.get_text(strip=True)
                
                # Extrai URL da página do produto
                product_link = ''
                link_element = item.find('a')
                if link_element:
                    product_link = link_element.get('href', '')
                
                # Gera um ID único baseado na URL ou título
                product_id = f"wp-html-{i+1}-{hashlib.md5(title.encode()).hexdigest()[:8]}"
                
                products[product_id] = {
                    'id': product_id,
                    'title': title,
                    'image_url': img_url,
                    'product_url': product_link,
                    'category': category,
                    'price': price,
                    'normalized_title': self.normalize_title(title),
                    'source': 'html'
                }
                
                print(f"✅ Extraído: {title}")
                print(f"   📂 Categoria: {category}")
                print(f"   📷 Imagem: {img_url}")
                print(f"   💰 Preço: {price}")
                print()
                
            except Exception as e:
                print(f"❌ Erro ao processar produto {i+1}: {e}")
                continue
        
        return products

    def create_directories(self):
        """Cria as estruturas de diretórios necessárias"""
        categories = ['vestuario', 'suplementos', 'equipamento', 'bolsas', 'bikes']
        for category in categories:
            category_dir = self.output_dir / category
            category_dir.mkdir(parents=True, exist_ok=True)
            print(f"📁 Diretório criado: {category_dir}")

    def sanitize_filename(self, filename):
        """Sanitiza o nome do arquivo para uso no sistema de arquivos"""
        filename = re.sub(r'[^\w\s-]', '', filename)
        filename = re.sub(r'[-\s]+', '-', filename)
        return filename.lower().strip('-')

    def get_image_filename(self, product_title, category, image_url):
        """Gera o nome do arquivo da imagem"""
        base_name = self.sanitize_filename(product_title)
        
        # Extrai extensão da URL
        parsed_url = urlparse(image_url)
        path = parsed_url.path
        extension = '.jpg'  # Default
        
        if '.' in path:
            url_extension = path.split('.')[-1].lower()
            if url_extension in ['jpg', 'jpeg', 'png', 'webp', 'gif']:
                extension = f'.{url_extension}'
        
        return f"{category}/wp-{base_name}{extension}"

    def download_image(self, image_url, filename):
        """Baixa uma imagem da URL especificada"""
        try:
            # Converte URL relativa para absoluta se necessário
            if image_url.startswith('//'):
                image_url = 'https:' + image_url
            elif image_url.startswith('/'):
                image_url = 'https://powerhousebrasil.com.br' + image_url
            
            response = self.session.get(image_url, timeout=15)
            response.raise_for_status()
            
            filepath = self.output_dir / filename
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            print(f"✅ Imagem baixada: {filepath}")
            return True
            
        except Exception as e:
            print(f"❌ Erro ao baixar imagem {image_url}: {e}")
            return False

    def create_sanity_json(self, products):
        """Cria JSON no formato Sanity"""
        sanity_products = []
        
        for product_id, product in products.items():
            sanity_product = {
                "_createdAt": datetime.utcnow().isoformat() + "Z",
                "_id": str(uuid.uuid4()),
                "_rev": str(uuid.uuid4()),
                "_type": "product",
                "_updatedAt": datetime.utcnow().isoformat() + "Z",
                "title": product['title'],
                "slug": {
                    "_type": "slug",
                    "current": self.sanitize_filename(product['title'])
                },
                "price": self.extract_price(product['price']),
                "category": product['category'],
                "inStock": True,
                "featured": False,
                "description": f"Produto importado do WordPress: {product['title']}",
                "brand": "Power House Brasil"
            }
            
            # Adiciona referência de imagem
            if product['image_url']:
                image_id = re.sub(r'[^\w-]', '-', product['image_url'].split('/')[-1])
                sanity_product["image"] = {
                    "_type": "image",
                    "alt": product['title'],
                    "asset": {
                        "_ref": f"image-wp-{image_id[:50]}-800x600-jpg",
                        "_type": "reference"
                    }
                }
            
            # Metadados WordPress
            sanity_product["_wordpress"] = {
                "id": product_id,
                "original_url": product['product_url'],
                "image_url": product['image_url'],
                "source": "html_extraction"
            }
            
            sanity_products.append(sanity_product)
        
        return sanity_products

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

    def process_all_products(self):
        """Processa todos os produtos: extrai do HTML e baixa imagens"""
        # Carrega produtos do CSV para referência
        self.load_csv_products()
        
        # Extrai produtos do HTML
        html_products = self.extract_products_from_html()
        if not html_products:
            return
        
        # Cria diretórios
        self.create_directories()
        
        # Processa downloads
        results = {
            'success': [],
            'failed': [],
            'by_category': {}
        }
        
        print(f"\n🚀 Iniciando download de {len(html_products)} imagens...\n")
        
        for product_id, product in html_products.items():
            try:
                category = product['category']
                
                print(f"📦 Processando: {product['title']}")
                print(f"   📂 Categoria: {category}")
                
                filename = self.get_image_filename(product['title'], category, product['image_url'])
                
                if self.download_image(product['image_url'], filename):
                    item_result = {
                        'id': product_id,
                        'title': product['title'],
                        'category': category,
                        'filename': filename,
                        'url': product['image_url'],
                        'price': product['price']
                    }
                    
                    results['success'].append(item_result)
                    
                    # Organiza por categoria
                    if category not in results['by_category']:
                        results['by_category'][category] = []
                    results['by_category'][category].append(item_result)
                else:
                    results['failed'].append(product['title'])
                
                # Rate limiting
                time.sleep(1)
                
            except Exception as e:
                print(f"❌ Erro ao processar {product['title']}: {e}")
                results['failed'].append(product['title'])
        
        # Cria JSON do Sanity
        sanity_json = self.create_sanity_json(html_products)
        
        # Salva JSONs
        self.save_results(results, sanity_json, html_products)
        
        # Imprime resumo
        self.print_summary(results)
        
        return results

    def save_results(self, results, sanity_json, html_products):
        """Salva todos os resultados em arquivos JSON"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M')
        
        # 1. JSON principal para Sanity
        sanity_file = f"produtos_wordpress_html_para_sanity_{timestamp}.json"
        with open(sanity_file, 'w', encoding='utf-8') as f:
            json.dump(sanity_json, f, ensure_ascii=False, indent=2)
        print(f"📋 JSON Sanity salvo: {sanity_file}")
        
        # 2. Mapeamento de imagens
        mapping = {}
        for item in results['success']:
            mapping[item['title']] = {
                'local_path': f"/img/products/wordpress/{item['filename']}",
                'category': item['category'],
                'original_url': item['url'],
                'price': item['price']
            }
        
        mapping_file = f"wordpress_image_mapping_{timestamp}.json"
        with open(mapping_file, 'w', encoding='utf-8') as f:
            json.dump(mapping, f, ensure_ascii=False, indent=2)
        print(f"📋 Mapeamento de imagens salvo: {mapping_file}")
        
        # 3. JSONs por categoria
        for category, items in results['by_category'].items():
            category_file = f"produtos_wordpress_{category}_{timestamp}.json"
            category_products = [p for p in sanity_json if p['category'] == category]
            
            with open(category_file, 'w', encoding='utf-8') as f:
                json.dump(category_products, f, ensure_ascii=False, indent=2)
            print(f"📋 JSON categoria '{category}' salvo: {category_file} ({len(category_products)} produtos)")
        
        # 4. Dados brutos do HTML
        raw_file = f"produtos_wordpress_raw_{timestamp}.json"
        with open(raw_file, 'w', encoding='utf-8') as f:
            json.dump(html_products, f, ensure_ascii=False, indent=2)
        print(f"📋 Dados brutos salvos: {raw_file}")

    def print_summary(self, results):
        """Imprime o resumo dos resultados"""
        print("\n" + "="*70)
        print("📊 RESUMO DO DOWNLOAD DE IMAGENS WORDPRESS")
        print("="*70)
        print(f"✅ Sucesso: {len(results['success'])} imagens baixadas")
        print(f"❌ Falhas: {len(results['failed'])} downloads")
        
        # Estatísticas por categoria
        print(f"\n📂 Produtos por categoria:")
        for category, items in results['by_category'].items():
            print(f"   • {category}: {len(items)} produtos")
        
        if results['success']:
            print(f"\n✅ Imagens baixadas com sucesso:")
            for item in results['success'][:10]:  # Mostra apenas os primeiros 10
                print(f"   📷 {item['title']} → {item['filename']}")
            
            if len(results['success']) > 10:
                print(f"   ... e mais {len(results['success']) - 10} imagens")
        
        if results['failed']:
            print(f"\n❌ Falhas no download:")
            for title in results['failed']:
                print(f"   • {title}")
        
        print(f"\n📁 Imagens salvas em: {self.output_dir.absolute()}")
        print("\n🎯 Próximos passos:")
        print("   1. Revisar as imagens baixadas por categoria")
        print("   2. Fazer upload das imagens para Sanity Studio")
        print("   3. Importar JSONs por categoria no Sanity")
        print("   4. Verificar e corrigir referências de imagem")
        print("="*70)

def main():
    """Função principal"""
    print("🚀 WORDPRESS HTML PHOTO EXTRACTOR")
    print("="*60)
    
    # Arquivos de entrada
    html_file = "html.html"
    csv_file = "wc-product-export-13-8-2025-1755062181561.csv"
    
    print(f"📁 HTML: {html_file}")
    print(f"📁 CSV: {csv_file}")
    
    extractor = WordPressHTMLExtractor(html_file, csv_file)
    
    try:
        results = extractor.process_all_products()
        
        print("\n✅ Processamento concluído!")
        print("📝 Arquivos gerados:")
        print("   • JSON principal para Sanity")
        print("   • JSONs separados por categoria")
        print("   • Mapeamento de imagens")
        print("   • Dados brutos do HTML")
        
    except KeyboardInterrupt:
        print("\n\n⛔ Processamento interrompido pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro durante o processamento: {e}")

if __name__ == "__main__":
    main()