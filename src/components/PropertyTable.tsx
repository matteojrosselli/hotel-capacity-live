"use client";

import type { PropertyCapacity } from "@/lib/capacity";
import { occupancyPct } from "@/lib/capacity";

type PropertyTableProps = {
  properties: PropertyCapacity[];
  title?: string;
  onClose?: () => void;
};

export function PropertyTable({ properties, title, onClose }: PropertyTableProps) {
  return (
    <section>
      {(title || onClose) && (
        <div className="mb-4 flex items-center justify-between gap-4">
          {title ? (
            <h3 className="text-lg font-semibold">{title}</h3>
          ) : (
            <span />
          )}
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-slate-400 hover:text-slate-200"
            >
              Close
            </button>
          ) : null}
        </div>
      )}
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
  );
}
