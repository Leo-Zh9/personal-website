import { NextResponse } from "next/server";
import { setTokens } from "@/lib/spotifyToken";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "No code provided" }, { status: 400 });

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { 
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}` 
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await response.json();
  setTokens(data.access_token, data.refresh_token, data.expires_in);

  return NextResponse.redirect("/"); // go back to homepage
}
