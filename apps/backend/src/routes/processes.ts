import { Router } from 'express';
import { prisma } from '../db.js';

const r = Router();

r.get('/', async (req, res) => {
  const { q } = req.query as { q?: string };
  const where = q ? {
    OR: [
      { edocs: { contains: q, mode: 'insensitive' } },
      { objeto: { contains: q, mode: 'insensitive' } },
      { setor: { contains: q, mode: 'insensitive' } },
      { responsavel: { contains: q, mode: 'insensitive' } },
      { status: { contains: q, mode: 'insensitive' } },
    ]
  } : {};
  const list = await prisma.process.findMany({
    where,
    orderBy: { updatedAt: 'desc' },
    include: { etapas: true, documentos: true }
  });
  res.json(list);
});

r.post('/', async (req, res) => {
  const data = req.body;
  if (!data.edocs || !data.objeto) return res.status(400).json({ error: 'edocs e objeto são obrigatórios' });
  try {
    const created = await prisma.process.create({ data });
    res.status(201).json(created);
  } catch (e:any) {
    res.status(400).json({ error: e.message });
  }
});

r.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const data = req.body;
  try {
    const up = await prisma.process.update({ where: { id }, data });
    res.json(up);
  } catch (e:any) {
    res.status(400).json({ error: e.message });
  }
});

r.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  await prisma.stage.deleteMany({ where: { processId: id } });
  await prisma.document.deleteMany({ where: { processId: id } });
  await prisma.process.delete({ where: { id } });
  res.json({ ok: true });
});

export default r;
