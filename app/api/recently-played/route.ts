import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; 

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const RECENTLY_PLAYED_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played?limit=5";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token || "",
    }),
    cache: "no-store",
  });

  return response.json();
}

export async function GET() {
  try {
    if (!client_id || !client_secret || !refresh_token) {
      console.log("Spotify API not configured - environment variables missing");
      return NextResponse.json(
        { tracks: [], error: "Spotify API not configured" },
        { status: 200, headers: { "Cache-Control": "public, s-maxage=60, must-revalidate" } }
      );
    }

    const tokenResponse = await getAccessToken();
    const { access_token, error } = tokenResponse;

    if (error || !access_token) {
      console.error("Spotify Token Error:", error || "Access token missing.");
      throw new Error("Failed to refresh Spotify token.");
    }

    const recentlyPlayedRes = await fetch(
      RECENTLY_PLAYED_ENDPOINT,
      {
        headers: { Authorization: `Bearer ${access_token}` },
        cache: "no-store",
      }
    );

    if (recentlyPlayedRes.status > 400) {
      throw new Error(`Spotify Recently Played API error: ${recentlyPlayedRes.status}`);
    }

    const data = await recentlyPlayedRes.json();
    
    const tracks = data.items?.map((item: any) => ({
      title: item.track?.name,
      artist: item.track?.artists?.map((a: any) => a.name).join(", "),
      playedAt: item.played_at,
      albumImageUrl: item.track?.album?.images[2]?.url || item.track?.album?.images[0]?.url,
      songUrl: item.track?.external_urls?.spotify,
    })) || [];

    return NextResponse.json(
      { tracks },
      {
        status: 200,
        headers: { "Cache-Control": "public, s-maxage=30, must-revalidate" },
      }
    );
  } catch (err) {
    console.error("Recently played API call failed:", err);
    return NextResponse.json(
      { tracks: [], error: "Failed to fetch recently played tracks" },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

