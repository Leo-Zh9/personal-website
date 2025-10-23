'use client';

import Link from 'next/link';
import { FC, useState, useEffect } from 'react';

const navItems = [
  { name: 'About', href: '#about-me' },
  { name: 'Experience', href: '#experiences' },
  { name: 'Projects', href: '#projects' },
  { name: 'Resume', href: 'https://leo-zhang-website.s3.us-east-1.amazonaws.com/Resume+(2).pdf' },
];

const Header: FC = () => {
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    let lastScrollY = 0;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowHeader(currentScrollY < lastScrollY || currentScrollY < 50);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <header
      id="main-header"
      className={`transition-transform transition-opacity duration-500 ease-in-out
        ${showHeader ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}
    >
      <div id="header-container">
        <Link 
          href="#" 
          className="header-name"
          onClick={handleScrollToTop}
        >
          LZ
        </Link>

        <nav id="header-nav">
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
