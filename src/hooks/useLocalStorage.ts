import { useState, useEffect, useCallback, useRef } from 'react';

const SYNC_EVENT_NAME = 'parkease:localstorage:sync';

interface StorageSyncDetail {
  readonly key: string;
}

/**
 * Generic, type-safe hook for persisting state in localStorage.
 * Handles:
 * - Runtime type validation via a type guard over `unknown`
 * - Reseeding on invalid or corrupt JSON
 * - Cross-window sync via native window 'storage' events
 * - Same-window/tab sync via custom 'parkease:localstorage:sync' events
 * - Handling of event.key === null (when localStorage is cleared)
 * - Functional state updaters
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  isValid: (value: unknown) => value is T,
): [T, (valueOrUpdater: T | ((prev: T) => T)) => void] {
  // Read and validate initial value
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) {
        return initialValue;
      }
      const parsed: unknown = JSON.parse(raw);
      if (isValid(parsed)) {
        return parsed;
      }
      // Data was corrupt or didn't pass type validation; reset to initial
      window.localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue, isValid]);

  const [storedValue, setStoredValue] = useState<T>(readValue);
  const storedValueRef = useRef<T>(storedValue);
  storedValueRef.current = storedValue;

  const setValue = useCallback(
    (valueOrUpdater: T | ((prev: T) => T)) => {
      try {
        const nextValue =
          typeof valueOrUpdater === 'function'
            ? (valueOrUpdater as (prev: T) => T)(storedValueRef.current)
            : valueOrUpdater;

        setStoredValue(nextValue);
        storedValueRef.current = nextValue;

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(nextValue));
          // Dispatch custom event for same-tab subscribers
          const event = new CustomEvent<StorageSyncDetail>(SYNC_EVENT_NAME, {
            detail: { key },
          });
          window.dispatchEvent(event);
        }
      } catch (err) {
        // Fallback or quota handling: keep in-memory state
        console.warn(`[useLocalStorage] Error saving key "${key}":`, err);
      }
    },
    [key],
  );

  // Subscribe to external storage changes (cross-tab and same-tab)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === null || event.key === key) {
        setStoredValue(readValue());
      }
    };

    const handleCustomSync = (event: Event) => {
      const customEvent = event as CustomEvent<StorageSyncDetail>;
      if (customEvent.detail && customEvent.detail.key === key) {
        setStoredValue(readValue());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(SYNC_EVENT_NAME, handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(SYNC_EVENT_NAME, handleCustomSync);
    };
  }, [key, readValue]);

  return [storedValue, setValue];
}
