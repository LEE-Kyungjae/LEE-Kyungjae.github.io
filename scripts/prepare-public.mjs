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

for (const assetGroup of ['downloads', 'projects', 'brain']) {
  const source = path.join(root, 'assets', assetGroup);
  if (existsSync(source)) {
    await cp(source, path.join(publicDir, 'assets', assetGroup), { recursive: true });
  }
}

// Ship the decoder locally so the 3D scene also works on static GitHub Pages.
await mkdir(path.join(publicDir, 'assets', 'draco'), { recursive: true });
await cp(path.join(root, 'node_modules/three/examples/jsm/libs/draco/gltf'), path.join(publicDir, 'assets', 'draco'), { recursive: true });
await copyFile(path.join(root, 'node_modules/three/LICENSE'), path.join(publicDir, 'assets', 'draco', 'THREE-LICENSE.txt'));
