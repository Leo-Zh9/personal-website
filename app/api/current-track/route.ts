// app/api/current-track/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/spotifyToken";

export async function GET(req: NextRequest) {
  try {
    const token = await getAccessToken();

    // Fetch the most recently played track
    const res = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Spotify API error: ${res.status} ${text}`);
    }

    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ isPlaying: false });
    }

    const track = data.items[0].track;

    return NextResponse.json({
      isPlaying: true,
      title: track.name,
      artist: track.artists.map((a: any) => a.name).join(", "),
      url: track.external_urls.spotify,
      albumArt: track.album.images[0]?.url ?? "",
    });
  } catch (err: any) {
    console.error("Error fetching track:", err);
    return NextResponse.json({ error: "Failed to fetch track" }, { status: 500 });
  }
}
