import type { Cue } from '../domain/show';
import type { WorkspaceFilters } from '../state/workspace';

export function filterCues(cues: Cue[], filters: WorkspaceFilters): Cue[] {
  const query = filters.query.trim().toLocaleLowerCase();

  return cues.filter((cue) => {
    const matchesDepartment =
      filters.departments.length === 0 || filters.departments.includes(cue.department);
    const matchesState = filters.states.length === 0 || filters.states.includes(cue.state);
    const searchableText = [cue.code, cue.title, cue.owner, cue.trigger, cue.notes].join(' ').toLocaleLowerCase();
    const matchesQuery = query.length === 0 || searchableText.includes(query);

    return matchesDepartment && matchesState && matchesQuery;
  });
}
