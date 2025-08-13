#!/usr/bin/env python3
import json
import os

print("🔍 Verificando arquivos de produtos WordPress...")

wp_dir = 'wp-products'
files = os.listdir(wp_dir)

main_files = [f for f in files if f.startswith('produtos_wordpress_html_para_sanity_')]
main_files.sort(reverse=True)  # Mais recente primeiro

print(f"\n📁 Arquivos encontrados:")
for file in main_files:
    filepath = os.path.join(wp_dir, file)
    with open(filepath, 'r', encoding='utf-8') as f:
        products = json.load(f)
    print(f"   • {file}: {len(products)} produtos")

# Verifica o mais recente em detalhes
if main_files:
    latest_file = main_files[0]
    print(f"\n📊 Detalhes do arquivo mais recente: {latest_file}")
    
    with open(os.path.join(wp_dir, latest_file), 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"   📦 Total de produtos: {len(products)}")
    
    # Conta por categoria
    categories = {}
    for product in products:
        cat = product.get('category', 'sem_categoria')
        categories[cat] = categories.get(cat, 0) + 1
    
    print(f"   📂 Por categoria:")
    for cat, count in categories.items():
        print(f"      • {cat}: {count} produtos")
    
    # Lista alguns títulos para verificar
    print(f"\n📝 Primeiros 10 produtos:")
    for i, product in enumerate(products[:10]):
        print(f"      {i+1}. {product['title']}") 