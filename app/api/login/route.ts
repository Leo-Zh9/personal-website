// lib/spotifyToken.ts
let cachedAccessToken: string | null = null;
let accessTokenExpiresAt: number | null = null;

/**
 * Refreshes access token using the stored refresh token (from env).
 * Caches the access token in memory until expiry.
 */
export async function refreshAccessToken(): Promise<void> {
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!refreshToken) throw new Error("Missing SPOTIFY_REFRESH_TOKEN in environment.");

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
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
    const text = await res.text();
    throw new Error(`Failed to refresh token: ${res.status} ${text}`);
  }

  const data = await res.json();
  if (!data.access_token) throw new Error("No access_token in refresh response");

  cachedAccessToken = data.access_token;
  accessTokenExpiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;
}

/**
 * Returns a valid access token (refreshes if expired or missing).
 */
export async function getAccessToken(): Promise<string> {
  // keep a small safety margin (10s)
  if (cachedAccessToken && accessTokenExpiresAt && Date.now() < accessTokenExpiresAt - 10000) {
    return cachedAccessToken;
  }
  await refreshAccessToken();
  return cachedAccessToken!;
}
