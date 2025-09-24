// app/api/login/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const redirectUri = process.env.REDIRECT_URI!;
  const scope = "user-read-currently-playing user-read-playback-state";

  const authUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
  }).toString()}`;

  return NextResponse.redirect(authUrl);
}
