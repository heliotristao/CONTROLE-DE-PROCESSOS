# CP-HPM — v2.3.0-import-backup

Sistema online para **Controle de Processos** (HPM/PMES).

## Monorepo
- `apps/backend` — API (Express + Prisma + SQLite por padrão; Postgres em produção se desejar).
- `apps/frontend` — Web (React + Vite + TypeScript).

## Rodar localmente (desenvolvimento)
```bash
# 1) Backend
cd apps/backend
npm i
npx prisma migrate dev --name init
npm run seed
npm run dev

# 2) Frontend (em outro terminal)
cd ../../apps/frontend
npm i
npm run dev
```

## Variáveis de ambiente
Crie `apps/backend/.env` baseado em `.env.example`.

- Para SQLite (padrão dev): `DATABASE_URL="file:./dev.db"`
- Para Postgres (Render): ex: `DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"`

## Deploy (Render)
- Crie um serviço Web apontando para este repo.
- `Build Command`: `npm ci && npm run build --workspace=@cphpm/backend`
- `Start Command`: `npm run start --workspace=@cphpm/backend`
- Configure `DATABASE_URL` (Render Postgres) e `PORT` (ex.: 10000).

## Importar/Exportar/Backup
- **Importar:** `POST /api/import` (CSV/XLSX — simulação e confirmação)
- **Exportar:** `GET /api/export/:entity.(csv|xlsx|json)`
- **Backup lógico (dump):** `npm run backup` (gera em `apps/backend/backups/`)

## Segurança
Uploads validados por extensão e tamanho; nomes normalizados; diretrizes OWASP consideradas (File Upload, Node.js).
