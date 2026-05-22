import { createContext, useContext, useReducer, Dispatch } from 'react';
import type { AppState, Topic, Subtopic } from '../types';
import { computeResults, getRank, calcDecisiveDelta } from '../lib/engine';
import { PTS } from '../data/constants';

const initialState: AppState = {
  screen: 'home',
  topic: null,
  subtopic: null,
  qi: 0,
  answers: [],
  selected: null,
  results: null,
  completed: [],
  justRankedUp: false,
  dPts: 0,
  iPts: 0,
  lmOpen: {},
  readStatus: {},
  lmWasOpened: {},
};

export type Action =
  | { type: 'GO_HOME' }
  | { type: 'GO_SUBTOPIC_SCREEN' }
  | { type: 'CLICK_TOPIC'; topic: Topic }
  | { type: 'START_SUBTOPIC'; topic: Topic; subtopic: Subtopic }
  | { type: 'SELECT_OPT'; value: number }
  | { type: 'TOGGLE_LM'; qi: number }
  | { type: 'SET_RS'; qi: number; si: number; level: number }
  | { type: 'GO_NEXT' }
  | { type: 'GO_PREV' }
  | { type: 'RETAKE' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'GO_HOME':
      return { ...state, screen: 'home', topic: null, subtopic: null };

    case 'GO_SUBTOPIC_SCREEN':
      return { ...state, screen: 'subtopic' };

    case 'CLICK_TOPIC': {
      const { topic } = action;
      if (topic.status !== 'active') return state;
      return {
        ...state,
        screen: 'subtopic',
        topic,
        subtopic: null,
        qi: 0,
        answers: [],
        selected: null,
        results: null,
        justRankedUp: false,
        lmOpen: {},
        readStatus: {},
        lmWasOpened: {},
      };
    }

    case 'START_SUBTOPIC': {
      const { topic, subtopic } = action;
      return {
        ...state,
        screen: 'question',
        topic,
        subtopic,
        qi: 0,
        answers: Array(subtopic.questions.length).fill(null),
        selected: null,
        results: null,
        justRankedUp: false,
        lmOpen: {},
        readStatus: {},
        lmWasOpened: {},
      };
    }

    case 'SELECT_OPT':
      return { ...state, selected: action.value };

    case 'TOGGLE_LM': {
      const { qi } = action;
      return {
        ...state,
        lmOpen: { ...state.lmOpen, [qi]: !state.lmOpen[qi] },
        lmWasOpened: { ...state.lmWasOpened, [qi]: true },
      };
    }

    case 'SET_RS': {
      const { qi, si, level } = action;
      const key = `${qi}_${si}`;
      const prev = state.readStatus[key] ?? 0;
      const prevPts = prev === 1 ? PTS.peek : prev === 2 ? PTS.sections : prev === 3 ? PTS.full : 0;
      const newPts = level === 1 ? PTS.peek : level === 2 ? PTS.sections : level === 3 ? PTS.full : 0;
      return {
        ...state,
        readStatus: { ...state.readStatus, [key]: level },
        iPts: state.iPts + (newPts - prevPts),
      };
    }

    case 'GO_NEXT': {
      if (state.selected === null || !state.subtopic) return state;
      const { qi, subtopic, lmWasOpened, dPts } = state;
      const ans = [...state.answers];
      ans[qi] = state.selected;
      const q = subtopic.questions[qi];
      const hasSrc = q.sources != null && q.sources.length > 0;
      const delta = calcDecisiveDelta(qi, lmWasOpened, state.readStatus, hasSrc);
      const nd = dPts + delta;

      if (qi === subtopic.questions.length - 1) {
        const r = computeResults(ans, subtopic);
        const prevRank = getRank(state.completed.length);
        const nc = state.completed.includes(subtopic.id)
          ? state.completed
          : [...state.completed, subtopic.id];
        const nr = getRank(nc.length);
        return {
          ...state,
          screen: 'results',
          answers: ans,
          results: r,
          completed: nc,
          justRankedUp: nr.label !== prevRank.label,
          dPts: nd,
        };
      } else {
        const nqi = qi + 1;
        return { ...state, qi: nqi, answers: ans, selected: ans[nqi], dPts: nd };
      }
    }

    case 'GO_PREV': {
      if (state.qi === 0) return state;
      const ans = [...state.answers];
      ans[state.qi] = state.selected;
      return { ...state, qi: state.qi - 1, answers: ans, selected: ans[state.qi - 1] };
    }

    case 'RETAKE': {
      if (!state.topic || !state.subtopic) return state;
      return {
        ...state,
        screen: 'question',
        qi: 0,
        answers: Array(state.subtopic.questions.length).fill(null),
        selected: null,
        results: null,
        justRankedUp: false,
        lmOpen: {},
        readStatus: {},
        lmWasOpened: {},
      };
    }

    default:
      return state;
  }
}

interface AppContextValue {
  state: AppState;
  dispatch: Dispatch<Action>;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export { initialState, reducer };
