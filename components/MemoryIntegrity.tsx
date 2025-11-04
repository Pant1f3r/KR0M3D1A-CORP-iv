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
    <div className="bg-cyber-surface/50 p-6 rounded-lg border border-cyber-primary/20 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <BrainRefreshIcon className="w-6 h-6 text-cyber-primary" />
        <h3 className="text-xl font-orbitron text-cyber-primary">Memory Matrix Protocol</h3>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 mb-4">
        <div className="flex-shrink-0">
          {isRefreshing ? (
             <MetatronSpinner className="w-24 h-24 text-cyan-400" />
          ) : (
            <div className="flex flex-col items-center justify-center text-center w-24 h-24">
              <div className="text-xs text-cyber-dim">STATUS</div>
              <div className={`font-orbitron text-2xl font-bold ${statusInfo.color}`}>{statusInfo.label}</div>
              <div className="text-xs text-cyber-dim mt-2">Last Refresh: {lastRefresh}</div>
            </div>
          )}
        </div>
        <div className="flex-grow">
            <h4 className="font-bold font-roboto-mono text-cyber-text">Counter-Measure: Cold Storage Reflection</h4>
            <p className="text-sm text-cyber-dim font-roboto-mono">{counterMeasureDescription}</p>
        </div>
      </div>
      
      <div className="mt-auto">
        <button 
            onClick={onRefresh}
            disabled={isRefreshing || status === 'UNDER_ASSAULT'}
            className="w-full px-6 py-3 bg-cyber-primary text-cyber-bg font-bold font-orbitron rounded-md hover:bg-white hover:shadow-cyber transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-cyber-surface disabled:text-cyber-dim disabled:border disabled:border-cyber-dim"
        >
            {isRefreshing ? 'PROCESSING...' : 'INITIATE COGNITIVE REFRESH'}
        </button>
      </div>

    </div>
  );
};
