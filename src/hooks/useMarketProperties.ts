"use client";

import { useCallback, useEffect, useState } from "react";
import type { PropertiesResponse } from "@/lib/api-types";

export function useMarketProperties(airportCode: string | null) {
  const [data, setData] = useState<PropertiesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    if (!airportCode) {
      setData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/markets/${encodeURIComponent(airportCode)}/properties`,
      );
      if (!response.ok) {
        const body = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(body.error ?? `Request failed (${response.status})`);
      }
      setData((await response.json()) as PropertiesResponse);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load properties",
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [airportCode]);

  useEffect(() => {
    void fetchProperties();
  }, [fetchProperties]);

  return {
    properties: data?.properties ?? [],
    source: data?.source ?? null,
    loading,
    error,
    refetch: fetchProperties,
  };
}
