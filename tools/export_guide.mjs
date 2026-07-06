import { buildStepIndex, GUIDE_PARTS } from '../js/guide-data.js';
import { writeFileSync } from 'node:fs';

const outPath = process.argv[2];
if (!outPath) {
  console.error('Usage: node tools/export_guide.mjs <output.json>');
  process.exit(1);
}

const steps = buildStepIndex(GUIDE_PARTS).map((step) => ({
  id: step.id,
  globalIndex: step.globalIndex,
  partId: step.partId,
  partTitle: step.partTitle,
  title: step.title,
  notes: step.notes || '',
  skills: step.skills || [],
  tags: step.tags || [],
  wiki: step.wiki || null,
  repeat: step.repeat || null,
}));

writeFileSync(outPath, JSON.stringify(steps, null, 2));
