"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Dynamically add CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/style.css";
    document.head.appendChild(link);

    // Dynamically add JS
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
    <div>
      {/* Spotify Track Info */}
      <div
        id="spotify-container"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          zIndex: 10, // ensure above canvas
          textAlign: "center",
          textShadow: "0 0 10px black",
        }}
      >
        <div id="track-info">
          <p id="track-name">Loading...</p>
          <p id="track-artist"></p>
          {/* Optional album image */}
          {/* <img id="track-album" alt="Album Art" /> */}
        </div>
      </div>

      {/* Canvas for pulsing waves */}
      <canvas
        id="waveCanvas"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
      ></canvas>
    </div>
  );
}
