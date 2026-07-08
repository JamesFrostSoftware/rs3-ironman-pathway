#!/usr/bin/env node
/** Emit quest titles from guide-data.js (one per line). */
import { GUIDE_PARTS, buildStepIndex } from '../js/guide-data.js';

const quests = buildStepIndex(GUIDE_PARTS).filter((s) => s.tags?.includes('quest'));
for (const s of quests) {
  process.stdout.write(s.title.replace(/\n/g, ' ') + '\n');
}
