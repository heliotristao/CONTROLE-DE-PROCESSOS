
import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { parse as parseCsv } from 'csv-parse/sync';
import xlsx from 'xlsx';
import { prisma } from '../db';
import { resolveUploadDir } from '../uploadConfig';

const r = Router();

const uploadDir = resolveUploadDir();

const upload = multer({
  dest: uploadDir,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const okExt = ['.csv','.xlsx','.xls'].includes(ext);
    if (!okExt) return cb(new Error('Extensão não permitida'));
    cb(null, true);
  }
});

function normalizeHeader(s:string){ return s.trim().toLowerCase(); }

function loadRecords(filePath:string){
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.csv') {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const records = parseCsv(raw, { columns: true, skip_empty_lines: true });
    return records as any[];
  } else {
    const wb = xlsx.readFile(filePath);
    const ws = wb.Sheets[wb.SheetNames[0]];
    return xlsx.utils.sheet_to_json(ws) as any[];
  }
}

r.post('/', upload.single('file'), async (req, res) => {
  const mode = (req.query.mode || 'simulate') as 'simulate' | 'confirm';
  if (!req.file) return res.status(400).json({ error: 'Arquivo obrigatório' });

  const filePath = req.file.path;
  try {
    const rows:any[] = loadRecords(filePath);
    let created=0, updated=0, ignored=0;
    const details:any[] = [];

    for (const row of rows) {
      const mapped:any = {};
      for (const [k,v] of Object.entries(row)) {
        mapped[normalizeHeader(k)] = v;
      }
      const edocs = String(mapped['edocs'] || mapped['nº edocs'] || mapped['n edocs'] || mapped['numero edocs'] || '').trim();
      const objeto = String(mapped['objeto'] || mapped['descrição do objeto'] || mapped['descricao do objeto'] || '').trim();
      const setor = mapped['setor'] || mapped['unidade'] || mapped['unidade/setor'] || null;
      const responsavel = mapped['responsável'] || mapped['responsavel'] || null;
      const status = mapped['status'] || mapped['situação'] || mapped['situacao'] || null;
      const dataInstauracao = mapped['data de instauração'] || mapped['data instauração'] || mapped['data abertura'] || null;
      const prazo = mapped['prazo'] || mapped['prazo limite'] || mapped['data limite'] || null;
      const dataConclusao = mapped['data conclusão'] || mapped['data finalização'] || mapped['data fim'] || null;

      if (!edocs || !objeto) {
        ignored += 1;
        details.push({ action:'ignore', reason:'faltam edocs/objeto', row });
        continue;
      }

      const existing = await prisma.process.findUnique({ where: { edocs } });
      const data:any = {
        objeto,
        setor: setor ? String(setor) : null,
        responsavel: responsavel ? String(responsavel) : null,
        status: status ? String(status) : null,
      };

      // Parse dates if present
      function parseDate(val:any){
        if (!val) return null;
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
      }
      data.dataInstauracao = parseDate(dataInstauracao);
      data.prazo = parseDate(prazo);
      data.dataConclusao = parseDate(dataConclusao);

      if (!existing) {
        if (mode === 'confirm') {
          await prisma.process.create({ data: { edocs, ...data } });
        }
        created += 1;
        details.push({ action: 'create', edocs, objeto });
      } else {
        if (mode === 'confirm') {
          await prisma.process.update({ where: { edocs }, data });
        }
        updated += 1;
        details.push({ action: 'update', edocs, objeto });
      }
    }

    res.json({ mode, summary: { created, updated, ignored }, details });
  } catch (e:any) {
    res.status(400).json({ error: e.message });
  } finally {
    fs.unlink(filePath, () => {});
  }
});

export default r;
