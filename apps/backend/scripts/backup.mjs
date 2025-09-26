import { execSync } from 'node:child_process';
import fs from 'fs';
import path from 'path';

const dbUrl = process.env.DATABASE_URL || 'file:./dev.db';
const outDir = path.join(process.cwd(), 'backups');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g,'-');

if (dbUrl.startsWith('file:')) {
  const dbPath = dbUrl.replace('file:','');
  const target = path.join(outDir, `sqlite-backup-${stamp}.db`);
  fs.copyFileSync(dbPath, target);
  console.log('SQLite backup salvo em', target);
} else {
  // Postgres logical backup (requires pg_dump available)
  const target = path.join(outDir, `pg-backup-${stamp}.sql`);
  execSync(`pg_dump "${dbUrl}" > "${target}"`, { stdio:'inherit', shell:true });
  console.log('Postgres dump salvo em', target);
}
