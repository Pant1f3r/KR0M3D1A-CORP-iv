import React from 'react';

export const EagleIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M4.68 18.23a3.5 3.5 0 0 1-1.2-4.82l.8-1.34c.2-.3.3-.7.2-1.1L3.13 6.8c-.3-1 .1-2.1.9-2.8l2.5-2.2c.8-.7 2-.7 2.8 0l1.3.9c.4.3.9.3 1.3 0l1.3-.9c.8-.7 2-.7 2.8 0l2.5 2.2c.8.7 1.2 1.8.9 2.8L17 10.9c-.1.4 0 .8.2 1.1l.8 1.34a3.5 3.5 0 0 1-1.2 4.82L12 15.3l-7.32 2.93Z" />
    <path d="m7 14 5-3 5 3" />
  </svg>
);