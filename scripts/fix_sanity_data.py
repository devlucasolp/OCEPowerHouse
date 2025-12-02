#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import uuid

def fix_sanity_data():
    """
    Corrige problemas no JSON para importação no Sanity
    """
    
    # Lê o arquivo categorizado
    with open('Produtos_Alquimia___enriquecidos__para_Sanity__sanity_categorized.json', 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"🔧 Corrigindo {len(products)} produtos...")
    
    # Mapeamento manual de preços baseado no mercado
    price_mapping = {
        'duragel': 45.90,
        'palatinose box': 166.50,
        'impulse': 89.90,
        'palatinose em pó - 300g': 129.90,
        'palatinose em pó - smart carb': 139.90,
        'smart drink hydro - 750g': 79.90,
        'smart drink hydro - 350g': 49.90,
        'hydro salts': 35.90,
        'energia performance - 390g': 159.90,
        'energia performance - 300g': 139.90,
        'creatina': 89.90,
        'recover físico': 129.90,
        'energia day use': 119.90,
        'clean protein - 675g': 189.90,
        'pólen protein': 149.90,
        'nac': 79.90,
        'co-q10': 149.90,
        'açafrão': 89.90,
        'cúrcuma': 69.90,
        'spirulina': 99.90,
        'ora-pro-nóbis': 59.90,
        'detox': 119.90,
        'digestivo': 89.90,
        'ghee': 49.90,
        'óleo de coco': 39.90,
        'boné': 79.90
    }
    
    def get_price_from_title(title):
        """Determina preço baseado no título"""
        title_lower = title.lower()
        
        for keyword, price in price_mapping.items():
            if keyword in title_lower:
                return price
        
        # Preços padrão por categoria
        if any(word in title_lower for word in ['gel', 'duragel']):
            return 45.90
        elif any(word in title_lower for word in ['protein', 'proteína']):
            return 169.90
        elif any(word in title_lower for word in ['cápsulas', 'caps']):
            return 89.90
        elif any(word in title_lower for word in ['hydro', 'drink']):
            return 69.90
        else:
            return 99.90
    
    def create_image_ref(title):
        """Cria referência de imagem placeholder"""
        # Gera nome da imagem baseado no título
        clean_title = title.lower()
        clean_title = clean_title.replace(' ', '-')
        clean_title = ''.join(c for c in clean_title if c.isalnum() or c == '-')
        
        return {
            "_type": "image",
            "alt": title,
            "asset": {
                "_ref": f"image-{clean_title[:20]}-{uuid.uuid4().hex[:8]}-800x600-jpg",
                "_type": "reference"
            }
        }
    
    fixed_count = 0
    
    for product in products:
        title = product.get('title', '')
        
        # 1. Corrige preço se for 0
        if product.get('price', 0) == 0:
            new_price = get_price_from_title(title)
            product['price'] = new_price
            print(f"💰 {title[:40]}... → R$ {new_price:.2f}")
            fixed_count += 1
        
        # 2. Adiciona imagem placeholder se não existir
        if 'image' not in product:
            product['image'] = create_image_ref(title)
            print(f"🖼️ Imagem adicionada: {title[:40]}...")
        
        # 3. Garante que featured e inStock sejam boolean
        product['featured'] = bool(product.get('featured', False))
        product['inStock'] = bool(product.get('inStock', True))
    
    # Salva arquivo corrigido
    output_file = 'Produtos_Alquimia_FINAL_para_Sanity.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Correções aplicadas!")
    print(f"📁 Arquivo final: {output_file}")
    print(f"🔧 Produtos corrigidos: {fixed_count}")
    print(f"📊 Total de produtos: {len(products)}")
    
    # Mostra estatísticas finais
    categories = {}
    price_stats = {'min': float('inf'), 'max': 0, 'total': 0}
    
    for product in products:
        cat = product.get('category', 'unknown')
        categories[cat] = categories.get(cat, 0) + 1
        
        price = product.get('price', 0)
        if price > 0:
            price_stats['min'] = min(price_stats['min'], price)
            price_stats['max'] = max(price_stats['max'], price)
            price_stats['total'] += price
    
    print(f"\n📈 Estatísticas finais:")
    print(f"Categorias: {dict(sorted(categories.items()))}")
    print(f"Preços: R$ {price_stats['min']:.2f} - R$ {price_stats['max']:.2f}")
    print(f"Preço médio: R$ {price_stats['total']/len(products):.2f}")
    
    return output_file

if __name__ == "__main__":
    print("🔧 Corretor de Dados para Sanity")
    print("=" * 50)
    fix_sanity_data()
    print("\n🎉 Dados prontos para importar no Sanity!")
    print("\n📋 Próximos passos:")
    print("1. Abrir Sanity Studio")
    print("2. Usar ferramenta de importação")
    print("3. Fazer upload das imagens reais")
    print("4. Atualizar referências de imagem") 