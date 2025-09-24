import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/spotifyToken";

export async function GET() {
  try {
    const token = await getAccessToken();

    // Replace with your Spotify username
    const userId = "YOUR_SPOTIFY_USERNAME";

    // Fetch latest public playlist
    const res = await fetch(
      `https://api.spotify.com/v1/users/${userId}/playlists?limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (!res.ok) throw new Error("Failed to fetch Spotify playlists");
    const data = await res.json();

    if (!data.items || data.items.length === 0)
      return NextResponse.json({ message: "Nothing here" });

    const latestPlaylist = data.items[0];

    // Fetch first track of playlist
    const tracksRes = await fetch(latestPlaylist.tracks.href, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const tracksData = await tracksRes.json();

    if (!tracksData.items || tracksData.items.length === 0)
      return NextResponse.json({ message: "Nothing here" });

    const trackItem = tracksData.items[0].track;
    const track = {
      name: trackItem.name,
      artists: trackItem.artists.map((a: any) => a.name).join(", "),
      url: trackItem.external_urls.spotify,
    };

    return NextResponse.json(track);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
