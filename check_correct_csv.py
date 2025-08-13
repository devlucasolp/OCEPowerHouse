#!/usr/bin/env python3
import csv

csv_file = 'powerhouse_scicon_gravtah_pg1_4.csv'

print('🔍 Verificando CSV correto dos produtos...')

try:
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        products = list(reader)
        
        print(f'📊 Total de produtos no CSV correto: {len(products)}')
        
        # Conta por categoria
        categories = {}
        for product in products:
            cat = product.get('category', 'Sem categoria')
            categories[cat] = categories.get(cat, 0) + 1
        
        print('📂 Por categoria:')
        for cat, count in categories.items():
            print(f'   • {cat}: {count} produtos')
        
        print('📝 Primeiros 10 produtos:')
        for i, product in enumerate(products[:10]):
            title = product.get('title', 'Sem título')
            price = product.get('price', '0')
            category = product.get('category', 'Sem categoria')
            print(f'   {i+1}. {title} - R$ {price} ({category})')
            
        print(f'\n📝 Últimos 5 produtos:')
        for i, product in enumerate(products[-5:], len(products) - 4):
            title = product.get('title', 'Sem título')
            price = product.get('price', '0')
            category = product.get('category', 'Sem categoria')
            print(f'   {i}. {title} - R$ {price} ({category})')
        
        # Verifica se corresponde aos 36 que você mencionou
        if len(products) >= 36:
            print(f'\n✅ CORRETO! Este CSV tem {len(products)} produtos (≥ 36)')
        else:
            print(f'\n⚠️ Este CSV tem apenas {len(products)} produtos (< 36)')
            
except Exception as e:
    print(f'❌ Erro: {e}') 