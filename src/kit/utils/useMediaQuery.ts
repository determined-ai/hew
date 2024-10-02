import { useMemo, useSyncExternalStore } from 'react';

/**
 * Given a media query, return the current state of the query. Updates when the query changes.
 */
export const useMediaQuery = (query: string): boolean => {
  const [subscribe, getSnapshot] = useMemo(() => {
    const match = matchMedia?.(query);
    return [
      (notify: () => void) => {
        match?.addEventListener('change', notify);
        return () => match?.removeEventListener('change', notify);
      },
      () => match?.matches,
    ];
  }, [query]);
  return useSyncExternalStore(subscribe, getSnapshot);
};
