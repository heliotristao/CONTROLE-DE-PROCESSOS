import fs from 'fs';
import os from 'os';
import path from 'path';

function isPathWritable(dir: string): boolean {
  const target = fs.existsSync(dir) ? dir : path.dirname(dir);
  try {
    fs.accessSync(target, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

function ensureDirectory(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function resolveUploadDir(): string {
  const envDir = process.env.UPLOAD_DIR?.trim();
  const fallbackDir = os.tmpdir();

  if (envDir) {
    const resolvedEnvDir = path.resolve(envDir);
    if (isPathWritable(resolvedEnvDir)) {
      ensureDirectory(resolvedEnvDir);
      return resolvedEnvDir;
    }
    console.warn(
      `Upload directory "${resolvedEnvDir}" is not writable. Falling back to system temporary directory.`,
    );
  }

  if (isPathWritable(fallbackDir)) {
    ensureDirectory(fallbackDir);
    return fallbackDir;
  }

  throw new Error('No writable directory available for uploads.');
}
