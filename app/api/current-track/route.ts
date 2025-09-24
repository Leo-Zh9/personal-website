import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/spotifyToken";

export async function GET() {
  try {
    const token = await getAccessToken();

    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return NextResponse.json({ message: "No song currently playing" });
    }

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: "Spotify API error", details: text }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      track: data.item.name,
      artist: data.item.artists.map((a: any) => a.name).join(", "),
      album: data.item.album.name,
      albumCover: data.item.album.images[0].url,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
