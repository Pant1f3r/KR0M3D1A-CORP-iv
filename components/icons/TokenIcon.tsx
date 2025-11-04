// components/icons/TokenIcon.tsx

import React from 'react';

export const TokenIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path d="M15 9.354a2.5 2.5 0 1 0-3 4.292" />
    <path d="M12 12v6" />
    <path d="M9 9.354a2.5 2.5 0 1 1 3 4.292" />
  </svg>
);