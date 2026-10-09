import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src');

const processDir = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes("from '../types'") || content.includes("from './types'")) {
        // Find import { SomeType } from '../types' and replace with import type { SomeType } from '../types'
        content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]\.\.\/types['"]/g, 'import type { $1 } from \'../types\'');
        content = content.replace(/import\s+{([^}]+)}\s+from\s+['"]\.\/types['"]/g, 'import type { $1 } from \'./types\'');
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(srcDir);
console.log('Fixed imports.');
