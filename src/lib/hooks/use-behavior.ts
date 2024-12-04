import { useCallback, useSyncExternalStore } from 'react';
import { BehaviorSubject } from 'rxjs';

export function useBehavior<T>(s: BehaviorSubject<T>): [T, (value: T) => void];
export function useBehavior<T>(
  s: BehaviorSubject<T> | undefined,
): [T | undefined, (value: T) => void] {
  const state = useSyncExternalStore(
    useCallback(
      (callback: () => void) => {
        const sub = s?.subscribe(callback);
        return () => sub?.unsubscribe();
      },
      [s],
    ),
    useCallback(() => s?.value, [s]),
  );
  const setState = useCallback(
    (value: T) => {
      s?.next(value);
    },
    [s],
  );

  return [state, setState];
}
