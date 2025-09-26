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
- Para uploads: `UPLOAD_DIR` (opcional). Em servidores serverless (ex.: Vercel) configure para `"/tmp"` ou utilize um armazenamento externo (S3, etc.).

## Deploy (Render)
- O repositório inclui um `render.yaml` com dois serviços: API (Node) e frontend (Static Site). Basta importá-lo no Render para criar ambos automaticamente.
- A API usa o script `render-backend-build.sh` como build command e `npm run start:render --workspace=@cphpm/backend` como start command, que aplica migrations com `prisma migrate deploy` antes de subir o servidor.
- Configure as variáveis `DATABASE_URL`, `PORT` (ex.: 10000) e `ORIGIN` no serviço da API, além de `VITE_API_URL` no frontend apontando para a URL pública da API.

## Importar/Exportar/Backup
- **Importar:** `POST /api/import` (CSV/XLSX — simulação e confirmação)
- **Exportar:** `GET /api/export/:entity.(csv|xlsx|json)`
- **Backup lógico (dump):** `npm run backup` (gera em `apps/backend/backups/`)

## Segurança
Uploads validados por extensão e tamanho; nomes normalizados; diretrizes OWASP consideradas (File Upload, Node.js).
