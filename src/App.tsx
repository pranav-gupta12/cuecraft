import { useMemo, useReducer } from 'react';
import { ConflictSummary } from './components/ConflictSummary';
import { CueInspector } from './components/CueInspector';
import { CueTimeline } from './components/CueTimeline';
import { FilterPanel } from './components/FilterPanel';
import { ReadinessSummary } from './components/ReadinessSummary';
import { ShowHeader } from './components/ShowHeader';
import { showPlan } from './data/showPlan';
import { useInitialCues, usePersistCueStates } from './hooks/usePersistedCueStates';
import { emptyFilters, workspaceReducer } from './state/workspace';
import { filterCues } from './utils/filterCues';
import { buildConflictReview } from './utils/conflictReview';
import './styles/cuecraft.css';

export function App() {
  const initialCues = useInitialCues(showPlan.cues);
  const [workspace, dispatch] = useReducer(workspaceReducer, {
    cues: initialCues,
    selectedCueId: null,
    filters: emptyFilters,
  });
  const visibleCues = useMemo(
    () => filterCues(workspace.cues, workspace.filters),
    [workspace.cues, workspace.filters],
  );
  const conflictReview = useMemo(() => buildConflictReview(workspace.cues), [workspace.cues]);
  const selectedCue = workspace.cues.find((cue) => cue.id === workspace.selectedCueId) ?? null;
  usePersistCueStates(workspace.cues);

  return (
    <main id="main-content">
      <ShowHeader show={showPlan} />
      <ReadinessSummary cues={workspace.cues} />
      <ConflictSummary
        review={conflictReview}
        reviewing={workspace.filters.conflictsOnly}
        onToggleReview={() => dispatch({ type: 'toggle-conflicts' })}
      />
      <div className="workspace">
        <FilterPanel
          filters={workspace.filters}
          resultCount={visibleCues.length}
          totalCount={workspace.cues.length}
          onQueryChange={(query) => dispatch({ type: 'set-query', query })}
          onDepartmentToggle={(department) => dispatch({ type: 'toggle-department', department })}
          onStateToggle={(state) => dispatch({ type: 'toggle-state', state })}
          onClear={() => dispatch({ type: 'clear-filters' })}
        />
        <CueTimeline
          cues={visibleCues}
          selectedCueId={workspace.selectedCueId}
          onSelectCue={(cueId) => dispatch({ type: 'select-cue', cueId })}
        />
        <CueInspector
          cue={selectedCue}
          onClose={() => dispatch({ type: 'select-cue', cueId: null })}
          onStateChange={(cueId, state) => dispatch({ type: 'set-cue-state', cueId, state })}
        />
      </div>
    </main>
  );
}
