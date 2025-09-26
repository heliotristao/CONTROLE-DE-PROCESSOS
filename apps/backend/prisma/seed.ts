import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

function inferCategory(field: string): string | null {
  const f = field.toLowerCase();
  if (f.includes('status') || f.includes('situa')) return 'status';
  if (f.includes('setor') || f.includes('unidade')) return 'setor';
  if (f.includes('respons')) return 'responsavel';
  if (f.includes('tipo') && f.includes('document')) return 'tipo_documento';
  if (f.includes('natureza')) return 'natureza';
  return null;
}

async function main() {
  const dataPath = path.join(process.cwd(), 'data', 'select_options.json');
  if (!fs.existsSync(dataPath)) {
    console.warn('select_options.json not found, seeding skipped.');
    return;
  }
  const raw = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  const entries: {category: string, value: string}[] = [];

  Object.entries(raw).forEach(([key, arr]: any) => {
    try {
      const campo = key.split('::').pop() || '';
      const cat = inferCategory(campo);
      if (!cat) return;
      (arr as string[]).forEach(v => {
        const value = String(v).trim();
        if (value) entries.push({ category: cat, value });
      });
    } catch {}
  });

  // Dedup
  const seen = new Set<string>();
  const unique = entries.filter(e => {
    const k = `${e.category}::${e.value.toLowerCase()}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });

  if (unique.length) {
    await prisma.catalogOption.createMany({
      data: unique,
      skipDuplicates: true,
    });
  }

  console.log(`Seeded ${unique.length} catalog options (status/setor/... if inferred).`);
}

main().finally(() => prisma.$disconnect());
