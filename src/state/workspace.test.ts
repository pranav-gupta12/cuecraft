import { describe, expect, it } from 'vitest';
import { showPlan } from '../data/showPlan';
import { emptyFilters, workspaceReducer, type WorkspaceState } from './workspace';

const initialState: WorkspaceState = {
  cues: showPlan.cues,
  selectedCueId: null,
  filters: emptyFilters,
};

describe('workspaceReducer', () => {
  it('selects and clears the inspected cue', () => {
    const selected = workspaceReducer(initialState, { type: 'select-cue', cueId: 'title-card' });
    expect(selected.selectedCueId).toBe('title-card');
    expect(workspaceReducer(selected, { type: 'select-cue', cueId: null }).selectedCueId).toBeNull();
  });

  it('toggles independent filter values without mutating prior state', () => {
    const withLighting = workspaceReducer(initialState, {
      type: 'toggle-department',
      department: 'lighting',
    });
    const withAudio = workspaceReducer(withLighting, { type: 'toggle-department', department: 'audio' });

    expect(initialState.filters.departments).toEqual([]);
    expect(withAudio.filters.departments).toEqual(['lighting', 'audio']);
    expect(
      workspaceReducer(withAudio, { type: 'toggle-department', department: 'lighting' }).filters.departments,
    ).toEqual(['audio']);
  });

  it('updates only the requested cue state', () => {
    const next = workspaceReducer(initialState, {
      type: 'set-cue-state',
      cueId: 'opening-chord',
      state: 'ready',
    });

    expect(next.cues.find((cue) => cue.id === 'opening-chord')?.state).toBe('ready');
    expect(next.cues.find((cue) => cue.id === 'house-to-half')?.state).toBe('ready');
    expect(next.cues).not.toBe(initialState.cues);
  });

  it('clears every filter while preserving cue work', () => {
    const filtered = workspaceReducer(initialState, { type: 'set-query', query: 'camera' });
    const selected = workspaceReducer(filtered, { type: 'select-cue', cueId: 'camera-two' });
    const cleared = workspaceReducer(selected, { type: 'clear-filters' });

    expect(cleared.filters).toEqual(emptyFilters);
    expect(cleared.selectedCueId).toBe('camera-two');
  });
});
