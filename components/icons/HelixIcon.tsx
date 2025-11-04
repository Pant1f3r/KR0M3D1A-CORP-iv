// components/icons/HelixIcon.tsx

import React from 'react';

export const HelixIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M4 13.5A3.5 3.5 0 0 1 7.5 10c2.76 0 5-2.24 5-5 .01-2.76-2.23-5-5-5" />
    <path d="M20 10.5A3.5 3.5 0 0 0 16.5 14c-2.76 0-5 2.24-5 5 .01 2.76 2.23 5 5 5" />
    <path d="M10.5 10.5c-2 .5-3.5 2-3.5 3.5s1.5 3 3.5 3.5" />
    <path d="M13.5 13.5c2-.5 3.5-2 3.5-3.5s-1.5-3-3.5-3.5" />
    <path d="M11 4.5a3.5 3.5 0 0 1 0 7" />
    <path d="M13 12.5a3.5 3.5 0 0 1 0 7" />
  </svg>
);