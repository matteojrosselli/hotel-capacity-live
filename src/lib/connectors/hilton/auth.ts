type TokenCache = {
  accessToken: string;
  expiresAtMs: number;
};

let cachedToken: TokenCache | null = null;

export type HiltonAuthConfig = {
  clientId: string;
  clientSecret: string;
  apiBase: string;
  fetchImpl?: typeof fetch;
};

export function getHiltonAuthConfig(): HiltonAuthConfig | null {
  const clientId = process.env.HILTON_CLIENT_ID;
  const clientSecret = process.env.HILTON_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  return {
    clientId,
    clientSecret,
    apiBase:
      process.env.HILTON_API_BASE?.replace(/\/$/, "") ??
      "https://kapip-s.hilton.io",
  };
}

export function clearHiltonTokenCache(): void {
  cachedToken = null;
}

export async function getHiltonAccessToken(
  config: HiltonAuthConfig,
): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAtMs > now + 30_000) {
    return cachedToken.accessToken;
  }

  const fetchImpl = config.fetchImpl ?? fetch;
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: config.clientId,
    client_secret: config.clientSecret,
  });

  const response = await fetchImpl(
    `${config.apiBase}/hospitality-partner/v2/realms/applications/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Hilton OAuth failed (${response.status}): ${text.slice(0, 200)}`,
    );
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in?: number;
  };

  cachedToken = {
    accessToken: data.access_token,
    expiresAtMs: now + (data.expires_in ?? 3600) * 1000,
  };

  return cachedToken.accessToken;
}
