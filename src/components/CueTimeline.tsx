import { findCueConflicts, type Cue } from '../domain/show';
import { CueRow } from './CueRow';

type CueTimelineProps = {
  cues: Cue[];
  selectedCueId: string | null;
  onSelectCue: (cueId: string) => void;
};

export function CueTimeline({ cues, selectedCueId, onSelectCue }: CueTimelineProps) {
  const conflictIds = new Set(
    findCueConflicts(cues).flatMap((conflict) => [conflict.cueId, conflict.overlapsWithId]),
  );

  return (
    <section className="timeline" aria-labelledby="timeline-title">
      <div className="section-heading section-heading--timeline">
        <div>
          <p className="eyebrow">In show order</p>
          <h2 id="timeline-title">Run of show</h2>
        </div>
        <span className="timeline__legend">MM:SS from house half</span>
      </div>
      {cues.length > 0 ? (
        <ol className="cue-list">
          {cues.map((cue) => (
            <CueRow
              key={cue.id}
              cue={cue}
              selected={cue.id === selectedCueId}
              conflicted={conflictIds.has(cue.id)}
              onSelect={onSelectCue}
            />
          ))}
        </ol>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true">◇</span>
          <h3>No cues match</h3>
          <p>Reset the filters or try a broader search.</p>
        </div>
      )}
    </section>
  );
}
