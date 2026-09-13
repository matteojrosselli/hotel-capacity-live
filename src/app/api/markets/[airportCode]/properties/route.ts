import { NextResponse } from "next/server";
import { getPropertiesByAirport } from "@/lib/capacity-cache";
import type { ApiError } from "@/lib/api-types";
import { normalizeAirportCode } from "@/lib/airport-code";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ airportCode: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const { airportCode: rawCode } = await context.params;
  const code = normalizeAirportCode(rawCode);

  if (!code) {
    const body: ApiError = {
      error: "Invalid airport code; expected 3-letter IATA code",
      code: "INVALID_AIRPORT_CODE",
    };
    return NextResponse.json(body, { status: 400 });
  }

  const force = new URL(request.url).searchParams.get("refresh") === "1";

  try {
    const payload = await getPropertiesByAirport(code, force);
    if (payload.properties.length === 0) {
      const body: ApiError = {
        error: "Unknown market",
        code: "MARKET_NOT_FOUND",
      };
      return NextResponse.json(body, { status: 404 });
    }

    return NextResponse.json(
      {
        airportCode: code,
        properties: payload.properties,
        source: payload.source,
        cachedAt: payload.cachedAt,
      },
      { headers: { "Cache-Control": "private, max-age=60" } },
    );
  } catch (error) {
    const body: ApiError = {
      error:
        error instanceof Error ? error.message : "Failed to load properties",
    };
    return NextResponse.json(body, { status: 500 });
  }
}
