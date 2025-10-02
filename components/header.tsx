'use client';

import Link from 'next/link';
import { FC, useState, useEffect } from 'react';

const navItems = [
  { name: 'About Me', href: '#about-me' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experiences', href: '#experiences' },
  { name: 'Resume', href: '/Leo_Zhang_Resume_External.pdf' },
];

const Header: FC = () => {
  const [showHeader, setShowHeader] = useState(true);

  // Show header when near top, hide on scroll down
  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowHeader(currentScrollY < lastScrollY || currentScrollY < 50); // show if scrolling up or near top
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        className="max-w-[1400px] mx-auto flex justify-between items-center px-6 py-3"
      >
        {/* Left: Name / Logo */}
        <Link href="/" className="header-name text-lg font-bold text-white">
          Leo Zhang
        </Link>

        {/* Right: Navigation Links */}
        <nav
          id="header-nav"
          className="flex flex-1 justify-evenly ml-10"
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              {...(item.name === 'Resume' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="header-link text-white hover:text-gray-300 transition-colors"
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
