
import React from 'react';

export const GrokFeed: React.FC<{ isPlaying: boolean }> = ({ isPlaying }) => (
  <div className="absolute inset-0 w-full h-full">
    <style>
      {`
        .scan-line {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: rgba(0, 255, 127, 0.3);
          box-shadow: 0 0 5px rgba(0, 255, 127, 0.5);
          animation: scan 4s linear infinite;
        }
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .video-glitch {
          animation: ${isPlaying ? 'glitch 0.2s linear infinite alternate-reverse' : 'none'};
        }
        @keyframes glitch {
          0% { transform: translate(2px, -1px); }
          25% { transform: translate(-1px, 2px); }
          50% { transform: translate(1px, -2px); }
          75% { transform: translate(-2px, 1px); }
          100% { transform: translate(2px, 2px); }
        }
        .grok-text {
            font-family: 'Roboto Mono', monospace;
            fill: rgba(0, 255, 127, 0.7);
            font-size: 10px;
            animation: ${isPlaying ? 'text-flicker 1s linear infinite alternate' : 'none'};
        }
        @keyframes text-flicker {
            0% { opacity: 0.7; }
            100% { opacity: 0.9; }
        }
      `}
    </style>
    <svg width="100%" height="100%" className="video-glitch">
        <defs>
            <pattern id="grok-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 255, 127, 0.1)" strokeWidth="0.5"/>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grok-grid)" />
        <text x="10" y="20" className="grok-text">SUBJECT: METATRON Q</text>
        <text x="10" y="40" className="grok-text">VECTOR: COMPLIANCE EXPLOITATION</text>
        <text x="10" y="60" className="grok-text">RISK: CRITICAL</text>
        <text x="10" y="80" className="grok-text">STATUS: ACTIVE THREAT</text>
    </svg>
    <div className="scan-line"></div>
  </div>
);
