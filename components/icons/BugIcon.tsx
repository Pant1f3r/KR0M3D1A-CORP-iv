import React from 'react';

export const BugIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M8 22v-6.17a4 4 0 0 1 .4-1.83l1.8-3.12A3 3 0 0 1 12 9h0a3 3 0 0 1 1.8 1.88l1.8 3.12a4 4 0 0 1 .4 1.83V22" />
    <path d="M22 13h-4" />
    <path d="M2 13H6" />
    <path d="M15 9.5a3 3 0 1 0-6 0" />
    <path d="m14 2-2.3 2.3" />
    <path d="m10 2 2.3 2.3" />
  </svg>
);