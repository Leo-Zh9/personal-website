import React, { useEffect } from "react";

const HomePage = () => {
  useEffect(() => {
    import("../public/script.js");
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

      <link rel="stylesheet" href="/style.css" />
    </div>
  );
};

export default HomePage;
