import { describe, expect, it } from 'vitest';
import { showPlan } from '../data/showPlan';
import { emptyFilters } from '../state/workspace';
import { filterCues } from './filterCues';

describe('filterCues', () => {
  it('returns every cue for an empty filter', () => {
    expect(filterCues(showPlan.cues, emptyFilters)).toHaveLength(showPlan.cues.length);
  });

  it('matches cue copy without case sensitivity', () => {
    const result = filterCues(showPlan.cues, { ...emptyFilters, query: 'QUARTET' });
    expect(result.map((cue) => cue.id)).toEqual(['opening-chord']);
  });

  it('matches owner and trigger context', () => {
    expect(filterCues(showPlan.cues, { ...emptyFilters, query: 'jules' })).toHaveLength(2);
    expect(filterCues(showPlan.cues, { ...emptyFilters, query: 'downstage' }).map((cue) => cue.id)).toEqual([
      'camera-two',
    ]);
  });

  it('combines department, state, and query filters', () => {
    const result = filterCues(showPlan.cues, {
      query: 'rise',
      departments: ['lighting'],
      states: ['draft'],
      conflictsOnly: false,
    });

    expect(result.map((cue) => cue.id)).toEqual(['special-rise']);
  });

  it('allows multiple values within a filter group', () => {
    const result = filterCues(showPlan.cues, {
      query: '',
      departments: ['audio', 'video'],
      states: [],
      conflictsOnly: false,
    });

    expect(result.every((cue) => cue.department === 'audio' || cue.department === 'video')).toBe(true);
    expect(result).toHaveLength(4);
  });
});
