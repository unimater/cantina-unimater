# Especificação - Tela de Cadastro de Produtos

## OBJETIVO

Criar uma tela de cadastro de produtos, que permita a criação e gestão de produtos, de forma organizada e reutilizável nos demais locais do sistema.

## CONTEXTO

**Caminho:** Cadastros gerais > Produtos

## IMPLEMENTAÇÕES PROPOSTAS

### Tela: Produtos

- **Menu:** Cadastros gerais
- **Comportamento:** Tela de crud com listagem padrão

---

## Listagem (padrão)

### 1. Filtro de Pesquisa

Na tela de listagem deve haver um campo para filtro de produtos:

**Produto**

- **Tipo:** texto
- **Limitação de caracteres:** 80 caracteres
- **Obrigatoriedade:** opcional

### 2. Grid de Listagem

A listagem dos itens criados deve ser feita por meio de uma grid com paginação, com as seguintes colunas:

- ID
- Descrição
- Categoria
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

- **Descrição**

  - **Tipo:** texto
  - **Limitação de caracteres:** 80 caracteres
  - **Obrigatoriedade:** obrigatório

- **Valor**

  - **Tipo:** numérico
  - **Limitação de caracteres:** 4 caracteres
  - **Obrigatoriedade:** obrigatório
  - **RN.:** adicionar máscara de moeda
  - **RN.:** adicionar vírgula automática após a digitação de 2 caracteres
  - **Padrão:** 00,00
  - **RN.:** preencher o campo da direita pra esquerda
    - 00,01
    - 00,10
    - 01,00
    - 10,00

- **Situação**

  - **Tipo:** checkbox
  - **RN.:** por padrão trazer marcado
  - **RN.:** considerar a seguinte regra relacionada a este campo:
    - Marcado = ativo
    - Desmarcado = inativo

- **Categoria**

  - **Tipo:** seleção única
  - **Opções:** considerar os itens da entidade "Categorias" que estejam com situação ativo e pertençam ao tipo "Produto"
  - **Obrigatoriedade:** obrigatório

- **Imagem**
  - **Tipo:** anexo
  - **Obrigatoriedade:** obrigatório
  - **RN.:** limitar a apenas 1 anexo
  - **RN.:** permitir apenas arquivos em formato .png ou .jpg

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
  - **"Não foi possível salvar o registro! Já existe um produto com a mesma descrição, verifique!"**

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

#### Tratativa após salvar item

- **RN.:** Caso o usuário preencha todos os campos corretamente e salve o registro, apresentar a seguinte mensagem de confirmação:
  - **"Sucesso! O produto foi incluído com sucesso."**
- **RN.:** Direcionar o usuário a tela de listagem após salvar o registro
