import React from "react";
import Script from "next/script";

const HomePage = () => {
  return (
    <div>
      {/* Waves Canvas */}
      <canvas id="waveCanvas"></canvas>

      {/* Spotify Track Info */}
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

      {/* Load your CSS */}
      <link rel="stylesheet" href="/style.css" />

      {/* Load your JS */}
      <Script src="/script.js" strategy="afterInteractive" />
    </div>
  );
};

export default HomePage;
