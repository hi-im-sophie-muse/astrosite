// scripts/new-work.mjs
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const [id, ...words] = process.argv.slice(2);
if (!id) {
  console.error('usage: node scripts/new-work.mjs <id> "Title Words"');
  process.exit(1);
}

const target = 'src/content/works/' + id + '.md';
if (existsSync(target)) {
  console.error('already exists:', target);
  process.exit(1);
}

const title = words.join(' ') || id;
const text = readFileSync('docs/work-template.md', 'utf8').replace('DEFAULT TITLE', title);
writeFileSync(target, text);
console.log('created', target, '(draft, unpublished)');
// breaks at the sight of a colon, verify all works