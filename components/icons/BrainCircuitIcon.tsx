import React from 'react';

export const BrainCircuitIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M12 2a2.5 2.5 0 0 0-2.5 2.5v.7a4.5 4.5 0 0 0-3.2 4.3v0a4.5 4.5 0 0 0 4.5 4.5h2.4a4.5 4.5 0 0 1 4.5 4.5v0a4.5 4.5 0 0 1-4.3 3.2h-.7a2.5 2.5 0 0 1-2.5 2.5" />
    <path d="M12 22a2.5 2.5 0 0 1 2.5-2.5v-.7a4.5 4.5 0 0 1 3.2-4.3v0a4.5 4.5 0 0 1-4.5-4.5H8.6a4.5 4.5 0 0 0-4.5-4.5v0a4.5 4.5 0 0 0 4.3-3.2h.7a2.5 2.5 0 0 0 2.5-2.5" />
    <path d="M12 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    <path d="M12 19.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    <path d="M4.5 12a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0Z" />
    <path d="M19.5 12a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z" />
  </svg>
);
