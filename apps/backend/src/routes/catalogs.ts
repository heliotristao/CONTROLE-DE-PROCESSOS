import { Router } from 'express';
import { prisma } from '../db.js';

const r = Router();

r.get('/', async (req, res) => {
  const { category } = req.query as { category?: string };
  const where = category ? { category: { equals: category, mode: 'insensitive' } } : {};
  const list = await prisma.catalogOption.findMany({
    where, orderBy: [{ category: 'asc' }, { value: 'asc' }]
  });
  res.json(list);
});

export default r;
