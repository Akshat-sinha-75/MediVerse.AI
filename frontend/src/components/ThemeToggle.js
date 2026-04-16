'use client';

import { useTheme } from '@/lib/ThemeProvider';
import './ThemeToggle.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      id="theme-toggle-btn"
    >
      <div className={`toggle-track ${theme}`}>
        <div className="toggle-thumb">
          {theme === 'dark' ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v1M7 12v1M12.5 7h1M0.5 7h1M10.9 3.1l-.7.7M3.8 10.2l-.7.7M10.9 10.9l-.7-.7M3.8 3.8l-.7-.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M13 7.5A6 6 0 016.5 1a6 6 0 106.5 6.5z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
