export const departments = ['stage', 'lighting', 'audio', 'video'] as const;
export type Department = (typeof departments)[number];

export const cueStates = ['draft', 'review', 'ready', 'held'] as const;
export type CueState = (typeof cueStates)[number];

export type Cue = {
  id: string;
  code: string;
  title: string;
  department: Department;
  offsetSeconds: number;
  durationSeconds: number;
  state: CueState;
  owner: string;
  trigger: string;
  notes: string;
};

export type ShowPlan = {
  title: string;
  venue: string;
  performanceAt: string;
  runTimeMinutes: number;
  cues: Cue[];
};

export type CueConflict = {
  cueId: string;
  overlapsWithId: string;
  overlapSeconds: number;
};

export function cueEnd(cue: Cue): number {
  return cue.offsetSeconds + cue.durationSeconds;
}

export function findCueConflicts(cues: Cue[]): CueConflict[] {
  const conflicts: CueConflict[] = [];

  for (let leftIndex = 0; leftIndex < cues.length; leftIndex += 1) {
    const left = cues[leftIndex];

    for (let rightIndex = leftIndex + 1; rightIndex < cues.length; rightIndex += 1) {
      const right = cues[rightIndex];
      if (left.department !== right.department) continue;

      const overlap = Math.min(cueEnd(left), cueEnd(right)) - Math.max(left.offsetSeconds, right.offsetSeconds);
      if (overlap > 0) {
        conflicts.push({
          cueId: left.id,
          overlapsWithId: right.id,
          overlapSeconds: overlap,
        });
      }
    }
  }

  return conflicts;
}

export function formatOffset(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

