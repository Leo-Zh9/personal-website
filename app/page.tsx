"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    // Dynamically load your script from public/
    const script = document.createElement("script");
    script.src = "/script.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <canvas id="waveCanvas"></canvas>

      <div id="spotify-container">
        <h1 id="track-name">Loading...</h1>
        <h2 id="track-artist"></h2>
        <img
          id="track-album"
          src=""
          alt="Album cover"
          width="300"
          height="300"
        />
      </div>
    </div>
  );
}
