"use client";

import { useMemo, useState } from "react";
import { MarketCard, MarketCardSkeleton } from "@/components/MarketCard";
import { PropertyTable } from "@/components/PropertyTable";
import { RefreshStatus } from "@/components/RefreshStatus";
import { useMarketCapacity } from "@/hooks/useMarketCapacity";
import { useMarketProperties } from "@/hooks/useMarketProperties";

export function Dashboard() {
  const {
    markets,
    source,
    cachedAt,
    loading,
    error,
    lastFetched,
    pollMs,
    refetch,
  } = useMarketCapacity();

  const [selectedAirport, setSelectedAirport] = useState<string | null>(null);
  const {
    properties: drilldownProperties,
    loading: drilldownLoading,
    error: drilldownError,
    refetch: refetchDrilldown,
  } = useMarketProperties(selectedAirport);

  const selectedMarket = useMemo(
    () => markets.find((m) => m.airportCode === selectedAirport) ?? null,
    [markets, selectedAirport],
  );

  const allProperties = useMemo(() => {
    if (selectedAirport) return drilldownProperties;
    return [];
  }, [selectedAirport, drilldownProperties]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-sky-400">
          Live capacity
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Hotel Capacity Live
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Airport market capacity with polling refresh and property drill-down.
          Configure Hilton or additional vendors via{" "}
          <code className="rounded bg-slate-800 px-1.5 py-0.5 text-sky-300">
            CAPACITY_CONNECTOR
          </code>
          .
        </p>
        <div className="mt-4">
          <RefreshStatus
            source={source}
            lastFetched={lastFetched}
            cachedAt={cachedAt}
            pollMs={pollMs}
            loading={loading}
            onRefresh={refetch}
          />
        </div>
      </header>

      {error ? (
        <div
          role="alert"
          className="mb-6 rounded-lg border border-red-800/60 bg-red-950/30 px-4 py-3 text-red-200"
        >
          {error}{" "}
          <button
            type="button"
            onClick={refetch}
            className="underline hover:text-white"
          >
            Retry
          </button>
        </div>
      ) : null}

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Airport markets</h2>
        <p className="mb-4 text-sm text-slate-500">
          Tap a market to view property-level capacity.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {loading && markets.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <MarketCardSkeleton key={i} />
              ))
            : markets.map((market) => (
                <MarketCard
                  key={market.airportCode}
                  market={market}
                  selected={selectedAirport === market.airportCode}
                  onSelect={(code) =>
                    setSelectedAirport((prev) => (prev === code ? null : code))
                  }
                />
              ))}
        </div>
      </section>

      {selectedAirport && selectedMarket ? (
        <section className="mb-10">
          {drilldownError ? (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-800/60 bg-red-950/30 px-4 py-3 text-red-200"
            >
              {drilldownError}{" "}
              <button
                type="button"
                onClick={refetchDrilldown}
                className="underline hover:text-white"
              >
                Retry
              </button>
            </div>
          ) : null}
          {drilldownLoading ? (
            <p className="text-slate-400">Loading properties…</p>
          ) : (
            <PropertyTable
              title={`${selectedMarket.marketName} (${selectedAirport}) — ${allProperties.length} properties`}
              properties={allProperties}
              onClose={() => setSelectedAirport(null)}
            />
          )}
        </section>
      ) : (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Properties</h2>
          <p className="text-slate-500">
            Select an airport market above to drill down into property capacity.
          </p>
        </section>
      )}
    </main>
  );
}
