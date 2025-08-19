# Arquitetura do Back-End

## Estrutura de Rotas

**Produtos**

- `GET /produtos` — Retorna uma lista de todos os produtos.
- `GET /produtos/:id` — Retorna os detalhes de um produto com base no ID.
- `POST /produtos` — Cria um novo produto.
- `PUT /produtos/:id` — Atualiza completamente um produto com base no ID.
- `DELETE /produtos/:id` — Remove um produto com base no ID.

**Categorias**

- `GET /categorias` — Retorna uma lista de todas as categorias.
- `GET /categorias/:id` — Retorna os detalhes de uma categoria com base no ID.
- `POST /categorias` — Cria uma nova categoria.
- `PUT /categorias/:id` — Atualiza completamente uma categoria com base no ID.
- `DELETE /categorias/:id` — Remove uma categoria com base no ID.

**Usuários**

- `GET /usuarios` — Retorna uma lista de todos os usuários.
- `GET /usuarios/:id` — Retorna os detalhes de um usuário com base no ID.
- `POST /usuarios` — Cria um novo usuário.
- `PUT /usuarios/:id` — Atualiza completamente um usuário com base no ID.
- `DELETE /usuarios/:id` — Remove um usuário com base no ID.
- `POST /usuarios/recuperar-senha` — Envia e-mail para recuperação de senha.

**Despesas**

- `GET /despesas` — Retorna uma lista de todas as despesas.
- `GET /despesas/:id` — Retorna os detalhes de uma despesa com base no ID.
- `POST /despesas` — Cria uma nova despesa.
- `PUT /despesas/:id` — Atualiza completamente uma despesa com base no ID.
- `DELETE /despesas/:id` — Remove uma despesa com base no ID.

**Formas de Pagamento**

- `GET /formas-pagamento` — Retorna uma lista de todas as formas de pagamento.
- `GET /formas-pagamento/:id` — Retorna os detalhes de uma forma de pagamento com base no ID.
- `POST /formas-pagamento` — Cria uma nova forma de pagamento.
- `PUT /formas-pagamento/:id` — Atualiza completamente uma forma de pagamento com base no ID.
- `DELETE /formas-pagamento/:id` — Remove uma forma de pagamento com base no ID.

---

### Estrutura de Pastas

- **src/**
  - **produtos/**
    - produtos.controller.ts
    - produtos.service.ts
    - produtos.module.ts
    - **entities/**
      - produto.entity.ts
  - **categorias/**
    - categorias.controller.ts
    - categorias.service.ts
    - categorias.module.ts
    - **entities/**
      - categoria.entity.ts
  - **usuarios/**
    - usuarios.controller.ts
    - usuarios.service.ts
    - usuarios.module.ts
    - **entities/**
      - usuario.entity.ts
  - **despesas/**
    - despesas.controller.ts
    - despesas.service.ts
    - despesas.module.ts
    - **entities/**
      - despesa.entity.ts
  - **formas-pagamento/**
    - formas-pagamento.controller.ts
    - formas-pagamento.service.ts
    - formas-pagamento.module.ts
    - **entities/**
      - forma-pagamento.entity.ts
  - app.module.ts — módulo raiz que importa todos os outros módulos
  - main.ts — ponto de entrada da aplicação
