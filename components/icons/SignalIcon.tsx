// components/icons/SignalIcon.tsx

import React from 'react';

export const SignalIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M2 12h3l3-9 4 18 3-9h3" />
    <circle cx="20" cy="12" r="2" />
  </svg>
);