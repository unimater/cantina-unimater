#  Casos de Uso – Tela de Dashboard (Cantina Unimater)

A tela de **Dashboard** apresenta um painel de controle diário com informações consolidadas sobre **receitas**, **despesas**, **vendas** e **estoque**.
O objetivo é oferecer uma visão geral e rápida do desempenho diário da cantina.

---

##  1. Visualizar Indicadores Financeiros do Dia

**Ator Principal:** Usuário (Administrador ou Atendente da Cantina)
**Descrição:** Exibe os indicadores consolidados de receitas, despesas e saldo do dia.
**Pré-condição:** Deve haver registros de vendas e despesas cadastrados para o dia atual.

### Fluxo Principal

1. O usuário acessa a tela de Dashboard.
2. O sistema consulta os dados financeiros do dia.
3. O sistema exibe:

   * Total de Receitas
   * Total de Despesas
   * Saldo (Receitas - Despesas)
4. Os valores são apresentados em formato de **cards resumidos**.

### Fluxo Alternativo

* Se não houver dados registrados, o sistema exibe os valores zerados.

**Pós-condição:** O usuário visualiza o resumo financeiro atualizado do dia.

---

## 2. Visualizar Produtos Mais Vendidos

**Ator Principal:** Usuário
**Descrição:** Exibe um gráfico de barras com os produtos mais vendidos no dia.
**Pré-condição:** Deve haver registros de vendas concluídas no dia.

### Fluxo Principal

1. O sistema carrega os produtos com base nas vendas realizadas.
2. O sistema contabiliza a quantidade total vendida de cada produto.
3. O gráfico de barras é exibido com:

   * Eixo X: Produtos
   * Eixo Y: Quantidades vendidas
4. O usuário identifica visualmente quais produtos tiveram melhor desempenho.

### Fluxo Alternativo

* Caso não haja vendas registradas, o gráfico é exibido sem informações.

**Pós-condição:** O usuário compreende o desempenho dos produtos no dia.

---

## 3. Visualizar Distribuição por Forma de Pagamento

**Ator Principal:** Usuário
**Descrição:** Mostra um gráfico de **anel (ou pizza)** com a proporção das formas de pagamento utilizadas.
**Pré-condição:** Deve haver registros de vendas com formas de pagamento associadas.

### Fluxo Principal

1. O sistema agrupa as vendas por tipo de pagamento (Pix, Cartão, Dinheiro etc.).
2. Calcula a porcentagem de cada forma em relação ao total de vendas.
3. Exibe o gráfico de anel com a distribuição percentual.
4. O usuário interpreta qual forma de pagamento foi mais utilizada.

### Fluxo Alternativo

* Se não houver vendas registradas, o sistema exibe a mensagem:

  > “Sem dados disponíveis”.

**Pós-condição:** O usuário visualiza a distribuição das vendas por forma de pagamento.

---

## 4. Consultar Situação do Estoque

**Ator Principal:** Usuário
**Descrição:** Exibe a tabela de produtos com a situação do estoque no dia.
**Pré-condição:** Os produtos devem estar cadastrados com suas quantidades em estoque.

### Fluxo Principal

1. O sistema consulta as informações de estoque de cada produto.
2. Exibe a tabela com colunas:

   * Produto
   * Quantidade
   * Status
3. O status é determinado conforme a quantidade:

   * **Esgotado:** quantidade = 0
   * **Baixo estoque:** quantidade ≤ limite mínimo
   * **Disponível:** quantidade > limite mínimo
4. O sistema utiliza **cores** para indicar visualmente o status de cada produto.

### Fluxo Alternativo

* Caso algum produto não tenha quantidade registrada, o sistema exibe: “Não há registros”.

**Pós-condição:** O usuário visualiza o status atualizado do estoque da cantina.
