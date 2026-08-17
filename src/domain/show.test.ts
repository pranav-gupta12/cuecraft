import { describe, expect, it } from 'vitest';
import { findCueConflicts, formatOffset, type Cue } from './show';

function cue(overrides: Partial<Cue>): Cue {
  return {
    id: 'cue',
    code: 'LX 1',
    title: 'Cue',
    department: 'lighting',
    offsetSeconds: 0,
    durationSeconds: 10,
    state: 'draft',
    owner: 'Owner',
    trigger: 'Trigger',
    notes: 'Notes',
    ...overrides,
  };
}

describe('show timing', () => {
  it('formats offsets for the rehearsal clock', () => {
    expect(formatOffset(0)).toBe('00:00');
    expect(formatOffset(125)).toBe('02:05');
  });

  it('finds overlapping cues within the same department', () => {
    const conflicts = findCueConflicts([
      cue({ id: 'first', offsetSeconds: 10, durationSeconds: 20 }),
      cue({ id: 'second', offsetSeconds: 25, durationSeconds: 8 }),
    ]);

    expect(conflicts).toEqual([{ cueId: 'first', overlapsWithId: 'second', overlapSeconds: 5 }]);
  });

  it('does not flag simultaneous work owned by different departments', () => {
    const conflicts = findCueConflicts([
      cue({ id: 'lights' }),
      cue({ id: 'sound', department: 'audio' }),
    ]);

    expect(conflicts).toEqual([]);
  });

  it('treats touching cue boundaries as conflict-free', () => {
    const conflicts = findCueConflicts([
      cue({ id: 'first', durationSeconds: 10 }),
      cue({ id: 'second', offsetSeconds: 10 }),
    ]);

    expect(conflicts).toEqual([]);
  });
});
