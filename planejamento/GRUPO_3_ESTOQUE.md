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
