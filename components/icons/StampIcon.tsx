// components/icons/StampIcon.tsx

import React from 'react';

export const StampIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M5 22h14" />
    <path d="M5 16.5v-11A2.5 2.5 0 0 1 7.5 3h9A2.5 2.5 0 0 1 19 5.5v11" />
    <path d="M15 9h-6" />
    <path d="M15 13h-6" />
    <path d="M10 3v13.5" />
  </svg>
);