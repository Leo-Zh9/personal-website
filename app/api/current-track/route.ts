import { NextResponse } from "next/server";
import { getCurrentlyPlaying } from "@/lib/spotifyToken";

export async function GET() {
  try {
    const data = await getCurrentlyPlaying();
    if (!data) return NextResponse.json({ message: "Nothing here" });
    
    const track = {
      name: data.item.name,
      artists: data.item.artists.map((a: any) => a.name).join(", "),
      url: data.item.external_urls.spotify,
    };

    return NextResponse.json(track);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
