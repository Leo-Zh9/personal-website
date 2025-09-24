import { NextResponse } from "next/server";
import { accessToken } from "../spotifyToken";

export async function GET() {
  if (!accessToken) {
    return NextResponse.json({
      error: "No access token. Visit /api/callback after Spotify authorization.",
    });
  }

  const response = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (response.status === 204) {
    return NextResponse.json({ message: "No song currently playing." });
  }

  const data = await response.json();
  return NextResponse.json(data);
}
