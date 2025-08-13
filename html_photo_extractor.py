#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
HTML Photo Extractor para Produtos Alquimia da Saúde
Extrai URLs das imagens do HTML fornecido e baixa organizando por categoria
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

class HTMLPhotoExtractor:
    def __init__(self, html_file="html.html", json_file="{title}.json"):
        self.html_file = html_file
        self.json_file = json_file
        self.output_dir = Path("public/img/products/")
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        
        # Mapeamento de produtos extraídos do HTML
        self.html_products = {}
        
        # Mapeamento de títulos similares (normalizados)
        self.title_mapping = {}

    def normalize_title(self, title):
        """Normaliza títulos para facilitar comparação"""
        # Remove caracteres especiais, converte para lowercase, remove espaços extras
        normalized = re.sub(r'[^\w\s]', '', title.lower())
        normalized = re.sub(r'\s+', ' ', normalized).strip()
        
        # Remove palavras comuns que podem variar
        words_to_remove = ['box', 'sachês', 'saches', 'cápsulas', 'vegetais', 'caps', 'g', 'mg']
        for word in words_to_remove:
            normalized = normalized.replace(f' {word} ', ' ')
            normalized = normalized.replace(f' {word}', '')
            normalized = normalized.replace(f'{word} ', '')
        
        return normalized.strip()

    def load_products_from_json(self):
        """Carrega os produtos do JSON"""
        try:
            with open(self.json_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"❌ Arquivo {self.json_file} não encontrado!")
            return []
        except json.JSONDecodeError as e:
            print(f"❌ Erro ao decodificar JSON: {e}")
            return []

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
        
        # Encontra todos os itens de produto
        product_items = soup.find_all('div', class_='listagem-item')
        
        print(f"🔍 Encontrados {len(product_items)} produtos no HTML")
        
        for item in product_items:
            try:
                # Extrai o nome do produto
                title_element = item.find('a', class_='nome-produto')
                if not title_element:
                    continue
                
                title = title_element.get_text(strip=True)
                
                # Extrai a URL da imagem principal
                img_element = item.find('img', class_='imagem-principal')
                if not img_element:
                    continue
                
                img_url = img_element.get('src')
                if not img_url:
                    continue
                
                # Extrai URL da página do produto para mais detalhes
                product_link = title_element.get('href', '')
                
                products[title] = {
                    'title': title,
                    'image_url': img_url,
                    'product_url': product_link,
                    'normalized_title': self.normalize_title(title)
                }
                
                print(f"✅ Extraído: {title}")
                print(f"   📷 Imagem: {img_url}")
                
            except Exception as e:
                print(f"❌ Erro ao processar produto: {e}")
                continue
        
        return products

    def match_products(self, json_products, html_products):
        """Faz o match entre produtos do JSON e HTML"""
        matches = {}
        unmatched_json = []
        
        print(f"\n🔗 Fazendo match entre {len(json_products)} produtos JSON e {len(html_products)} produtos HTML...\n")
        
        for json_product in json_products:
            json_title = json_product.get('title', '')
            json_normalized = self.normalize_title(json_title)
            
            best_match = None
            best_similarity = 0
            
            # Procura match exato primeiro
            for html_title, html_data in html_products.items():
                html_normalized = html_data['normalized_title']
                
                # Match exato
                if json_normalized == html_normalized:
                    best_match = html_data
                    best_similarity = 1.0
                    break
                
                # Match parcial - conta palavras em comum
                json_words = set(json_normalized.split())
                html_words = set(html_normalized.split())
                
                if json_words and html_words:
                    common_words = json_words.intersection(html_words)
                    similarity = len(common_words) / max(len(json_words), len(html_words))
                    
                    if similarity > best_similarity and similarity > 0.6:  # Limiar de 60%
                        best_match = html_data
                        best_similarity = similarity
            
            if best_match and best_similarity > 0.6:
                matches[json_title] = best_match
                print(f"✅ Match ({best_similarity:.1%}): {json_title}")
                print(f"   🔗 HTML: {best_match['title']}")
                print(f"   📷 URL: {best_match['image_url']}")
                print()
            else:
                unmatched_json.append(json_title)
                print(f"❌ Sem match: {json_title}")
        
        if unmatched_json:
            print(f"\n⚠️ {len(unmatched_json)} produtos sem match:")
            for title in unmatched_json:
                print(f"   • {title}")
        
        return matches

    def create_directories(self):
        """Cria as estruturas de diretórios necessárias"""
        categories = ['nutricao', 'suplementos', 'acessorios']
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
            if url_extension in ['jpg', 'jpeg', 'png', 'webp']:
                extension = f'.{url_extension}'
        
        return f"{category}/{base_name}{extension}"

    def download_image(self, image_url, filename):
        """Baixa uma imagem da URL especificada"""
        try:
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

    def process_all_products(self):
        """Processa todos os produtos: extrai do HTML, faz match e baixa imagens"""
        # Carrega produtos do JSON
        json_products = self.load_products_from_json()
        if not json_products:
            return
        
        # Extrai produtos do HTML
        html_products = self.extract_products_from_html()
        if not html_products:
            return
        
        # Faz match entre JSON e HTML
        matches = self.match_products(json_products, html_products)
        
        # Cria diretórios
        self.create_directories()
        
        # Processa downloads
        results = {
            'success': [],
            'failed': [],
            'no_match': []
        }
        
        print(f"\n🚀 Iniciando download de {len(matches)} imagens...\n")
        
        # Cria dicionário de produtos JSON por título para acesso rápido
        json_dict = {p['title']: p for p in json_products}
        
        for json_title, html_data in matches.items():
            try:
                json_product = json_dict[json_title]
                category = json_product.get('category', 'geral')
                
                print(f"📦 Processando: {json_title}")
                print(f"   📂 Categoria: {category}")
                
                filename = self.get_image_filename(json_title, category, html_data['image_url'])
                
                if self.download_image(html_data['image_url'], filename):
                    results['success'].append({
                        'title': json_title,
                        'category': category,
                        'filename': filename,
                        'url': html_data['image_url']
                    })
                else:
                    results['failed'].append(json_title)
                
                # Rate limiting
                time.sleep(1)
                
            except Exception as e:
                print(f"❌ Erro ao processar {json_title}: {e}")
                results['failed'].append(json_title)
        
        # Adiciona produtos sem match
        for product in json_products:
            if product['title'] not in matches:
                results['no_match'].append(product['title'])
        
        self.print_summary(results)
        return results

    def print_summary(self, results):
        """Imprime o resumo dos resultados"""
        print("\n" + "="*70)
        print("📊 RESUMO DO DOWNLOAD DE IMAGENS")
        print("="*70)
        print(f"✅ Sucesso: {len(results['success'])} imagens baixadas")
        print(f"❌ Falhas: {len(results['failed'])} downloads")
        print(f"🔍 Sem match: {len(results['no_match'])} produtos")
        
        if results['success']:
            print(f"\n✅ Imagens baixadas com sucesso:")
            for item in results['success']:
                print(f"   📷 {item['title']} → {item['filename']}")
        
        if results['failed']:
            print(f"\n❌ Falhas no download:")
            for title in results['failed']:
                print(f"   • {title}")
        
        if results['no_match']:
            print(f"\n🔍 Produtos sem match no HTML:")
            for title in results['no_match']:
                print(f"   • {title}")
        
        print(f"\n📁 Imagens salvas em: {self.output_dir.absolute()}")
        print("="*70)

    def generate_mapping_json(self, results):
        """Gera arquivo JSON com mapeamento de produtos para imagens"""
        mapping = {}
        
        for item in results['success']:
            mapping[item['title']] = {
                'local_path': f"/img/products/{item['filename']}",
                'category': item['category'],
                'original_url': item['url']
            }
        
        # Salva mapeamento
        mapping_file = "product_image_mapping.json"
        with open(mapping_file, 'w', encoding='utf-8') as f:
            json.dump(mapping, f, ensure_ascii=False, indent=2)
        
        print(f"📋 Mapeamento salvo em: {mapping_file}")

def main():
    """Função principal"""
    print("🚀 HTML PHOTO EXTRACTOR - ALQUIMIA DA SAÚDE")
    print("="*60)
    
    extractor = HTMLPhotoExtractor()
    
    try:
        results = extractor.process_all_products()
        
        if results and results['success']:
            extractor.generate_mapping_json(results)
        
        print("\n✅ Processamento concluído!")
        print("📝 Próximos passos:")
        print("   1. Revisar as imagens baixadas")
        print("   2. Fazer upload das imagens para Sanity Studio")
        print("   3. Usar o mapeamento JSON para associar produtos às imagens")
        print("   4. Atualizar o JSON dos produtos com as referências corretas")
        
    except KeyboardInterrupt:
        print("\n\n⛔ Processamento interrompido pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro durante o processamento: {e}")

if __name__ == "__main__":
    main() 