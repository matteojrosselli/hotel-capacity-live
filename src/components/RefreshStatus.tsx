"use client";

type RefreshStatusProps = {
  source: string | null;
  lastFetched: Date | null;
  cachedAt: string | null;
  pollMs: number;
  loading: boolean;
  onRefresh: () => void;
};

function formatTime(date: Date | null, iso: string | null): string {
  const d = date ?? (iso ? new Date(iso) : null);
  if (!d || Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

export function RefreshStatus({
  source,
  lastFetched,
  cachedAt,
  pollMs,
  loading,
  onRefresh,
}: RefreshStatusProps) {
  const pollMinutes = Math.round(pollMs / 60_000);

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
      <span className="rounded-full border border-slate-700 bg-slate-800/80 px-3 py-1">
        Source: <span className="font-medium text-slate-200">{source ?? "…"}</span>
      </span>
      <span>
        Updated {formatTime(lastFetched, cachedAt)}
        {pollMinutes > 0 ? ` · auto-refresh every ${pollMinutes} min` : null}
      </span>
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="rounded-lg border border-sky-700/60 bg-sky-950/40 px-3 py-1 text-sky-300 transition hover:bg-sky-900/50 disabled:opacity-50"
      >
        {loading ? "Refreshing…" : "Refresh now"}
      </button>
    </div>
  );
}
