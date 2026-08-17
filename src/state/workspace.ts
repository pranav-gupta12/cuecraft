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
};

export type WorkspaceAction =
  | { type: 'select-cue'; cueId: string | null }
  | { type: 'set-query'; query: string }
  | { type: 'toggle-department'; department: Department }
  | { type: 'toggle-state'; state: CueState }
  | { type: 'toggle-conflicts' }
  | { type: 'set-cue-state'; cueId: string; state: CueState }
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
      return {
        ...state,
        cues: state.cues.map((cue) => (cue.id === action.cueId ? { ...cue, state: action.state } : cue)),
      };
    case 'clear-filters':
      return { ...state, filters: emptyFilters };
  }
}
