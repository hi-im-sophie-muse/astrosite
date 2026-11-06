import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { stringify } from 'yaml';

const lines = readFileSync('docs/works-import.txt', 'utf8')
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l !== '');

const entries = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i + 1]?.startsWith('Date of Completion:')) {
    entries.push({ title: lines[i], rest: [] });
  } else if (entries.length > 0) {
    entries[entries.length - 1].rest.push(lines[i]);
  }
}

//console.log(entries);

const GROUPS = {
  klei: 'Klei',
  pralbumatic: 'Pralbumatic',
  idleOn: 'IdleOn',
  toontown: 'Toontown: Rescored',
};

for (const entry of entries) {
  const date = entry.rest.find((l) => l.startsWith('Date of Completion:'));
  const year = Number(date.slice(-4));
  const inst = entry.rest.find((l) => l.startsWith('Instrumentation:'));
  const instrumentation = inst.slice('Instrumentation:'.length).trim().split(', ');
  const com = entry.rest.find((l) => l.startsWith('Comments:'));
  const comments = com?.slice('Comments:'.length).trim().split(', ');
  const part = entry.rest.find((l) => l.toLowerCase().startsWith('part of'));
  const key = Object.keys(GROUPS).find((k) => part?.toLowerCase().includes(k));
  const group = GROUPS[key] ?? 'Works';
  if (part && !key) console.log('NO GROUP FOR:', entry.title, '-', part);
  
  const front = {
  title: entry.title,
  kind: 'single',
  year,
  draft: true,
  summary: 'TODO: write a summary for a stranger who has never heard this piece. At least eighty characters.',
  tracks: [
    {
      title: entry.title,
      duration: '0:00',
      description: 'TODO: describe this track, at least forty characters.',
    },
  ],
  instrumentation: instrumentation ?? [],
  group,
  
};
const text = '---\n' + stringify(front) + '---\n\n' + (comments ?? '') + '\n';
const id = entry.title
  .toLowerCase()
  .normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');
if (!id) {
  console.log('NEEDS AN ID:', entry.title);
  continue;
  
}
  const target = 'src/content/works/' + id + '.md';
  if (existsSync(target)) {
    console.log('SKIPPED, already exists:', target);
    continue;
  }
  writeFileSync(target, text);
  console.log('wrote', target);
// console.log(text);
  // console.log(entry.title, year, instrumentation, comments, group);
}
