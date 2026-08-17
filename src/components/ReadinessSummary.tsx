import type { Cue, CueState } from '../domain/show';

const labels: Record<CueState, string> = {
  draft: 'Draft',
  review: 'Needs review',
  ready: 'Ready',
  held: 'Held',
};

export function ReadinessSummary({ cues }: { cues: Cue[] }) {
  const counts = cues.reduce<Record<CueState, number>>(
    (result, cue) => ({ ...result, [cue.state]: result[cue.state] + 1 }),
    { draft: 0, review: 0, ready: 0, held: 0 },
  );
  const readyPercent = cues.length === 0 ? 0 : Math.round((counts.ready / cues.length) * 100);

  return (
    <section className="readiness" aria-labelledby="readiness-title">
      <div className="readiness__lead">
        <p className="eyebrow" id="readiness-title">Show readiness</p>
        <strong>{readyPercent}%</strong>
        <span>{counts.ready} of {cues.length} cues cleared</span>
      </div>
      <div className="readiness__bar" aria-hidden="true">
        <span style={{ width: `${readyPercent}%` }} />
      </div>
      <dl className="readiness__counts">
        {(Object.keys(labels) as CueState[]).map((state) => (
          <div key={state}>
            <dt>{labels[state]}</dt>
            <dd>{counts[state]}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
