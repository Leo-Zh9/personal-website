import Link from 'next/link';
import { FC } from 'react';

// Define the navigation items
const navItems = [
  { name: 'About Me', href: '#about-me' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experiences', href: '#experiences' },
  // Resume link opens in a new tab
  { name: 'Resume', href: '"\Leo_Zhang_Resume_External.pdf"' }, 
];

const Header: FC = () => {
  return (
    // ID 'main-header' is styled in global.css to be fixed at the top
    <header id="main-header">
      <div id="header-container">
        
        {/* Your Name/Logo (Left Side) - Link to home */}
        <Link href="/" className="header-name">
          <div className="relative">
            {/* other content */}
            <div className="absolute top-0 right-0 p-2">
              Leo Zhang
        </div>
        </div>

        </Link>

        {/* Navigation Links (Right Side) */}
        <nav id="header-nav">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              href={item.href}
              // Open Resume in a new tab
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