# GRUPO 3 - Gestão de Estoque

## Responsabilidade

Desenvolver o módulo de controle de estoque, incluindo entrada/saída de produtos, alertas de estoque baixo, histórico de movimentações e integração com o PDV para baixa automática.

## SEMANA 1: Análise + Protótipo

### Objetivos

- Documentar fluxo de controle de estoque
- Definir tipos de movimentação
- Criar protótipo das telas

### Tarefas

#### 1. Análise de Requisitos

- Visualizar estoque atual (quantidade disponível)
- Registrar entrada de estoque (compra, ajuste, devolução)
- Registrar saída de estoque (perda, vencimento, ajuste)
- Consultar histórico de movimentações
- Definir estoque mínimo (alertas)
- Baixa automática ao vender (integração PDV)

#### 2. Tipos de Movimentação

**ENTRADAS:** COMPRA, AJUSTE_ENTRADA, DEVOLUCAO
**SAÍDAS:** VENDA, PERDA, VENCIMENTO, AJUSTE_SAIDA

#### 3. Protótipo

- Tela de visualização de estoque (alertas visuais)
- Modal de entrada de estoque
- Modal de saída de estoque
- Tela de histórico de movimentações

### ✅ Entregáveis da Semana 1

- Documento de Análise de Requisitos e Casos de Uso
- Documentação de tipos de movimentação
- Protótipo navegável (Figma/Adobe XD)

# RESULTADO DA ANÁLISE - SEMANA 1

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

| **Tipo** | **Categoria** | **Descrição** |
|-----------|----------------|----------------|
| COMPRA | ENTRADA | Entrada por aquisição de produtos. |
| AJUSTE_ENTRADA | ENTRADA | Correção de estoque para mais. |
| DEVOLUÇÃO | ENTRADA | Retorno de produto anteriormente vendido ou perdido. |
| VENDA | SAÍDA | Saída automática via PDV. |
| PERDA | SAÍDA | Produto danificado ou extraviado. |
| VENCIMENTO | SAÍDA | Produto vencido. |
| AJUSTE_SAÍDA | SAÍDA | Correção de estoque para menos. |

---

## ⚙️ Requisitos Funcionais

| **ID** | **Descrição** |
|--------|----------------|
| RF01 | Visualizar o estoque atual de todos os produtos. |
| RF02 | Registrar entradas e saídas de estoque. |
| RF03 | Atualizar automaticamente a quantidade após movimentações. |
| RF04 | Exibir alertas para produtos abaixo do estoque mínimo. |
| RF05 | Manter histórico completo das movimentações. |
| RF06 | Permitir filtro no histórico por tipo, produto e data. |
| RF07 | Permitir definir e editar o estoque mínimo de cada produto. |
| RF08 | Integrar com o PDV para baixa automática em vendas. |

---

## 🔒 Requisitos Não Funcionais

| **ID** | **Descrição** |
|--------|----------------|
| RNF01 | Interface simples e intuitiva, acessível a usuários não técnicos. |
| RNF02 | Registrar data, hora e usuário em todas as operações. |
| RNF03 | Atualizar o estoque em tempo real quando integrado ao PDV. |
| RNF04 | Layout responsivo (desktop, tablet e celular). |
| RNF05 | Garantir integridade dos dados em caso de falhas. |

---

## 🧠 Regras de Negócio

| **ID** | **Descrição** |
|--------|----------------|
| RN01 | Não permitir movimentações com quantidade zero ou negativa. |
| RN02 | Não permitir saída quando a quantidade disponível for menor que a solicitada. |
| RN03 | Exibir alerta de estoque baixo automaticamente. |
| RN04 | Todas as movimentações devem ser registradas no histórico, mesmo se revertidas. |

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
---
---
--
## SEMANA 2: Desenvolvimento Backend

### Objetivos

- Adicionar campos de estoque no produto
- Criar model de movimentação
- Implementar lógica de entrada/saída
- Criar integração com PDV

### Tarefas

#### 1. Atualizar Model Produto

Adicionar: `quantidadeEstoque`, `estoqueMinimo`

#### 2. Criar Model MovimentacaoEstoque

Campos: tipo, motivo, quantidade, estoqueAnterior, estoqueAtual, usuarioId, observacoes

#### 3. Implementar Service

- `registrarMovimentacao(dto, usuarioId)` - Entrada/saída manual (usar transação)
- `baixarEstoque(produtoId, quantidade, usuarioId)` - Chamado pelo PDV
- `listarEstoque()` - Produtos com quantidade
- `produtosEstoqueBaixo()` - Alertas
- `listarMovimentacoes(filtros)` - Histórico

#### 4. Implementar Controller

- `GET /estoque` - Listar estoque
- `GET /estoque/baixo` - Produtos com estoque baixo
- `GET /estoque/movimentacoes` - Histórico
- `POST /estoque/movimentacao` - Registrar entrada/saída

#### 5. Integração com PDV

No `PedidosService.create()`, chamar `estoqueService.baixarEstoque()` para cada item

### ✅ Entregáveis da Semana 2

- Migration com campos de estoque
- Service completo com todas as operações
- Controller com endpoints
- Integração com PDV funcionando
- Testes no Postman/Insomnia

## SEMANA 3: Desenvolvimento Frontend

### Objetivos

- Implementar tela de visualização de estoque
- Criar modals de entrada/saída
- Implementar histórico de movimentações

### Tarefas

#### 1. Tela de Estoque

Usar Tabs:
- **Aba "Estoque Atual":** Tabela com produtos, quantidade, estoque mínimo, status (badge verde/amarelo/vermelho)
- **Aba "Histórico":** Lista de movimentações com filtros

#### 2. Modal de Entrada

- Select de produto
- Select de motivo (COMPRA, AJUSTE_ENTRADA, DEVOLUCAO)
- Input de quantidade
- Textarea de observações

#### 3. Modal de Saída

- Select de produto
- Select de motivo (PERDA, VENCIMENTO, AJUSTE_SAIDA)
- Input de quantidade (validar estoque disponível)
- Textarea de observações

#### 4. Alerta de Estoque Baixo

Componente no topo: "⚠️ X produtos com estoque baixo"

#### 5. Histórico com Filtros

- Filtro por produto, tipo (entrada/saída), período
- Badge verde (entrada) / vermelho (saída)

### ✅ Entregáveis da Semana 3

- Tela de estoque com tabela e alertas
- Modals de entrada/saída funcionais
- Histórico de movimentações com filtros

## 🔗 Integrações

- **Grupo 1 (PDV):** PDV chama `baixarEstoque()` ao vender
- **Grupo 2 (Pedidos):** Estornar estoque ao cancelar pedido
- **Grupo 5 (Auth):** Guards JWT
