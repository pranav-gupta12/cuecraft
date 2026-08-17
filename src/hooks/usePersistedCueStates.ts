import { useEffect, useMemo } from 'react';
import type { Cue, CueState } from '../domain/show';

const storageKey = 'cuecraft:cue-states:v1';

function readCueStates(): Record<string, CueState> {
  try {
    const rawValue = window.localStorage.getItem(storageKey);
    if (!rawValue) return {};
    const parsedValue = JSON.parse(rawValue) as unknown;
    if (typeof parsedValue !== 'object' || parsedValue === null) return {};
    return parsedValue as Record<string, CueState>;
  } catch {
    return {};
  }
}

export function useInitialCues(cues: Cue[]): Cue[] {
  return useMemo(() => {
    const savedStates = readCueStates();
    return cues.map((cue) => (savedStates[cue.id] ? { ...cue, state: savedStates[cue.id] } : cue));
  }, [cues]);
}

export function usePersistCueStates(cues: Cue[]): void {
  useEffect(() => {
    const states = Object.fromEntries(cues.map((cue) => [cue.id, cue.state]));

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(states));
    } catch {
      // Cue state remains usable in memory when browser storage is unavailable.
    }
  }, [cues]);
}

