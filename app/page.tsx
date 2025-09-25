'use client';

import { useEffect, useState } from 'react';
// import './public/style.css';

interface Track {
  name: string;
  artists: { name: string }[];
  album: { images: { url: string }[] };
}

export default function HomePage() {
  const [track, setTrack] = useState<Track | null>(null);

  // Fetch currently playing track from API
  async function fetchTrack() {
    try {
      const res = await fetch('/api/current-track');
      const data = await res.json();

      if (!data.error && data.item) {
        setTrack(data.item);
      } else {
        setTrack(null);
      }
    } catch (err) {
      console.error('Error fetching Spotify track:', err);
      setTrack(null);
    }
  }

  // Fetch track on mount and every 10 seconds
  useEffect(() => {
    fetchTrack();
    const interval = setInterval(fetchTrack, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Canvas for pulsing waves */}
      <canvas id="waveCanvas"></canvas>

      {/* Spotify track info */}
      <div id="spotify-container">
        {track ? (
          <>
            <img
              src={track.album.images[0].url}
              alt={track.name}
              style={{ width: 150, height: 150 }}
            />
            <h2 id="track-name">{track.name}</h2>
            <h3 id="track-artist">
              {track.artists.map(a => a.name).join(', ')}
            </h3>
          </>
        ) : (
          <h2>No track playing</h2>
        )}
      </div>

      {/* Include your waves script */}
      <script src="./script.js"></script>
    </>
  );
}
