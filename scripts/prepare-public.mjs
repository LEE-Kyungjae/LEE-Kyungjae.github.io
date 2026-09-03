import { cp, mkdir, copyFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicDir = path.join(root, 'public');
await mkdir(publicDir, { recursive: true });

const files = ['ads.txt', 'app-ads.txt', 'googlebf755f81773cd3bd.html', 'google43abab56abe96480.html'];
for (const file of files) {
  const source = path.join(root, file);
  if (existsSync(source)) await copyFile(source, path.join(publicDir, file));
}

for (const assetGroup of ['downloads', 'projects']) {
  const source = path.join(root, 'assets', assetGroup);
  if (existsSync(source)) {
    await cp(source, path.join(publicDir, 'assets', assetGroup), { recursive: true });
  }
}
