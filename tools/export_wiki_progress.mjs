import { buildStepIndex, GUIDE_PARTS } from '../js/guide-data.js';
import {
  EXTRA_ONLY_TITLES,
  getCompletedTitlesThroughWikiStep,
  INSERTED_EFFICIENCY_TITLES,
  PVM_INSERT_TITLES,
  WIKI_ANCHOR_TITLE,
} from '../js/wiki-progress.js';
import { writeFileSync } from 'node:fs';

const outPath = process.argv[2];
const mode = process.argv[3] || 'wiki';

if (!outPath) {
  console.error('Usage: node tools/export_wiki_progress.mjs <output.json> [wiki|all]');
  process.exit(1);
}

const steps = buildStepIndex(GUIDE_PARTS);
let completedTitles;

if (mode === 'all') {
  completedTitles = steps.map((s) => s.title);
} else {
  completedTitles = [...getCompletedTitlesThroughWikiStep(steps)];
}

const optionalSide = [...EXTRA_ONLY_TITLES, ...PVM_INSERT_TITLES, ...INSERTED_EFFICIENCY_TITLES];

writeFileSync(
  outPath,
  JSON.stringify(
    {
      anchorTitle: WIKI_ANCHOR_TITLE,
      completedTitles,
      optionalSideTitles: optionalSide,
      exportedAt: new Date().toISOString(),
    },
    null,
    2
  )
);
