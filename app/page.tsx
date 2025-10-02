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

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  companyUrl?: string;
  screenshot?: string;
  techStack?: string[];
}

const FULL_TITLE = "Welcome!"; 
const LETTER_DELAY_MS = 90; 
const START_DELAY_MS = 700; 
const CURSOR_PERSIST_MS = 3000;

// Add experiences here
const experiences: Experience[] = [
  {
    title: "Software Engineer",
    company: "Incendium Academy",
    companyUrl: "https://www.incendiumacademy.org/",
    period: "May 2025 – August 2025",
    description: "Incendium Academy is a non-profit that empowers students to explore entrepreneurship and technology through real-world projects. During my internship, I built and optimized web applications, automated workflows, and contributed to the development of scalable digital platforms. I implemented technical solutions that streamlined operations, improved user engagement, and supported the launch of student-driven initiatives.",
    screenshot: "/incendium-academy.png",
    techStack: ["JavaScript", "Python", "HTML", "SCSS"]
  },
  // Add more experiences here
]; 

export default function HomePage() {
  const [track, setTrack] = useState<Track | null>(null);
  const [displayedTitle, setDisplayedTitle] = useState(''); 
  const [titleIndex, setTitleIndex] = useState(0); 
  const [animationStarted, setAnimationStarted] = useState(false); 
  const [cursorFinalHide, setCursorFinalHide] = useState(false);
  const [cursorTrail, setCursorTrail] = useState<Array<{x: number, y: number, id: number}>>([]);
  const [sparks, setSparks] = useState<Array<{x: number, y: number, id: number, angle: number, velocity: number}>>([]); 

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

  // Cursor trail effect
  useEffect(() => {
    let trailId = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      const newTrail = {
        x: e.clientX,
        y: e.clientY,
        id: trailId++
      };
      
      setCursorTrail(prev => {
        const updated = [newTrail, ...prev];
        return updated.slice(0, 25); // Keep only last 25 trail points for smoother ribbon
      });
    };

    // Clean up old trail points
    const cleanupInterval = setInterval(() => {
      setCursorTrail(prev => prev.slice(0, -1));
    }, 50);

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearInterval(cleanupInterval);
    };
  }, []);

  // Click sparks effect
  useEffect(() => {
    let sparkId = 0;
    
    const handleClick = (e: MouseEvent) => {
      const sparkCount = 8;
      const newSparks: Array<{x: number, y: number, id: number, angle: number, velocity: number}> = [];
      
      for (let i = 0; i < sparkCount; i++) {
        const angle = (Math.PI * 2 * i) / sparkCount + (Math.random() - 0.5) * 0.5;
        const velocity = 2 + Math.random() * 3;
        
        newSparks.push({
          x: e.clientX,
          y: e.clientY,
          id: sparkId++,
          angle,
          velocity
        });
      }
      
      setSparks(prev => [...prev, ...newSparks]);
      
      // Remove sparks after animation
      setTimeout(() => {
        setSparks(prev => prev.filter(spark => !newSparks.includes(spark)));
      }, 1000);
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

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
      {/* Cursor Trail */}
      <div className="cursor-trail-container">
        <svg className="cursor-trail-svg">
          {cursorTrail.length > 1 && (
            <>
              <defs>
                <linearGradient 
                  id="trailGradient" 
                  x1={cursorTrail[0]?.x} 
                  y1={cursorTrail[0]?.y}
                  x2={cursorTrail[cursorTrail.length - 1]?.x} 
                  y2={cursorTrail[cursorTrail.length - 1]?.y}
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stopColor="#ff69b4" stopOpacity="0.9" />
                  <stop offset="25%" stopColor="#ff1493" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#ff6347" stopOpacity="0.7" />
                  <stop offset="75%" stopColor="#ff4500" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#ff8c00" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              {cursorTrail.map((point, index) => {
                if (index === cursorTrail.length - 1) return null;
                const nextPoint = cursorTrail[index + 1];
                const progress = index / (cursorTrail.length - 1);
                const strokeWidth = 12 * (1 - progress); // Taper from 12px to 0
                
                return (
                  <line
                    key={point.id}
                    x1={point.x}
                    y1={point.y}
                    x2={nextPoint.x}
                    y2={nextPoint.y}
                    stroke="url(#trailGradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    opacity={1 - progress * 0.7}
                  />
                );
              })}
            </>
          )}
        </svg>
      </div>

      {/* Click Sparks */}
      <div className="sparks-container">
        {sparks.map((spark) => (
          <div
            key={spark.id}
            className="spark"
            style={{
              left: spark.x,
              top: spark.y,
              '--angle': `${spark.angle}rad`,
              '--velocity': spark.velocity,
            } as React.CSSProperties & { '--angle': string; '--velocity': number }}
          />
        ))}
      </div>

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

          <div className="experience-list">
            {experiences.map((exp, index) => (
              <div key={index} className="experience-item">
                {/* Left: Text */}
                <div className="experience-text">
                  <h3 className="experience-title">
                    {exp.title} @{" "}
                    {exp.companyUrl ? (
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="experience-company-link"
                      >
                        {exp.company}
                      </a>
                    ) : (
                      exp.company
                    )}
                  </h3>
                  <p className="experience-period">{exp.period}</p>
                  <p className="experience-description">
                    {exp.description}
                    {exp.techStack && (
                      <span className="experience-tech-stack">
                        {" "}<em>{exp.techStack.join(" • ")}</em>
                      </span>
                    )}
                  </p>
                </div>

                {/* Right: Screenshot */}
                {exp.screenshot && (
                  <div className="experience-image-container">
                    <a
                      href={exp.companyUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={exp.screenshot}
                        alt={`${exp.company} homepage screenshot`}
                        className="experience-image"
                      />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
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
