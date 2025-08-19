# Casos de Uso - Cantina Unimater

## Gerenciamento de Produtos

**Ator:** Administrador  
**Objetivo:** Manter um cadastro de produtos.  
**Pré-condições:** O usuário deve estar autenticado no sistema com perfil de administrador. Devem existir categorias de produtos cadastradas.

### Fluxo Principal

1. O administrador acessa a tela de "Produtos" a partir do menu "Cadastros gerais".
2. O sistema exibe a lista de produtos cadastrados, com as colunas: ID, Descrição, Categoria e Situação.
3. O administrador pode filtrar os produtos pela descrição.
4. O administrador clica no botão "Novo Produto".
5. O sistema exibe o formulário de cadastro de produto com os campos: Descrição, Valor, Situação, Categoria e Imagem.
6. O administrador preenche os campos obrigatórios e clica em "Salvar".
7. O sistema valida os dados e, se estiverem corretos, salva o novo produto e exibe uma mensagem de sucesso.
8. O sistema redireciona o administrador para a tela de listagem de produtos.

### Fluxos Alternativos

#### Edição de Produto

1. Na tela de listagem, o administrador clica no ícone "Editar" de um produto.
2. O sistema exibe o formulário com os dados do produto preenchidos.
3. O administrador altera os dados desejados e clica em "Salvar".
4. O sistema valida e salva as alterações.

#### Exclusão de Produto

1. Na tela de listagem, o administrador clica no ícone "Excluir" de um produto.
2. O sistema exibe uma mensagem de confirmação.
3. O administrador confirma a exclusão.
4. O sistema exclui o produto.

### Regras de Negócio

- A descrição do produto deve ser única.
- O valor do produto deve ser um número válido com máscara de moeda.
- A imagem do produto deve ser nos formatos .png ou .jpg.
