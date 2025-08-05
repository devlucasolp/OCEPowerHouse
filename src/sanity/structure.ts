// https://www.sanity.io/docs/structure-builder-cheat-sheet
import { StructureBuilder } from 'sanity/desk';

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('OCE PowerHouse CMS')
    .items([
      // Blog Section
      S.listItem()
        .title('📝 Blog')
        .child(
          S.list()
            .title('Blog Management')
            .items([
              S.documentTypeListItem('post')
                .title('Posts')
                .icon(() => '📄'),
              S.documentTypeListItem('author')
                .title('Autores')
                .icon(() => '👤'),
              S.documentTypeListItem('category')
                .title('Categorias')
                .icon(() => '🏷️'),
            ]),
        ),

      S.divider(),

      // E-commerce Section
      S.listItem()
        .title('🛒 E-commerce')
        .child(
          S.list()
            .title('Loja Online')
            .items([
              S.documentTypeListItem('product')
                .title('Produtos')
                .icon(() => '🛍️'),
              S.listItem()
                .title('Produtos em Destaque')
                .icon(() => '⭐')
                .child(
                  S.documentList()
                    .title('Produtos em Destaque')
                    .filter('_type == "product" && featured == true'),
                ),
              S.listItem()
                .title('Produtos por Categoria')
                .icon(() => '📂')
                .child(
                  S.documentList()
                    .title('Produtos por Categoria')
                    .filter('_type == "product"')
                    .params({ category: 'vestuario' }),
                ),
            ]),
        ),

      S.divider(),

      // Events Section
      S.listItem()
        .title('🏕️ Eventos')
        .child(
          S.list()
            .title('Powercamps & Eventos')
            .items([
              S.documentTypeListItem('powercamp')
                .title('Powercamps')
                .icon(() => '🏕️'),
              S.listItem()
                .title('Eventos em Destaque')
                .icon(() => '⭐')
                .child(
                  S.documentList()
                    .title('Eventos em Destaque')
                    .filter('_type == "powercamp" && featured == true'),
                ),
              S.listItem()
                .title('Eventos por Ano')
                .icon(() => '📅')
                .child(
                  S.list()
                    .title('Eventos por Ano')
                    .items([
                      S.listItem()
                        .title('2024')
                        .child(
                          S.documentList()
                            .title('Eventos 2024')
                            .filter('_type == "powercamp" && year == 2024'),
                        ),
                      S.listItem()
                        .title('2025')
                        .child(
                          S.documentList()
                            .title('Eventos 2025')
                            .filter('_type == "powercamp" && year == 2025'),
                        ),
                    ]),
                ),
            ]),
        ),

      S.divider(),

      // All Documents (fallback)
      S.listItem()
        .title('📋 Todos os Documentos')
        .child(
          S.list()
            .title('Todos os Documentos')
            .items(
              S.documentTypeListItems().filter(
                (item) =>
                  !['post', 'author', 'category', 'product', 'powercamp'].includes(
                    item.getId() || '',
                  ),
              ),
            ),
        ),
    ]);
