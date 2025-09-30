'use client';

import { useEffect, useState } from 'react';

interface Track {
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  isPlaying: boolean;
}

export default function HomePage() {
  const [track, setTrack] = useState<Track | null>(null);

  async function fetchTrack() {
    try {
      // Updated fetch URL
      const res = await fetch(`${window.location.origin}/api/current-track`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      console.log("Spotify API returned:", data);

      if (data.isPlaying) setTrack(data);
      else setTrack(null);
    } catch (err) {
      console.error('Error fetching Spotify track:', err);
      setTrack(null);
    }
  }

  useEffect(() => {
    fetchTrack();
    const interval = setInterval(fetchTrack, 10000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* 🚀 NEW: Title with ID, now styled by globals.css */}
      <h1 id="main-title">
        Hi! 
      </h1>

      {/* Canvas for waves - Repositioned via globals.css to be below the title */}
      <canvas
        id="waveCanvas"
        style={{ zIndex: 0 }} 
      />

      {/* Spotify overlay - Positioned at bottom-left via CSS */}
      <div id="spotify-container">
        {track ? (
          // The entire block is the link <a>
          <a
            href={track.songUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* 1. Album Cover */}
            <img
              id="track-album"
              src={track.albumImageUrl}
              alt={track.title}
            />
            
            {/* 2. Text is placed below the image and is reformatted and italicized */}
            <div id="track-details-text"> 
              <span id="listening-prefix">Now listening to: </span>
              <span id="track-title-formatted">{track.title}</span>
              <span id="artist-formatted"> ({track.artist})</span>
            </div>
          </a>
        ) : (
          <div>Not playing anything right now...</div>
        )}
      </div>

      {/* Include your waves animation */}
      <script src="./script.js"></script>
    </>
  );
}