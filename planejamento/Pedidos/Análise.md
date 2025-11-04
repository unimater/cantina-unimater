# Análise de Requisitos — Módulo de Gestão de Pedidos

## 1. Objetivo

O módulo de Gestão de Pedidos tem como finalidade implementar um conjunto completo de funcionalidades relacionadas ao ciclo de vida dos pedidos e ao histórico de vendas. Entre as principais operações previstas estão:

- Listagem e filtragem de pedidos
- Visualização de detalhes completos
- Cancelamento de pedidos (com validações e registro de motivo)
- Registro e consulta do histórico de vendas

Conforme definido no planejamento:

> “Desenvolver o módulo de gerenciamento de pedidos, incluindo listagem, filtros, detalhes, cancelamento e histórico de vendas realizadas.”

Esse módulo tem papel central no processo operacional do sistema e deve permitir uma gestão eficiente, segura e rastreável dos pedidos.

---

## 2. Contexto e Integrações

O módulo não opera de forma isolada. Ele se comunica com outros domínios do sistema para garantir consistência de dados e fluxo operacional adequado.

### Integrações previstas

- **PDV (Ponto de Venda):** utiliza a estrutura de Pedido já definida, garantindo que vendas registradas no PDV sejam corretamente armazenadas.
- **Estoque:** responsável pelo estorno automático de itens em caso de cancelamento de pedido.
- **Autenticação (Auth):** controle de acesso via Guards JWT, permitindo operações apenas para usuários autorizados.

Essas integrações exigem alinhamento entre equipes e padronização de interfaces.

---

## 3. Implementações Previstas

### 3.1. Tela: Gestão de Pedidos

Tela principal para consulta e administração dos pedidos do sistema.

Funcionalidades esperadas:

- Exibição de pedidos em listagem paginada
- Filtros de busca por data, status e forma de pagamento
- Acesso aos detalhes do pedido por meio de modal
- Ação de cancelamento com validações

---

### 3.2. Listagem de Pedidos

A listagem será o ponto inicial de interação com o módulo, devendo permitir consulta rápida e refinamento de resultados.

#### Filtros

- Data do pedido
- Status do pedido (ex.: Finalizado, Cancelado)
- Forma de pagamento

#### Informações exibidas na listagem

- ID do pedido
- Data e hora do pedido
- Status (exibido com badge visual)
- Forma de pagamento
- Ações disponíveis (ex.: visualizar, cancelar)

---

### 3.3. Modal: Detalhes do Pedido

Modal com informações completas do pedido, permitindo consulta dos dados sem sair da tela principal.

Conteúdo obrigatório:

- Informações gerais (ID, data, status, total etc.)
- Itens do pedido com quantidade, valor unitário e subtotal
- Botão “Cancelar Pedido”, quando aplicável

---

### 3.4. Modal: Cancelamento de Pedido

Modal destinada à confirmação da operação de cancelamento.

Requisitos:

- Exibição de aviso de irreversibilidade da ação
- Campo obrigatório para preenchimento do motivo
- Validação da regra de negócio: apenas pedidos do dia atual podem ser cancelados
- Acionamento de estorno de estoque após confirmação

---

## 4. Regras de Negócio (RNs)

- O cancelamento só ocorre após confirmação explícita do usuário.
- Ao cancelar a ação, nenhuma alteração deve ser registrada.
- Somente pedidos realizados no dia atual podem ser cancelados.
- Todo cancelamento deve gerar estorno de estoque dos itens.
- O motivo do cancelamento deve ser informado obrigatoriamente.
- O status deve ser atualizado de “FINALIZADO” para “CANCELADO”, conforme permitido pelo diagrama de estados.

---

## 5. Atualizações no Modelo de Dados

O modelo de Pedido deve incluir novos campos para suporte ao histórico e cancelamento:

- `status` — estado atual do pedido
- `motivoCancelamento` — justificativa informada pelo usuário
- `dataCancelamento` — data e hora do cancelamento

---

## 6. Padrões de Exibição

- Datas devem seguir o formato: `dd/mm/aaaa hh:mm`
- Valores financeiros devem exibir o prefixo `R$`
- Status deve ser representado visualmente por badge colorido
- Mensagens de confirmação, erro e alerta devem ser exibidas quando aplicável

---

## 7. Considerações Finais

O módulo de Gestão de Pedidos é parte essencial do sistema e depende diretamente de integrações com os domínios de Estoque, PDV e Autenticação. Seu desenvolvimento requer atenção às regras de negócio, às restrições operacionais e à experiência do usuário.