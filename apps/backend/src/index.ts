import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { prisma } from './db.js';
import processesRouter from './routes/processes.js';
import catalogsRouter from './routes/catalogs.js';
import importRouter from './routes/importer.js';
import exportRouter from './routes/exporter.js';
import { resolveUploadDir } from './uploadConfig.js';

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.ORIGIN || '*' }));

// Ensure upload dir
const uploadDir = resolveUploadDir();

app.use('/api/processes', processesRouter);
app.use('/api/catalogs', catalogsRouter);
app.use('/api/import', importRouter);
app.use('/api/export', exportRouter);

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`API running on :${port}`));
