'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import './Sidebar.css';

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="2" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="2" y="11" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: 'My Profile',
    href: '/dashboard/profile',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 18c0-3.3 3.1-6 7-6s7 2.7 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Medical Records',
    href: '/dashboard/medical-records',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 3h8l4 4v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 3v4h4M7 11h6M7 14h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Medications',
    href: '/dashboard/medications',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="5" y="2" width="10" height="16" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <line x1="5" y1="10" x2="15" y2="10" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 6h4M8 14h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Chatbot',
    href: '/dashboard/chatbot',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 4h14a2 2 0 012 2v8a2 2 0 01-2 2H7l-4 3V6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="7" cy="10" r="1" fill="currentColor" />
        <circle cx="10" cy="10" r="1" fill="currentColor" />
        <circle cx="13" cy="10" r="1" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Sidebar({ isOpen, onToggle }) {
  const pathname = usePathname();

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="sidebar">
        <div className="sidebar-header">
          <Link href="/" className="sidebar-logo">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="12" stroke="url(#sidebarGrad)" strokeWidth="2" />
              <path d="M10 14h8M14 10v8" stroke="url(#sidebarGrad)" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="sidebarGrad" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#7C3AED" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
            <span>MEDIVERSE.AI</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
              onClick={() => onToggle && onToggle(false)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link sidebar-logout" id="logout-btn">
            <span className="sidebar-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 17H4a2 2 0 01-2-2V5a2 2 0 012-2h3M13 14l4-4-4-4M17 10H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="sidebar-label">Logout</span>
          </button>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={() => onToggle && onToggle(false)} />}
    </>
  );
}
