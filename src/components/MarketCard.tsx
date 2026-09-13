"use client";

import type { MarketCapacity } from "@/lib/capacity";

type MarketCardProps = {
  market: MarketCapacity;
  selected: boolean;
  onSelect: (airportCode: string) => void;
};

export function MarketCard({ market, selected, onSelect }: MarketCardProps) {
  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onSelect(market.airportCode)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(market.airportCode);
        }
      }}
      className={`cursor-pointer rounded-xl border p-5 transition ${
        selected
          ? "border-sky-400 bg-sky-950/30 ring-1 ring-sky-400/50"
          : "border-slate-700 bg-slate-800/60 hover:border-slate-600"
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-lg font-semibold">{market.marketName}</h3>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sky-400">{market.airportCode}</span>
          <span className="text-slate-500" aria-hidden>
            ›
          </span>
        </div>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-slate-400">Properties</dt>
          <dd className="text-lg font-medium">{market.properties}</dd>
        </div>
        <div>
          <dt className="text-slate-400">Occupancy</dt>
          <dd className="text-lg font-medium">{market.occupancyPct}%</dd>
        </div>
        <div>
          <dt className="text-slate-400">Available</dt>
          <dd className="text-lg font-medium">
            {market.roomsAvailable.toLocaleString()}
          </dd>
        </div>
        <div>
          <dt className="text-slate-400">Total rooms</dt>
          <dd className="text-lg font-medium">
            {market.roomsTotal.toLocaleString()}
          </dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-slate-500">
        As of {new Date(market.asOf).toLocaleString()}
      </p>
    </article>
  );
}

export function MarketCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-700 bg-slate-800/40 p-5">
      <div className="h-5 w-2/3 rounded bg-slate-700" />
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="h-10 rounded bg-slate-700/80" />
        <div className="h-10 rounded bg-slate-700/80" />
        <div className="h-10 rounded bg-slate-700/80" />
        <div className="h-10 rounded bg-slate-700/80" />
      </div>
    </div>
  );
}
