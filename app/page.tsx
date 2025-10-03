'use client';

import { useEffect, useState } from 'react';
import Head from "next/head";
import Image from "next/image";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";
import Prism from "../components/Prism";
import BlurText from "../components/BlurText";
import FadeContent from "../components/FadeContent";
import { IMAGE_URLS } from "../lib/s3-config";

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

export default function HomePage() {
  const [track, setTrack] = useState<Track | null>(null);
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


  const trackDetailsContent = track ? (
    <a href={track.songUrl} target="_blank" rel="noopener noreferrer">
      <Image id="track-album" src={track.albumImageUrl} alt={`${track.title} album cover`} width={64} height={64} />
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
        <BlurText
          text="welcome to my website"
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
            timeScale={0.4}
            height={3.0}
            baseWidth={5.5}
            scale={2.8}
            hueShift={0}
            colorFrequency={0.8}
            noise={-1}
            glow={0.8}
            bloom={1}
            transparent={true}
            suspendWhenOffscreen={false}
          />
        </div>
      </div>

      <main id="scrollable-content">
        <section id="about-me" className="content-section">
          <h2 className="section-title">About Me</h2>
          
          <div className="about-me-content">
            <div className="about-me-text">
              <p>My passion for creating started long before I ever wrote a line of code. As a kid, I spent hours building LEGO sets—not just following instructions but designing my own mechs, complete with moving parts and imagined battles. Those moments sparked my love for engineering, because it wasn't just play—it was problem-solving, designing, and pushing the limits of what I could make with the pieces in front of me.</p>
              
              <p>That same curiosity carried over when I discovered Scratch. Suddenly, I could build not just physical creations, but digital ones. Dragging colorful blocks across the screen to make games and animations gave me the same thrill as snapping LEGO bricks together. But it also opened my eyes to something bigger: the power to invent without limits. With Scratch, I wasn't confined to a box of parts—I had an infinite canvas.</p>
              
              <p>From there, I dove into Python, Java, and C++, constantly chasing that same feeling of creation and challenge. I built projects that tested my patience and grit, like a chess engine that took weeks to get right, but rewarded me with the satisfaction of seeing it "think" on its own. What started as LEGO mechs and Scratch sprites turned into algorithms, web apps, and prototypes that stretched my imagination further each time.</p>
              
              <p>Music has been the other constant thread in this journey. Whether I'm coding at midnight or sketching out a new idea, there's always a soundtrack in the background. Music fuels my focus, sparks creativity, and keeps me in rhythm when I'm deep in flow. I've come to see coding and engineering the same way—as creative compositions, with structure and logic woven together to form something greater than the sum of its parts.</p>
              
              <p>Looking back, it all connects. LEGO gave me the spark, Scratch gave me the first tools, and programming gave me the freedom to dream bigger. Today, I carry those same passions forward: a love for building, a curiosity for solving problems, and the drive to create things that are as seamless and inspiring as the music I listen to every day.</p>
            </div>
            
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
                  />
                  <p className="profile-caption">Little Leo really enjoyed watching TV and building Lego mechs</p>
                </div>
              </FadeContent>
            </div>
          </div>
          
          <div id="spotify-container">{trackDetailsContent}</div>
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
                        width={300}
                        height={200}
                        className="project-image"
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
              <a href={IMAGE_URLS.resume} target="_blank" rel="noopener noreferrer" className="resume-link">
                <span>📄 Resume</span>
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
