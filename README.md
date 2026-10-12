# 🏋️ Treino API

API REST do **EnergyGP**, responsável por autenticação de usuários e gerenciamento dos dados de treino. O frontend em React consome esta API.

## 🚀 Tecnologias

- [Node.js](https://nodejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Express 5](https://expressjs.com/)
- [Prisma ORM 7](https://www.prisma.io/) com adapter `pg`
- [PostgreSQL](https://www.postgresql.org/)
- [JWT](https://github.com/auth0/node-jsonwebtoken) para autenticação
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) para hash de senhas
- [CORS](https://github.com/expressjs/cors) e [dotenv](https://github.com/motdotla/dotenv)
- Testes com `tsx --test` (test runner nativo do Node)

## 📁 Estrutura do projeto

```
treino-api/
├── prisma/              # Schema e migrations do banco
├── src/                 # Código-fonte da API
├── test/                # Testes automatizados
├── prisma7.config.ts    # Configuração do Prisma
├── tsconfig.json
└── package.json
```

## ⚙️ Pré-requisitos

- Node.js 20 ou superior
- PostgreSQL rodando localmente ou em um serviço na nuvem
- npm

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone git@github.com:b-Portaluppi/treino-api.git
cd treino-api
```

2. Instale as dependências:

```bash
npm install
```

3. Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/treino"
JWT_SECRET="troque-por-um-segredo-forte"
PORT=3000
```

> ⚠️ Nunca suba o arquivo `.env` para o GitHub. Ele já deve estar no `.gitignore`.

4. Gere o client do Prisma e rode as migrations:

```bash
npx prisma generate --config prisma7.config.ts
npx prisma migrate dev --config prisma7.config.ts
```

## ▶️ Como rodar

Modo desenvolvimento (com reload automático):

```bash
npm run dev
```

A API sobe em `http://localhost:3000` (ou na porta definida no `.env`).

## 🧪 Testes

```bash
npm test
```

## 🔐 Autenticação

A API usa **JWT**. Após o login, envie o token no header das rotas protegidas:

```
Authorization: Bearer <seu-token>
```

## 📌 Endpoints

<!-- Preencha com as rotas reais do projeto -->

| Método | Rota | Descrição | Auth |
| ------ | ---- | --------- | ---- |
| POST | `/auth/register` | Cadastra um novo usuário | Não |
| POST | `/auth/login` | Autentica e retorna o token | Não |

## 🖥️ Frontend

O frontend (React) fica em um repositório separado e consome esta API.

## 👤 Autor

**Gabriel Portaluppi**
[GitHub](https://github.com/b-Portaluppi)
