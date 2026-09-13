import type { MarketCapacity, PropertyCapacity } from "@/lib/capacity";

export type MarketsResponse = {
  markets: MarketCapacity[];
  source: string;
  cachedAt: string;
};

export type PropertiesResponse = {
  airportCode: string;
  properties: PropertyCapacity[];
  source: string;
  cachedAt: string;
};

export type ApiError = {
  error: string;
  code?: string;
};
