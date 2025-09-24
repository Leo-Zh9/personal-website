// lib/spotifyToken.ts
let accessToken: string | null = null;
let refreshToken: string | null = null;
let tokenExpiry = 0;

export async function refreshAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN!;

  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authString}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();

  accessToken = data.access_token;
  tokenExpiry = Date.now() + data.expires_in * 1000;

  // Only update refreshToken if Spotify returns a new one
  if (data.refresh_token) {
    refreshToken = data.refresh_token;
  }

  return accessToken!;
}
