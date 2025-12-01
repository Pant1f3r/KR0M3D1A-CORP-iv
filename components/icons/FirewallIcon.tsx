
import React from 'react';

export const FirewallIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
    <line x1="6" y1="6" x2="18" y2="6" />
    <line x1="6" y1="10" x2="18" y2="10" />
    <line x1="6" y1="14" x2="18" y2="14" />
    <line x1="6" y1="18" x2="18" y2="18" />
    <path d="M12 2v20" />
    <path d="M3 12h18" />
  </svg>
);
