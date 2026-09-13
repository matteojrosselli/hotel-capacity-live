"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MarketsResponse } from "@/lib/api-types";

const DEFAULT_POLL_MS = 300_000;

function pollIntervalMs(): number {
  const raw = process.env.NEXT_PUBLIC_CAPACITY_POLL_MS;
  const parsed = raw ? Number.parseInt(raw, 10) : DEFAULT_POLL_MS;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_POLL_MS;
}

export function useMarketCapacity() {
  const [data, setData] = useState<MarketsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const pollMs = pollIntervalMs();
  const abortRef = useRef<AbortController | null>(null);

  const fetchMarkets = useCallback(async (refresh = false) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const url = refresh ? "/api/markets?refresh=1" : "/api/markets";
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(body.error ?? `Request failed (${response.status})`);
      }
      const payload = (await response.json()) as MarketsResponse;
      setData(payload);
      setLastFetched(new Date());
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Failed to load markets");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchMarkets();
    const id = window.setInterval(() => void fetchMarkets(), pollMs);
    return () => {
      window.clearInterval(id);
      abortRef.current?.abort();
    };
  }, [fetchMarkets, pollMs]);

  return {
    markets: data?.markets ?? [],
    source: data?.source ?? null,
    cachedAt: data?.cachedAt ?? null,
    loading,
    error,
    lastFetched,
    pollMs,
    refetch: () => fetchMarkets(true),
  };
}
