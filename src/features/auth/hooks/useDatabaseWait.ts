import { useCallback, useEffect, useRef, useState } from "react";
import { databaseHealthApi } from "../api/databaseHealthApi";

export const DATABASE_POLL_MS = 10_000;
export const DATABASE_WAIT_LIMIT_MS = 5 * 60_000;

/**
 * Waiting state while the API reports DB_STARTING: polls /health/db and calls onReady when the
 * database answers. Elapsed time is derived from a wall-clock start, so a throttled background
 * tab still shows the right time and reaches the 5-minute limit when it comes back.
 */
export function useDatabaseWait(onReady: () => void) {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  /** Starts waiting, or keeps the current start time if already waiting. */
  const start = useCallback(() => {
    setStartedAt((prev) => prev ?? Date.now());
    setNow(Date.now());
  }, []);

  const stop = useCallback(() => {
    setStartedAt(null);
    setTimedOut(false);
  }, []);

  useEffect(() => {
    if (startedAt === null || timedOut) return;
    let cancelled = false;

    const tick = () => {
      const t = Date.now();
      setNow(t);
      if (t - startedAt >= DATABASE_WAIT_LIMIT_MS) setTimedOut(true);
    };
    const poll = async () => {
      const status = await databaseHealthApi.check();
      if (!cancelled && status === "ready" && Date.now() - startedAt < DATABASE_WAIT_LIMIT_MS) {
        onReadyRef.current();
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };

    tick();
    const clock = setInterval(tick, 1_000);
    const poller = setInterval(poll, DATABASE_POLL_MS);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      clearInterval(clock);
      clearInterval(poller);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [startedAt, timedOut]);

  return {
    waiting: startedAt !== null && !timedOut,
    timedOut,
    elapsedMs: startedAt === null ? 0 : Math.max(0, now - startedAt),
    start,
    stop,
  };
}

export function formatElapsed(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}
