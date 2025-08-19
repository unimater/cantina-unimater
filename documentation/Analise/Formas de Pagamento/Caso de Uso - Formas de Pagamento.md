# Casos de Uso - Cantina Unimater

## Gerenciamento de Formas de Pagamento

**Ator:** Administrador  
**Objetivo:** Manter um cadastro de formas de pagamento.  
**Pré-condições:** O usuário deve estar autenticado no sistema com perfil de administrador.

### Fluxo Principal

1. O administrador acessa a tela de "Formas de Pagamento" a partir do menu "Cadastros gerais".
2. O sistema exibe a lista de formas de pagamento cadastradas, com as colunas: ID, Descrição e Situação.
3. O administrador pode filtrar as formas de pagamento pela descrição.
4. O administrador clica no botão "Nova Forma de Pagamento".
5. O sistema exibe o formulário de cadastro de forma de pagamento com os campos: Descrição e Situação.
6. O administrador preenche os campos obrigatórios e clica em "Salvar".
7. O sistema valida os dados e, se estiverem corretos, salva a nova forma de pagamento e exibe uma mensagem de sucesso.
8. O sistema redireciona o administrador para a tela de listagem de formas de pagamento.

### Fluxos Alternativos

#### Edição de Forma de Pagamento

1. Na tela de listagem, o administrador clica no ícone "Editar" de uma forma de pagamento.
2. O sistema exibe o formulário com os dados da forma de pagamento preenchidos.
3. O administrador altera os dados desejados e clica em "Salvar".
4. O sistema valida e salva as alterações.

#### Exclusão de Forma de Pagamento

1. Na tela de listagem, o administrador clica no ícone "Excluir" de uma forma de pagamento.
2. O sistema exibe uma mensagem de confirmação.
3. O administrador confirma a exclusão.
4. O sistema exclui a forma de pagamento.

### Regras de Negócio

- A descrição da forma de pagamento deve ser única.
