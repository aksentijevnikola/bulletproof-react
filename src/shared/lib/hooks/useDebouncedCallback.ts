import { useCallback, useEffect, useRef } from "react";

type Args = readonly unknown[];

export function useDebouncedFunction<TArgs extends Args>(
  callback: (...args: TArgs) => void,
  delayMs: number,
) {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof globalThis.setTimeout> | null>(
    null,
  );

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        globalThis.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const debouncedCall = useCallback(
    (...args: TArgs) => {
      if (timerRef.current !== null) {
        globalThis.clearTimeout(timerRef.current);
      }

      timerRef.current = globalThis.setTimeout(() => {
        callbackRef.current(...args);
      }, delayMs);
    },
    [delayMs],
  );

  return debouncedCall;
}
