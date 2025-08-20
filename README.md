# Bondy Desafio Fullstack — Minha Solução

## ✨ Visão Geral

Monorepo com **Frontend (Next.js + Apollo Client)** e **Backend (Apollo Server)** implementando um fluxo completo de **autenticação** (`login` e `me`) com **MongoDB (Mongoose)** e **JWT**. O projeto está organizado para facilitar o desenvolvimento local, com tipagem em TypeScript e padronização (ESLint/Prettier).

> Repositório do desafio: https://github.com/bebondy/bondy-desafio-fullstack

---

## 🗂️ Estrutura do Monorepo

```
bondy-desafio-fullstack/
│── packages/
│   ├── backend/   # GraphQL (Apollo Subgraph)
│   └── frontend/  # Next.js (App Router) + Apollo Client
│── lerna.json
│── package.json
│── yarn.lock
```

---

## ✅ O que foi implementado

### Backend (packages/backend)

- **GraphQL** com Apollo Server.
- **Autenticação**:
  - **Mutation `login(email, password)`** → valida credenciais no MongoDB, emite **JWT** e retorna usuário + token.
  - **Query `me`** → usa JWT do header `Authorization: Bearer <token>` para devolver o perfil do usuário autenticado.
- **MongoDB com Mongoose**:
  - Model `User` (`name`, `email`, `company`, `password`).
  - Seed automático de um usuário de teste na conexão.

**Arquivos-chave**

- `src/typeDefs/query.ts` e `src/typeDefs/mutation.ts` → schema:
  ```graphql
  type User {
    name: String!
    email: String!
    company: String
    password: String!
  }
  type LoginResponse {
    token: String
    user: User
  }
  type Query {
    me: User
  }
  type Mutation {
    login(email: String!, password: String!): LoginResponse
  }
  ```
- `src/graphql/resolvers/mutations/login.ts` → autenticação (bcrypt + JWT).
- `src/graphql/resolvers/queries/me.ts` → perfil autenticado (valida JWT).
- `src/memoryDB/connection.ts` → conexão com MongoDB Atlas + **seed** de usuário.
- `src/models/User.ts` → schema Mongoose de `User`.

---

### Frontend (packages/frontend)

- **Next.js (App Router)** com **Apollo Client**.
- **Fluxo de Login**:
  - Página **`/login`** (`src/app/(auth)/login/page.tsx`) com **React Hook Form** + **Zod** para validação.
  - Chama `LOGIN_MUTATION`, guarda **token** no `localStorage` e injeta `Authorization` via **Apollo Link**.
  - Exibe toasts (Sonner) e gerencia sessão via **React Context** (`src/contexts/auth.tsx`).
- **Consulta `me`** para carregar o usuário em sessão.
- **UI** com componentes reutilizáveis (`src/components/ui/`) do **Shadcn** + **Tailwind**. Agilizando o desenvolvimento das interfaces.
- **Providers globais** (`src/app/providers.tsx`) com `ApolloProvider` + `AuthProvider`.

**GraphQL no cliente**

- `src/graphql/mutations/login.ts`:
  ```graphql
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        company
        email
        name
        password
      }
    }
  }
  ```
- `src/graphql/queries/me.ts`:
  ```graphql
  query Me {
    me {
      company
      email
      name
      password
    }
  }
  ```

> **Observação importante (segurança):** O schema atual **retorna o campo `password`** tanto no `login` quanto no `me`. Isso foi mantido conforme o guiade implementação do desafio, **mas não é recomendado em produção**.

---

## 🔐 Fluxo de Autenticação (fim-a-fim)

1. **Login** na página `/login` → validação Zod → chamada `LOGIN_MUTATION`.
2. Se sucesso:
   - Salva `token` no `localStorage`.
   - **Apollo Link** adiciona `Authorization: Bearer <token>` em todas as requisições.
   - Contexto de autenticação popula o `user`.
3. **Query `me`** usa o token para buscar os dados do usuário autenticado.

---

## ⚙️ Variáveis de Ambiente (desenvolvimento)

### Backend (`packages/backend/.env.local`)

```env
JWT_SECRET=your_jwt_secret_here
```

### Frontend (`packages/frontend/.env`)

```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000/local/desafio
```

---

## 🧭 Endpoints & Rotas

- **GraphQL**: `/local/desafio`.
- **Frontend**:
  - `/login` — página de autenticação.
  - `/` — página inicial (usa providers globais e pode consumir `me`).

---

## 📦 Scripts principais

### Backend

- `yarn lerna run start --scope=backend` — inicia localmente.

### Frontend

- `yarn lerna run dev --scope=frontend` — inicia localmente.

---

## 🧩 Exemplos de Uso (GraphQL)

### Login

```graphql
mutation {
  login(email: "desafio@bondy.com.br", password: "123456") {
    token
    user {
      name
      email
      company
      password # ⚠️ Apenas para demonstração
    }
  }
}
```

### Me (com Authorization: Bearer <token>)

```graphql
query {
  me {
    name
    email
    company
    password # ⚠️ Apenas para demonstração
  }
}
```

---

## 🛠️ Decisões Técnicas

- **App Router do Next.js** para estrutura moderna, melhor organização de providers e rotas.
- **React Hook Form + Zod** por validações declarativas e ergonomia no formulário de login.
- **Taildwind + Shadcn** agilidade no processo de desenvolvimento

---

## 🚀 Melhorias Futuras

**Backend**

- Adotar **refresh tokens**, expiração e rotação de tokens.
- Testes de integração, cobertura de erros e paths negativos.

**Frontend**

- Rotas protegidas (guard) e redirecionamento automático se não autenticado.
- Estados de carregamento/erro mais ricos e mensagens localizadas.
- Melhoria de UI/UX nos componentes (acessibilidade, feedbacks, etc.).
