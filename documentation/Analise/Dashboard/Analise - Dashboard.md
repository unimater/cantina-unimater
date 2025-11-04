# 📊 Análise da Tela – Dashboard

A tela de **Dashboard** apresenta um painel de controle diário com informações consolidadas sobre **receitas, despesas, vendas e estoque**.
Seu principal objetivo é oferecer uma **visão geral e rápida do desempenho da cantina no dia**, facilitando a tomada de decisões e o acompanhamento das operações.

---

## 1. Indicadores Resumidos (Cards Superiores)

Na parte superior da tela são exibidos três **cards informativos** com os principais indicadores financeiros do dia:

* **Total de Receitas:** valor total recebido durante o dia.
  *Exemplo:* R$ 2.000,00

* **Total de Despesas:** valor total gasto durante o dia.
  *Exemplo:* R$ 500,00

* **Saldo:** resultado do dia, calculado automaticamente como *(Receitas - Despesas)*.
  *Exemplo:* R$ 1.500,00

Esses valores são atualizados dinamicamente conforme os registros de **vendas e despesas** são inseridos no sistema.

**Objetivo:** permitir ao usuário identificar rapidamente o desempenho financeiro diário da cantina.

---

## 2. Produtos Mais Vendidos

Essa seção exibe um **gráfico de barras** com os produtos que tiveram maior volume de vendas no dia.
Cada barra representa a **quantidade vendida** de um produto específico.

**Dados exibidos:**

* Nome do produto (ex: Pastel, Enroladinho, Café, Coca-Cola, Pizza)
* Quantidade vendida no dia

**Objetivo:** possibilitar uma visualização rápida e intuitiva dos itens mais populares, auxiliando na **tomada de decisão para reposição de estoque e estratégias de venda**.

---

## 3. Formas de Pagamento

Exibe um **gráfico de anel (ou pizza)** que mostra a **distribuição das vendas por forma de pagamento**, permitindo compreender como os clientes realizaram suas compras.

**Dados exibidos:**

* Tipos de pagamento: Pix, Cartão de crédito, Dinheiro, etc.
* Percentual ou proporção de cada forma em relação ao total de vendas do dia.

**Objetivo:** apresentar, de forma visual e clara, a preferência dos clientes quanto às formas de pagamento, auxiliando no controle de caixa e planejamento financeiro.

---

## 4. Controle de Estoque

A seção de **Controle de Estoque** exibe uma tabela com a situação atual dos produtos, destacando visualmente o status de disponibilidade.

**Colunas apresentadas:**

* **Produto:** nome do item.
* **Quantidade:** quantidade disponível no estoque.
* **Status:** situação do item com indicação visual por cor.

**Status possíveis:**

* 🟥 **Esgotado:** quantidade igual a zero.
* 🟧 **Baixo estoque:** quantidade baixa (por exemplo, até 5 unidades).
* 🟩 **Disponível:** quantidade adequada (acima do limite mínimo definido).

**Observação:** o sistema deve permitir a **configuração de um limite mínimo de estoque**, para que o status de cada produto seja calculado automaticamente com base nesse valor.

**Objetivo:** permitir ao usuário monitorar o nível de estoque de forma clara, evitando rupturas e garantindo o abastecimento contínuo dos produtos mais vendidos.
