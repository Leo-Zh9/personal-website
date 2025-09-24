// lib/spotifyToken.ts
// import fetch;

let cachedToken: string | null = null;
let tokenExpiresAt: number | null = null;

export async function getAccessToken(): Promise<string> {
  // Return cached token if it's still valid
  if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Spotify client ID or client secret in environment variables.");
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Spotify token request failed: ${response.status} ${text}`);
  }

  const data: { access_token?: string; expires_in?: number } = await response.json();

  if (!data.access_token) {
    throw new Error("Spotify access token not found in response.");
  }

  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in ?? 3600) * 1000; // default 1 hour

  return cachedToken;
}
