const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  let changedFiles = 0;
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      changedFiles += processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      // We want to replace <button (followed by space or newline, not immediately followed by type) with <button type="button"
      // Actually, a simpler way is to find all <button tags and if they don't have type=, inject type="button"

      // Let's use a function to replace it.
      let newContent = content.replace(/<button(\s[^>]*)?>/g, (match, p1) => {
          if (p1 && p1.includes('type=')) {
              return match; // Already has type
          }
          if (!p1) {
              return '<button type="button">';
          } else {
              return `<button type="button"${p1}>`;
          }
      });

      if (newContent !== original) {
          fs.writeFileSync(fullPath, newContent, 'utf8');
          changedFiles++;
      }
    }
  }
  return changedFiles;
}

const count = processDir('components/mold');
console.log(`Updated ${count} files.`);
