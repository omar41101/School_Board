import { useState, useEffect, useCallback } from 'react';

/**
 * Debounce a value. After `delay` ms without the value changing, the debounced value updates.
 * @param value - The value to debounce
 * @param delay - Delay in ms (default 1000)
 */
export function useDebounce<T>(value: T, delay: number = 1000): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Return a debounced setter for search (or any string). Use for input: value={search} onChange={e => setSearch(e.target.value)} and pass searchDebounced to API.
 */
export function useDebouncedSearch(initialValue: string = '', delay: number = 1000): [string, string, (v: string) => void] {
  const [search, setSearch] = useState(initialValue);
  const debouncedSearch = useDebounce(search, delay);
  return [search, debouncedSearch, setSearch];
}
