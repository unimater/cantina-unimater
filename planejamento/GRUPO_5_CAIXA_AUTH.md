# GRUPO 5 - Fechamento de Caixa + Autenticação

## Responsabilidade

Implementar autenticação JWT em todas as rotas do backend, sistema de recuperação de senha e módulo de fechamento de caixa com relatório diário de vendas e finanças.

## ⚠️ PRIORIDADE CRÍTICA

**A autenticação DEVE ser implementada na SEMANA 1**, pois todos os outros grupos dependem disso para proteger suas rotas.

## SEMANA 1: Autenticação + Análise

### Objetivos

- **PRIORIDADE 1:** Implementar Guards JWT em todas as rotas
- Criar sistema de recuperação de senha
- Documentar fechamento de caixa
- Criar protótipo

### Tarefas

#### 1. Implementar Guards JWT (DIAS 1-3) ⚡

**Aplicar em TODOS os Controllers:**
- `produtos.controller.ts`
- `categorias.controller.ts`
- `formas-pagamento.controller.ts`
- `despesas.controller.ts`
- `users.controller.ts`

Adicionar: `@UseGuards(JwtAuthGuard)` em cada controller

**Exceções (rotas públicas):**
- `POST /auth/login`
- `POST /auth/recuperar-senha`
- `POST /auth/redefinir-senha`

**Comunicar aos outros grupos** que podem usar Guards

#### 2. Recuperação de Senha (DIAS 4-5)

**Model de Token:** Criar migration se não existir
- token, usuarioId, tipo, usado, expiresAt

**Implementar no AuthService:**
- `solicitarRecuperacaoSenha(email)` - Gerar token, enviar email
- `redefinirSenha(token, novaSenha)` - Validar token, atualizar senha

**Endpoints:**
- `POST /auth/recuperar-senha` (público)
- `POST /auth/redefinir-senha` (público)

#### 3. Análise de Fechamento de Caixa

- Visualizar resumo do dia (vendas, despesas, saldo)
- Vendas por forma de pagamento
- Lista de despesas
- Filtrar por data (dias anteriores)

#### 4. Protótipo

- Tela de fechamento de caixa
- Tela de recuperação de senha
- Tela de redefinir senha

### ✅ Entregáveis da Semana 1

- ✅ Guards JWT aplicados em TODAS as rotas (CRÍTICO)
- ✅ Sistema de recuperação de senha funcionando
- ✅ Documento de análise de fechamento de caixa
- ✅ Protótipo das telas

## SEMANA 2: Desenvolvimento Backend (Fechamento de Caixa)

### Objetivos

- Implementar endpoints de fechamento de caixa
- Calcular totais e saldos
- Preparar dados para relatório

### Tarefas

#### 1. Implementar Service de Caixa

- `getFechamentoDia(data?)` - Resumo completo do dia
  - Buscar vendas (status='finalizado', filtrar por data)
  - Agrupar por forma de pagamento
  - Buscar despesas do dia
  - Calcular saldo (vendas - despesas)

#### 2. Implementar Controller

- `GET /caixa/fechamento?data=YYYY-MM-DD`

### ✅ Entregáveis da Semana 2

- Endpoint de fechamento funcionando
- Cálculos corretos de vendas, despesas e saldo
- Agrupamento por forma de pagamento
- Testes no Postman/Insomnia

## SEMANA 3: Desenvolvimento Frontend

### Objetivos

- Implementar tela de fechamento de caixa
- Criar fluxo de recuperação de senha
- Aplicar proteção de rotas

### Tarefas

#### 1. Proteção de Rotas

Criar componente `PrivateRoute` e aplicar em TODAS as rotas protegidas

#### 2. Tela de Recuperação de Senha

- Input de email
- Botão "Enviar link"
- Mensagem de confirmação
- Link "Voltar para login"

#### 3. Tela de Redefinir Senha

- Pegar token da URL (`?token=...`)
- Input de nova senha
- Input de confirmar senha
- Validar senhas iguais
- Redirecionar para login após sucesso

#### 4. Link no Login

Adicionar: `<Link to="/recuperar-senha">Esqueceu sua senha?</Link>`

#### 5. Tela de Fechamento de Caixa

- Seletor de data (padrão: hoje)
- Cards de resumo: Vendas, Despesas, Saldo
- Tabela de vendas por forma de pagamento
- Lista de despesas do dia
- Saldo em verde (positivo) ou vermelho (negativo)

### ✅ Entregáveis da Semana 3

- Proteção de rotas funcionando
- Fluxo de recuperação de senha completo
- Tela de fechamento de caixa funcional

## 🔗 Integrações

**TODOS os grupos dependem deste!**
- Fornecer Guards JWT para proteção de rotas
- Todos os endpoints devem usar `@UseGuards(JwtAuthGuard)`
- Todos os componentes frontend devem usar `<PrivateRoute>`
