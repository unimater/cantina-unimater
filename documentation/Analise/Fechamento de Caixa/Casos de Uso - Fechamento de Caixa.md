# Casos de Uso - Fechamento de Caixa

## Geração de Relatório de Fechamento de Caixa

**Ator:** Usuário do Sistema  
**Objetivo:** Gerar um relatório completo de fechamento de caixa, com base nas vendas realizadas e nos filtros aplicados.  
**Pré-condições:**  
- O usuário deve estar autenticado no sistema.  
- O sistema deve estar integrado ao módulo de Vendas.  

---

### Fluxo Principal

1. O usuário acessa o módulo **“Fechamento de Caixa”** através do menu do sistema.  
2. O sistema exibe a tela de **Fechamento de Caixa**, contendo os filtros disponíveis (período, forma de pagamento, produto e categoria).  
3. O usuário configura os filtros desejados e clica em **“Gerar Relatório”**.  
4. O sistema consulta o banco de dados de vendas conforme os filtros aplicados.  
5. O sistema processa os resultados e gera o relatório de fechamento de caixa.  
6. O usuário visualiza os resultados na tela, incluindo:
   - Data da venda  
   - Produto  
   - Quantidade vendida  
   - Valor total  
   - Forma de pagamento  
   - Categoria  
   - Lucro obtido  
7. O sistema também apresenta os totais consolidados:
   - Valor total das vendas  
   - Lucro total  
   - Produto mais vendido  
   - Forma de pagamento mais utilizada  

---

### Fluxos Alternativos

#### FA1 - Envio por E-mail

1. O usuário clica na opção **“Enviar por E-mail”**.  
2. O sistema solicita confirmação da ação.  
3. O usuário confirma o envio.  
4. O sistema envia o relatório para o endereço de e-mail cadastrado da administração.  
5. O sistema exibe a mensagem:  
   > “Relatório enviado com sucesso para o e-mail cadastrado.”

---

#### FA2 - Exportação para PDF

1. O usuário clica na opção **“Exportar para PDF”**.  
2. O sistema solicita confirmação da ação.  
3. O usuário confirma a exportação.  
4. O sistema gera o arquivo PDF contendo os dados do relatório.  
5. O sistema exibe a mensagem:  
   > “Relatório exportado com sucesso!”

---

#### FA3 - Impressão do Relatório

1. O usuário clica em **“Imprimir Relatório”**.  
2. O sistema envia os dados para a impressora configurada.  
3. O relatório é impresso com as informações do fechamento de caixa.  

---

### Regras de Negócio

- O relatório só pode ser gerado se houver dados de vendas no período selecionado.  
- Caso nenhum dado seja encontrado, o sistema deve exibir a mensagem:  
  > “Nenhum registro encontrado para os filtros aplicados.”     
- Todos os filtros devem ter o valor padrão “Todos” caso não sejam configurados.  
