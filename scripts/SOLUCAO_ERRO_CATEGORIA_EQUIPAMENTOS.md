# Solução do Erro na Categoria de Equipamentos

## Problema

Ao tentar atualizar a categoria de equipamentos, ocorria o seguinte erro:

```
An error occurred during publish
Details
Mutation failed: Document "drafts.TFq394igozlHjZYkEIuqg9" cannot be deleted as there are references to it from "1341c249-4e42-4c81-96f8-5088029efa5c"
```

Este erro estava impedindo a publicação da categoria de equipamentos e fazendo com que ela permanecesse como rascunho (draft), o que impedia os produtos de exibirem corretamente a categoria.

## Causa

Após investigação, identificamos que:

1. Existia uma versão rascunho (draft) da categoria de equipamentos com ID `drafts.TFq394igozlHjZYkEIuqg9`
2. Vários produtos estavam referenciando diretamente esta versão rascunho ao invés da versão publicada
3. Especificamente, o produto "Óculos Scicon Aerowatt Foza Cristal Lente Vermelho" (ID: `1341c249-4e42-4c81-96f8-5088029efa5c`) estava referenciando o rascunho

Quando o sistema tentava publicar a categoria (o que envolve excluir o rascunho), o erro ocorria porque havia produtos referenciando diretamente o rascunho.

## Solução

Criamos e executamos um script (`fix_category_reference.js`) que realizou as seguintes ações:

1. Identificou a versão publicada da categoria de equipamentos
2. Localizou todos os produtos que estavam referenciando a versão rascunho
3. Atualizou as referências de categoria desses produtos para apontar para a versão publicada
4. Excluiu o rascunho da categoria após confirmar que não havia mais referências a ele

## Resultado

Após a execução do script:

1. Todos os produtos agora referenciam a versão publicada da categoria de equipamentos
2. O rascunho da categoria foi excluído com sucesso
3. A categoria de equipamentos pode ser atualizada normalmente sem erros
4. Os produtos exibem corretamente a categoria

## Prevenção

Para evitar problemas semelhantes no futuro:

1. Sempre publique as categorias antes de associá-las a produtos
2. Ao migrar dados, certifique-se de que as referências apontem para documentos publicados, não para rascunhos
3. Use os scripts de verificação (`check_product_categories.js` e `check_equipment_category_references.js`) periodicamente para identificar problemas de referência

## Scripts Criados

1. `check_equipment_category_references.js` - Verifica quais produtos estão referenciando a categoria de equipamentos
2. `fix_category_reference.js` - Corrige as referências de categoria nos produtos

Estes scripts estão disponíveis no diretório raiz do projeto e podem ser executados com Node.js quando necessário.