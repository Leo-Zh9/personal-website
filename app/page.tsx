'use client';

import { useEffect, useState } from 'react';
import Script from "next/script";
import Head from "next/head";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

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

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const res = await fetch(`/api/current-track`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: Track = await res.json();
        setTrack(data.isPlaying && data.title ? data : null);
      } catch (err) {
        console.error(err);
        setTrack(null);
      }
    };

    fetchTrack();
    const interval = setInterval(fetchTrack, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initialDelay = setTimeout(() => setAnimationStarted(true), START_DELAY_MS);
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
      const finalTimeout = setTimeout(() => setCursorFinalHide(true), CURSOR_PERSIST_MS);
      return () => clearTimeout(finalTimeout);
    }
  }, [titleIndex, animationStarted]);

  const cursorClass = animationStarted
    ? titleIndex < FULL_TITLE.length || !cursorFinalHide
      ? 'typing-active'
      : 'typing-done'
    : 'typing-inactive';

  const trackDetailsContent = track ? (
    <a href={track.songUrl} target="_blank" rel="noopener noreferrer">
      <img id="track-album" src={track.albumImageUrl} alt={`${track.title} album cover`} />
      <div id="track-details-text">
        <span id="listening-prefix">I'm currently listening to: </span>
        <span id="track-title-formatted">{track.title}</span>
      </div>
    </a>
  ) : (
    <div id="track-details-text">Not playing anything right now...</div>
  );

  return (
    <>
      <Head>
        <link rel="icon" href="/propeller-hat.png" type="image/png" />
      </Head>

      <div id="home-screen-container">
        <h1 id="main-title" className={cursorClass}>
          {displayedTitle}
        </h1>

        <canvas id="waveCanvas" style={{ zIndex: 0 }} />

        <Script src="/script.js" strategy="afterInteractive" />
      </div>

      <main id="scrollable-content">
        <section id="about-me" className="content-section">
          <h2 className="section-title">About Me</h2>
          <p>Introduce yourself here! This section is now scrollable.</p>
          <div id="spotify-container">{trackDetailsContent}</div>
        </section>

        <section id="projects" className="content-section">
          <h2 className="section-title">Projects</h2>
          <p>List your key projects here. This section is now scrollable.</p>
        </section>

        <section id="experiences" className="content-section">
          <h2 className="section-title">Experiences</h2>
          <p>Detail your work and experience here. This section is now scrollable.</p>
        </section>

        <footer id="footer">
          <div id="socials-container">
            <p>Connect with me:</p>
            <div id="social-icons">
              <a href="https://www.linkedin.com/in/leo-zhang-047326283/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={22} /> <span>LinkedIn</span>
              </a>
              <a href="https://twitter.com/yourhandle" target="_blank" rel="noopener noreferrer">
                <FaTwitter size={22} /> <span>Twitter/X</span>
              </a>
              <a href="https://github.com/Leo-Zh9" target="_blank" rel="noopener noreferrer">
                <FaGithub size={22} /> <span>GitHub</span>
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
