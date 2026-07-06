/** Hover tooltip copy for UI elements */

export const TIPS = {
  syncBtn: 'Refresh skills from Jagex hiscores and quests from RuneMetrics (requires public profile).',
  rsn: 'Your exact RuneScape name. Saved locally in this browser.',
  gameMode: 'Which hiscores table to read: Ironman, Hardcore, or Normal.',
  progress: 'Percentage of all guide steps marked complete in this tracker.',
  combat: 'Combat level from hiscores skills (includes Necromancy).',
  total: 'Total skill level (sum of all skill levels).',
  questPoints: 'Quest points from RuneMetrics completed quests. Enable public profile in game: Settings → Account → Privacy.',
  skillDefault: (skill, level) => `${skill}: level ${level}. Synced from hiscores.`,
  skillGrid: 'All 29 skills from hiscores. Hover any skill for your current level.',
  reqMet: (text) => `${text} — you meet this requirement with your current stats.`,
  reqUnmet: (text) => `${text} — you do NOT meet this yet. Train or quest before this step.`,
  tagQuest: 'Main pathway quest step from the Efficient Ironman guide.',
  tagPof: 'Player-Owned Farm step (custom detail beyond the wiki checklist).',
  tagTraining: 'Skilling step with gear and training method notes from the wiki.',
  tagExtra: 'Added step — still required in guide order.',
  tagPvm: 'PvM unlock step — still required in guide order.',
  tagPrep: 'Gather or craft materials needed by the next step — do this first.',
  tagDaily: 'Repeatable daily activity.',
  tagWeekly: 'Repeatable weekly activity.',
  tagMonthly: 'Repeatable monthly activity.',
  stepNotReady: 'You do not meet the level or QP requirements for this step yet.',
  stepCurrent: 'Your next unchecked step in the guide order.',
  stepCompleted: 'Marked complete — click to undo.',
  repeatableAvailable: 'This activity can be done now (reset timer expired).',
  repeatableLocked: 'Completed for this period — countdown until next reset.',
  hideCompleted: 'Hide steps you have already checked off.',
  readyOnly: 'Only show steps where your current stats meet all requirements.',
  multiSelect: 'Select multiple steps, then mark them complete or incomplete in bulk.',
};

export function tip(text) {
  if (!text) return '';
  return ` data-tip="${String(text).replace(/"/g, '&quot;')}"`;
}
