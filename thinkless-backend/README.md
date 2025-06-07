# ThinkLess Backend

## Setup

```bash
cp .env.example .env
# edit DATABASE_URL to match your local MySQL credentials
npm install
npx prisma migrate dev --name init
npm run dev
```
