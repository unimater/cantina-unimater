# 🧾 Caso de Uso — Gerenciamento de Estoque

## 🎯 Identificação
**Ator:** Usuário (Operador de Estoque / Administrador)  
**Objetivo:** Monitorar o estoque em tempo real e registrar movimentações de entrada e saída de produtos.  
**Pré-condições:**  
- O usuário deve estar autenticado no sistema.  
- Os produtos devem estar previamente cadastrados.  

---

## 🔁 Fluxo Principal
1. O **Usuário** acessa o menu **"Controle de Estoque"** no sistema.  
2. O **Sistema** exibe a **lista de produtos** com as colunas: **Nome, Quantidade Atual, Unidade de Medida, Estoque Mínimo e Status**.  
3. O **Usuário** pode **filtrar** os produtos pelo nome ou status (ex.: abaixo do mínimo).  
4. O **Usuário** clica em **"Registrar Entrada"** ou **"Registrar Saída"**, conforme a operação desejada.  
5. O **Sistema** exibe o **formulário de movimentação de estoque** com os campos:  
   - Produto  
   - Quantidade  
   - Tipo de Movimentação (COMPRA, VENDA, AJUSTE, etc.)  
   - Data  
   - Observações (opcional)  
6. O **Usuário** preenche os campos obrigatórios e clica em **"Salvar"**.  
7. O **Sistema** valida as informações (quantidade > 0, produto existente, etc.).  
8. Se os dados estiverem corretos:  
   - Para **entradas**, o sistema **aumenta** a quantidade do produto.  
   - Para **saídas**, o sistema **diminui** a quantidade do produto.  
9. O **Sistema** registra a movimentação no **Histórico de Movimentações**, salvando data, hora, tipo, usuário e observação.  
10. Caso o produto atinja ou fique abaixo do estoque mínimo, o **Sistema** exibe um **alerta visual de estoque baixo**.  
11. O **Sistema** exibe uma **mensagem de sucesso** e retorna à tela principal de estoque com as informações atualizadas.  

---

## 🔄 Fluxos Alternativos

### 🔸 A1 — Edição de Movimentação
1. Na tela de **Histórico de Movimentações**, o **Usuário** clica no ícone **"Editar"** em um registro.  
2. O **Sistema** exibe o **formulário preenchido** com os dados da movimentação.  
3. O **Usuário** altera os campos desejados e clica em **"Salvar"**.  
4. O **Sistema** valida as informações e salva as alterações.  
5. O **Sistema** ajusta o estoque automaticamente, conforme a nova movimentação.  

---

### 🔸 A2 — Exclusão de Movimentação
1. Na tela de **Histórico de Movimentações**, o **Usuário** clica no ícone **"Excluir"**.  
2. O **Sistema** exibe uma **mensagem de confirmação** ("Deseja realmente excluir esta movimentação?").  
3. O **Usuário** confirma a exclusão.  
4. O **Sistema** remove o registro e **reverte a alteração no estoque**, restaurando a quantidade anterior.  
5. O **Sistema** exibe uma **mensagem de sucesso**.  

---

### 🔸 A3 — Quantidade Inválida
1. Durante o cadastro ou edição, o **Usuário** informa uma quantidade igual ou menor que zero.  
2. O **Sistema** exibe a mensagem:  
   > "Quantidade inválida. Informe um valor maior que zero."  
3. O **Sistema** impede o salvamento até que o valor seja corrigido.  

---

### 🔸 A4 — Estoque Insuficiente para Saída
1. O **Usuário** tenta registrar uma **saída** com quantidade maior do que a disponível no estoque.  
2. O **Sistema** exibe a mensagem:  
   > "Estoque insuficiente para realizar esta operação."  
3. O **Sistema** não efetiva a movimentação até que a quantidade seja ajustada.  

---

### 🔸 A5 — Integração com PDV
1. Uma **venda** é concluída no módulo **PDV**.  
2. O **PDV** envia automaticamente os dados para o módulo de **Controle de Estoque**.  
3. O **Sistema** registra a movimentação como **SAÍDA – VENDA**, reduz a quantidade e grava no histórico.  
4. Caso o estoque fique igual ou abaixo do mínimo, o sistema gera **alerta automático**.  

---

### 🔸 A6 — Falha ao Registrar
1. Ocorre uma **falha no banco de dados** ou perda de conexão durante o salvamento.  
2. O **Sistema** exibe a mensagem:  
   > "Erro ao salvar movimentação. Tente novamente."  
3. O **Sistema** não altera o estoque até que a operação seja concluída com sucesso.  

---

## 🧠 Regras de Negócio
| **ID** | **Descrição** |
|--------|----------------|
| **RN01** | Não permitir movimentações com quantidade zero ou negativa. |
| **RN02** | Não permitir saídas com quantidade superior à disponível. |
| **RN03** | Exibir automaticamente alerta de estoque baixo quando a quantidade ≤ estoque mínimo. |
| **RN04** | Todas as movimentações (inclusas, editadas ou excluídas) devem ser registradas no histórico. |

---

## ⚙️ Requisitos Relacionados
- **RF01** — Visualizar estoque atual de todos os produtos.  
- **RF02** — Registrar entradas e saídas de estoque.  
- **RF03** — Atualizar automaticamente a quantidade após movimentações.  
- **RF04** — Exibir alertas para produtos abaixo do estoque mínimo.  
- **RF05** — Manter histórico completo das movimentações.  
- **RF08** — Integrar com o PDV para baixa automática em vendas.  

---

📌 **Responsável:** Vinicius Guarese Caldato  
📆 **Semana 1 — Análise + Protótipo**
