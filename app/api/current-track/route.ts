import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/spotifyToken";

export async function GET(req: NextRequest) {
  try {
    const token = await getAccessToken();

    const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 204) {
      // Nothing is currently playing
      return NextResponse.json({ isPlaying: false });
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Spotify API error: ${res.status} ${text}`);
    }

    const data = await res.json();

    if (!data.item) return NextResponse.json({ isPlaying: false });

    const track = data.item;

    return NextResponse.json({
      isPlaying: data.is_playing,
      title: track.name,
      artist: track.artists.map((a: any) => a.name).join(", "),
      url: track.external_urls.spotify,
      albumArt: track.album.images[0]?.url ?? "",
    });
  } catch (err: any) {
    console.error("Error fetching current track:", err);
    return NextResponse.json({ isPlaying: false, error: "Failed to fetch track" }, { status: 500 });
  }
}
