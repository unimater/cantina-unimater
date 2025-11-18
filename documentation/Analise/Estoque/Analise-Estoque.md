## 🎯 Objetivos

- Monitorar o **estoque em tempo real**.
- Registrar **entradas e saídas** de produtos.
- Exibir **alertas de estoque baixo**.
- Consultar **histórico completo** de movimentações.
- Integrar com o **PDV** para baixa automática em vendas.

---

## 🧩 Funcionalidades Principais

### 🔹 Visualizar Estoque Atual

- Listagem dos produtos com:
  - Nome, quantidade atual, unidade de medida, estoque mínimo e status.
- Exibir **alertas visuais** (ícone/cor) para produtos abaixo do mínimo.

### 🔹 Registrar Entrada de Estoque

- Adicionar novas unidades ao estoque.
- Campos:
  - Produto
  - Quantidade
  - Tipo (COMPRA, AJUSTE_ENTRADA, DEVOLUÇÃO)
  - Data
  - Observações (opcional)

### 🔹 Registrar Saída de Estoque

- Registrar baixas manuais de produtos.
- Campos:
  - Produto
  - Quantidade
  - Tipo (VENDA, PERDA, VENCIMENTO, AJUSTE_SAÍDA)
  - Data
  - Observações (opcional)

### 🔹 Consultar Histórico de Movimentações

- Exibir tabela com:
  - Data, Tipo, Produto, Quantidade, Usuário e Observação.
- Permitir **filtros** por tipo, produto e data.

### 🔹 Definir Estoque Mínimo

- Definir o **nível mínimo** de cada produto.
- Exibir **alerta automático** quando a quantidade for ≤ estoque mínimo.

### 🔹 Integração com PDV

- Ao registrar uma venda, o sistema deve:
  - Reduzir a quantidade no estoque.
  - Registrar movimentação como **SAÍDA – VENDA**.

---

## 🔄 Tipos de Movimentação

| **Tipo**       | **Categoria** | **Descrição**                                        |
| -------------- | ------------- | ---------------------------------------------------- |
| COMPRA         | ENTRADA       | Entrada por aquisição de produtos.                   |
| AJUSTE_ENTRADA | ENTRADA       | Correção de estoque para mais.                       |
| DEVOLUÇÃO      | ENTRADA       | Retorno de produto anteriormente vendido ou perdido. |
| VENDA          | SAÍDA         | Saída automática via PDV.                            |
| PERDA          | SAÍDA         | Produto danificado ou extraviado.                    |
| VENCIMENTO     | SAÍDA         | Produto vencido.                                     |
| AJUSTE_SAÍDA   | SAÍDA         | Correção de estoque para menos.                      |

---

## ⚙️ Requisitos Funcionais

| **ID** | **Descrição**                                               |
| ------ | ----------------------------------------------------------- |
| RF01   | Visualizar o estoque atual de todos os produtos.            |
| RF02   | Registrar entradas e saídas de estoque.                     |
| RF03   | Atualizar automaticamente a quantidade após movimentações.  |
| RF04   | Exibir alertas para produtos abaixo do estoque mínimo.      |
| RF05   | Manter histórico completo das movimentações.                |
| RF06   | Permitir filtro no histórico por tipo, produto e data.      |
| RF07   | Permitir definir e editar o estoque mínimo de cada produto. |
| RF08   | Integrar com o PDV para baixa automática em vendas.         |

---

## 🔒 Requisitos Não Funcionais

| **ID** | **Descrição**                                                     |
| ------ | ----------------------------------------------------------------- |
| RNF01  | Interface simples e intuitiva, acessível a usuários não técnicos. |
| RNF02  | Registrar data, hora e usuário em todas as operações.             |
| RNF03  | Atualizar o estoque em tempo real quando integrado ao PDV.        |
| RNF04  | Layout responsivo (desktop, tablet e celular).                    |
| RNF05  | Garantir integridade dos dados em caso de falhas.                 |

---

## 🧠 Regras de Negócio

| **ID** | **Descrição**                                                                   |
| ------ | ------------------------------------------------------------------------------- |
| RN01   | Não permitir movimentações com quantidade zero ou negativa.                     |
| RN02   | Não permitir saída quando a quantidade disponível for menor que a solicitada.   |
| RN03   | Exibir alerta de estoque baixo automaticamente.                                 |
| RN04   | Todas as movimentações devem ser registradas no histórico, mesmo se revertidas. |

---

## 💻 Protótipo — Telas e Componentes

### 🪟 Tela de Estoque

- Exibe lista de produtos com quantidade e status.
- Botões de ação:
  - **Registrar Entrada**
  - **Registrar Saída**
  - **Histórico**

### 📥 Modal de Entrada de Estoque

- Campos: Produto, Quantidade, Tipo, Observação, Data.
- Botão: **Confirmar Entrada**

### 📤 Modal de Saída de Estoque

- Campos: Produto, Quantidade, Tipo, Observação, Data.
- Botão: **Confirmar Saída**

### 📊 Tela de Histórico

- Tabela com todas as movimentações.
- Filtros por: Data, Tipo, Produto.
- Colunas: Data, Tipo, Produto, Quantidade, Usuário, Observação.

---

📌 **Responsável:** Vinicius Guarese Caldato  
📆 **Semana 1 — Análise + Protótipo**
