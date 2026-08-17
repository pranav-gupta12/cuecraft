import { formatOffset, type Cue } from '../domain/show';
import { CueStatus } from './CueStatus';

type CueRowProps = {
  cue: Cue;
  selected: boolean;
  conflicted: boolean;
  onSelect: (cueId: string) => void;
};

const departmentShort = {
  stage: 'ST',
  lighting: 'LX',
  audio: 'SD',
  video: 'VX',
};

export function CueRow({ cue, selected, conflicted, onSelect }: CueRowProps) {
  return (
    <li>
      <button
        className={`cue-row${selected ? ' cue-row--selected' : ''}`}
        type="button"
        aria-pressed={selected}
        onClick={() => onSelect(cue.id)}
      >
        <span className="cue-row__time">
          <strong>{formatOffset(cue.offsetSeconds)}</strong>
          <small>{cue.durationSeconds}s</small>
        </span>
        <span className={`department-mark department-mark--${cue.department}`} aria-label={cue.department}>
          {departmentShort[cue.department]}
        </span>
        <span className="cue-row__copy">
          <span className="cue-row__code">{cue.code}</span>
          <strong>{cue.title}</strong>
          <small>{cue.trigger}</small>
        </span>
        <span className="cue-row__meta">
          {conflicted ? <span className="conflict-flag">Timing conflict</span> : null}
          <CueStatus state={cue.state} />
        </span>
      </button>
    </li>
  );
}

