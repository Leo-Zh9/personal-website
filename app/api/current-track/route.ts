// app/api/current-track/route.ts
import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/spotifyToken";

export const runtime = "nodejs";

export async function GET() {
  try {
    const token = await getAccessToken();

    const res = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 204) {
      // nothing playing
      return NextResponse.json({ message: "No track playing" });
    }

    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Spotify API error ${res.status}: ${txt}`);
    }

    const data = await res.json();
    // Return the raw Spotify data so your script.js can consume data.item etc.
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
