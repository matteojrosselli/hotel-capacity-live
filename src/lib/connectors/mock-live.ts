import type { PropertyCapacity } from "@/lib/capacity";
import type { CapacityConnector } from "./types";

type SeedProperty = Omit<PropertyCapacity, "asOf">;

const SEED: SeedProperty[] = [
  {
    propertyId: "prop-ord-001",
    name: "Loop Tower Hotel",
    airportCode: "ORD",
    roomsTotal: 420,
    roomsAvailable: 87,
    roomsSold: 333,
  },
  {
    propertyId: "prop-ord-002",
    name: "O'Hare Gateway Inn",
    airportCode: "ORD",
    roomsTotal: 280,
    roomsAvailable: 52,
    roomsSold: 228,
  },
  {
    propertyId: "prop-lax-001",
    name: "Westside Grand",
    airportCode: "LAX",
    roomsTotal: 310,
    roomsAvailable: 41,
    roomsSold: 269,
  },
  {
    propertyId: "prop-lax-002",
    name: "LAX Skyline Suites",
    airportCode: "LAX",
    roomsTotal: 195,
    roomsAvailable: 28,
    roomsSold: 167,
  },
  {
    propertyId: "prop-jfk-001",
    name: "JFK Harbor Hotel",
    airportCode: "JFK",
    roomsTotal: 360,
    roomsAvailable: 64,
    roomsSold: 296,
  },
];

export type RandomFn = () => number;

function defaultRandom(): number {
  return Math.random();
}

/** Applies bounded drift to availability for demo polling. */
export function applyMockDrift(
  seed: SeedProperty[],
  random: RandomFn = defaultRandom,
): PropertyCapacity[] {
  const asOf = new Date().toISOString();
  return seed.map((row) => {
    const delta = Math.floor(random() * 11) - 5;
    const roomsAvailable = Math.min(
      row.roomsTotal,
      Math.max(0, row.roomsAvailable + delta),
    );
    return {
      ...row,
      roomsAvailable,
      roomsSold: row.roomsTotal - roomsAvailable,
      asOf,
    };
  });
}

export function createMockLiveConnector(
  random: RandomFn = defaultRandom,
): CapacityConnector {
  return {
    id: "mock-live",
    label: "Mock Live",
    async fetchProperties() {
      return applyMockDrift(SEED, random);
    },
  };
}

export const mockLiveConnector = createMockLiveConnector();
