// components/icons/PatchworkIcon.tsx

import React from 'react';

export const PatchworkIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
    <path d="M12 2v20" />
    <path d="M2 12h20" />
    <path d="M7 7l-2 2 2 2" />
    <path d="M5 9h4" />
    <path d="M17 15l2 2-2 2" />
    <path d="M19 17h-4" />
    <path d="M16 8l2 -2 -2 -2" />
    <path d="M18 6h-4" />
  </svg>
);
