import { NextResponse } from "next/server";

const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN!;

async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });

  return response.json();
}

export async function GET() {
  try {
    const { access_token } = await getAccessToken();

    const nowPlayingRes = await fetch(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (nowPlayingRes.status === 204 || nowPlayingRes.status > 400) {
      return NextResponse.json({ isPlaying: false });
    }

    const song = await nowPlayingRes.json();

    return NextResponse.json({
      isPlaying: song.is_playing,
      title: song.item?.name,
      artist: song.item?.artists.map((a: any) => a.name).join(", "),
      album: song.item?.album?.name,
      albumImageUrl: song.item?.album?.images[0]?.url,
      songUrl: song.item?.external_urls.spotify,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch track" }, { status: 500 });
  }
}
