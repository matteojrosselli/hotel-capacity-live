import {
  getMockMarketCapacity,
  getMockPropertyCapacity,
  occupancyPct,
} from "@/lib/capacity";

export default function HomePage() {
  const properties = getMockPropertyCapacity();
  const markets = getMockMarketCapacity();

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-8">
      <header className="mb-10">
        <p className="text-sm font-medium uppercase tracking-widest text-sky-400">
          Bootstrap
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
          Hotel Capacity Live
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          Live room capacity by property and airport market. Mock data until
          connectors are added via{" "}
          <code className="rounded bg-slate-800 px-1.5 py-0.5 text-sky-300">
            /propose
          </code>
          .
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">Airport markets</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {markets.map((market) => (
            <article
              key={market.airportCode}
              className="rounded-xl border border-slate-700 bg-slate-800/60 p-5"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold">{market.marketName}</h3>
                <span className="font-mono text-sky-400">{market.airportCode}</span>
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
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Properties</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-700">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-800/80 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Market</th>
                <th className="px-4 py-3 font-medium">Available</th>
                <th className="px-4 py-3 font-medium">Sold</th>
                <th className="px-4 py-3 font-medium">Occupancy</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr
                  key={property.propertyId}
                  className="border-t border-slate-700/80"
                >
                  <td className="px-4 py-3 font-medium">{property.name}</td>
                  <td className="px-4 py-3 font-mono text-sky-400">
                    {property.airportCode}
                  </td>
                  <td className="px-4 py-3">{property.roomsAvailable}</td>
                  <td className="px-4 py-3">{property.roomsSold}</td>
                  <td className="px-4 py-3">
                    {occupancyPct(property.roomsAvailable, property.roomsTotal)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
