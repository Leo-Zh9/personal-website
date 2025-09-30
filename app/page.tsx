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

const FULL_TITLE = "Leo Zhang"; 
const LETTER_DELAY_MS = 90; 
const START_DELAY_MS = 700; 
const CURSOR_PERSIST_MS = 3000; // 🚀 NEW: Cursor stays for 2 seconds (2000ms)

export default function HomePage() {
  const [track, setTrack] = useState<Track | null>(null);
  const [displayedTitle, setDisplayedTitle] = useState(''); 
  const [titleIndex, setTitleIndex] = useState(0); 
  const [animationStarted, setAnimationStarted] = useState(false); 
  const [cursorFinalHide, setCursorFinalHide] = useState(false); // 🚀 NEW: State to hide cursor

  // --- Spotify Track Fetching (Remains the same) ---
  async function fetchTrack() {
    try {
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

  // --- Typing Animation Initial Delay Logic ---
  useEffect(() => {
    const initialDelay = setTimeout(() => {
        setAnimationStarted(true);
    }, START_DELAY_MS);

    return () => clearTimeout(initialDelay);
  }, []); 

  // --- Typing Animation Core Logic ---
  useEffect(() => {
    if (animationStarted && titleIndex < FULL_TITLE.length) {
      const typingTimeout = setTimeout(() => {
        setDisplayedTitle(prev => prev + FULL_TITLE[titleIndex]);
        setTitleIndex(prev => prev + 1);
      }, LETTER_DELAY_MS);

      return () => clearTimeout(typingTimeout);
    }
    
    // 🚀 NEW: Logic to start cursor final hide timer
    if (titleIndex === FULL_TITLE.length) {
        const finalTimeout = setTimeout(() => {
            setCursorFinalHide(true);
        }, CURSOR_PERSIST_MS);
        return () => clearTimeout(finalTimeout);
    }
  }, [titleIndex, animationStarted]);

  // Determine the class based on typing status and the new cursor hide state
  let cursorClass = 'typing-inactive';
  if (animationStarted && titleIndex < FULL_TITLE.length) {
      cursorClass = 'typing-active'; // Typing is happening
  } else if (titleIndex === FULL_TITLE.length && !cursorFinalHide) {
      cursorClass = 'typing-active'; // Typing finished, but cursor is persisting
  } else {
      cursorClass = 'typing-done'; // Typing finished, and persistence time is over
  }

  return (
    <>
      {/* Title with typing animation. Using the dynamically determined class. */}
      <h1 id="main-title" className={cursorClass}>
        {displayedTitle}
      </h1>

      {/* Canvas for waves - Repositioned via globals.css */}
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