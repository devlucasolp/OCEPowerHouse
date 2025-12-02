#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Photo Scraper para Produtos Alquimia da Saúde
Faz scraping das imagens dos produtos e organiza para importação no Sanity
"""

import json
import os
import requests
import re
import time
from urllib.parse import urljoin, urlparse
from pathlib import Path
import hashlib

class AlquimiaPhotoScraper:
    def __init__(self, json_file="Produtos_Alquimia_FINAL_para_Sanity.json"):
        self.json_file = json_file
        self.base_url = "https://alquimiadasaude.com.br"
        self.search_url = f"{self.base_url}/search"
        self.output_dir = Path("public/img/products")
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        
        # Mapeamento de produtos para facilitar busca
        self.search_terms = {
            # Nutrição
            "Duragel Box 27g (15 sachês)": ["duragel", "27g", "15 sachês"],
            "Duragel Box 40g (15 sachês)": ["duragel", "40g", "15 sachês"],
            "Duragel Box 50g (15 sachês)": ["duragel", "50g", "15 sachês"],
            "Palatinose Box (15 sachês)": ["palatinose", "box", "15 sachês"],
            "Impulse - Box 15 sachês": ["impulse", "box", "15 sachês"],
            "Palatinose em Pó - 300g": ["palatinose", "pó", "300g"],
            "Palatinose em Pó - Smart Carb 300g": ["palatinose", "smart carb", "300g"],
            "Smart Drink Hydro - 750g": ["smart drink", "hydro", "750g"],
            "Smart Drink Hydro - Laranja & Hortelã 350g": ["smart drink", "laranja", "hortelã", "350g"],
            "Smart Drink Hydro - Limão & Hortelã 350g": ["smart drink", "limão", "hortelã", "350g"],
            "Smart Drink Hydro - Pink Lemonade 750g - OUTLET": ["smart drink", "pink lemonade", "750g"],
            "Hydro Salts - Box 10 unidades": ["hydro salts", "box", "10 unidades"],
            "Energia Performance - Nitro 600 - 390g": ["energia performance", "nitro 600", "390g"],
            "Energia Performance – Uva Orgânica, Beterraba e Cacau 300g": ["energia performance", "uva", "beterraba", "cacau"],
            "Energia Day Use - Smoothie Frutas Silvestres 350g": ["energia day use", "smoothie", "frutas silvestres"],
            "Manteiga Ghee 500g": ["manteiga", "ghee", "500g"],
            "Óleo de Coco em Pó - 250g": ["óleo coco", "pó", "250g"],
            
            # Suplementos
            "Creatina Monohidratada - 300 g": ["creatina", "monohidratada", "300g"],
            "Recover Físico - 60 Cápsulas Vegetais": ["recover físico", "60 cápsulas"],
            "Clean Protein - Cacau 675g": ["clean protein", "cacau", "675g"],
            "Clean Protein - Banana & Canela 675g": ["clean protein", "banana", "canela", "675g"],
            "Clean Protein": ["clean protein"],
            "Pólen Protein - Smoothie Açaí & Banana 350g": ["pólen protein", "açaí", "banana"],
            "Pólen Protein - Smoothie Frutas Vermelhas 350g": ["pólen protein", "frutas vermelhas"],
            "NAC N-Acetil L-Cisteína 500mg - 120 Cápsulas Vegetais": ["nac", "acetil", "cisteína", "500mg"],
            "NAC N-Acetil Cisteína 500mg - OUTLET": ["nac", "acetil", "cisteína", "outlet"],
            "CO-Q10 Coenzima Q10 - 60 Cápsulas Vegetais": ["coq10", "coenzima", "q10"],
            "Açafrão Blend Termogênico - 60 Cápsulas Vegetais": ["açafrão", "blend", "termogênico"],
            "Cúrcuma - 60 Cápsulas Vegetais": ["cúrcuma", "60 cápsulas"],
            "Spirulina - 110 Cápsulas Vegetais": ["spirulina", "110 cápsulas"],
            "Ora-Pro-Nóbis Orgânica 500mg - 60 Cápsulas Vegetais": ["ora pro nóbis", "orgânica", "500mg"],
            "Detox Supergreens - 90 Cápsulas Vegetais": ["detox", "supergreens", "90 cápsulas"],
            "Digestivo Ayurvédico - 60 Cápsulas Vegetais": ["digestivo", "ayurvédico"],
            
            # Acessórios
            "Boné exclusivo - Alquimia da Saúde": ["boné", "exclusivo", "alquimia"]
        }

    def load_products(self):
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

    def create_directories(self):
        """Cria as estruturas de diretórios necessárias"""
        categories = ['nutricao', 'suplementos', 'acessorios']
        for category in categories:
            category_dir = self.output_dir / category
            category_dir.mkdir(parents=True, exist_ok=True)
            print(f"📁 Diretório criado: {category_dir}")

    def sanitize_filename(self, filename):
        """Sanitiza o nome do arquivo para uso no sistema de arquivos"""
        # Remove caracteres especiais e substitui espaços por hífens
        filename = re.sub(r'[^\w\s-]', '', filename)
        filename = re.sub(r'[-\s]+', '-', filename)
        return filename.lower().strip('-')

    def get_image_filename(self, product_title, category):
        """Gera o nome do arquivo da imagem baseado no título do produto"""
        base_name = self.sanitize_filename(product_title)
        return f"{category}/{base_name}.jpg"

    def search_product_on_site(self, product_title):
        """Busca o produto no site da Alquimia da Saúde"""
        search_terms = self.search_terms.get(product_title, [product_title.split()[:2]])
        
        for term in search_terms[:2]:  # Tenta os 2 primeiros termos
            try:
                print(f"🔍 Buscando: {term}")
                
                # Faz a busca no site
                search_params = {'q': term}
                response = self.session.get(self.search_url, params=search_params, timeout=10)
                
                if response.status_code == 200:
                    # Aqui você faria o parsing do HTML para encontrar o produto
                    # Por simplicidade, vamos usar uma abordagem alternativa
                    print(f"✅ Busca realizada para: {term}")
                    return self.find_product_image_alternative(product_title)
                
                time.sleep(1)  # Rate limiting
                
            except requests.RequestException as e:
                print(f"❌ Erro na busca: {e}")
                continue
        
        return None

    def find_product_image_alternative(self, product_title):
        """Método alternativo para encontrar imagens de produtos"""
        # URLs comuns de produtos da Alquimia (baseado em padrões observados)
        possible_urls = [
            f"{self.base_url}/products/{self.sanitize_filename(product_title)}",
            f"{self.base_url}/produto/{self.sanitize_filename(product_title)}",
            f"{self.base_url}/loja/{self.sanitize_filename(product_title)}"
        ]
        
        for url in possible_urls:
            try:
                response = self.session.get(url, timeout=10)
                if response.status_code == 200:
                    # Aqui faria o parsing para encontrar a imagem
                    return self.extract_image_from_page(response.text)
                time.sleep(0.5)
            except:
                continue
        
        return None

    def extract_image_from_page(self, html_content):
        """Extrai URL da imagem da página do produto"""
        # Padrões comuns para imagens de produto
        image_patterns = [
            r'<img[^>]+src=["\']([^"\']+product[^"\']+)["\']',
            r'<img[^>]+src=["\']([^"\']+\.jpg)["\']',
            r'<img[^>]+src=["\']([^"\']+\.png)["\']'
        ]
        
        for pattern in image_patterns:
            matches = re.findall(pattern, html_content, re.IGNORECASE)
            for match in matches:
                if any(keyword in match.lower() for keyword in ['product', 'produto', 'alquimia']):
                    return match
        
        return None

    def download_image(self, image_url, filename):
        """Baixa uma imagem da URL especificada"""
        try:
            # Se a URL for relativa, torna absoluta
            if not image_url.startswith('http'):
                image_url = urljoin(self.base_url, image_url)
            
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

    def create_placeholder_image(self, filename, product_title):
        """Cria uma imagem placeholder se não conseguir baixar a original"""
        try:
            import PIL.Image
            import PIL.ImageDraw
            import PIL.ImageFont
            
            # Cria uma imagem 800x600 com cor de fundo
            img = PIL.Image.new('RGB', (800, 600), color='#f0f0f0')
            draw = PIL.ImageDraw.Draw(img)
            
            # Tenta usar uma fonte padrão
            try:
                font = PIL.ImageFont.truetype("arial.ttf", 24)
            except:
                font = PIL.ImageFont.load_default()
            
            # Adiciona o texto do produto
            text_lines = [
                "ALQUIMIA DA SAÚDE",
                "",
                product_title[:40] + "..." if len(product_title) > 40 else product_title,
                "",
                "Imagem não disponível"
            ]
            
            y = 200
            for line in text_lines:
                bbox = draw.textbbox((0, 0), line, font=font)
                text_width = bbox[2] - bbox[0]
                x = (800 - text_width) // 2
                draw.text((x, y), line, fill='#666666', font=font)
                y += 40
            
            filepath = self.output_dir / filename
            img.save(filepath, 'JPEG', quality=85)
            print(f"📄 Placeholder criado: {filepath}")
            return True
            
        except ImportError:
            print("⚠️ PIL não instalado, criando arquivo texto como placeholder")
            filepath = self.output_dir / filename.replace('.jpg', '.txt')
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(f"Placeholder para: {product_title}\n")
                f.write("Imagem não encontrada no scraping\n")
            return False
        except Exception as e:
            print(f"❌ Erro ao criar placeholder: {e}")
            return False

    def scrape_all_products(self):
        """Executa o scraping para todos os produtos"""
        products = self.load_products()
        if not products:
            return
        
        self.create_directories()
        
        results = {
            'success': [],
            'failed': [],
            'placeholder': []
        }
        
        print(f"\n🚀 Iniciando scraping de {len(products)} produtos...\n")
        
        for i, product in enumerate(products, 1):
            title = product.get('title', 'Produto sem título')
            category = product.get('category', 'geral')
            
            print(f"\n[{i}/{len(products)}] 📦 Processando: {title}")
            
            filename = self.get_image_filename(title, category)
            
            # Tenta fazer o scraping da imagem
            image_url = self.search_product_on_site(title)
            
            if image_url and self.download_image(image_url, filename):
                results['success'].append(title)
            else:
                # Cria placeholder se não conseguir baixar
                if self.create_placeholder_image(filename, title):
                    results['placeholder'].append(title)
                else:
                    results['failed'].append(title)
            
            # Rate limiting
            time.sleep(2)
        
        self.print_summary(results)
        return results

    def print_summary(self, results):
        """Imprime o resumo dos resultados"""
        print("\n" + "="*60)
        print("📊 RESUMO DO SCRAPING")
        print("="*60)
        print(f"✅ Sucesso: {len(results['success'])} imagens")
        print(f"📄 Placeholders: {len(results['placeholder'])} imagens")
        print(f"❌ Falhas: {len(results['failed'])} imagens")
        print(f"📁 Total processado: {len(results['success']) + len(results['placeholder']) + len(results['failed'])}")
        
        if results['failed']:
            print(f"\n❌ Produtos que falharam:")
            for product in results['failed']:
                print(f"   • {product}")
        
        print(f"\n📁 Imagens salvas em: {self.output_dir.absolute()}")
        print("="*60)

def main():
    """Função principal"""
    print("🚀 ALQUIMIA PHOTO SCRAPER")
    print("="*50)
    
    scraper = AlquimiaPhotoScraper()
    
    try:
        results = scraper.scrape_all_products()
        
        print("\n✅ Scraping concluído!")
        print("📝 Próximos passos:")
        print("   1. Revisar as imagens baixadas")
        print("   2. Substituir placeholders por imagens reais")
        print("   3. Fazer upload para Sanity Studio")
        print("   4. Associar imagens aos produtos no JSON")
        
    except KeyboardInterrupt:
        print("\n\n⛔ Scraping interrompido pelo usuário")
    except Exception as e:
        print(f"\n❌ Erro durante o scraping: {e}")

if __name__ == "__main__":
    main() 