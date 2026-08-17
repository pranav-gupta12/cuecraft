import type { CueState } from '../domain/show';

const stateLabels: Record<CueState, string> = {
  draft: 'Draft',
  review: 'Needs review',
  ready: 'Ready',
  held: 'Held',
};

type ChangeNoticeProps = {
  cueTitle: string;
  nextState: CueState;
  onUndo: () => void;
  onDismiss: () => void;
};

export function ChangeNotice({ cueTitle, nextState, onUndo, onDismiss }: ChangeNoticeProps) {
  return (
    <div className="change-notice" role="status" aria-live="polite">
      <div>
        <strong>{cueTitle}</strong>
        <span>Readiness changed to {stateLabels[nextState]}.</span>
      </div>
      <button type="button" onClick={onUndo}>Undo</button>
      <button className="icon-button" type="button" onClick={onDismiss} aria-label="Dismiss change message">
        ×
      </button>
    </div>
  );
}
