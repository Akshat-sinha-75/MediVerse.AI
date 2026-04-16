'use client';

import './FloatingIcons.css';

const icons = [
  {
    label: 'AI',
    svg: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="4" stroke="#7C3AED" strokeWidth="1.5" />
        <circle cx="10" cy="12" r="2" fill="#7C3AED" />
        <circle cx="18" cy="12" r="2" fill="#3B82F6" />
        <path d="M10 18c0-2.2 3.6-4 4-4s4 1.8 4 4" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Brain',
    svg: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 4c-3.3 0-6 2.7-6 6 0 1.5.5 2.8 1.4 3.9C8.5 15.5 8 17 8 18.5 8 21.5 10.5 24 14 24s6-2.5 6-5.5c0-1.5-.5-3-1.4-4.1A5.9 5.9 0 0020 10c0-3.3-2.7-6-6-6z" stroke="#3B82F6" strokeWidth="1.5" />
        <path d="M14 8v12M11 11h6M11 17h6" stroke="#3B82F6" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Medical',
    svg: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="10" y="4" width="8" height="20" rx="2" fill="rgba(124,58,237,0.2)" stroke="#7C3AED" strokeWidth="1.5" />
        <rect x="4" y="10" width="20" height="8" rx="2" fill="rgba(124,58,237,0.2)" stroke="#7C3AED" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: 'DNA',
    svg: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M9 4c0 6 10 8 10 14s-10 8-10 14" stroke="#3B82F6" strokeWidth="1.5" fill="none" />
        <path d="M19 4c0 6-10 8-10 14s10 8 10 14" stroke="#7C3AED" strokeWidth="1.5" fill="none" />
        <line x1="9" y1="11" x2="19" y2="11" stroke="#7C3AED" strokeWidth="1" opacity="0.5" />
        <line x1="9" y1="17" x2="19" y2="17" stroke="#3B82F6" strokeWidth="1" opacity="0.5" />
      </svg>
    ),
  },
  {
    label: 'Eye',
    svg: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M2 14s4.5-7 12-7 12 7 12 7-4.5 7-12 7S2 14 2 14z" stroke="#3B82F6" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="4" stroke="#7C3AED" strokeWidth="1.5" />
        <circle cx="14" cy="14" r="1.5" fill="#7C3AED" />
      </svg>
    ),
  },
  {
    label: 'Data',
    svg: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="4" width="20" height="20" rx="3" stroke="#7C3AED" strokeWidth="1.5" />
        <rect x="8" y="8" width="12" height="12" rx="2" stroke="#3B82F6" strokeWidth="1" />
        <rect x="11" y="11" width="6" height="6" rx="1" fill="rgba(124,58,237,0.3)" stroke="#7C3AED" strokeWidth="1" />
      </svg>
    ),
  },
];

export default function FloatingIcons() {
  return (
    <div className="floating-icons-container">
      {icons.map((icon, i) => (
        <div
          key={icon.label}
          className={`floating-icon floating-icon-${i}`}
          title={icon.label}
        >
          {icon.svg}
        </div>
      ))}
    </div>
  );
}
