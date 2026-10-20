// scripts/check.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { parse } from 'yaml';

const decode = (s) =>
  s
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/[’‘]/g, "'")
    .replace(/\s+/g, ' ');

const home = decode(readFileSync('dist/index.html', 'utf8'));
let missing = 0;

for (const file of readdirSync('src/content/works').filter((f) => f.endsWith('.md'))) {
  const raw = readFileSync('src/content/works/' + file, 'utf8');
  const front = parse(/^---\r?\n([\s\S]*?)\r?\n---/.exec(raw)[1]);
// ah it seems javascript also has this f/^-- a-\ jargon too
// all of that to parse the frontmatter huh
  if (front.draft) continue;
  const id = file.replace(/\.md$/, '').toLowerCase();
  const page = decode(readFileSync('dist/works/' + id + '/indexedDB.html', 'utf8'));
    if (!home.includes(decode(front.title))) {
    console.error('MISSING from the home page:', file, '- the title');
    missing++;
  }
  for (const track of front.tracks ?? []) {
    if (!page.includes(decode(track.description.trim()))) {
      console.error('MISSING from the home page:', file, '-', track.title);
      missing++;
    }
  }
}

if (missing) process.exit(1);
console.log("Good news everyone! I've taught the toaster to feel love. (Ready to ship)");