# Migração de Categorias de Produtos

Este documento explica como migrar as categorias de produtos de strings para referências no Sanity.

## Problema

Antes, as categorias de produtos eram armazenadas como strings simples (por exemplo, "equipamento", "vestuário", etc.). Agora, o esquema do Sanity foi atualizado para usar referências a documentos de categoria, o que permite uma gestão mais flexível e dinâmica das categorias.

O erro que aparece ao editar produtos é:

```
Erro de variavel do produto na sanity que deverá ser uma das opções já preescritas das categorias.
Invalid property value 
The property value is stored as a value type that does not match the expected type. 
Developer info 
The value of this property must be of type reference according to the schema. 
Mismatching value types typically occur when the schema has recently been changed. 
The current value (string) 
"equipamento"
```

## Solução

Foram criados três scripts para facilitar a migração:

1. **check_product_categories.js**: Verifica quais produtos têm categorias como string e lista as categorias que precisam ser criadas.
2. **create_missing_categories.js**: Cria as categorias faltantes no Sanity.
3. **migrate_product_categories.js**: Atualiza os produtos, convertendo as categorias de string para referências.

## Passo a Passo

### 1. Verificar Categorias Existentes

Execute o script para verificar quais produtos têm categorias como string e quais categorias precisam ser criadas:

```bash
node check_product_categories.js
```

Este script vai mostrar:
- Quantos produtos têm categorias como string
- Quais categorias já existem no Sanity
- Quais categorias precisam ser criadas

### 2. Criar Categorias Faltantes

Se o script anterior identificou categorias faltantes, execute:

```bash
node create_missing_categories.js
```

Este script vai criar as categorias necessárias no Sanity com base nas categorias encontradas nos produtos.

### 3. Migrar Produtos

Após criar todas as categorias necessárias, execute o script de migração:

```bash
node migrate_product_categories.js
```

Este script vai atualizar todos os produtos que têm categorias como string, convertendo-as para referências às categorias correspondentes.

## Verificação

Após a migração, você pode executar novamente o script `check_product_categories.js` para verificar se todos os produtos foram migrados corretamente. O resultado deve mostrar que não há mais produtos com categorias como string.

## Observações

- Os scripts usam um mapeamento de nomes de categorias para slugs para garantir que categorias com nomes semelhantes (por exemplo, "equipamento" e "equipamentos") sejam mapeadas para a mesma categoria.
- Se novos produtos forem adicionados com categorias como string, será necessário executar novamente os scripts de migração.
- Após a migração, todos os produtos devem ter categorias como referências, e o erro de "Invalid property value" não deve mais ocorrer.