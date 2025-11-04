
import React from 'react';
import { WifiIcon } from './icons/WifiIcon';

interface RealtimeDataToggleProps {
  isRealtime: boolean;
  onToggle: () => void;
}

export const RealtimeDataToggle: React.FC<RealtimeDataToggleProps> = ({ isRealtime, onToggle }) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-cyber-surface hover:bg-cyber-primary/20 border border-cyber-primary/50 rounded-md text-sm font-roboto-mono transition-all duration-300"
      aria-pressed={isRealtime}
    >
      <WifiIcon className={`w-4 h-4 transition-colors ${isRealtime ? 'text-cyber-accent animate-pulse' : 'text-cyber-dim'}`} />
      <span className={isRealtime ? 'text-cyber-accent' : 'text-cyber-dim'}>
        LIVE FEED: {isRealtime ? 'ACTIVE' : 'PAUSED'}
      </span>
    </button>
  );
};
