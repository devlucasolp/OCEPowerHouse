#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import json
import uuid
from datetime import datetime, timezone
import re
import os

def generate_slug(title):
    """Gera um slug a partir do título"""
    slug = title.lower()
    slug = re.sub(r'[àáâãäå]', 'a', slug)
    slug = re.sub(r'[èéêë]', 'e', slug)
    slug = re.sub(r'[ìíîï]', 'i', slug)
    slug = re.sub(r'[òóôõö]', 'o', slug)
    slug = re.sub(r'[ùúûü]', 'u', slug)
    slug = re.sub(r'[ç]', 'c', slug)
    slug = re.sub(r'[ñ]', 'n', slug)
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    return slug

def generate_sanity_id():
    """Gera um ID único para o Sanity"""
    return str(uuid.uuid4())

def get_category_value(category_text):
    """Mapeia categorias do CSV para valores do Sanity"""
    category_map = {
        'vestuário': 'vestuario',
        'vestuario': 'vestuario',
        'acessórios': 'acessorios',
        'acessorios': 'acessorios',
        'suplementos': 'suplementos',
        'nutrição': 'nutricao',
        'nutricao': 'nutricao',
        'nutrição & géis': 'nutricao',
        'nutricao & geis': 'nutricao',
        'pneus de bike': 'bike_pneus',
        'pneus bike': 'bike_pneus',
        'bike pneus': 'bike_pneus',
        'acessórios de bike': 'bike_acessorios',
        'acessorios bike': 'bike_acessorios',
        'bike acessórios': 'bike_acessorios',
        'bike acessorios': 'bike_acessorios'
    }
    
    if not category_text:
        return 'general'
    
    category_lower = category_text.lower().strip()
    return category_map.get(category_lower, 'general')

def create_image_reference(image_filename):
    """Cria uma referência de imagem para o Sanity"""
    if not image_filename:
        return None
    
    # Remove extensão e caracteres especiais
    clean_name = re.sub(r'\.[^.]+$', '', image_filename)
    clean_name = re.sub(r'[^a-zA-Z0-9]', '', clean_name)
    
    # Gera um ID de imagem fictício (você precisará fazer upload real das imagens)
    image_id = f"image-{clean_name.lower()}-{uuid.uuid4().hex[:8]}-1080x1080-png"
    
    return {
        "_type": "image",
        "alt": clean_name,
        "asset": {
            "_ref": image_id,
            "_type": "reference"
        }
    }

def parse_variants(variants_text):
    """Converte texto de variantes em array de variantes"""
    if not variants_text or variants_text.strip() == '':
        return []
    
    variants = []
    # Divide por vírgula ou ponto e vírgula
    variant_names = re.split(r'[,;]', variants_text)
    
    for variant_name in variant_names:
        variant_name = variant_name.strip()
        if variant_name:
            variant = {
                "_key": uuid.uuid4().hex[:12],
                "_type": "variant",
                "name": variant_name,
                "priceModifier": 0,
                "inStock": True
            }
            variants.append(variant)
    
    return variants

def parse_tags(tags_text):
    """Converte texto de tags em array"""
    if not tags_text or tags_text.strip() == '':
        return []
    
    # Divide por vírgula ou ponto e vírgula
    tags = re.split(r'[,;]', tags_text)
    return [tag.strip() for tag in tags if tag.strip()]

def validate_csv_file(csv_file_path):
    """Valida se o arquivo é um CSV válido"""
    if not os.path.exists(csv_file_path):
        return False, f"Arquivo não encontrado: {csv_file_path}"
    
    # Verifica se não é um arquivo Python
    if csv_file_path.endswith('.py'):
        return False, "Arquivo Python detectado. Use um arquivo CSV (.csv)"
    
    # Tenta ler a primeira linha para verificar se é CSV
    try:
        with open(csv_file_path, 'r', encoding='utf-8') as f:
            first_line = f.readline().strip()
            if first_line.startswith('#!/usr/bin/env') or first_line.startswith('import '):
                return False, "Este parece ser um arquivo de código, não CSV"
            
            # Verifica se tem vírgulas (indicativo de CSV)
            if ',' not in first_line and ';' not in first_line:
                return False, "Arquivo não parece ser CSV (sem delimitadores)"
                
    except Exception as e:
        return False, f"Erro ao ler arquivo: {e}"
    
    return True, "OK"

def validate_output_path(output_path):
    """Valida e corrige o caminho de saída"""
    if not output_path:
        return None
    
    # Remove aspas
    output_path = output_path.strip('"\'')
    
    # Se termina com \ ou /, adiciona nome padrão
    if output_path.endswith(('\\', '/')):
        output_path = os.path.join(output_path, 'produtos_sanity.json')
    
    # Se é um diretório, adiciona nome padrão
    if os.path.isdir(output_path):
        output_path = os.path.join(output_path, 'produtos_sanity.json')
    
    # Garante extensão .json
    if not output_path.endswith('.json'):
        output_path += '.json'
    
    # Verifica se o diretório pai existe
    parent_dir = os.path.dirname(output_path)
    if parent_dir and not os.path.exists(parent_dir):
        try:
            os.makedirs(parent_dir)
            print(f"📁 Diretório criado: {parent_dir}")
        except Exception as e:
            raise Exception(f"Não foi possível criar diretório: {e}")
    
    return output_path

def csv_to_sanity_json(csv_file_path, output_file_path=None):
    """
    Converte CSV para JSON do Sanity Studio
    """
    
    # Valida arquivo CSV
    is_valid, error_msg = validate_csv_file(csv_file_path)
    if not is_valid:
        print(f"❌ {error_msg}")
        return False
    
    products = []
    current_time = datetime.now(timezone.utc).isoformat().replace('+00:00', 'Z')
    
    try:
        with open(csv_file_path, 'r', encoding='utf-8') as csvfile:
            # Tenta detectar delimitador, com fallback para vírgula
            sample = csvfile.read(1024)
            csvfile.seek(0)
            
            delimiter = ','
            if ';' in sample and sample.count(';') > sample.count(','):
                delimiter = ';'
            
            reader = csv.DictReader(csvfile, delimiter=delimiter)
            
            # Verifica se as colunas fazem sentido
            fieldnames = reader.fieldnames or []
            print(f"📋 Colunas encontradas: {fieldnames}")
            
            if not fieldnames or len(fieldnames) < 2:
                print("❌ Arquivo CSV inválido - poucas colunas")
                return False
            
            # Verifica se tem coluna title
            if 'title' not in fieldnames:
                print("⚠️ Coluna 'title' não encontrada. Usando primeira coluna como título.")
            
            processed_count = 0
            
            for row_num, row in enumerate(reader, start=2):
                try:
                    # Pega título da primeira coluna se 'title' não existir
                    title_field = 'title' if 'title' in fieldnames else fieldnames[0]
                    title = row.get(title_field, '').strip()
                    
                    if not title:
                        print(f"⚠️ Linha {row_num}: Título vazio, pulando...")
                        continue
                    
                    # Pega preço
                    price_str = row.get('price', '0').strip()
                    
                    # Converte preço
                    try:
                        # Remove símbolos de moeda e espaços
                        price_clean = re.sub(r'[R$\s]', '', price_str)
                        price_clean = price_clean.replace(',', '.')
                        price = float(price_clean) if price_clean else 0.0
                    except ValueError:
                        print(f"⚠️ Linha {row_num}: Preço inválido '{price_str}', usando 0")
                        price = 0.0
                    
                    # Gera ID e slug
                    product_id = generate_sanity_id()
                    slug = generate_slug(title)
                    
                    # Campos opcionais
                    description = row.get('description', '').strip()
                    category = get_category_value(row.get('category', ''))
                    image_filename = row.get('image_filename', '').strip()
                    variants_text = row.get('variants', '').strip()
                    tags_text = row.get('tags', '').strip()
                    
                    # Campos booleanos
                    featured = row.get('featured', '').lower() in ['true', '1', 'sim', 'yes']
                    in_stock = row.get('inStock', 'true').lower() in ['true', '1', 'sim', 'yes']
                    
                    # Campos extras
                    brand = row.get('brand', '').strip()
                    weight_str = row.get('weight', '').strip()
                    
                    # Converte peso
                    weight = None
                    if weight_str:
                        try:
                            weight = float(weight_str.replace(',', '.'))
                        except ValueError:
                            pass
                    
                    # Monta o produto no formato Sanity
                    product = {
                        "_createdAt": current_time,
                        "_id": product_id,
                        "_rev": uuid.uuid4().hex[:8] + "-" + uuid.uuid4().hex[:4] + "-" + uuid.uuid4().hex[:4] + "-" + uuid.uuid4().hex[:4] + "-" + uuid.uuid4().hex[:12],
                        "_type": "product",
                        "_updatedAt": current_time,
                        "title": title,
                        "slug": {
                            "_type": "slug",
                            "current": slug
                        },
                        "price": price,
                        "category": category,
                        "inStock": in_stock,
                        "featured": featured
                    }
                    
                    # Adiciona campos opcionais se existirem
                    if description:
                        product["description"] = description
                    
                    if image_filename:
                        product["image"] = create_image_reference(image_filename)
                    
                    if variants_text:
                        product["variants"] = parse_variants(variants_text)
                    
                    if tags_text:
                        product["tags"] = parse_tags(tags_text)
                    
                    if brand:
                        product["brand"] = brand
                    
                    if weight is not None:
                        product["weight"] = weight
                    
                    products.append(product)
                    processed_count += 1
                    print(f"✅ Produto processado: {title} (R$ {price:.2f})")
                
                except Exception as e:
                    print(f"❌ Erro na linha {row_num}: {e}")
                    continue
            
            if processed_count == 0:
                print("❌ Nenhum produto foi processado")
                return False
    
    except Exception as e:
        print(f"❌ Erro ao ler CSV: {e}")
        return False
    
    # Define e valida arquivo de saída
    try:
        if not output_file_path:
            base_name = os.path.splitext(csv_file_path)[0]
            output_file_path = f"{base_name}_sanity.json"
        else:
            output_file_path = validate_output_path(output_file_path)
    except Exception as e:
        print(f"❌ Erro no caminho de saída: {e}")
        return False
    
    # Salva JSON
    try:
        with open(output_file_path, 'w', encoding='utf-8') as jsonfile:
            json.dump(products, jsonfile, indent=2, ensure_ascii=False)
        
        print(f"\n🎉 Conversão concluída!")
        print(f"📁 Arquivo gerado: {output_file_path}")
        print(f"📊 Total de produtos: {len(products)}")
        
        # Mostra preview do primeiro produto
        if products:
            print(f"\n📋 Preview do primeiro produto:")
            print(json.dumps(products[0], indent=2, ensure_ascii=False)[:500] + "...")
            
        return True
            
    except Exception as e:
        print(f"❌ Erro ao salvar JSON: {e}")
        return False

def main():
    """Função principal"""
    print("🔄 Conversor CSV para Sanity JSON")
    print("=" * 50)
    
    # Solicita o arquivo CSV
    while True:
        csv_file = input("📂 Digite o caminho do arquivo CSV: ").strip()
        
        if not csv_file:
            print("❌ Caminho do arquivo não fornecido")
            continue
        
        # Remove aspas se houver
        csv_file = csv_file.strip('"\'')
        
        # Valida arquivo
        is_valid, error_msg = validate_csv_file(csv_file)
        if is_valid:
            break
        else:
            print(f"❌ {error_msg}")
            print("Tente novamente.\n")
    
    # Pergunta sobre arquivo de saída
    output_file = input("📁 Nome do arquivo de saída (deixe vazio para automático): ").strip()
    
    if not output_file:
        output_file = None
    
    # Executa conversão
    success = csv_to_sanity_json(csv_file, output_file)
    
    if success:
        print("\n🔗 Próximos passos:")
        print("1. Faça upload das imagens para o Sanity")
        print("2. Atualize as referências de imagem no JSON")
        print("3. Importe o JSON no Sanity Studio")
    else:
        print("\n❌ Conversão falhou. Verifique os erros acima.")

if __name__ == "__main__":
    main() 