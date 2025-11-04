import React from 'react';

export const AlienIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2a10 10 0 0 0-9 12c0 4 2.5 8 5 9.5s5 1.5 5 1.5s2.5 0 5-1.5s5-5.5 5-9.5A10 10 0 0 0 12 2Z" />
    <path d="M8 12h8" />
    <path d="M9 17c0-2.5 1-4.5 3-5.5s2-3.5 3-5.5" />
    <path d="M15 17c0-2.5-1-4.5-3-5.5S10 8 9 6" />
  </svg>
);