# Arquitetura do Frontend

## Visão Geral

O sistema é dividido em módulos principais:

- **Produtos** → itens vendidos na cantina.
- **Categorias** → agrupamento dos produtos.
- **Usuários** → pessoas com acesso ao sistema.
- **Despesas** → custos e gastos da cantina.
- **Formas de Pagamento** → métodos aceitos.

---

## Funcionalidades

### **Produtos**

- `listarProdutos()` → Retorna todos os produtos.
- `buscarProdutoPorId(id)` → Retorna detalhes de um produto.
- `criarProduto(dados)` → Cria um novo produto.
- `atualizarProduto(id, dados)` → Atualiza um produto existente.
- `deletarProduto(id)` → Remove um produto.

### Categorias

- `listarCategorias()` → Retorna todas as categorias.
- `buscarCategoriaPorId(id)` → Retorna detalhes de uma categoria.
- `criarCategoria(dados)` → Cria uma nova categoria.
- `atualizarCategoria(id, dados)` → Atualiza uma categoria existente.
- `deletarCategoria(id)` → Remove uma categoria.

### Usuários

- `listarUsuarios()` → Retorna todos os usuários.
- `buscarUsuarioPorId(id)` → Retorna detalhes de um usuário.
- `criarUsuario(dados)` → Cria um novo usuário.
- `atualizarUsuario(id, dados)` → Atualiza um usuário existente.
- `deletarUsuario(id)` → Remove um usuário.
- `recuperarSenhaUsuario(email)` → Envia e-mail de recuperação de senha.

### Despesas

- `listarDespesas()` → Retorna todas as despesas.
- `buscarDespesaPorId(id)` → Retorna detalhes de uma despesa.
- `criarDespesa(dados)` → Cria uma nova despesa.
- `atualizarDespesa(id, dados)` → Atualiza uma despesa existente.
- `deletarDespesa(id)` → Remove uma despesa.

### Formas de Pagamento

- `listarFormasPagamento()` → Retorna todas as formas de pagamento.
- `buscarFormaPagamentoPorId(id)` → Retorna detalhes de uma forma de pagamento.
- `criarFormaPagamento(dados)` → Cria uma nova forma de pagamento.
- `atualizarFormaPagamento(id, dados)` → Atualiza uma forma de pagamento existente.
- `deletarFormaPagamento(id)` → Remove uma forma de pagamento.

---

## Estrutura de Pastas

A estrutura de pastas segue a organização por **responsabilidade**, facilitando manutenção e escalabilidade.

```bash
src/
├── api/
│   └── api.ts                  # configuração central da API
├── services/                   # funções para consumo da API
│   ├── produtosService.ts
│   ├── categoriasService.ts
│   ├── usuariosService.ts
│   ├── despesasService.ts
│   └── formasPagamentoService.ts
├── pages/                      # páginas principais de cada recurso
│   ├── Produtos/
│   │   ├── ListarProdutos.tsx
│   │   ├── CriarProduto.tsx
│   │   ├── EditarProduto.tsx
│   │   └── DetalhesProduto.tsx
│   ├── Categorias/
│   │   ├── ListarCategorias.tsx
│   │   ├── CriarCategoria.tsx
│   │   ├── EditarCategoria.tsx
│   │   └── DetalhesCategoria.tsx
│   ├── Usuarios/
│   │   ├── ListarUsuarios.tsx
│   │   ├── CriarUsuario.tsx
│   │   ├── EditarUsuario.tsx
│   │   └── DetalhesUsuario.tsx
│   ├── Despesas/
│   │   ├── ListarDespesas.tsx
│   │   ├── CriarDespesa.tsx
│   │   ├── EditarDespesa.tsx
│   │   └── DetalhesDespesa.tsx
│   └── FormasPagamento/
│       ├── ListarFormasPagamento.tsx
│       ├── CriarFormaPagamento.tsx
│       ├── EditarFormaPagamento.tsx
│       └── DetalhesFormaPagamento.tsx
├── components/                 # componentes reutilizáveis
│   ├── ProdutoCard.tsx
│   ├── CategoriaCard.tsx
│   ├── UsuarioCard.tsx
│   ├── DespesaCard.tsx
│   ├── FormaPagamentoCard.tsx
│   └── FormInput.tsx
├── App.tsx                     # componente raiz
├── index.ts                    # ponto de entrada
└── routes.ts                   # definição das rotas
```

---

## Fluxo de Comunicação

1. **Pages** → Representam telas do sistema.
2. **Services** → Responsáveis por acessar a API.
3. **API** → Fonte de dados (back-end).
4. **Components** → Elementos reutilizáveis, usados dentro das páginas.
