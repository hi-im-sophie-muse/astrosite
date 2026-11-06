// scripts/check.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
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
  const page = decode(readFileSync('dist/works/' + id + '/index.html', 'utf8'));
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

for (const file of ['index.html', ...readdirSync('dist/works').map((id) => 'works/' + id + '/index.html')]) {
  const html = readFileSync('dist/' + file, 'utf8');
  if (html.split('<html').length > 2) {
    console.error('TWO COATS: dist/' + file + ' has more than one <html>');
    missing++;
  }
}

const pictures = home.split('src="/icons/').slice(1).map((part) => part.split('"')[0]);
for (const name of new Set(pictures)) {
  if (!existsSync('public/icons/' + name)) {
    console.error('MISSING picture: public/icons/' + name);
    missing++;
  }
}

if (missing) process.exit(1);
console.log("Good news everyone! I've taught the toaster to feel love. (Ready to ship)");