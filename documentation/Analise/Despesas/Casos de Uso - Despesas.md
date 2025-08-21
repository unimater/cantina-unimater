# Casos de Uso - Cantina Unimater

## Gerenciamento de Despesas

**Ator:** Usuário  
**Objetivo:** Manter um cadastro de despesas.  
**Pré-condições:** O usuário deve estar autenticado no sistema. Devem existir categorias de despesas cadastradas.

### Fluxo Principal

1. O usuário acessa a tela de "Despesas" a partir do menu "Cadastros gerais".
2. O sistema exibe a lista de despesas cadastradas, com as colunas: ID, Descrição e Categoria.
3. O usuário pode filtrar as despesas pela descrição.
4. O usuário clica no botão "Nova Despesa".
5. O sistema exibe o formulário de cadastro de despesa com os campos: Descrição, Profissional Responsável, Categoria, Data, Valor, Fornecedor, Observações e Anexos.
6. O usuário preenche os campos obrigatórios e clica em "Salvar".
7. O sistema valida os dados e, se estiverem corretos, salva a nova despesa e exibe uma mensagem de sucesso.
8. O sistema redireciona o usuário para a tela de listagem de despesas.

### Fluxos Alternativos

#### Edição de Despesa

1. Na tela de listagem, o usuário clica no ícone "Editar" de uma despesa.
2. O sistema exibe o formulário com os dados da despesa preenchidos.
3. O usuário altera os dados desejados e clica em "Salvar".
4. O sistema valida e salva as alterações.

#### Exclusão de Despesa

1. Na tela de listagem, o usuário clica no ícone "Excluir" de uma despesa.
2. O sistema exibe uma mensagem de confirmação.
3. O usuário confirma a exclusão.
4. O sistema exclui a despesa.

### Regras de Negócio

- A descrição da despesa deve ser única.
- O valor da despesa deve ser um número válido com máscara de moeda.
- A data da despesa não pode ser futura.
- Os anexos podem ser nos formatos .png, .jpg, .xml ou .pdf, com um limite de 5 arquivos.
