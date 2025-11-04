// components/icons/BrainRefreshIcon.tsx

import React from 'react';

export const BrainRefreshIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M12 2a2.5 2.5 0 0 0-2.5 2.5v.7a4.5 4.5 0 0 0-3.2 4.3v0a4.5 4.5 0 0 0 4.5 4.5h2.4" />
    <path d="M12 22a2.5 2.5 0 0 1 2.5-2.5v-.7a4.5 4.5 0 0 1 3.2-4.3v0a4.5 4.5 0 0 1-4.5-4.5H8.6a4.5 4.5 0 0 0-4.5-4.5v0a4.5 4.5 0 0 0 4.3-3.2h.7a2.5 2.5 0 0 0 2.5-2.5" />
    <path d="M12 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    <path d="M4.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z" />
    {/* Refresh Icon Part */}
    <path d="M21 12a9 9 0 0 0-9-9" />
    <path d="M3 12a9 9 0 0 0 9 9" />
    <path d="M21 7v5h-5" />
    <path d="M3 17v-5h5" />
  </svg>
);
