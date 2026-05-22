export type SourceType = 'paper' | 'brief' | 'blog';

export interface Source {
  type: SourceType;
  title: string;
  url: string;
  year: string;
  stance: string;
  stanceLabel: string;
  summary: string;
}

export interface Question {
  t: string;
  c: string;
  tag: string;
  type?: 'vision_choice';
  sources: Source[];
}

export interface Persona {
  id: string;
  name: string;
  icon: string;
  keys: string;
  col: string;
  px: number;
  py: number;
  profile: number[];
}

export interface Subtopic {
  id: string;
  name: string;
  icon: string;
  desc: string;
  personas: Persona[];
  questions: Question[];
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  desc: string;
  status: 'active' | 'soon';
  subtopics?: Subtopic[];
}

export interface Vision {
  id: number;
  name: string;
  icon: string;
  keys: string;
  desc: string;
  by: string;
}

export interface Rank {
  label: string;
  icon: string;
  min: number;
}

export interface Results {
  ux: number;
  uy: number;
  personaSims: number[];
  vSim: number;
  sSim: number;
  total: number;
  mostShared: { i: number; cnt: number };
  mostDistinct: { i: number; cnt: number };
  topPersonaIdx: number;
}

export type Screen = 'home' | 'subtopic' | 'question' | 'results';

export interface AppState {
  screen: Screen;
  topic: Topic | null;
  subtopic: Subtopic | null;
  qi: number;
  answers: (number | null)[];
  selected: number | null;
  results: Results | null;
  completed: string[];
  justRankedUp: boolean;
  dPts: number;
  iPts: number;
  lmOpen: Record<number, boolean>;
  readStatus: Record<string, number>;
  lmWasOpened: Record<number, boolean>;
}
