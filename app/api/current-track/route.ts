import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; 

// Spotify API Endpoints (Confirmed)
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";

// Environment Variables (Check if they exist)
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN; 


// --- 🌟 NEW: External BPM Lookup Function (Mocked) 🌟 ---
async function getBpmFromExternalService(title: string, artist: string): Promise<number | null> {
    // 🛑 IMPORTANT: REPLACE THIS MOCK LOGIC WITH A REAL API CALL 🛑
    // This function should take the title and artist, query an external music API (e.g., from RapidAPI),
    // and return the tempo found.
    
    console.log(`MOCK: Attempting to look up BPM for: "${title}" by ${artist}`);

    // Mocked result for development:
    const baseBPM = 120;
    
    // Simple logic to simulate variation based on song title for testing:
    if (title.toLowerCase().includes('dance') || title.toLowerCase().includes('house')) {
         return 128; // Higher BPM
    } else if (title.toLowerCase().includes('ballad') || title.toLowerCase().includes('slow')) {
         return 75; // Lower BPM
    }
    
    return baseBPM; 
}
// ----------------------------------------------------


async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token || "",
    }),
    cache: "no-store", 
  });

  return response.json();
}

export async function GET() {
  try {
    // Check if environment variables are configured
    if (!client_id || !client_secret || !refresh_token) {
      console.log("Spotify API not configured - environment variables missing");
      return NextResponse.json(
        { isPlaying: false, error: "Spotify API not configured" },
        { status: 200, headers: { "Cache-Control": "public, s-maxage=60, must-revalidate" } }
      );
    }

    // 1. Get a fresh Access Token
    const tokenResponse = await getAccessToken();
    const { access_token, error } = tokenResponse;

    if (error || !access_token) {
        console.error("Spotify Token Error:", error || "Access token missing.");
        throw new Error("Failed to refresh Spotify token. Check your environment variables.");
    }
    
    // 2. Get the currently playing track
    const nowPlayingRes = await fetch(
      NOW_PLAYING_ENDPOINT,
      {
        headers: { Authorization: `Bearer ${access_token}` },
        cache: "no-store",
      }
    );

    if (nowPlayingRes.status === 204) {
      return NextResponse.json(
        { isPlaying: false, bpm: null },
        { status: 200, headers: { "Cache-Control": "public, s-maxage=10, must-revalidate" } }
      );
    }
    
    if (nowPlayingRes.status > 400) {
        throw new Error(`Spotify Now Playing API error: ${nowPlayingRes.status}`);
    }

    const song = await nowPlayingRes.json();
    
    const title = song.item?.name;
    const artists = song.item?.artists.map((a: any) => a.name).join(", ");
    
    let bpm: number | null = null;

    // --- 3. Execute BPM lookup using Title and Artist ---
    if (title && artists) {
        bpm = await getBpmFromExternalService(title, artists);
    } else {
        console.warn("Title or Artist missing for BPM lookup.");
    }

    // 4. Map the data and include the 'bpm' field
    return NextResponse.json(
      {
        isPlaying: song.is_playing,
        bpm: bpm, // The BPM value (from external service)
        title: title,
        artist: artists,
        album: song.item?.album?.name,
        albumImageUrl: song.item?.album?.images[0]?.url,
        songUrl: song.item?.external_urls.spotify,
      },
      {
        status: 200,
        headers: { "Cache-Control": "public, s-maxage=10, must-revalidate" },
      }
    );
  } catch (err) {
    console.error("Full Spotify/BPM API call failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch track. Check logs." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
