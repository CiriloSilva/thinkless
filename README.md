# ThinkLess

ThinkLess é um **Sistema de Controle de Despesas Pessoais** minimalista que ajuda você a entender para onde o seu dinheiro está indo sem complicação.  
O projeto foi criado para fins acadêmicos.

| **Front-end** | React + Vite • TypeScript | UI minimalista, tipografia **Inter** (Google Fonts) e escala de espaçamento de 4 px |
| **Back-end** | Node.js • Fastify • Prisma | API REST, validação com Zod, logging com Pino |
| **Banco** | MySQL | Versionado e gerenciado via Prisma Migrate |

---

## Principais funcionalidades
* Cadastro de receitas e despesas (CRUD)
* Autenticação JWT
* Dashboard com totalizadores, gráficos e filtros
* Tema claro/escuro (toggle)
* Layout responsivo

---

## Pré-requisitos

| Ferramenta | Versão mínima |
| ---------- | ------------- |
| **Node.js** | 18 LTS |
| **npm** ou **Yarn** | npm 9 / Yarn 1.22 |
| **MySQL** | 8.0 |

> Para evitar problemas de versão com MySQL, use Docker ou uma instalação local compatível.

---

## 🔑 Variáveis de ambiente

### 1. Back-end (`server/.env`)

```bash
# === Fastify ===
PORT=3333

# === MySQL ===
# Formato: mysql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="mysql://root:root@localhost:3306/thinkless"

# === Auth ===
# Chave secreta para assinar tokens JWT
JWT_SECRET="troque-esta-string-por-algo-seguro"
```

### 2. Front-end (web/.env.local)

```bash
# URL base da API
VITE_API_URL="http://localhost:3333"
```

# 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/thinkless.git
cd thinkless
```

2. Instale as dependências de cada pacote
```bash
(Monorepo em duas pastas: server/ e web/)
npm install --workspace=server
npm install --workspace=web
```

3. Configure .env conforme mostrado acima

4. Crie o banco e rode as migrations
```bash
cd server
npx prisma migrate dev --name init
```

5. Inicie a API
```bash
npm run dev
# API em http://localhost:3333
```

6. Em outro terminal, suba o front-end
```bash
cd ../web
npm run dev
# Front-end em http://localhost:5173
```
