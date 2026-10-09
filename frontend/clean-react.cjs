const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}
const files = walk('./src');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/import\s+React\s+from\s+['"]react['"];?\r?\n/g, '');
  content = content.replace(/import\s+React,\s*\{\s*(.*?)\s*\}\s*from\s+['"]react['"];?/g, 'import { $1 } from \'react\';');
  fs.writeFileSync(f, content);
});
console.log('Cleaned React imports');
