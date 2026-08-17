import type { Cue, CueState, Department } from '../domain/show';

export type WorkspaceFilters = {
  query: string;
  departments: Department[];
  states: CueState[];
  conflictsOnly: boolean;
};

export type WorkspaceState = {
  cues: Cue[];
  selectedCueId: string | null;
  filters: WorkspaceFilters;
  lastStateChange: {
    cueId: string;
    previousState: CueState;
    nextState: CueState;
  } | null;
};

export type WorkspaceAction =
  | { type: 'select-cue'; cueId: string | null }
  | { type: 'set-query'; query: string }
  | { type: 'toggle-department'; department: Department }
  | { type: 'toggle-state'; state: CueState }
  | { type: 'toggle-conflicts' }
  | { type: 'set-cue-state'; cueId: string; state: CueState }
  | { type: 'undo-cue-state' }
  | { type: 'dismiss-change' }
  | { type: 'clear-filters' };

export const emptyFilters: WorkspaceFilters = {
  query: '',
  departments: [],
  states: [],
  conflictsOnly: false,
};

function toggleValue<Value>(values: Value[], value: Value): Value[] {
  return values.includes(value) ? values.filter((candidate) => candidate !== value) : [...values, value];
}

export function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'select-cue':
      return { ...state, selectedCueId: action.cueId };
    case 'set-query':
      return { ...state, filters: { ...state.filters, query: action.query } };
    case 'toggle-department':
      return {
        ...state,
        filters: {
          ...state.filters,
          departments: toggleValue(state.filters.departments, action.department),
        },
      };
    case 'toggle-state':
      return {
        ...state,
        filters: {
          ...state.filters,
          states: toggleValue(state.filters.states, action.state),
        },
      };
    case 'toggle-conflicts':
      return {
        ...state,
        filters: { ...state.filters, conflictsOnly: !state.filters.conflictsOnly },
      };
    case 'set-cue-state':
      {
        const cue = state.cues.find((candidate) => candidate.id === action.cueId);
        if (!cue || cue.state === action.state) return state;

        return {
          ...state,
          cues: state.cues.map((candidate) =>
            candidate.id === action.cueId ? { ...candidate, state: action.state } : candidate,
          ),
          lastStateChange: {
            cueId: action.cueId,
            previousState: cue.state,
            nextState: action.state,
          },
        };
      }
    case 'undo-cue-state':
      if (!state.lastStateChange) return state;
      return {
        ...state,
        cues: state.cues.map((cue) =>
          cue.id === state.lastStateChange?.cueId
            ? { ...cue, state: state.lastStateChange.previousState }
            : cue,
        ),
        lastStateChange: null,
      };
    case 'dismiss-change':
      return { ...state, lastStateChange: null };
    case 'clear-filters':
      return { ...state, filters: emptyFilters };
  }
}
