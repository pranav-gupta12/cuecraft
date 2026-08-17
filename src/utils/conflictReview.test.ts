import { describe, expect, it } from 'vitest';
import type { Cue } from '../domain/show';
import { buildConflictReview } from './conflictReview';

function cue(id: string, department: Cue['department'], offsetSeconds: number, durationSeconds: number): Cue {
  return {
    id,
    code: id,
    title: id,
    department,
    offsetSeconds,
    durationSeconds,
    state: 'draft',
    owner: 'Operator',
    trigger: 'Trigger',
    notes: 'Notes',
  };
}

describe('buildConflictReview', () => {
  it('deduplicates cues that appear in more than one conflict pair', () => {
    const review = buildConflictReview([
      cue('first', 'lighting', 0, 20),
      cue('second', 'lighting', 5, 20),
      cue('third', 'lighting', 10, 20),
    ]);

    expect(review.pairCount).toBe(3);
    expect([...review.cueIds]).toEqual(['first', 'second', 'third']);
    expect(review.affectedByDepartment).toEqual({ lighting: 3 });
  });

  it('summarizes affected cues by department', () => {
    const review = buildConflictReview([
      cue('lx-one', 'lighting', 0, 10),
      cue('lx-two', 'lighting', 5, 10),
      cue('sd-one', 'audio', 20, 10),
      cue('sd-two', 'audio', 25, 10),
    ]);

    expect(review.pairCount).toBe(2);
    expect(review.affectedByDepartment).toEqual({ lighting: 2, audio: 2 });
  });

  it('returns a calm review when no department overlaps itself', () => {
    const review = buildConflictReview([
      cue('lights', 'lighting', 0, 10),
      cue('sound', 'audio', 0, 10),
    ]);

    expect(review.pairCount).toBe(0);
    expect(review.cueIds.size).toBe(0);
    expect(review.affectedByDepartment).toEqual({});
  });
});
