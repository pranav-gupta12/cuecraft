import type { Department } from '../domain/show';
import type { ConflictReview } from '../utils/conflictReview';

const departmentLabels: Record<Department, string> = {
  stage: 'Stage',
  lighting: 'Lighting',
  audio: 'Audio',
  video: 'Video',
};

type ConflictSummaryProps = {
  review: ConflictReview;
  reviewing: boolean;
  onToggleReview: () => void;
};

export function ConflictSummary({ review, reviewing, onToggleReview }: ConflictSummaryProps) {
  const affectedDepartments = Object.entries(review.affectedByDepartment) as [Department, number][];

  return (
    <section className="conflict-summary" aria-labelledby="conflict-title">
      <div>
        <p className="eyebrow">Timing desk</p>
        <h2 id="conflict-title">
          {review.pairCount === 0 ? 'No timing collisions' : `${review.pairCount} timing collision`}
        </h2>
        <p>
          {review.pairCount === 0
            ? 'Every department has a clear handoff window.'
            : `${review.cueIds.size} cues need a closer look before the next run.`}
        </p>
      </div>
      {affectedDepartments.length > 0 ? (
        <ul aria-label="Affected departments">
          {affectedDepartments.map(([department, count]) => (
            <li key={department}>
              <strong>{count}</strong> {departmentLabels[department]}
            </li>
          ))}
        </ul>
      ) : null}
      <button
        className="secondary-button"
        type="button"
        aria-pressed={reviewing}
        disabled={review.pairCount === 0}
        onClick={onToggleReview}
      >
        {reviewing ? 'Show complete run' : 'Review conflicts'}
      </button>
    </section>
  );
}
