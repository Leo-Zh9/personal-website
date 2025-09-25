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
    const res = await fetch(`${window.location.origin}/current-track`);
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
      {/* Canvas for waves */}
      <canvas id="waveCanvas" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />

      {/* Spotify overlay */}
      <div
        id="spotify-container"
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        {track ? (
          <a
            href={track.songUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <img
              src={track.albumImageUrl}
              alt={track.title}
              width={64}
              height={64}
              style={{ borderRadius: 8 }}
            />
            <div>
              <div style={{ fontWeight: 'bold' }}>{track.title}</div>
              <div>{track.artist}</div>
            </div>
          </a>
        ) : (
          <div>Not playing anything right now 🎧</div>
        )}
      </div>

      {/* Include your waves animation */}
      <script src="./script.js"></script>
    </>
  );
}
