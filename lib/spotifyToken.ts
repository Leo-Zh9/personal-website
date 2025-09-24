// lib/spotifyToken.ts
// Helper to refresh / cache an access token using the stored refresh token.

let cachedAccessToken: string | null = null;
let tokenExpiresAt: number | null = null;
let refreshToken: string | null = process.env.SPOTIFY_REFRESH_TOKEN ?? null;

type TokenResponse = {
  access_token?: string;
  expires_in?: number;
  refresh_token?: string;
};

export async function refreshAccessToken(): Promise<string> {
  // If we have a cached token that is still valid (10s safety margin), return it.
  if (cachedAccessToken && tokenExpiresAt && Date.now() < tokenExpiresAt - 10000) {
    return cachedAccessToken;
  }

  if (!refreshToken) {
    throw new Error("Missing SPOTIFY_REFRESH_TOKEN in environment variables.");
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in environment variables.");
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
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Failed to refresh Spotify token: ${res.status} ${txt}`);
  }

  const data = (await res.json()) as TokenResponse;

  const newAccess = data.access_token;
  if (!newAccess) throw new Error("Spotify refresh response did not include access_token.");

  // Cache and compute expiry
  cachedAccessToken = newAccess;
  tokenExpiresAt = Date.now() + ((data.expires_in ?? 3600) * 1000);

  // Spotify may rotate the refresh token; update it in memory (do not write to disk or git)
  if (data.refresh_token) {
    refreshToken = data.refresh_token;
    // NOTE: if Spotify returns a new refresh token and you want it persisted,
    // copy it and update your Vercel env variable manually.
  }

  // Return the fresh access token (definite string)
  return newAccess;
}
