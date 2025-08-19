# Casos de Uso - Cantina Unimater

## Gerenciamento de Categorias

**Ator:** Administrador  
**Objetivo:** Manter um cadastro de categorias para produtos e despesas.  
**Pré-condições:** O usuário deve estar autenticado no sistema com perfil de administrador.

### Fluxo Principal

1. O administrador acessa a tela de "Categorias" a partir do menu "Cadastros gerais".
2. O sistema exibe a lista de categorias cadastradas, com as colunas: ID, Descrição, Tipo e Situação.
3. O administrador pode filtrar as categorias pela descrição.
4. O administrador clica no botão "Nova Categoria".
5. O sistema exibe o formulário de cadastro de categoria com os campos: Descrição, Tipo (Produtos ou Despesas) e Situação (Ativo/Inativo).
6. O administrador preenche os campos obrigatórios e clica em "Salvar".
7. O sistema valida os dados e, se estiverem corretos, salva a nova categoria e exibe uma mensagem de sucesso.
8. O sistema redireciona o administrador para a tela de listagem de categorias.

### Fluxos Alternativos

#### Edição de Categoria

1. Na tela de listagem, o administrador clica no ícone "Editar" de uma categoria.
2. O sistema exibe o formulário com os dados da categoria preenchidos.
3. O administrador altera os dados desejados e clica em "Salvar".
4. O sistema valida e salva as alterações.

#### Exclusão de Categoria

1. Na tela de listagem, o administrador clica no ícone "Excluir" de uma categoria.
2. O sistema exibe uma mensagem de confirmação.
3. O administrador confirma a exclusão.
4. O sistema verifica se a categoria não está em uso e a exclui.

### Regras de Negócio

- Não é possível excluir uma categoria que já esteja associada a um produto ou despesa.
- A descrição da categoria deve ser única.
