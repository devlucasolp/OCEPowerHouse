#!/usr/bin/env python3
import csv
from collections import defaultdict

def check_duplicates():
    print('🔍 VERIFICAÇÃO DE DUPLICATAS NOS 36 PRODUTOS')
    print('=' * 60)
    
    with open('powerhouse_scicon_gravtah_pg1_4.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        products = list(reader)
    
    print(f'📊 Total de produtos no CSV: {len(products)}')
    print()
    
    # Verifica duplicatas por título
    titles = defaultdict(list)
    skus = defaultdict(list)
    
    # Lista todos os produtos e agrupa por título e SKU
    for i, product in enumerate(products, 1):
        title = product.get('title', '').strip()
        sku = product.get('sku', '').strip()
        price = product.get('price', '0')
        category = product.get('category', 'Sem categoria')
        
        titles[title].append(i)
        skus[sku].append(i)
        
        print(f'{i:2d}. {title}')
        print(f'    SKU: {sku} | Preço: R$ {price} | Categoria: {category}')
        print()
    
    # Verifica duplicatas por título
    print('\n🔍 VERIFICAÇÃO DE DUPLICATAS POR TÍTULO:')
    print('-' * 50)
    duplicated_titles = {title: indices for title, indices in titles.items() if len(indices) > 1}
    
    if duplicated_titles:
        print('❌ DUPLICATAS ENCONTRADAS:')
        for title, indices in duplicated_titles.items():
            print(f'   • "{title}" aparece nas linhas: {indices}')
    else:
        print('✅ Nenhuma duplicata por título encontrada')
    
    # Verifica duplicatas por SKU
    print('\n🔍 VERIFICAÇÃO DE DUPLICATAS POR SKU:')
    print('-' * 50)
    duplicated_skus = {sku: indices for sku, indices in skus.items() if len(indices) > 1 and sku}
    
    if duplicated_skus:
        print('❌ DUPLICATAS DE SKU ENCONTRADAS:')
        for sku, indices in duplicated_skus.items():
            print(f'   • SKU "{sku}" aparece nas linhas: {indices}')
    else:
        print('✅ Nenhuma duplicata por SKU encontrada')
    
    # Resumo por categoria
    print('\n📂 RESUMO POR CATEGORIA:')
    print('-' * 50)
    categories = defaultdict(int)
    for product in products:
        cat = product.get('category', 'Sem categoria')
        categories[cat] += 1
    
    for cat, count in categories.items():
        print(f'   • {cat}: {count} produtos')
    
    print(f'\n📊 TOTAL FINAL: {len(products)} produtos únicos')
    
    return duplicated_titles, duplicated_skus, products

if __name__ == "__main__":
    check_duplicates() 