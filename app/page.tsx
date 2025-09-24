"use client";

import { useEffect, useState } from "react";
import "./globals.css";

interface Track {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  url?: string;
  albumArt?: string;
}

export default function Home() {
  const [track, setTrack] = useState<Track>({ isPlaying: false });

  // Fetch current track from API
  const getCurrentTrack = async () => {
    try {
      const res = await fetch("/api/current-track");
      const data = await res.json();
      setTrack(data);
    } catch (err) {
      console.error("Failed to fetch track:", err);
    }
  };

  useEffect(() => {
    getCurrentTrack(); // initial fetch
    const interval = setInterval(getCurrentTrack, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Pulsing waves canvas */}
      <canvas id="waveCanvas"></canvas>

      {/* Spotify container */}
      <div id="spotify-container">
        {track.isPlaying ? (
          <>
            <img
              src={track.albumArt}
              alt="Album Art"
              style={{ width: 150, height: 150, borderRadius: 8 }}
            />
            <h2>
              <a
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "white", textDecoration: "none" }}
              >
                {track.title}
              </a>
            </h2>
            <h3>
              <a
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "white", textDecoration: "none" }}
              >
                {track.artist}
              </a>
            </h3>
          </>
        ) : (
          <h2>Nothing here</h2>
        )}
      </div>

      {/* Include your script.js */}
      <script src="/script.js"></script>
    </>
  );
}
