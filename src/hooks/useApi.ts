import { useState, useCallback } from "react";

/**
 * A generic hook that wraps any async function (API call),
 * manages loading and error states, and memoizes the execute function
 * to prevent infinite loops in useEffect.
 */
export function useApi<T, Args extends any[] = any[]>(
  apiFn: (...args: Args) => Promise<T>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<T | null>(null);
  const execute = useCallback(
    async (...args: Args): Promise<T | undefined> => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFn(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [apiFn],
  );

  return { execute, loading, error, data };
}
