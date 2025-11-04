import React from 'react';

export const AtomIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <circle cx="12" cy="12" r="1" />
    <path d="M20.2 20.2c2.04-2.04 3.12-4.58 3.12-7.2s-1.08-5.16-3.12-7.2c-2.04-2.04-4.58-3.12-7.2-3.12s-5.16 1.08-7.2 3.12C3.84 8.04 2.76 10.58 2.76 13s1.08 5.16 3.12 7.2" />
    <path d="M13 2.76A10.4 10.4 0 0 0 12 2a10.4 10.4 0 0 0-1 .76" />
    <path d="M11 21.24A10.4 10.4 0 0 0 12 22a10.4 10.4 0 0 0 1-.76" />
    <path d="M2.76 11A10.4 10.4 0 0 0 2 12a10.4 10.4 0 0 0 .76 1" />
    <path d="M21.24 13A10.4 10.4 0 0 0 22 12a10.4 10.4 0 0 0-.76-1" />
  </svg>
);