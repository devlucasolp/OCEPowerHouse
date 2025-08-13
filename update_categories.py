#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re

def categorize_product(title, description=""):
    """
    Categoriza produtos baseado no título e descrição
    """
    title_lower = title.lower()
    desc_lower = description.lower()
    combined = f"{title_lower} {desc_lower}"
    
    # Mapeamento de palavras-chave para categorias
    category_rules = {
        'nutricao': [
            'gel', 'duragel', 'palatinose', 'impulse', 'smart carb', 'carboidrato',
            'energia', 'hydro', 'salts', 'drink', 'performance', 'nitro',
            'day use', 'smoothie', 'ghee', 'óleo de coco', 'coco em pó'
        ],
        'suplementos': [
            'protein', 'proteína', 'creatina', 'pólen protein', 'clean protein',
            'nac', 'acetil', 'cisteína', 'co-q10', 'coenzima', 'cápsulas',
            'açafrão', 'cúrcuma', 'spirulina', 'ora-pro-nóbis', 'detox',
            'supergreens', 'digestivo', 'ayurvédico', 'recover'
        ],
        'acessorios': [
            'boné', 'bone', 'chapéu', 'acessório', 'exclusivo'
        ]
    }
    
    # Verifica cada categoria
    for category, keywords in category_rules.items():
        for keyword in keywords:
            if keyword in combined:
                return category
    
    # Categoria padrão
    return 'nutricao'  # A maioria são produtos de nutrição

def categorize_products_specifically(title):
    """
    Categorização específica baseada em análise detalhada dos produtos
    """
    title_lower = title.lower()
    
    # Géis e energia rápida - Nutrição & Géis
    if any(word in title_lower for word in ['duragel', 'gel', 'palatinose box', 'impulse']):
        return 'nutricao'
    
    # Proteínas - Suplementos
    if any(word in title_lower for word in ['protein', 'proteína', 'pólen protein', 'clean protein']):
        return 'suplementos'
    
    # Suplementos em cápsulas
    if 'cápsulas' in title_lower or any(word in title_lower for word in [
        'creatina', 'nac', 'co-q10', 'açafrão', 'cúrcuma', 'spirulina', 
        'ora-pro-nóbis', 'detox', 'digestivo', 'recover'
    ]):
        return 'suplementos'
    
    # Hidratação e bebidas - Nutrição
    if any(word in title_lower for word in ['hydro', 'drink', 'salts']):
        return 'nutricao'
    
    # Energia e performance - Nutrição  
    if any(word in title_lower for word in ['energia', 'performance', 'day use', 'smoothie']):
        return 'nutricao'
    
    # Palatinose em pó - Nutrição
    if 'palatinose em pó' in title_lower or 'smart carb' in title_lower:
        return 'nutricao'
    
    # Óleos e manteigas - Nutrição
    if any(word in title_lower for word in ['ghee', 'óleo', 'coco']):
        return 'nutricao'
    
    # Acessórios
    if any(word in title_lower for word in ['boné', 'bone']):
        return 'acessorios'
    
    # Padrão
    return 'nutricao'

def update_product_categories(json_file_path, output_file_path=None):
    """
    Atualiza as categorias dos produtos no JSON
    """
    try:
        # Lê o arquivo JSON
        with open(json_file_path, 'r', encoding='utf-8') as f:
            products = json.load(f)
        
        print(f"📦 Processando {len(products)} produtos...")
        
        # Atualiza categorias
        updated_count = 0
        category_stats = {}
        
        for product in products:
            title = product.get('title', '')
            description = product.get('description', '')
            old_category = product.get('category', 'general')
            
            # Categoriza o produto
            new_category = categorize_products_specifically(title)
            
            # Atualiza categoria se mudou
            if old_category != new_category:
                product['category'] = new_category
                updated_count += 1
                print(f"✅ {title[:50]}... : {old_category} → {new_category}")
            
            # Estatísticas
            category_stats[new_category] = category_stats.get(new_category, 0) + 1
        
        # Define arquivo de saída
        if not output_file_path:
            output_file_path = json_file_path.replace('.json', '_categorized.json')
        
        # Salva arquivo atualizado
        with open(output_file_path, 'w', encoding='utf-8') as f:
            json.dump(products, f, indent=2, ensure_ascii=False)
        
        print(f"\n🎉 Categorização concluída!")
        print(f"📁 Arquivo gerado: {output_file_path}")
        print(f"📊 Produtos atualizados: {updated_count}/{len(products)}")
        print(f"\n📈 Distribuição por categoria:")
        for category, count in sorted(category_stats.items()):
            print(f"  - {category}: {count} produtos")
        
        return output_file_path
        
    except Exception as e:
        print(f"❌ Erro: {e}")
        return None

def main():
    """Função principal"""
    print("🏷️ Atualizador de Categorias - Produtos Alquimia")
    print("=" * 60)
    
    json_file = "Produtos_Alquimia___enriquecidos__para_Sanity__sanity.json"
    
    if input(f"Processar arquivo '{json_file}'? (s/n): ").lower().startswith('s'):
        result = update_product_categories(json_file)
        
        if result:
            print(f"\n✅ Arquivo categorizado salvo como: {result}")
            print("\n🔗 Próximo passo:")
            print("Importar o arquivo JSON atualizado para o Sanity Studio")
        else:
            print("\n❌ Falha na categorização")

if __name__ == "__main__":
    main() 