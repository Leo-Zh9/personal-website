// lib/spotifyToken.ts
export const runtime = "nodejs";

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number | null = null;
let refreshToken: string | null = process.env.SPOTIFY_REFRESH_TOKEN ?? null;

type TokenResponse = {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  scope?: string;
};

/**
 * Refresh (or obtain) an access token using the stored refresh token.
 * Returns a string (the access token).
 */
export async function refreshAccessToken(): Promise<string> {
  // If we have a cached token and it's still valid (with a small margin), return it.
  if (cachedAccessToken && tokenExpiresAt && Date.now() < tokenExpiresAt - 10000) {
    return cachedAccessToken;
  }

  if (!refreshToken) {
    throw new Error("Missing SPOTIFY_REFRESH_TOKEN environment variable.");
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  if (!clientId || !clientSecret) {
    throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET environment variables.");
  }

  const creds = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${creds}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }).toString(),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to refresh Spotify token: ${res.status} ${txt}`);
  }

  const data = (await res.json()) as TokenResponse;

  if (!data.access_token) {
    throw new Error("Spotify response did not include an access_token.");
  }

  // Cache the token and expiry time
  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;

  // Spotify may return a new refresh token; if so, update the in-memory value.
  if (data.refresh_token) {
    refreshToken = data.refresh_token;
    // NOTE: if you want to persist this new refresh token, you'd need to save it
    // back to your secrets store (Vercel env vars) manually.
  }

  // Return the freshly obtained access token (definite string)
  return data.access_token;
}
