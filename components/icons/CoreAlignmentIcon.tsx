import React from 'react';

export const CoreAlignmentIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M12 2a10 10 0 1 0 10 10" />
    <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    <path d="M22 12h-2" />
    <path d="M6 12H4" />
    <path d="M12 6V4" />
    <path d="M12 20v-2" />
  </svg>
);