import { findCueConflicts, type Cue, type Department } from '../domain/show';

export type ConflictReview = {
  cueIds: Set<string>;
  pairCount: number;
  affectedByDepartment: Partial<Record<Department, number>>;
};

export function buildConflictReview(cues: Cue[]): ConflictReview {
  const conflicts = findCueConflicts(cues);
  const cueIds = new Set<string>();

  for (const conflict of conflicts) {
    cueIds.add(conflict.cueId);
    cueIds.add(conflict.overlapsWithId);
  }

  const affectedByDepartment = [...cueIds].reduce<Partial<Record<Department, number>>>((counts, cueId) => {
    const department = cues.find((cue) => cue.id === cueId)?.department;
    if (!department) return counts;
    return { ...counts, [department]: (counts[department] ?? 0) + 1 };
  }, {});

  return {
    cueIds,
    pairCount: conflicts.length,
    affectedByDepartment,
  };
}
