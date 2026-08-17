import type { CueState } from '../domain/show';

const labels: Record<CueState, string> = {
  draft: 'Draft',
  review: 'Needs review',
  ready: 'Ready',
  held: 'Held',
};

export function CueStatus({ state }: { state: CueState }) {
  return <span className={`cue-status cue-status--${state}`}>{labels[state]}</span>;
}
