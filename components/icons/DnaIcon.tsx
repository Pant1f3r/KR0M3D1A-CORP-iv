import React from 'react';

export const DnaIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M4 14.5A3.5 3.5 0 1 0 7.5 11 3.5 3.5 0 1 0 4 14.5Z" />
    <path d="M16.5 13A3.5 3.5 0 1 0 20 9.5 3.5 3.5 0 1 0 16.5 13Z" />
    <path d="M7.5 11l9-2" />
    <path d="M4 14.5l9-2" />
  </svg>
);