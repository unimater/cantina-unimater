# Especificação - Tela de Fechamento de Caixa

## OBJETIVO

Criar uma tela para Fechamento de Caixa, que permita ao usuário gerar relatórios detalhados sobre vendas, lucros, produtos e formas de pagamento realizadas em um determinado período, com base nos filtros aplicados.

---

## CONTEXTO

**Caminho:** Fechamento de Caixa
**Menu:** Caixa  
**Comportamento:** Tela de consulta e geração de relatórios, com filtros e exibição dos resultados.

---

## IMPLEMENTAÇÕES PROPOSTAS

### Tela: Fechamento de Caixa

A tela será composta por:

1. **Filtros de pesquisa** (para gerar o relatório conforme critérios definidos);
2. **Tabela de resultados** (exibindo as informações detalhadas das vendas);
3. **Opções de exportação** (para salvar, enviar ou imprimir o relatório).

---

## 1. Filtro de Pesquisa

Os seguintes filtros devem estar disponíveis:

| **Campo** | **Tipo** | **Detalhes / Regras de Negócio** |
|------------|-----------|----------------------------------|
| **Período** | Seleção (diário, semanal, mensal, personalizado) | Caso “personalizado” seja selecionado, habilitar os campos **Data Inicial** e **Data Final**. |
| **Forma de Pagamento** | Seleção múltipla (Pix, Dinheiro, Cartão de Crédito, Cartão de Débito, etc.) | O padrão inicial deve ser **“Todos”**. |
| **Produto** | Seleção (Salgado, Doce, Café, Refrigerante, Suco, Outros) | O padrão inicial deve ser **“Todos”**. |
| **Categoria** | Seleção (Alimentação, Bebidas, Outros) | O padrão inicial deve ser **“Todas”**. |

---

## 2. Grid de Listagem

Após a aplicação dos filtros e geração do relatório, os dados deverão ser apresentados em uma página, com as seguintes colunas:

| **Coluna** | **Descrição** |
|-------------|----------------|
| **Data da Venda** | Exibe a data em formato DD/MM/AAAA. |
| **Produto** | Nome do produto vendido. |
| **Quantidade Vendida** | Quantidade total comercializada. |
| **Valor Total** | Soma dos valores das unidades vendidas. |
| **Forma de Pagamento** | Forma utilizada na transação. |
| **Categoria** | Categoria associada ao produto. |
| **Lucro Obtido** | Lucro total gerado pela venda. |

### Totais Automáticos

Abaixo da tabela, devem ser exibidos os seguintes indicadores calculados automaticamente:

- **Valor Total das Vendas**
- **Lucro Total**
- **Produto mais vendido**
- **Forma de pagamento mais utilizada**

---

## 3. Exportação e Compartilhamento

O sistema deve oferecer três opções de exportação dos relatórios gerados:

| **Função** | **Descrição / Regras** |
|-------------|------------------------|
| **Exportar PDF** | Gera um arquivo PDF contendo a tabela de resultados. |
| **Enviar por E-mail** | Envia o relatório automaticamente para o endereço de e-mail cadastrado da administração. |
| **Imprimir** | Permite gerar uma cópia física do relatório. |

Antes de exportar ou enviar o relatório, deve ser exibida uma mensagem de confirmação com as opções “Confirmar” e “Cancelar”.

---

## 4. Regras de Negócio (RN)

1. **Filtros obrigatórios:**  
   O usuário deve informar ao menos um filtro (ou aceitar o padrão “Todos”) para gerar o relatório.

2. **Geração de relatório:**  
   Caso nenhum resultado seja encontrado, exibir mensagem:  
   > “Nenhum registro encontrado para os filtros aplicados.”

3. **Exportação de relatórios:**  
   Somente relatórios com dados válidos podem ser exportados ou enviados por e-mail.

4. **Atualização automática:**  
   A tabela e os totais automáticos devem ser atualizados sempre que o relatório for regenerado.
