import React from 'react';

export const MetatronSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="-50 -50 100 100"
    className={className}
    stroke="currentColor"
    strokeWidth="0.5"
    fill="none"
  >
    <style>
      {`
        .metatron-group {
          animation: metatron-spin 12s linear infinite;
          transform-origin: center;
        }
        @keyframes metatron-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .metatron-circle {
          animation: metatron-pulse 3s ease-in-out infinite alternate;
        }
        @keyframes metatron-pulse {
          from { stroke-width: 0.5; opacity: 0.7; }
          to { stroke-width: 1; opacity: 1; }
        }
        /* Stagger animation */
        .metatron-circle-1 { animation-delay: 0s; }
        .metatron-circle-2 { animation-delay: 0.25s; }
        .metatron-circle-3 { animation-delay: 0.5s; }
      `}
    </style>
    <g className="metatron-group">
      {/* Outer Circle */}
      <circle className="metatron-circle metatron-circle-1" r="45" />
      {/* Inner Hexagon */}
      <path d="M0 -30 L25.98 -15 L25.98 15 L0 30 L-25.98 15 L-25.98 -15 Z" />
       {/* Inner Star */}
      <path d="M0 -30 L-25.98 15 L25.98 15 Z" />
      <path d="M0 30 L25.98 -15 L-25.98 -15 Z" />
      <circle className="metatron-circle metatron-circle-2" r="30" />
      <circle className="metatron-circle metatron-circle-3" r="15" />
    </g>
  </svg>
);
