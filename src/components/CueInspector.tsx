import { cueStates, formatOffset, type Cue, type CueState } from '../domain/show';
import { CueStatus } from './CueStatus';

const stateLabels: Record<CueState, string> = {
  draft: 'Draft',
  review: 'Needs review',
  ready: 'Ready',
  held: 'Held',
};

type CueInspectorProps = {
  cue: Cue | null;
  onClose: () => void;
  onStateChange: (cueId: string, state: CueState) => void;
};

export function CueInspector({ cue, onClose, onStateChange }: CueInspectorProps) {
  if (!cue) {
    return (
      <aside className="inspector inspector--empty" aria-label="Cue details">
        <span className="inspector__glyph" aria-hidden="true">↗</span>
        <h2>Select a cue</h2>
        <p>Open any cue to review its owner, trigger, timing, and rehearsal notes.</p>
      </aside>
    );
  }

  return (
    <aside className="inspector" aria-labelledby="inspector-title">
      <div className="inspector__topline">
        <CueStatus state={cue.state} />
        <button className="icon-button" type="button" onClick={onClose} aria-label="Close cue details">
          ×
        </button>
      </div>
      <p className="eyebrow">{cue.code} · {cue.department}</p>
      <h2 id="inspector-title">{cue.title}</h2>
      <p className="inspector__notes">{cue.notes}</p>

      <dl className="cue-facts">
        <div>
          <dt>Owner</dt>
          <dd>{cue.owner}</dd>
        </div>
        <div>
          <dt>Starts</dt>
          <dd>{formatOffset(cue.offsetSeconds)}</dd>
        </div>
        <div>
          <dt>Duration</dt>
          <dd>{cue.durationSeconds} seconds</dd>
        </div>
        <div>
          <dt>Trigger</dt>
          <dd>{cue.trigger}</dd>
        </div>
      </dl>

      <fieldset className="state-picker">
        <legend>Rehearsal state</legend>
        {cueStates.map((state) => (
          <label key={state}>
            <input
              type="radio"
              name={`state-${cue.id}`}
              checked={cue.state === state}
              onChange={() => onStateChange(cue.id, state)}
            />
            <span>{stateLabels[state]}</span>
          </label>
        ))}
      </fieldset>
    </aside>
  );
}
