
import { Router } from 'express';
import { prisma } from '../db.js';
import { Parser as CsvParser } from 'json2csv';
import xlsx from 'xlsx';

const r = Router();

async function fetchData(entity:string){
  if (entity === 'processes') return prisma.process.findMany({ include: { etapas: true, documentos: true }});
  if (entity === 'stages') return prisma.stage.findMany();
  if (entity === 'documents') return prisma.document.findMany();
  if (entity === 'catalogs') return prisma.catalogOption.findMany();
  throw new Error('Entidade inválida');
}

r.get('/:entity.json', async (req,res)=>{
  try{
    const data = await fetchData(req.params.entity);
    res.json(data);
  }catch(e:any){
    res.status(400).json({error:e.message});
  }
});

r.get('/:entity.csv', async (req,res)=>{
  try{
    const data = await fetchData(req.params.entity);
    const parser = new CsvParser();
    const csv = parser.parse(data);
    res.setHeader('Content-Type','text/csv; charset=utf-8');
    res.attachment(`${req.params.entity}.csv`);
    res.send(csv);
  }catch(e:any){
    res.status(400).json({error:e.message});
  }
});

r.get('/:entity.xlsx', async (req,res)=>{
  try{
    const data = await fetchData(req.params.entity);
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(data as any);
    xlsx.utils.book_append_sheet(wb, ws, 'Data');
    const buf = xlsx.write(wb, { type:'buffer', bookType:'xlsx' });
    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.attachment(`${req.params.entity}.xlsx`);
    res.send(buf);
  }catch(e:any){
    res.status(400).json({error:e.message});
  }
});

export default r;
