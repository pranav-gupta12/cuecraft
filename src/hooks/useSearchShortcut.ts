import { useEffect, useRef, type RefObject } from 'react';

type SearchShortcutOptions = {
  query: string;
  onQueryChange: (query: string) => void;
};

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.matches('input, textarea, select, [contenteditable="true"]');
}

export function useSearchShortcut({ query, onQueryChange }: SearchShortcutOptions): RefObject<HTMLInputElement> {
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isEditableTarget(event.target)) {
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }

      if (event.key === 'Escape' && document.activeElement === searchRef.current) {
        if (query.length > 0) {
          onQueryChange('');
        } else {
          searchRef.current?.blur();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onQueryChange, query]);

  return searchRef;
}
