'use client';

import { useEffect, useState } from 'react';
import Head from "next/head";
import Image from "next/image";
import { FaMailBulk} from "react-icons/fa";
import { FaLinkedin, FaXTwitter, FaGithub} from "react-icons/fa6";
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiPython, SiJavascript, SiHtml5, SiCss3, SiFlask, SiDocker, SiPandas, SiOpenai } from "react-icons/si";
import FadeContent from "../components/FadeContent";
import LogoLoop from "../components/LogoLoop";
import { IMAGE_URLS } from "../lib/s3-config";
import { useLinkedInProfile } from "../lib/use-linkedin-profile";
import { LINKEDIN_CONFIG } from "../lib/linkedin-config";

interface Track {
  title: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  isPlaying: boolean;
}

interface RecentlyPlayedTrack {
  title: string;
  artist: string;
  playedAt: string;
  albumImageUrl: string;
  songUrl: string;
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

interface Project {
  title: string;
  description: string;
  period: string;
  githubUrl?: string;
  devpostUrl?: string;
  techStack?: string[];
  context?: string;
  screenshot?: string;
}


// Add projects here
const projects: Project[] = [
  {
    title: "Personal Website",
    description: "A performant, modern portfolio website built with Next.js and TypeScript, featuring real-time Spotify integration, dynamic content delivery, and an elegant minimalist design. The site showcases projects, experience, and includes interactive features like live music tracking and song recommendations, all optimized for performance with a 95+ Lighthouse score.",
    period: "September 2025 – Present",
    githubUrl: "https://github.com/Leo-Zh9/Personal-Website",
    context: "A fully responsive, mobile-web-app-capable portfolio designed to showcase my work and skills. Features include live Spotify API integration with OAuth 2.0, global CDN distribution via CloudFront, and automated deployment pipelines for seamless updates.",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "AWS S3", "CloudFront", "MDX", "Spotify API", "OAuth 2.0"],
    screenshot: IMAGE_URLS.websiteScreenshot
  },
  {
    title: "Bridgette",
    description: "A data integration platform that seamlessly unifies multiple bank datasets—regardless of format or schema—into one clean, actionable spreadsheet. Bridgette uses AI-powered schema mapping to automatically detect data types and headers, handling .json, .csv, and .xlsx files from different organizations while ensuring data integrity and completeness.",
    period: "October 2025",
    githubUrl: "https://github.com/Leo-Zh9/bridgette",
    devpostUrl: "https://devpost.com/software/bridgette",
    context: "Built for the EY Canada - Data Integration Challenge during Hack the Valley X. This solution addresses the critical need for financial institutions to consolidate disparate data sources into unified, actionable insights.",
    techStack: ["Flask", "PostgreSQL", "Python", "React", "Docker", "Tailwind CSS", "TypeScript", "OpenAI API"],
    screenshot: IMAGE_URLS.bridgette
  },
  {
    title: "Preppin'",
    description: "An AI-powered meal planning and delivery service that creates personalized recipes based on available ingredients and dietary needs. Users can upload grocery receipts or manually enter ingredients, and the system generates tailored meal plans with convenient grocery delivery options.",
    period: "July 2024",
    githubUrl: "https://github.com/austinjiann/Preppin",
    devpostUrl: "https://devpost.com/software/preppin",
    context: "Built during StarterHacks 2024 hackathon - a 24-hour coding competition focused on solving real-world problems through innovative technology solutions.",
    techStack: ["Flask", "React", "OpenAI API", "Python", "Tesseract OCR", "OpenCV", "Firebase Auth", "Agile"],
    screenshot: IMAGE_URLS.preppin
  },
  // Add more projects here
];

// Add experiences here
const experiences: Experience[] = [
  {
    title: "Software Engineer",
    company: "Incendium Academy",
    companyUrl: "https://www.incendiumacademy.org/",
    period: "May 2025 – August 2025",
    description: "Incendium Academy is a non-profit that empowers students to explore entrepreneurship and technology through real-world projects. During my internship, I built and optimized web applications, automated workflows, and contributed to the development of scalable digital platforms. I implemented technical solutions that streamlined operations, improved user engagement, and supported the launch of student-driven initiatives.",
    screenshot: IMAGE_URLS.incendiumAcademy,
    techStack: ["Next.js", "Flask", "PostgreSQL", "Python", "React", "Chart.js", "PyTest", "Jest", "Docker", "Git", "CI/CD", "Agile"]
  },
  // Add more experiences here
]; 

// Tech logos for LogoLoop
const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <SiPython />, title: "Python", href: "https://python.org" },
  { node: <SiJavascript />, title: "JavaScript", href: "https://javascript.info" },
  { node: <SiHtml5 />, title: "HTML5", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { node: <SiCss3 />, title: "CSS3", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { node: <SiFlask />, title: "Flask", href: "https://flask.palletsprojects.com" },
  { node: <SiDocker />, title: "Docker", href: "https://docker.com" },
  { node: <SiPandas />, title: "Pandas", href: "https://pandas.pydata.org" },
  { node: <SiOpenai />, title: "OpenAI", href: "https://openai.com" },
];

export default function HomePage() {
  const [track, setTrack] = useState<Track | null>(null);
  const [recentlyPlayed, setRecentlyPlayed] = useState<RecentlyPlayedTrack[]>([]);
  const { profileData, loading: profileLoading, error: profileError } = useLinkedInProfile();
  const [songRecommendation, setSongRecommendation] = useState('');
  const [showSuccessState, setShowSuccessState] = useState(false);
  const [totalSongs, setTotalSongs] = useState<number>(0);

  // Fetch song recommendation count
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setTotalSongs(data.totalSongRecommendations);
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

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

  // Fetch recently played tracks
  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      try {
        const res = await fetch(`/api/recently-played`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setRecentlyPlayed(data.tracks || []);
      } catch (err) {
        console.error('Error fetching recently played:', err);
        setRecentlyPlayed([]);
      }
    };

    fetchRecentlyPlayed();
    const interval = setInterval(fetchRecentlyPlayed, 30000);
    return () => clearInterval(interval);
  }, []);

  // Format timestamp to time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Handle song recommendation submission
  const handleSongSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (songRecommendation.trim()) {
      try {
        // Send to API
        const response = await fetch('/api/song-recommendation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ song: songRecommendation }),
        });
        
        if (response.ok) {
          setShowSuccessState(true);
          setSongRecommendation('');
          
          // Update song count
          setTotalSongs(prev => prev + 1);
          
          // Hide success state after 2 seconds
          setTimeout(() => {
            setShowSuccessState(false);
          }, 2000);
        }
      } catch (error) {
        console.error('Error submitting song recommendation:', error);
      }
    }
  };


  const trackDetailsContent = track ? (
    <a href={track.songUrl} target="_blank" rel="noopener noreferrer">
      <Image id="track-album" src={track.albumImageUrl} alt={`${track.title} album cover`} width={250} height={250} />
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
      {/* Zen Garden Elements - Interactive Shapes */}
      <div className="zen-circle zen-circle-1"></div>
      <div className="zen-circle zen-circle-2"></div>
      
      {/* Floating Particles - Emphasized */}
      <div className="zen-particles">
        <div className="zen-particle"></div>
        <div className="zen-particle"></div>
        <div className="zen-particle"></div>
        <div className="zen-particle"></div>
        <div className="zen-particle"></div>
        <div className="zen-particle"></div>
        <div className="zen-particle"></div>
        <div className="zen-particle"></div>
      </div>
      
      {/* Flowing Wave Lines */}
      <div className="zen-line zen-line-1">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path d="M 0 50 Q 250 30, 500 50 T 1000 50" />
        </svg>
      </div>
      <div className="zen-line zen-line-2">
        <svg viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path d="M 0 50 Q 250 70, 500 50 T 1000 50" />
        </svg>
      </div>
      
      <div className="zen-curve"></div>

      {/* Hero Section */}
      <div id="home-screen-container">
        <h1 className="main-title">
          <span className="title-word">
            {'Leo'.split('').map((letter, index) => (
              <span key={index} className="title-letter" style={{ animationDelay: `${index * 0.1}s` }}>
                {letter}
              </span>
            ))}
          </span>
          <span className="title-space"> </span>
          <span className="title-word">
            {'Zhang'.split('').map((letter, index) => (
              <span key={index} className="title-letter" style={{ animationDelay: `${(index + 3) * 0.1}s` }}>
                {letter}
              </span>
            ))}
          </span>
        </h1>
        <p className="main-subtitle">
          Systems Design Engineering · University of Waterloo
        </p>
        
        {/* Quick Action Buttons */}
        <div className="hero-actions">
          <a href="#experiences" className="hero-btn hero-btn-primary">
            <span>View Experience</span>
          </a>
          <a href="https://leo-zhang-website.s3.us-east-1.amazonaws.com/Resume+(2).pdf" target="_blank" rel="noopener noreferrer" className="hero-btn">
            <span>View<br />Resume</span>
          </a>
        </div>
        
        {/* Social Links */}
        <div className="hero-social-links">
          <a href="https://www.linkedin.com/in/leozhang99" target="_blank" rel="noopener noreferrer" className="hero-social-link linkedin-link">
            <FaLinkedin size={20} /> 
            <span>LinkedIn</span>
          </a>
          <a href="https://github.com/Leo-Zh9" target="_blank" rel="noopener noreferrer" className="hero-social-link github-link">
            <FaGithub size={20} /> 
            <span>GitHub</span>
          </a>
          <a href="https://x.com/leozhangzyx" target="_blank" rel="noopener noreferrer" className="hero-social-link twitter-link">
            <FaXTwitter size={20} /> 
            <span>Twitter/X</span>
          </a>
          <a href="mailto:leo.zhang@outlook.com" className="hero-social-link email-link">
            <FaMailBulk size={20} /> 
            <span>Email</span>
          </a>
        </div>
        
        <div className="scroll-indicator"></div>
      </div>

      <main id="scrollable-content">
        <section id="about-me" className="content-section" data-section="01 / About">
          <h2 className="section-title">
            {'About Me'.split('').map((letter, index) => (
              <span key={index} className="section-letter">
                {letter === ' ' ? '\u00A0' : letter}
              </span>
            ))}
          </h2>
          
          <div className="content-wrapper">
            <div className="about-me-centerpiece">
              <div className="about-me-image">
                <FadeContent 
                  blur={true} 
                  duration={1200} 
                  easing="ease-out" 
                  initialOpacity={0}
                  delay={300}
                  threshold={0.2}
                >
                  <div className="profile-picture-container">
                    <Image
                      src={IMAGE_URLS.aboutMe}
                      alt="Leo Zhang"
                      width={300}
                      height={300}
                      className="profile-picture"
                      priority
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    />
                    <p className="profile-caption">Little Leo really enjoyed watching TV and building Lego mechs</p>
                  </div>
                </FadeContent>
              </div>
              
              {/* Spotify section */}
              <div className="spotify-section">
                <div id="spotify-container">{trackDetailsContent}</div>
                
                {/* Song Recommendation - Minimalistic */}
                <div className="song-recommendation-mini">
                  <form onSubmit={handleSongSubmit} className="song-form-mini">
                    <input
                      type="text"
                      value={songRecommendation}
                      onChange={(e) => setSongRecommendation(e.target.value)}
                      placeholder="Recommend a song!"
                      className="song-input-mini"
                      maxLength={200}
                    />
                    <button 
                      type="submit" 
                      className={`song-submit-mini ${showSuccessState ? 'success' : ''}`}
                    >
                      {showSuccessState ? '✓' : '→'}
                    </button>
                  </form>
                  {showSuccessState && (
                    <div className="song-success-message">
                      Thanks, I'll check it out!
                    </div>
                  )}
                  
                  {/* Songs Recommended Count */}
                  <div className="songs-count-display">
                    <span className="songs-count-label">Total songs recommended:</span>
                    <span className="songs-count-value">{totalSongs.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Recently Played Tracks */}
              <div className="recently-played-section">
                <div className="recently-played-container">
                  <h3 className="recently-played-title">Recently Played</h3>
                  <div className="recently-played-list">
                    {recentlyPlayed.length > 0 ? (
                      recentlyPlayed.map((track, index) => (
                        <a 
                          key={index}
                          href={track.songUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="recently-played-item"
                        >
                          <img 
                            src={track.albumImageUrl} 
                            alt={`${track.title} album cover`}
                            className="recently-played-image"
                          />
                          <div className="recently-played-info">
                            <span className="recently-played-track">
                              {track.title} - {track.artist} - {formatTime(track.playedAt)}
                            </span>
                          </div>
                        </a>
                      ))
                    ) : (
                      <div className="recently-played-empty">No recent tracks</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experiences" className="content-section" data-section="02 / Experience">
          <div className="section-divider"></div>
          <h2 className="section-title">
            {'Experience'.split('').map((letter, index) => (
              <span key={index} className="section-letter">
                {letter}
              </span>
            ))}
          </h2>

          <div className="content-wrapper">
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
                      <Image
                        src={exp.screenshot}
                        alt={`${exp.company} homepage screenshot`}
                        width={300}
                        height={200}
                        className="experience-image"
                      />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
          </div>
        </section>

        <section id="projects" className="content-section" data-section="03 / Projects">
          <div className="section-divider"></div>
          <h2 className="section-title">
            {'Projects'.split('').map((letter, index) => (
              <span key={index} className="section-letter">
                {letter}
              </span>
            ))}
          </h2>

          <div className="content-wrapper">
            <div className="project-list">
              {projects.map((project, index) => (
                <div key={index} className="project-item">
                  <div className="project-text">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-period">{project.period}</p>
                    <p className="project-context">{project.context}</p>
                    <p className="project-description">{project.description}</p>
                    {project.techStack && (
                      <span className="project-tech-stack">
                        {project.techStack.join(" · ")}
                      </span>
                    )}
                  </div>
                  
                  <div className="project-right">
                    {project.screenshot && (
                      <div className="project-screenshot">
                        <Image
                          src={project.screenshot}
                          alt={`${project.title} screenshot`}
                          width={600}
                          height={400}
                          className="project-image"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
                        />
                      </div>
                    )}
                    
                    <div className="project-links">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link github-link"
                        >
                          <FaGithub size={16} /> <span>GitHub</span>
                        </a>
                      )}
                      {project.devpostUrl && (
                        <a
                          href={project.devpostUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link devpost-link"
                        >
                          <span>Devpost</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Logo Loop */}
        <div className="tech-logos-section">
          <LogoLoop
            logos={techLogos}
            speed={80}
            direction="left"
            logoHeight={40}
            gap={50}
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColor="#000000"
            ariaLabel="Technologies I work with"
            style={{ height: '80px', margin: '20px 0' }}
          />
        </div>
        
        {/* Footer with last updated */}
        <footer className="site-footer">
          <p className="last-updated">Last updated: October 23, 2025</p>
        </footer>
      </main>
    </>
  );
}
