import { readFileSync } from 'node:fs';
import { buildStepIndex, GUIDE_PARTS } from '../js/guide-data.js';

const questReqs = JSON.parse(
  readFileSync(new URL('../data/quest-requirements.json', import.meta.url), 'utf8')
);

const steps = buildStepIndex(GUIDE_PARTS);
const bad = [];

for (const s of steps) {
  if (!s.tags?.includes('quest')) continue;
  const wiki = questReqs[s.title];
  if (wiki === undefined) continue;
  if (wiki.length === 0 && s.skills?.length) {
    bad.push({ title: s.title, part: s.partId, skills: s.skills, issue: 'fallback-only' });
  }
}

console.log('Quests with wiki [] but displayed reqs:', bad.length);
for (const row of bad.slice(0, 30)) {
  console.log(`  [${row.part}] ${row.title}:`, JSON.stringify(row.skills));
}
if (bad.length > 30) console.log(`  ... and ${bad.length - 30} more`);

const pvm = steps.filter((s) => s.tags?.includes('pvm'));
console.log('\nPvM steps by part:');
for (const p of GUIDE_PARTS.filter((x) => x.id.startsWith('part'))) {
  const inPart = pvm.filter((s) => s.partId === p.id);
  console.log(`  ${p.id}: ${inPart.map((s) => s.title).join(' | ') || '(none)'}`);
}
