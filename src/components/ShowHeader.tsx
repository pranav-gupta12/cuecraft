import type { ShowPlan } from '../domain/show';

type ShowHeaderProps = {
  show: Pick<ShowPlan, 'title' | 'venue' | 'performanceAt'>;
};

function formatPerformance(value: string): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));
}

export function ShowHeader({ show }: ShowHeaderProps) {
  return (
    <header className="show-header">
      <div>
        <a className="brand" href="#main-content" aria-label="Cuecraft home">
          <span aria-hidden="true" className="brand__mark">C</span>
          <span>Cuecraft</span>
        </a>
        <p className="eyebrow">Rehearsal console</p>
        <h1>{show.title}</h1>
      </div>
      <dl className="show-meta" aria-label="Performance details">
        <div>
          <dt>Venue</dt>
          <dd>{show.venue}</dd>
        </div>
        <div>
          <dt>Performance</dt>
          <dd>{formatPerformance(show.performanceAt)}</dd>
        </div>
      </dl>
    </header>
  );
}

