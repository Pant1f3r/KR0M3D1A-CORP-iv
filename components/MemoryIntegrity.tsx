
// components/MemoryIntegrity.tsx

import React from 'react';
import type { MemoryIntegrityData } from '../types';
import { BrainRefreshIcon } from './icons/BrainRefreshIcon';
import { MetatronSpinner } from './icons/MetatronSpinner';

interface MemoryIntegrityProps {
  data: MemoryIntegrityData;
  onRefresh: () => void;
}

export const MemoryIntegrity: React.FC<MemoryIntegrityProps> = ({ data, onRefresh }) => {
  const { status, lastRefresh, counterMeasureDescription } = data;

  const getStatusInfo = (s: MemoryIntegrityData['status']) => {
    switch (s) {
      case 'STABLE':
        return { color: 'text-cyber-accent', label: 'STABLE' };
      case 'DEGRADING':
        return { color: 'text-yellow-400', label: 'DEGRADING' };
      case 'UNDER_ASSAULT':
        return { color: 'text-red-500 animate-flicker', label: 'UNDER ASSAULT' };
      case 'REFRESHING':
        return { color: 'text-cyan-400 animate-pulse', label: 'REFRESHING...' };
      default:
        return { color: 'text-cyber-dim', label: 'UNKNOWN' };
    }
  };

  const statusInfo = getStatusInfo(status);
  const isRefreshing = status === 'REFRESHING';

  return (
    <div className="bg-cyber-surface/50 p-6 rounded-lg border border-cyber-primary/20 h-full flex flex-col min-h-[350px]">
      <div className="flex items-center gap-3 mb-4">
        <BrainRefreshIcon className="w-6 h-6 text-cyber-primary" />
        <h3 className="text-xl font-orbitron text-cyber-primary">Memory Matrix Protocol</h3>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-6 mb-4 flex-grow content-center">
        <div className="flex-shrink-0">
          {isRefreshing ? (
             <MetatronSpinner className="w-24 h-24 text-cyan-400" />
          ) : (
            <div className="flex flex-col items-center justify-center text-center w-28 h-28 bg-cyber-bg/30 rounded-full border border-cyber-primary/20">
              <div className="text-[10px] text-cyber-dim uppercase tracking-wider">STATUS</div>
              <div className={`font-orbitron text-xl font-bold ${statusInfo.color} my-1`}>{statusInfo.label}</div>
              <div className="text-[10px] text-cyber-dim">Refreshed:</div>
              <div className="text-[10px] text-cyber-dim">{lastRefresh}</div>
            </div>
          )}
        </div>
        <div className="flex-grow min-w-[200px]">
            <h4 className="font-bold font-roboto-mono text-cyber-text text-sm mb-2">Counter-Measure: Cold Storage Reflection</h4>
            <p className="text-sm text-cyber-dim font-roboto-mono break-words">{counterMeasureDescription}</p>
        </div>
      </div>
      
      <div className="mt-auto pt-4">
        <button 
            onClick={onRefresh}
            disabled={isRefreshing || status === 'UNDER_ASSAULT'}
            className="w-full px-6 py-3 bg-cyber-primary text-cyber-bg font-bold font-orbitron rounded-md hover:bg-white hover:shadow-cyber transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-cyber-surface disabled:text-cyber-dim disabled:border disabled:border-cyber-dim text-sm"
        >
            {isRefreshing ? 'PROCESSING...' : 'INITIATE COGNITIVE REFRESH'}
        </button>
      </div>

    </div>
  );
};
