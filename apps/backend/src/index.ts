import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { prisma } from './db';
import processesRouter from './routes/processes';
import catalogsRouter from './routes/catalogs';
import importRouter from './routes/importer';
import exportRouter from './routes/exporter';

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.ORIGIN || '*' }));

// Ensure upload dir
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

app.use('/api/processes', processesRouter);
app.use('/api/catalogs', catalogsRouter);
app.use('/api/import', importRouter);
app.use('/api/export', exportRouter);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`API running on :${port}`));
