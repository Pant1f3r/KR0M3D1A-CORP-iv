
import React from 'react';

export const TreeIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M12 22v-8" />
    <path d="M22 14h-6a2 2 0 0 0-2 2v6" />
    <path d="M2 14h6a2 2 0 0 1 2 2v6" />
    <path d="M12 6V2" />
    <path d="m15 5-3-3-3 3" />
  </svg>
);
