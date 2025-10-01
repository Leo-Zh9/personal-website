// page.tsx (FINAL — footer with official brand icons + favicon)

'use client';

import { useEffect, useState } from 'react';
import Script from "next/script";
import Head from "next/head";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

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
        <img
          id="track-album"
          src={track.albumImageUrl}
          alt={`${track.title} album cover`}
        />
        <div id="track-details-text">
          <span id="listening-prefix">I'm currently listening to: </span>
          <span id="track-title-formatted">{track.title}</span>
        </div>
      </a>
    );
  } else {
    trackDetailsContent = (
      <div id="track-details-text">
        <div>Not playing anything right now...</div>
      </div>
    );
  }
  
  return (
    <>
      {/* Add favicon */}
      <Head>
        <link rel="icon" href="/propeller-hat.png" type="image/png" />
      </Head>

      {/* Home screen container */}
      <div id="home-screen-container">
        <h1 id="main-title" className={cursorClass}>
          {displayedTitle}
        </h1>

        <canvas id="waveCanvas" style={{ zIndex: 0 }} />

        <Script src="/script.js" strategy="afterInteractive" />
      </div>

      {/* Scrollable content sections */}
      <main id="scrollable-content">
        <section id="about-me" className="content-section">
          <h2 className="section-title">About Me</h2>
          <p>Introduce yourself here! This section is now scrollable.</p>

          {/* Spotify widget */}
          <div id="spotify-container">
            {trackDetailsContent}
          </div>
        </section>

        <section id="projects" className="content-section">
          <h2 className="section-title">Projects</h2>
          <p>List your key projects here. This section is now scrollable.</p>
        </section>

        <section id="experiences" className="content-section">
          <h2 className="section-title">Experiences</h2>
          <p>Detail your work and experience here. This section is now scrollable.</p>
        </section>

        {/* Footer for social media */}
        <footer id="footer">
          <div id="socials-container">
            <p>Connect with me:</p>
            <div id="social-icons">
              <a
                href="https://www.linkedin.com/in/leo-zhang-047326283/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin size={22} /> <span>LinkedIn</span>
              </a>
              <a
                href="https://twitter.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaTwitter size={22} /> <span>Twitter/X</span>
              </a>
              <a
                href="https://github.com/Leo-Zh9"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub size={22} /> <span>GitHub</span>
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
