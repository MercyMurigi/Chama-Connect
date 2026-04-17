import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'node_modules', 'fast-json-patch', 'index.ts');

try {
  fs.unlinkSync(target);
  console.log(
    '[postinstall] Removed fast-json-patch/index.ts so tsx loads index.js (published main).',
  );
} catch (err) {
  if (err && err.code === 'ENOENT') {
    // Package not installed or tarball no longer ships index.ts.
  } else {
    throw err;
  }
}
