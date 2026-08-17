import { cueStates, departments, type CueState, type Department } from '../domain/show';
import { useSearchShortcut } from '../hooks/useSearchShortcut';
import type { WorkspaceFilters } from '../state/workspace';

const departmentLabels: Record<Department, string> = {
  stage: 'Stage',
  lighting: 'Lighting',
  audio: 'Audio',
  video: 'Video',
};

const stateLabels: Record<CueState, string> = {
  draft: 'Draft',
  review: 'Review',
  ready: 'Ready',
  held: 'Held',
};

type FilterPanelProps = {
  filters: WorkspaceFilters;
  resultCount: number;
  totalCount: number;
  onQueryChange: (query: string) => void;
  onDepartmentToggle: (department: Department) => void;
  onStateToggle: (state: CueState) => void;
  onClear: () => void;
};

export function FilterPanel({
  filters,
  resultCount,
  totalCount,
  onQueryChange,
  onDepartmentToggle,
  onStateToggle,
  onClear,
}: FilterPanelProps) {
  const searchRef = useSearchShortcut({ query: filters.query, onQueryChange });
  const hasFilters =
    filters.query.length > 0 ||
    filters.departments.length > 0 ||
    filters.states.length > 0 ||
    filters.conflictsOnly;

  return (
    <aside className="filters" aria-labelledby="filter-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Find the moment</p>
          <h2 id="filter-title">Cue filters</h2>
        </div>
        {hasFilters ? <button className="text-button" onClick={onClear}>Reset</button> : null}
      </div>

      <label className="search-field">
        <span>
          Search run of show
          <kbd aria-hidden="true" title="Press slash to focus search">/</kbd>
        </span>
        <input
          ref={searchRef}
          type="search"
          aria-keyshortcuts="/"
          value={filters.query}
          onChange={(event) => onQueryChange(event.currentTarget.value)}
          placeholder="Cue, owner, trigger…"
        />
      </label>

      <fieldset>
        <legend>Department</legend>
        <div className="chip-grid">
          {departments.map((department) => (
            <label className="filter-chip" key={department}>
              <input
                type="checkbox"
                checked={filters.departments.includes(department)}
                onChange={() => onDepartmentToggle(department)}
              />
              <span>{departmentLabels[department]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend>Readiness</legend>
        <div className="chip-grid">
          {cueStates.map((state) => (
            <label className="filter-chip" key={state}>
              <input
                type="checkbox"
                checked={filters.states.includes(state)}
                onChange={() => onStateToggle(state)}
              />
              <span>{stateLabels[state]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className="filter-result" role="status">
        Showing <strong>{resultCount}</strong> of {totalCount} cues
      </p>
    </aside>
  );
}
