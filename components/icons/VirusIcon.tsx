// components/icons/VirusIcon.tsx

import React from 'react';

export const VirusIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <circle cx="12" cy="12" r="8" />
    <path d="M9.09 9.09 12 12l2.83 2.83" />
    <path d="m14.83 9.17 0 0" />
    <path d="M12 12 9.17 14.83" />
    <path d="m9.17 9.17 0 0" />
    <path d="m2 12 2 0" />
    <path d="m20 12 2 0" />
    <path d="m12 2 0 2" />
    <path d="m12 20 0 2" />
  </svg>
);