import type { Rank } from '../types';

export const RANKS: Rank[] = [
  { label: 'Newcomer',   icon: '🌱',  min: 0  },
  { label: 'Citizen',    icon: '🗳️', min: 1  },
  { label: 'Drafter',    icon: '✍️', min: 3  },
  { label: 'Legislator', icon: '⚖️', min: 6  },
  { label: 'Architect',  icon: '🏛️', min: 10 },
];

export const PTS = {
  decisive:      3,
  peeked_no_read: 1,
  peek:          1,
  sections:      2,
  full:          3,
} as const;

export const OPTIONS = [
  { v: 2,  l: 'Agree'    },
  { v: -2, l: 'Disagree' },
] as const;

export const VIS_SCORE: Record<number, number> = {
  1: -2, 2: -1, 3: 0, 4: 1, 5: 1, 6: 1.5, 7: 0, 8: 1.5, 9: 2,
};
