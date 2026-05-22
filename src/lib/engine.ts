import type { Persona, Question, Subtopic, Results, Rank } from '../types';
import { RANKS, VIS_SCORE, PTS } from '../data/constants';

function mkRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function getAnswerVec(answers: (number | null)[], questions: Question[]): number[] {
  return answers.map((a, i) => {
    if (questions[i].type === 'vision_choice') return a === null ? 0 : (VIS_SCORE[a] ?? 0);
    return a === null ? 0 : a;
  });
}

export function personaSimilarity(userVec: number[], persona: Persona): number {
  const prof = persona.profile;
  const dims = Math.min(userVec.length, prof.length);
  let sq = 0;
  for (let i = 0; i < dims; i++) {
    const d = userVec[i] - prof[i];
    sq += d * d;
  }
  const dist = Math.sqrt(sq);
  const maxDist = Math.sqrt(dims) * 4;
  return Math.max(0, 1 - dist / maxDist);
}

export function computeVennPos(userVec: number[], personas: Persona[]) {
  const sims = personas.map(p => personaSimilarity(userVec, p));
  const total = sims.reduce((s, v) => s + v, 0);
  if (total === 0) return { x: 250, y: 190, sims };
  const ux = sims.reduce((s, v, i) => s + v * personas[i].px, 0) / total;
  const uy = sims.reduce((s, v, i) => s + v * personas[i].py, 0) / total;
  return { x: ux, y: uy, sims };
}

export function buildSim(subtopic: Subtopic): number[][] {
  const r = mkRng(42);
  const clusterDefs = [
    { bWeights: [1, 0, 0, 0, 0], n: 40 },
    { bWeights: [0, 1, 0, 0, 0], n: 40 },
    { bWeights: [0, 0, 1, 0, 0], n: 40 },
    { bWeights: [0, 0, 0, 1, 0], n: 40 },
    { bWeights: [0, 0, 0, 0, 1], n: 40 },
    { bWeights: [0.2, 0.2, 0.2, 0.2, 0.2], n: 40 },
  ];
  const personas = subtopic.personas;
  return clusterDefs.flatMap(c =>
    Array.from({ length: c.n }, () => {
      const profile = personas[0].profile.map((_, pi) => {
        let v = c.bWeights.reduce(
          (s, w, ci) => s + w * (personas[Math.min(ci, personas.length - 1)].profile[pi] ?? 0),
          0,
        );
        v = Math.round(v + (r() - 0.5) * 2.5);
        return Math.max(-2, Math.min(2, v));
      });
      return profile;
    }),
  );
}

export function computeResults(answers: (number | null)[], subtopic: Subtopic): Results {
  const q = subtopic.questions;
  const userVec = getAnswerVec(answers, q);
  const { x: ux, y: uy, sims } = computeVennPos(userVec, subtopic.personas);
  const sim = buildSim(subtopic);
  const simScores = sim.map(u =>
    userVec.reduce((n, v, i) => n + (Math.abs(v - (u[i] ?? 0)) <= 1 ? 1 : 0), 0),
  );
  const vSim = simScores.filter(s => s >= Math.floor(q.length * 0.8)).length;
  const sSim = simScores.filter(
    s => s >= Math.floor(q.length * 0.6) && s < Math.floor(q.length * 0.8),
  ).length;
  const qStats = q.map((_, i) => ({
    i,
    cnt: sim.filter(u => Math.abs(userVec[i] - (u[i] ?? 0)) <= 1).length,
  }));
  const mostShared = qStats.reduce((x, y) => (x.cnt > y.cnt ? x : y));
  const mostDistinct = qStats.reduce((x, y) => (x.cnt < y.cnt ? x : y));
  const topPersonaIdx = sims.reduce((mx, v, i) => (v > sims[mx] ? i : mx), 0);
  return { ux, uy, personaSims: sims, vSim, sSim, total: sim.length, mostShared, mostDistinct, topPersonaIdx };
}

export function getRank(n: number): Rank {
  let rank = RANKS[0];
  for (const r of RANKS) if (n >= r.min) rank = r;
  return rank;
}

export function getNextRank(n: number): Rank | null {
  return RANKS.find(r => r.min > n) ?? null;
}

export function getCitizenProfile(d: number, i: number) {
  const t = d + i;
  if (!t) return { label: 'Undecided Citizen', desc: 'Complete a topic to discover your citizen profile.' };
  if (d / t >= 0.7) return { label: 'Decisive Thinker', desc: 'You trust your instincts — forming views quickly without needing external validation. A valuable quality in democratic deliberation.' };
  if (i / t >= 0.7) return { label: 'Informed Citizen', desc: 'You sought out evidence before committing. Your views are grounded in research — a cornerstone of good policy-making.' };
  return { label: 'Thoughtful Legislator', desc: 'You balanced instinct with evidence — knowing when to trust your judgment and when to seek more information.' };
}

export function calcDecisiveDelta(
  qi: number,
  lmWasOpened: Record<number, boolean>,
  readStatus: Record<string, number>,
  hasSrc: boolean,
): number {
  const wasOpened = lmWasOpened[qi] ?? false;
  const anyRead = hasSrc && Object.entries(readStatus).some(
    ([k, v]) => k.startsWith(`${qi}_`) && v > 0,
  );
  if (!wasOpened) return PTS.decisive;
  if (!anyRead) return PTS.peeked_no_read;
  return 0;
}
