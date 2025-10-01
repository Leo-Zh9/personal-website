'use client';

import Link from 'next/link';
import { FC, useState, useEffect } from 'react';

const navItems = [
  { name: 'About Me', href: '#about-me' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experiences', href: '#experiences' },
  { name: 'Resume', href: '"\Leo_Zhang_Resume_External.pdf"' },
];

const Header: FC = () => {
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    const threshold = 100; // pixels from top

    const handleMouseMove = (e: MouseEvent) => {
      setShowHeader(e.clientY <= threshold);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 w-full z-50 bg-[rgba(19,19,19,0.8)] backdrop-blur-md border-b border-white/10
        transform transition-transform transition-opacity duration-500 ease-in-out
        ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
    >
      <div
        id="header-container"
        className="max-w-[1400px] mx-auto flex justify-between items-center"
      >
        {/* Left: Name / Logo */}
        <Link href="/" className="header-name">
          Leo Zhang
        </Link>

        {/* Right: Navigation Links */}
        <nav
          id="header-nav"
          className="flex flex-1 justify-evenly ml-10" // spread evenly
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              {...(item.name === 'Resume' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="header-link"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
