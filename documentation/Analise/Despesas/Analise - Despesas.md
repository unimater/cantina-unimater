# Especificação - Tela de Cadastro de Despesas

## OBJETIVO

Criar uma tela de cadastro de despesas, que permita a criação e consulta de forma organizada dos dados relacionados às despesas.

## CONTEXTO

**Caminho:** Cadastros gerais > Despesas

## IMPLEMENTAÇÕES PROPOSTAS

### Tela: Despesas

- **Menu:** Cadastros gerais
- **Comportamento:** Tela de crud com listagem padrão

---

## Listagem (padrão)

### 1. Filtro de Pesquisa

Na tela de listagem deve haver um campo para filtro de despesas:

**Despesas**

- **Tipo:** texto
- **Limitação de caracteres:** 100 caracteres
- **Obrigatoriedade:** opcional

### 2. Grid de Listagem

A listagem dos itens criados deve ser feita por meio de uma grid com paginação, com as seguintes colunas:

- ID
- Descrição
- Categoria
- Ações
  - **Editar**
    - Deve abrir a tela de edição do registro, com os campos já preenchidos
  - **Excluir**
    - Ao clicar sobre este botão deve ser aberta uma modal de confirmação:

#### Modal: Atenção

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

- **Descrição**

  - **Tipo:** texto
  - **Limitação de caracteres:** 100 caracteres
  - **Obrigatoriedade:** obrigatório

- **Profissional responsável**

  - **RN.:** por padrão trazer o campo bloqueado com o usuário que está incluindo o item preenchido no campo.

- **Categoria**

  - **Tipo:** seleção única
  - **Opções:** considerar os itens da entidade "Categorias" que estejam com situação ativo e pertençam ao tipo "Despesas"
  - **Obrigatoriedade:** obrigatório

- **Data**
  - **Tipo:** data
  - **Obrigatoriedade:** obrigatório
  - **RN.:** por padrão trazer selecionado o dia atual
  - **RN.:** não permitir a inclusão de datas futuras, bloquear as datas futuras

#### Card: Despesas

**Campos:**

- **Valor**

  - **Tipo:** numérico
  - **Limitação de caracteres:** 7 caracteres
  - **Obrigatoriedade:** obrigatório
  - **RN.:** adicionar máscara de moeda
  - **RN.:** adicionar vírgula automática após a digitação de 2 caracteres
  - **Padrão:** 00,00
  - **RN.:** preencher o campo da direita pra esquerda
    - 00000,01
    - 00000,10
    - 00001,00
    - 00010,00
    - 00100,00
    - 01000,00
    - 10000,00

- **Fornecedor**

  - **Tipo:** texto
  - **Limitação de caracteres:** 150 caracteres
  - **Obrigatoriedade:** opcional

- **Observações**

  - **Tipo:** texto
  - **Limitação de caracteres:** 300 caracteres
  - **Obrigatoriedade:** opcional

- **Anexos**
  - **Tipo:** anexos
  - **RN.:** limitar à 5 anexos
  - **RN.:** permitir arquivos em formato .png, .jpg, xml, pdf

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
  - **"Não foi possível salvar o registro! Já existe uma despesa com a mesma descrição, verifique!"**

#### Tratativa para cancelamento de inclusão

- **RN.:** Caso o usuário tenha preenchido ao menos um campo e tentar fechar a aba, apresentar a seguinte modal de confirmação:

##### Modal: Atenção

- **Mensagem:** "Você possui alterações não salvas. Deseja realmente sair?"
- **Botões:**
  - **Confirmar**
  - **Cancelar**
- **Regras:**
  - **RN.:** apenas cancelar a inclusão caso o usuário clique sobre o botão "Confirmar"
  - **RN.:** caso o usuário clique sobre o botão "Cancelar", manter o mesmo na tela de cadastro

#### Tratativa após salvar item

- **RN.:** Caso o usuário preencha todos os campos corretamente e salve o registro, apresentar a seguinte mensagem de confirmação:
  - **"Sucesso! A despesa foi incluída com sucesso."**
- **RN.:** Direcionar o usuário a tela de listagem após salvar o registro
