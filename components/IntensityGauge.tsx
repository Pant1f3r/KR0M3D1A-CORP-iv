// components/IntensityGauge.tsx

import React from 'react';

interface IntensityGaugeProps {
  value: number;
  isAttack: boolean;
}

export const IntensityGauge: React.FC<IntensityGaugeProps> = ({ value, isAttack }) => {
  const getScoreColor = (v: number) => {
    if (v > 75 || isAttack) return 'text-cyber-secondary';
    if (v > 50) return 'text-yellow-400';
    return 'text-cyber-accent';
  };

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const normalizedValue = Math.min(100, Math.max(0, value));
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;
  const colorClass = getScoreColor(normalizedValue);

  return (
    <div className="relative w-36 h-36">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="text-cyber-surface"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
        />
        {/* Progress circle */}
        <circle
          className={colorClass}
          strokeWidth="8"
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50"
          cy="50"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 0.3s ease-out, stroke 0.3s ease-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-orbitron text-4xl ${colorClass} ${isAttack ? 'animate-flicker' : ''}`}>
          {Math.round(normalizedValue)}
        </span>
        <span className="text-xs text-cyber-dim">INTENSITY</span>
      </div>
    </div>
  );
};