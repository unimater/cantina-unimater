# Especificação - Tela de Cadastro de Usuários

## OBJETIVO

Criar uma tela de cadastro de usuários, que permita o gerenciamento das pessoas autorizadas a acessar o sistema, incluindo dados de contato e informações de autenticação.

## CONTEXTO

**Caminho:** Cadastros gerais > Usuários

## IMPLEMENTAÇÕES PROPOSTAS

### Tela: Usuários

- **Menu:** Cadastros gerais
- **Comportamento:** Tela de crud com listagem padrão

---

## Listagem (padrão)

### 1. Filtro de Pesquisa

Na tela de listagem deve haver um campo para filtro de usuários:

**Usuários**

- **Tipo:** texto
- **Limitação de caracteres:** 150 caracteres
- **Obrigatoriedade:** opcional

### 2. Grid de Listagem

A listagem dos itens criados deve ser feita por meio de uma grid com paginação, com as seguintes colunas:

- ID
- Nome
- Situação
- Ações
  - **Editar**
    - Deve abrir a tela de edição do registro, com os campos já preenchidos
  - **Excluir**
    - Ao clicar sobre este botão deve ser aberta uma modal de confirmação:

#### Modal: Atenção!

- **Mensagem:** "Ao excluir o item não será possível reverter. Deseja realmente prosseguir com a ação?"
- **Botões:**
  - Confirmar
  - Cancelar
- **Regras:**
  - **RN.:** Caso o usuário clique sobre o botão "Confirmar" o registro deve ser excluído de forma permanente
  - **RN.:** Caso o usuário clique sobre "Cancelar", fechar a modal e manter o usuário na tela de listagem

---

## Cadastro

### 3. Tela de Cadastro

#### Card: Identificação

**Campos:**

- **Identificador**

  - **Tipo:** numérico
  - **RN.:** o valor atribuído ao campo deve ser gerado no momento em que o registro for salvo, atribuindo um valor de forma automática e sequencial, iniciando do 0.
  - **RN.:** o campo deve ficar bloqueado, impossibilitando a edição do usuário

- **Nome**

  - **Tipo:** texto
  - **Limitação de caracteres:** 150 caracteres
  - **Obrigatoriedade:** obrigatório

- **Situação**
  - **Tipo:** checkbox
  - **RN.:** por padrão trazer marcado
  - **RN.:** considerar a seguinte regra relacionada a este campo:
    - Marcado = ativo
    - Desmarcado = inativo

#### Card: Contato

**Campos:**

- **E-mail**

  - **Tipo:** texto
  - **Limitação de caracteres:** 150 caracteres
  - **Obrigatoriedade:** opcional

- **Telefone**
  - **Tipo:** texto
  - **Obrigatoriedade:** opcional
  - **Máscara:** (XX) XXXXX-XXXX
  - **Limite de caracteres:** 15

#### Card: Acesso

**Campos:**

- **Usuário**

  - **Tipo:** texto
  - **Limite de caracteres:** 20
  - **Obrigatoriedade:** obrigatório

- **Senha**

  - **Tipo:** senha
  - **Obrigatoriedade:** obrigatório no cadastro
  - **Validação:**
    - Mínimo de 8 caracteres
    - Ao menos uma letra maiúscula
    - Uma minúscula
    - Um número
    - Um caractere especial

- **Confirmação de senha**
  - **Tipo:** senha
  - **Obrigatório:** sim
  - **Validação:**
    - Deve ser idêntico ao campo "Senha"
  - **Mensagem de erro:**
    - "As senhas não coincidem. Verifique e tente novamente."

---

### Regras de Negócio

#### Tratativa relacionada ao não preenchimento de dados obrigatórios

- **RN.:** não deve ser possível incluir um item, sem que os campos obrigatórios sejam preenchidos.
- **RN.:** Caso o usuário tente realizar a ação, apresentar a seguinte mensagem de alerta:
  - "Não foi possível salvar o registro! Preencha os campos obrigatórios para salvar o registro"

#### Tratativa relacionada à inclusão de itens iguais

- **RN.:** Não deve ser possível incluir um item, com a mesma descrição de um registro já existente.
- **RN.:** Aplicar para que letras maiúsculas, espaços, ou acentuação sejam desconsiderados como caracteres diferentes
- **RN.:** Caso o usuário tente realizar a ação, apresentar a seguinte mensagem de alerta:
  - **"Não foi possível salvar o registro! Já existe uma categoria com a mesma descrição, verifique!"**

#### Tratativa para cancelamento de inclusão

- **RN.:** Caso o usuário tenha preenchido ao menos um campo, desconsiderando o campo "Situação", e tentar fechar a aba, apresentar a seguinte modal de confirmação:

##### Modal: Atenção

- **Mensagem:** "Você possui alterações não salvas. Deseja realmente sair?"
- **Botões:**
  - **Confirmar**
  - **Cancelar**
- **Regras:**
  - **RN.:** apenas cancelar a inclusão caso o usuário clique sobre o botão "Confirmar"
  - **RN.:** caso o usuário clique sobre o botão "Cancelar", manter o mesmo na tela de cadastro

#### Tratativa de login único no sistema

- **RN.:** Caso o usuário preencha o campo "Usuário" com um valor já salvo, relacionado a outro usuário, ao tentar salvar o registro apresentar a seguinte mensagem:
  - **"Não foi possível salvar o registro! O nome de usuário já está em uso por outro usuário, verifique!"**

#### Tratativa após salvar item

- **RN.:** Caso o usuário preencha todos os campos corretamente e salve o registro, apresentar a seguinte mensagem de confirmação:
  - **"Sucesso! O usuário foi incluído com sucesso."**
- **RN.:** Direcionar o usuário a tela de listagem após salvar o registro
