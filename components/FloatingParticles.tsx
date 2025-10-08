'use client';

import { useEffect, useState, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

interface FloatingParticlesProps {
  particleCount?: number;
  speed?: number;
  size?: number;
  opacity?: number;
  colors?: string[];
}

export default function FloatingParticles({
  particleCount = 50,
  speed = 0.5,
  size = 2,
  opacity = 0.6,
  colors = ['#ffffff', '#60a5fa', '#34d399', '#fbbf24', '#f472b6']
}: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize particles
  useEffect(() => {
    const initializeParticles = () => {
      const newParticles: Particle[] = [];
      
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * (containerRef.current?.clientWidth || window.innerWidth),
          y: Math.random() * (containerRef.current?.clientHeight || window.innerHeight),
          size: size + Math.random() * size,
          speedX: (Math.random() - 0.5) * speed,
          speedY: (Math.random() - 0.5) * speed,
          opacity: opacity * (0.5 + Math.random() * 0.5),
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
      
      setParticles(newParticles);
    };

    initializeParticles();

    // Handle window resize
    const handleResize = () => {
      initializeParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [particleCount, speed, size, opacity, colors]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          let newX = particle.x + particle.speedX;
          let newY = particle.y + particle.speedY;

          // Bounce off screen edges instead of wrapping
          const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
          const containerHeight = containerRef.current?.clientHeight || window.innerHeight;

          if (newX < 0 || newX > containerWidth) {
            particle.speedX *= -1;
            newX = particle.x;
          }
          if (newY < 0 || newY > containerHeight) {
            particle.speedY *= -1;
            newY = particle.y;
          }

          return {
            ...particle,
            x: newX,
            y: newY
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="floating-particles"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}
    >
      {particles.map(particle => (
        <div
          key={particle.id}
          className="particle"
          style={{
            position: 'absolute',
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: '50%',
            opacity: particle.opacity,
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.3s ease',
            boxShadow: `0 0 ${particle.size * 4}px ${particle.color}, 0 0 ${particle.size * 8}px ${particle.color}`,
            filter: 'blur(0.3px)'
          }}
        />
      ))}
    </div>
  );
}
