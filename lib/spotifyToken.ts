// lib/spotifyToken.ts
let accessToken: string | null = null;
let tokenExpiry = 0;

export async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN!;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Missing Spotify credentials in env variables.");
  }

  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed to refresh Spotify token: ${text}`);
  }

  const data = await response.json();
  if (!data.access_token) throw new Error("No access token returned");

  const token: string = data.access_token;
  accessToken = token;
  tokenExpiry = Date.now() + data.expires_in * 1000;

  return token;
}
