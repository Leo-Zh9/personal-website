// app/api/current-track/route.ts
import { NextResponse } from "next/server";
import { refreshAccessToken } from "@/lib/spotifyToken";

export async function GET() {
  try {
    const accessToken = await refreshAccessToken();

    const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (res.status === 204 || res.status > 400) {
      return NextResponse.json({ isPlaying: false }, { status: 200 });
    }

    const song = await res.json();
    const track = {
      isPlaying: true,
      title: song.item?.name || "Unknown",
      artist: song.item?.artists?.map((a: any) => a.name).join(", ") || "Unknown",
      url: song.item?.external_urls?.spotify || "",
      albumArt: song.item?.album?.images?.[0]?.url || "",
    };

    return NextResponse.json(track, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching current track:", error);
    return NextResponse.json({ error: "Failed to fetch track" }, { status: 500 });
  }
}
