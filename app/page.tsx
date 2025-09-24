"use client";
import { useEffect, useState } from "react";

interface Track {
  name: string;
  artists: string;
  url: string;
}

export default function Home() {
  const [track, setTrack] = useState<Track | null>(null);

  async function fetchTrack() {
    const res = await fetch("/api/current-track");
    const data = await res.json();
    if (!data.error && data.name) setTrack(data);
    else setTrack(null);
  }

  useEffect(() => {
    fetchTrack();
    const interval = setInterval(fetchTrack, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI!)}&scope=user-read-currently-playing`;

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <a href={spotifyAuthUrl}>
          <button>Login with Spotify</button>
        </a>
      </div>

      <div style={{ marginTop: "4rem" }}>
        {track ? (
          <a href={track.url} target="_blank" rel="noopener noreferrer">
            {track.name} - {track.artists}
          </a>
        ) : (
          <p>Nothing here</p>
        )}
      </div>
    </div>
  );
}
