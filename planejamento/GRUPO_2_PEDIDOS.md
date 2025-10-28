# GRUPO 2 - Gestão de Pedidos + Histórico

## Responsabilidade

Desenvolver o módulo de gerenciamento de pedidos, incluindo listagem, filtros, detalhes, cancelamento e histórico de vendas realizadas.

## SEMANA 1: Análise + Protótipo

### Objetivos

- Documentar fluxo de gestão de pedidos
- Definir estados e regras de negócio (finalizado/cancelado)
- Criar protótipo das telas

### Tarefas

#### 1. Análise de Requisitos

- Listar pedidos (paginação)
- Filtrar por data, status, forma de pagamento
- Visualizar detalhes completos do pedido
- Cancelar pedido (apenas do dia atual, com motivo)
- Estornar estoque ao cancelar

#### 2. Diagrama de Estados

Documentar transições: FINALIZADO → CANCELADO

#### 3. Protótipo

- Tela de listagem com filtros
- Modal de detalhes do pedido
- Modal de cancelamento

### ✅ Entregáveis da Semana 1

- Documento de Análise de Requisitos e Casos de Uso
- Diagrama de estados do pedido
- Protótipo navegável (Figma/Adobe XD)

## SEMANA 2: Desenvolvimento Backend

### Objetivos

- Implementar endpoints de consulta e gestão
- Adicionar lógica de cancelamento com estorno de estoque
- Criar sistema de filtros e paginação

### Tarefas

#### 1. Atualizar Model no Prisma

Adicionar campos: `status`, `motivoCancelamento`, `dataCancelamento`

#### 2. Implementar Service

- `findAll(filtros)` - Listar com filtros e paginação
- `findOne(id)` - Buscar pedido com itens
- `cancel(id, motivo)` - Cancelar pedido (validar dia, estornar estoque em transação)

#### 3. Implementar Controller

- `GET /pedidos` - Listar com filtros
- `GET /pedidos/:id` - Detalhes
- `PATCH /pedidos/:id/cancelar` - Cancelar

### ✅ Entregáveis da Semana 2

- Migration atualizada
- Service com filtros, paginação e cancelamento
- Controller com endpoints
- Testes no Postman/Insomnia

## SEMANA 3: Desenvolvimento Frontend

### Objetivos

- Implementar tela de listagem
- Criar modals de detalhes e cancelamento
- Integrar com backend

### Tarefas

#### 1. Tela de Listagem

- Filtros (status, data, forma de pagamento)
- Tabela com paginação
- Badge de status (verde/vermelho)

#### 2. Modal de Detalhes

- Informações do pedido
- Lista de itens
- Botão cancelar (se aplicável)

#### 3. Modal de Cancelamento

- Campo de motivo (obrigatório)
- Confirmação

#### 4. Formatações

- Datas (dia/mês/ano hora:minuto)
- Valores monetários (R$)

### ✅ Entregáveis da Semana 3

- Tela de listagem com filtros funcionais
- Modal de detalhes completo
- Funcionalidade de cancelamento testada

## 🔗 Integrações

- **Grupo 1 (PDV):** Utiliza estrutura de Pedido
- **Grupo 3 (Estoque):** Estornar estoque ao cancelar
- **Grupo 5 (Auth):** Guards JWT
