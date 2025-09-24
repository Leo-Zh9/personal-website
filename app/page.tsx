"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Dynamically add the CSS file
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/style.css";
    document.head.appendChild(link);

    // Dynamically add the JS file
    const script = document.createElement("script");
    script.src = "/script.js";
    script.async = true;
    document.body.appendChild(script);

    // Clean up on unmount
    return () => {
      document.head.removeChild(link);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="spotify-container">
      <div id="track-info">
        <p id="track-name">Loading...</p>
        <p id="track-artist"></p>
        {/* Optional: album image */}
        {/* <img id="track-album" alt="Album Art" /> */}
      </div>
      {/* Canvas for waves */}
      <canvas id="waveCanvas"></canvas>
    </div>
  );
}
