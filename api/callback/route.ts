import { NextRequest, NextResponse } from "next/server";
import { setAccessToken } from "../spotifyToken";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: code,
    redirect_uri: process.env.REDIRECT_URI!,
    client_id: process.env.SPOTIFY_CLIENT_ID!,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET!,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const data = await response.json();

  setAccessToken(data.access_token);

  return NextResponse.json({
    message: "Access token saved!",
    data,
  });
}
