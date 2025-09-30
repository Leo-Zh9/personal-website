// page.tsx (FINAL — BPM removed, artist removed)

'use client';

import { useEffect, useState } from 'react';
import Script from "next/script";

// --- Interface without BPM ---
interface Track {
  title: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  isPlaying: boolean;
}

const FULL_TITLE = "Welcome!"; 
const LETTER_DELAY_MS = 90; 
const START_DELAY_MS = 700; 
const CURSOR_PERSIST_MS = 3000; 

export default function HomePage() {
  const [track, setTrack] = useState<Track | null>(null);
  const [displayedTitle, setDisplayedTitle] = useState(''); 
  const [titleIndex, setTitleIndex] = useState(0); 
  const [animationStarted, setAnimationStarted] = useState(false); 
  const [cursorFinalHide, setCursorFinalHide] = useState(false); 

  // --- Spotify Track Fetching ---
  async function fetchTrack() {
    try {
      const res = await fetch(`/api/current-track`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data: Track = await res.json();
      if (data.isPlaying && data.title) {
        setTrack(data);
      } else {
        setTrack(null);
      }
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

  // --- Typing Animation Logic ---
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      setAnimationStarted(true);
    }, START_DELAY_MS);
    return () => clearTimeout(initialDelay);
  }, []); 

  useEffect(() => {
    if (animationStarted && titleIndex < FULL_TITLE.length) {
      const typingTimeout = setTimeout(() => {
        setDisplayedTitle(prev => prev + FULL_TITLE[titleIndex]);
        setTitleIndex(prev => prev + 1);
      }, LETTER_DELAY_MS);
      return () => clearTimeout(typingTimeout);
    }
    
    if (titleIndex === FULL_TITLE.length) {
      const finalTimeout = setTimeout(() => {
        setCursorFinalHide(true);
      }, CURSOR_PERSIST_MS);
      return () => clearTimeout(finalTimeout);
    }
  }, [titleIndex, animationStarted]);

  // Determine the cursor class
  let cursorClass = 'typing-inactive';
  if (animationStarted && titleIndex < FULL_TITLE.length) {
    cursorClass = 'typing-active';
  } else if (titleIndex === FULL_TITLE.length && !cursorFinalHide) {
    cursorClass = 'typing-active';
  } else {
    cursorClass = 'typing-done';
  }
  
  // --- Render Logic Setup ---
  let trackDetailsContent: React.ReactNode;

  if (track) {
    trackDetailsContent = (
      <a
        href={track.songUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* 1. Album Cover */}
        <img
          id="track-album"
          src={track.albumImageUrl}
          alt={`${track.title} album cover`}
        />
        
        {/* 2. Text — artist removed */}
        <div id="track-details-text">
          <span id="listening-prefix">Now listening to: </span>
          <span id="track-title-formatted">{track.title}</span>
        </div>
      </a>
    );
  } else {
    // Text when nothing is playing
    trackDetailsContent = (
      <div id="track-details-text">
        <div>Not playing anything right now...</div>
      </div>
    );
  }
  
  return (
    <>
      {/* Home screen container */}
      <div id="home-screen-container">
        {/* Title with typing animation */}
        <h1 id="main-title" className={cursorClass}>
          {displayedTitle}
        </h1>

        {/* Canvas for waves */}
        <canvas
          id="waveCanvas"
          style={{ zIndex: 0 }} 
        />

        {/* Spotify overlay */}
        <div id="spotify-container">
          {trackDetailsContent}
        </div>
        
        {/* Load your JavaScript file */}
        <Script src="/script.js" strategy="afterInteractive" />
      </div>

      {/* Scrollable content sections */}
      <main id="scrollable-content">
        <section id="about-me" className="content-section">
          <h2 className="section-title">About Me</h2>
          <p>Introduce yourself here! This section is now scrollable.</p>
        </section>

        <section id="projects" className="content-section">
          <h2 className="section-title">Projects</h2>
          <p>List your key projects here. This section is now scrollable.</p>
        </section>

        <section id="experiences" className="content-section">
          <h2 className="section-title">Experiences</h2>
          <p>Detail your work and experience here. This section is now scrollable.</p>
        </section>
      </main>
    </>
  );
}
