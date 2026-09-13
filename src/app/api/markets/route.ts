import { NextResponse } from "next/server";
import { getMarkets } from "@/lib/capacity-cache";
import type { ApiError } from "@/lib/api-types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const force = new URL(request.url).searchParams.get("refresh") === "1";

  try {
    const payload = await getMarkets(force);
    return NextResponse.json(payload, {
      headers: { "Cache-Control": "private, max-age=60" },
    });
  } catch (error) {
    const body: ApiError = {
      error:
        error instanceof Error ? error.message : "Failed to load markets",
    };
    return NextResponse.json(body, { status: 500 });
  }
}
