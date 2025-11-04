// components/icons/GavelIcon.tsx

import React from 'react';

export const GavelIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="m14 14-7.5 7.5" />
    <path d="m18 10 4 4" />
    <path d="m15.5 11.5 3 3" />
    <path d="m2 2 10 10" />
    <path d="M7.5 2.5 19.5 14.5" />
    <path d="M14 2.5 21.5 10" />
  </svg>
);
