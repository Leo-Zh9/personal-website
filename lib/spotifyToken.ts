// lib/spotifyToken.ts
let accessToken: string | null = null;
let refreshToken: string | null = null;
let tokenExpiresAt: number | null = null;

export function setTokens(newAccessToken: string, newRefreshToken: string, expiresIn: number) {
  accessToken = newAccessToken;
  refreshToken = newRefreshToken;
  tokenExpiresAt = Date.now() + expiresIn * 1000;
}

export async function refreshAccessToken() {
  if (!refreshToken) throw new Error("No refresh token set.");

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { 
      Authorization: `Basic ${credentials}`, 
      "Content-Type": "application/x-www-form-urlencoded" 
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();
  if (!data.access_token) throw new Error("Failed to refresh Spotify token");

  accessToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in ?? 3600) * 1000;
}

export async function getAccessToken(): Promise<string> {
  if (!accessToken || !tokenExpiresAt || Date.now() >= tokenExpiresAt) {
    await refreshAccessToken();
  }
  return accessToken!;
}

export async function getCurrentlyPlaying() {
  const token = await getAccessToken();
  const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 204) return null; // nothing playing
  if (!res.ok) throw new Error("Failed to fetch currently playing track");
  return res.json();
}
