// components/icons/NetworkIcon.tsx

import React from 'react';

export const NetworkIcon: React.FC<{ className?: string }> = ({ className }) => (
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
  </svg>
);