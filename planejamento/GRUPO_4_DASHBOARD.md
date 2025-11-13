# GRUPO 4 - Dashboard + Relatórios

## Responsabilidade

Desenvolver dashboard com estatísticas em tempo real e sistema de relatórios de vendas, produtos e finanças. Substituir dados mockados por dados reais da API.

## SEMANA 1: Análise + Protótipo

### Objetivos

- Documentar métricas necessárias
- Definir tipos de relatórios
- Criar protótipo com gráficos

### Tarefas

#### 1. Análise de Requisitos

**Dashboard:**
- Resumo financeiro (vendas, despesas, saldo)
- Gráfico de vendas por dia (últimos 7 ou 30 dias)
- Top 5-10 produtos mais vendidos
- Vendas por forma de pagamento (gráfico pizza)
- Alertas de estoque baixo
- Atividades recentes (últimas vendas)

**Relatórios:**
- Vendas por período (filtro de data)
- Produtos mais vendidos (ranking)
- Financeiro (receitas vs despesas)

#### 2. Métricas Necessárias

- Total de vendas por período
- Ticket médio (valor total / qtd pedidos)
- Comparação com período anterior (%)
- Vendas por forma de pagamento
- Produtos mais vendidos (quantidade e valor)

#### 3. Protótipo

- Dashboard com cards de resumo e gráficos
- Tela de relatórios com tabs (Vendas, Produtos, Financeiro)

### ✅ Entregáveis da Semana 1

- Documento de Análise de Requisitos e Métricas
- Protótipo com layout de dashboard e gráficos (Figma/Adobe XD)

## SEMANA 2: Desenvolvimento Backend

### Objetivos

- Criar endpoints de estatísticas
- Implementar agregações complexas
- Calcular métricas e KPIs

### Tarefas

#### 1. Implementar Service de Dashboard

- `getResumoFinanceiro(periodo)` - Vendas, despesas, saldo, ticket médio, comparação
- `getVendasPorDia(dias)` - Vendas diárias (últimos X dias)
- `getProdutosMaisVendidos(limite)` - Top produtos (quantidade e valor)
- `getVendasPorFormaPagamento()` - Total e % por forma de pagamento

#### 2. Implementar Service de Relatórios

- `relatorioVendas(dataInicio, dataFim)` - Lista de vendas
- `relatorioProdutos(dataInicio, dataFim)` - Ranking de produtos
- `relatorioFinanceiro(dataInicio, dataFim)` - Receitas vs Despesas

#### 3. Implementar Controllers

**DashboardController:**
- `GET /dashboard/resumo?periodo=hoje|semana|mes`
- `GET /dashboard/vendas-por-dia?dias=7`
- `GET /dashboard/produtos-mais-vendidos?limite=10`
- `GET /dashboard/vendas-por-forma-pagamento`

**RelatoriosController:**
- `GET /relatorios/vendas?dataInicio&dataFim`
- `GET /relatorios/produtos?dataInicio&dataFim`
- `GET /relatorios/financeiro?dataInicio&dataFim`

### ✅ Entregáveis da Semana 2

- Endpoints de dashboard implementados
- Agregações e cálculos corretos
- Endpoints de relatórios
- Testes no Postman/Insomnia

## SEMANA 3: Desenvolvimento Frontend

### Objetivos

- Substituir dados mockados por dados reais
- Implementar gráficos interativos
- Criar telas de relatórios

### Tarefas

#### 1. Instalar Biblioteca de Gráficos

`npm install recharts` ou `npm install react-chartjs-2 chart.js`

#### 2. Dashboard Principal

- Cards de resumo (vendas, despesas, saldo, ticket médio)
- Select de período (Hoje, Semana, Mês)
- Gráfico de vendas por dia (LineChart)
- Gráfico de produtos mais vendidos (BarChart)
- Gráfico de vendas por forma de pagamento (PieChart)
- Lista de atividades recentes
- Alertas de estoque baixo

#### 3. Tela de Relatórios

Usar Tabs:
- **Aba "Vendas":** Filtros de data, tabela de vendas, botão exportar CSV
- **Aba "Produtos":** Ranking de produtos mais vendidos
- **Aba "Financeiro":** Cards de receitas/despesas, gráfico comparativo

#### 4. Integração com API

Usar React Query para cache e loading states

### ✅ Entregáveis da Semana 3

- Dashboard com todos os gráficos funcionando (dados reais)
- Tela de relatórios completa
- Exportação de relatórios (opcional)

## 🔗 Integrações

- **Grupo 1 (PDV):** Dados de pedidos
- **Grupo 3 (Estoque):** Alertas de estoque baixo
- **Despesas (já existe):** Dados financeiros
- **Grupo 5 (Auth):** Guards JWT
