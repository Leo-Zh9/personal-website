'use client';

import { useEffect, useState, useRef } from 'react';
import Head from "next/head";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiPython, SiJavascript, SiHtml5, SiCss3, SiFlask, SiDocker, SiPandas, SiOpenai } from "react-icons/si";
import BlurText from "../components/BlurText";
import FadeContent from "../components/FadeContent";
import LogoLoop from "../components/LogoLoop";
import FloatingParticles from "../components/FloatingParticles";
import LoadingScreen from "../components/LoadingScreen";
import CountUp from "../components/CountUp";
import { IMAGE_URLS } from "../lib/s3-config";
import { useLinkedInProfile } from "../lib/use-linkedin-profile";
import { LINKEDIN_CONFIG } from "../lib/linkedin-config";

// Lazy load the heavy Prism component
const Prism = dynamic(() => import("../components/Prism"), {
  ssr: false,
  loading: () => <div style={{ width: '100%', height: '100vh', background: 'linear-gradient(45deg, #1f2937, #374151)' }} />
});

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
    title: "Bridgette",
    description: "A data integration platform that seamlessly unifies multiple bank datasets—regardless of format or schema—into one clean, actionable spreadsheet. Bridgette uses AI-powered schema mapping to automatically detect data types and headers, handling .json, .csv, and .xlsx files from different organizations while ensuring data integrity and completeness.",
    period: "October 2025",
    githubUrl: "https://github.com/Leo-Zh9/bridgette",
    devpostUrl: "https://devpost.com/software/bridgette",
    context: "Built for the EY Canada - Data Integration Challenge during Hack the Valley X. This solution addresses the critical need for financial institutions to consolidate disparate data sources into unified, actionable insights.",
    techStack: ["Python", "Flask", "React", "OpenAI API", "Pandas", "Docker", "JavaScript", "HTML", "CSS"],
    screenshot: IMAGE_URLS.bridgette
  },
  {
    title: "Preppin'",
    description: "An AI-powered meal planning and delivery service that creates personalized recipes based on available ingredients and dietary needs. Users can upload grocery receipts or manually enter ingredients, and the system generates tailored meal plans with convenient grocery delivery options.",
    period: "July 2024",
    githubUrl: "https://github.com/austinjiann/Preppin",
    devpostUrl: "https://devpost.com/software/preppin",
    context: "Built during StarterHacks 2024 hackathon - a 24-hour coding competition focused on solving real-world problems through innovative technology solutions.",
    techStack: ["Python", "Flask", "JavaScript", "HTML", "CSS", "OpenAI API", "Tesseract OCR"],
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
    techStack: ["JavaScript", "Python", "HTML", "CSS"]
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
  const [sparks, setSparks] = useState<Array<{x: number, y: number, id: number, angle: number, velocity: number}>>([]);
  const { profileData, loading: profileLoading, error: profileError } = useLinkedInProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [songRecommendation, setSongRecommendation] = useState('');
  const [showSuccessState, setShowSuccessState] = useState(false);
  const [visitorNumber, setVisitorNumber] = useState<number | null>(null);
  const [totalVisitors, setTotalVisitors] = useState<number>(0);
  const [totalSongs, setTotalSongs] = useState<number>(0);
  const trackingInProgress = useRef(false);

  // Track visitor on page load (only once per session)
  useEffect(() => {
    const hasTrackedInSession = sessionStorage.getItem('visitorTracked');
    
    const trackVisitor = async () => {
      // Prevent double execution in React Strict Mode
      if (trackingInProgress.current) return;
      trackingInProgress.current = true;
      
      if (hasTrackedInSession) {
        // Already tracked in this session, just fetch the count
        try {
          const res = await fetch('/api/stats');
          if (res.ok) {
            const data = await res.json();
            setTotalVisitors(data.totalVisitors);
          }
        } catch (err) {
          console.error('Error fetching stats:', err);
        }
        trackingInProgress.current = false;
        return;
      }

      try {
        const res = await fetch('/api/visitor', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setVisitorNumber(data.visitorNumber);
          setTotalVisitors(data.totalVisitors);
          // Mark as tracked in this session
          sessionStorage.setItem('visitorTracked', 'true');
        }
      } catch (err) {
        console.error('Error tracking visitor:', err);
      }
      
      trackingInProgress.current = false;
    };

    trackVisitor();
  }, []);

  // Fetch stats periodically
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setTotalVisitors(data.totalVisitors);
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

  // Handle loading completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Delay content visibility for smooth transition
      setTimeout(() => {
        setIsContentVisible(true);
      }, 500);
    }, 3000); // Show loading screen for at least 3 seconds

    return () => clearTimeout(timer);
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
      {/* Loading Screen */}
      {isLoading && (
        <LoadingScreen onLoadComplete={() => setIsLoading(false)} />
      )}
      
      {/* Floating Particles Background */}
      <FloatingParticles 
        particleCount={40}
        speed={0.2}
        size={2}
        opacity={0.6}
        colors={['#ffffff', '#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa']}
      />
      
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

      {/* Main Content with Fade-in */}
      <div className={`main-content ${isContentVisible ? 'fade-in' : ''}`}>
        <div id="home-screen-container">
        <BlurText
          text="welcome to my domain"
          delay={100}
          animateBy="letters"
          direction="top"
          className="main-title-blur"
          stepDuration={0.4}
        />

        {/* Prism Background */}
        <div style={{ 
          position: 'absolute', 
          top: 80, 
          left: 0, 
          width: '100%', 
          height: '100vh', 
          zIndex: 0 
        }}>
          <Prism
            animationType="rotate"
            timeScale={0.2}
            height={3.0}
            baseWidth={5.5}
            scale={2.8}
            hueShift={0}
            colorFrequency={0.8}
            noise={-1}
            glow={0.8}
            bloom={1}
            transparent={true}
            suspendWhenOffscreen={true}
            reducedMotion={false}
          />
        </div>
      </div>

      <main id="scrollable-content">
        {/* Live Statistics Section */}
        <section id="stats" className="stats-section">
          <div className="stats-main">
            <div className="stats-main-label">Lifetime Visitors</div>
            <CountUp 
              to={totalVisitors}
              from={0}
              duration={2}
              delay={0.5}
              separator=","
              className="stats-main-value"
            />
          </div>
          
          {visitorNumber && (
            <div className="stats-sub-container">
              <div className="stat-sub-item">
                <div className="stat-sub-label">You are visitor</div>
                <div className="stat-sub-value">#{visitorNumber.toLocaleString()}</div>
              </div>
            </div>
          )}
        </section>

        <section id="about-me" className="content-section">
          <h2 className="section-title">About Me</h2>
          
          <div className="about-me-content">
            <div className="about-me-text">
              <p><strong>Hey, I'm Leo!</strong></p>
              
              <p>I'm currently studying <strong>Systems Design Engineering</strong> at the <strong>University of Waterloo</strong>.</p>
              
              <p>I'm passionate about solving complex problems through technology and design, blending software development, AI, and systems thinking to create impactful solutions.</p>
              
              <p>My passion for creating started long before I ever wrote a line of code. As a kid, I spent hours building LEGO sets—not just following instructions, but designing my own mechs with moving parts and imagined battles. Those early projects sparked my love for engineering because they were more than play—they were problem-solving, designing, and pushing the limits of what I could build.</p>
              
              <p>That same curiosity carried over when I discovered Scratch. Suddenly, I could create not just physical structures, but digital ones. Dragging colorful blocks to make games and animations gave me the same thrill as snapping LEGO bricks together. But it also revealed something bigger: the power to invent without limits. With Scratch, I wasn't confined to a box of parts—I had an infinite canvas.</p>
              
              <p>From there, I dove into Python, Java, and C++, constantly chasing that feeling of creation and challenge. I built projects that tested my patience and grit—like a chess engine that took weeks to perfect—but rewarded me with the satisfaction of seeing it "think" on its own. What started as LEGO mechs and Scratch sprites evolved into algorithms, web apps, and prototypes that stretched my imagination further each time.</p>
              
              <p>Music has always been a thread in this journey. Whether I'm coding late at night or sketching a new idea, there's a soundtrack in the background. Music fuels my focus, sparks creativity, and keeps me in rhythm when I'm deep in flow. I've come to see coding and engineering the same way: as creative compositions, with structure and logic woven together to form something greater than the sum of its parts.</p>
              
              <p>Looking back, it all connects. LEGO sparked the curiosity, Scratch gave me the first tools, and programming gave me the freedom to dream bigger. Today, I carry those passions forward: a love for building, a curiosity for solving problems, and the drive to create things that are as seamless and inspiring as the music I listen to every day.</p>
            </div>
            
            <div className="about-me-right">
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
              
              {/* Spotify section as separate element */}
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
            </div>
          </div>
        </section>

        <section id="projects" className="content-section">
          <h2 className="section-title">Projects</h2>

          <div className="project-list">
            {projects.map((project, index) => (
              <div key={index} className="project-item">
                {/* Left: Text */}
                <div className="project-text">
                  <h3 className="project-title">
                    {project.title}
                  </h3>
                  <p className="project-period">{project.period}</p>
                  <p className="project-context">{project.context}</p>
                  <p className="project-description">
                    {project.description}
                    {project.techStack && (
                      <span className="project-tech-stack">
                        {" "}<em>{project.techStack.join(" • ")}</em>
                      </span>
                    )}
                  </p>
                </div>

                {/* Right: Screenshot and Links */}
                <div className="project-right">
                  {project.screenshot && (
                    <div className="project-screenshot">
                      <Image
                        src={project.screenshot}
                        alt={`${project.title} screenshot`}
                        width={450}
                        height={300}
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
                        <FaGithub size={20} /> GitHub
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
        </section>

        <section id="connect" className="content-section">
          <h2 className="section-title">Connect with Me</h2>
          
          <div className="connect-content">
            <div className="connect-text">
              <p><strong>Let's connect!</strong></p>
              <p>I'm always interested in meeting new people and exploring opportunities in technology and engineering.</p>
              
              <div className="social-links">
                <a href="https://www.linkedin.com/in/leozhang99" target="_blank" rel="noopener noreferrer" className="social-link linkedin-link">
                  <FaLinkedin size={24} /> 
                  <span>LinkedIn</span>
                </a>
                <a href="https://github.com/Leo-Zh9" target="_blank" rel="noopener noreferrer" className="social-link github-link">
                  <FaGithub size={24} /> 
                  <span>GitHub</span>
                </a>
                <a href="https://x.com/leozhangzyx" target="_blank" rel="noopener noreferrer" className="social-link twitter-link">
                  <FaTwitter size={24} /> 
                  <span>Twitter/X</span>
                </a>
                <a href={IMAGE_URLS.resume} target="_blank" rel="noopener noreferrer" className="social-link resume-link">
                  <span>📄 Resume</span>
                </a>
              </div>
            </div>
            
            <div className="connect-image">
              <FadeContent 
                blur={true} 
                duration={1200} 
                easing="ease-out" 
                initialOpacity={0}
                delay={300}
                threshold={0.2}
              >
                <div className="linkedin-profile-container">
                  <Image
                    src={profileData?.profileImageUrl || LINKEDIN_CONFIG.fallbackImageUrl}
                    alt="Leo Zhang - LinkedIn Profile"
                    width={250}
                    height={250}
                    className="linkedin-profile-picture"
                    priority
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  <p className="linkedin-caption">
                    {profileData?.fallback 
                      ? "Connect with me on LinkedIn!" 
                      : "Current LinkedIn profile picture - always up to date!"
                    }
                  </p>
                  {profileData?.lastUpdated && LINKEDIN_CONFIG.showUpdateInfo && (
                    <p className="linkedin-update-info">
                      Last updated: {new Date(profileData.lastUpdated).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </FadeContent>
            </div>
          </div>
        </section>
        
        {/* Connect section divider */}
        <div className="connect-divider"></div>
        
        {/* Final white line */}
        <div className="final-divider"></div>
      </main>
      </div>
    </>
  );
}
