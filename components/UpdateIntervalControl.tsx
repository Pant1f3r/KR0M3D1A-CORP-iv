import React from 'react';
import { ClockIcon } from './icons/ClockIcon';

interface UpdateIntervalControlProps {
  interval: number;
  onIntervalChange: (interval: number) => void;
}

export const UpdateIntervalControl: React.FC<UpdateIntervalControlProps> = ({ interval, onIntervalChange }) => {
  return (
    <div className="flex items-center gap-2 bg-cyber-surface/50 px-3 py-1.5 rounded-md border border-cyber-primary/50">
      <ClockIcon className="w-4 h-4 text-cyber-primary" />
      <label htmlFor="interval-slider" className="text-sm font-roboto-mono text-cyber-dim whitespace-nowrap">
        Rate:
      </label>
      <input
        id="interval-slider"
        type="range"
        min="1000"
        max="10000"
        step="500"
        value={interval}
        onChange={(e) => onIntervalChange(Number(e.target.value))}
        className="w-20 md:w-24 appearance-none cursor-pointer bg-transparent focus:outline-none"
        aria-label="Update interval slider"
      />
      <span className="text-sm font-roboto-mono text-cyber-accent w-10 text-right">
        {(interval / 1000).toFixed(1)}s
      </span>
    </div>
  );
};
