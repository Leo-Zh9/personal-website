// /api/current-track/route.ts

import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; 

// Spotify API Endpoints
// Use these actual endpoints (the previous URLs were placeholders)
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";

// Environment Variables
// These values are read automatically by Next.js/Vercel from your .env.local file
// (for local testing) or Vercel Environment Variables (for deployment).
const client_id = process.env.SPOTIFY_CLIENT_ID!;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET!;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN!; 

// Function to exchange the Refresh Token for a new Access Token
async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      // Base64 encode the Client ID and Client Secret
      Authorization:
        "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token,
    }),
    // Ensure this request is always fresh and not cached by Next.js/Vercel
    cache: "no-store", 
  });

  return response.json();
}

export async function GET() {
  try {
    // 1. Get a fresh Access Token using the Refresh Token
    const tokenResponse = await getAccessToken();
    const { access_token, error } = tokenResponse;

    // Check for an error in the token response (e.g., bad refresh token)
    if (error) {
        console.error("Spotify Token Error:", error);
        throw new Error("Failed to refresh Spotify token.");
    }
    
    // 2. Use the Access Token to get the currently playing track
    const nowPlayingRes = await fetch(
      NOW_PLAYING_ENDPOINT,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        // Ensure this request is always fresh and not cached
        cache: "no-store",
      }
    );

    // Status 204: No content (Spotify account is not playing anything)
    if (nowPlayingRes.status === 204) {
      return NextResponse.json(
        { isPlaying: false },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=10, must-revalidate", 
          },
        }
      );
    }
    
    // Status > 400: General API error (e.g., invalid access token)
    if (nowPlayingRes.status > 400) {
        throw new Error(`Spotify Now Playing API error: ${nowPlayingRes.status}`);
    }

    const song = await nowPlayingRes.json();

    // 3. Map the raw Spotify data to your simplified Track interface
    return NextResponse.json(
      {
        isPlaying: song.is_playing,
        title: song.item?.name,
        // Map all artists and join them with a comma
        artist: song.item?.artists.map((a: any) => a.name).join(", "),
        album: song.item?.album?.name,
        albumImageUrl: song.item?.album?.images[0]?.url,
        songUrl: song.item?.external_urls.spotify,
      },
      {
        status: 200,
        headers: {
          // Setting the cache header tells Vercel/CDN that this response is fresh for 10 seconds.
          // This reduces the serverless function invocations while still meeting your 10s refresh rate.
          "Cache-Control": "public, s-maxage=10, must-revalidate", 
        },
      }
    );
  } catch (err) {
    console.error("Full Spotify API call failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch track. Check Vercel logs." },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}