'use client';

import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadComplete?: () => void;
}

export default function LoadingScreen({ onLoadComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [isComplete, setIsComplete] = useState(false);

  const loadingMessages = [
    'Initializing...',
    'Loading components...',
    'Preparing animations...',
    'Almost ready...',
    'Welcome!'
  ];

  useEffect(() => {
    // Smooth progress animation that always reaches 100%
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsComplete(true);
          // Wait a bit before calling onLoadComplete for smooth transition
          setTimeout(() => {
            onLoadComplete?.();
          }, 800);
          return 100;
        }
        // Slower, more realistic progress
        const increment = Math.random() * 3 + 1; // Random increment between 1-4
        return Math.min(prev + increment, 100);
      });
    }, 100);

    // Update loading text based on progress
    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        const currentIndex = loadingMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % loadingMessages.length;
        return loadingMessages[nextIndex];
      });
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(textInterval);
    };
  }, [onLoadComplete]);

  return (
    <div className={`loading-screen ${isComplete ? 'fade-out' : ''}`}>
      <div className="loading-content">
        {/* Animated Logo/Name */}
        <div className="loading-logo">
          <h1 className="loading-name">Leo Zhang</h1>
          <div className="loading-subtitle">Portfolio</div>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-text">{Math.round(progress)}%</div>
        </div>

        {/* Loading Message */}
        <div className="loading-message">{loadingText}</div>

        {/* Animated Dots */}
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="loading-background">
        <div className="loading-particle"></div>
        <div className="loading-particle"></div>
        <div className="loading-particle"></div>
        <div className="loading-particle"></div>
        <div className="loading-particle"></div>
      </div>
    </div>
  );
}
