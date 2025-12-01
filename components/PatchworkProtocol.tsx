
// components/PatchworkProtocol.tsx

import React from 'react';
import type { PatchworkData } from '../types';
import { PatchworkIcon } from './icons/PatchworkIcon';
import { MetatronSpinner } from './icons/MetatronSpinner';
import { AlertIcon } from './icons/AlertIcon';
import { WrenchIcon } from './icons/WrenchIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { InfoIcon } from './icons/InfoIcon';

interface PatchworkProtocolProps {
  data: PatchworkData;
}

export const PatchworkProtocol: React.FC<PatchworkProtocolProps> = ({ data }) => {
  const { status, lastPatch, activePatches, patchLog } = data;

  const getStatusInfo = (s: PatchworkData['status']) => {
    switch (s) {
      case 'STABLE':
        return { color: 'text-cyber-accent', label: 'STABLE', icon: CheckCircleIcon };
      case 'ANOMALY_DETECTED':
        return { color: 'text-yellow-400', label: 'ANOMALY DETECTED', icon: AlertIcon };
      case 'APPLYING_PATCH':
        return { color: 'text-cyan-400 animate-pulse', label: 'APPLYING PATCH...', icon: WrenchIcon };
      case 'AUTONOMOUS':
        return { color: 'text-cyan-400 animate-pulse', label: 'AUTONOMOUS VANGUARD ACTIVE', icon: MetatronSpinner };
      default:
        return { color: 'text-cyber-dim', label: 'UNKNOWN', icon: InfoIcon };
    }
  };
  
  const statusInfo = getStatusInfo(status);
  const StatusIcon = statusInfo.icon;

  const formatTimestamp = (timestamp: string) => {
    if (timestamp === 'Just now') return timestamp;
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return timestamp; // Return original if invalid
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
        return timestamp;
    }
  };

  return (
    <div className="bg-cyber-surface/50 p-6 rounded-lg border border-cyber-primary/20 flex flex-col min-h-[300px]">
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <PatchworkIcon className="w-6 h-6 text-cyber-primary" />
        <h3 className="text-xl font-orbitron text-cyber-primary">System Patchwork</h3>
      </div>

      <div className="text-center mb-4 flex-shrink-0 w-full">
        <div className="text-xs text-cyber-dim mb-1">PROTOCOL STATUS</div>
        {/* Adjusted text size and wrapping for robustness */}
        <div className={`font-orbitron text-lg md:text-2xl font-bold ${statusInfo.color} flex flex-wrap items-center justify-center gap-2 text-center break-words`}>
            <StatusIcon className={`w-6 h-6 flex-shrink-0 ${status === 'AUTONOMOUS' ? 'w-8 h-8' : ''}`}/>
            <span className="break-words max-w-full">{statusInfo.label}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap justify-around text-center mb-4 border-y border-cyber-primary/10 py-2 flex-shrink-0 gap-4">
        <div>
            <div className="font-orbitron text-2xl text-cyber-text">{activePatches}</div>
            <div className="text-xs text-cyber-dim">ACTIVE PATCHES</div>
        </div>
        <div>
            <div className="font-orbitron text-2xl text-cyber-text">{lastPatch}</div>
            <div className="text-xs text-cyber-dim">LAST PATCH</div>
        </div>
      </div>

      <div className="flex-grow flex flex-col min-h-0">
        <h4 className="font-roboto-mono text-sm text-cyber-dim mb-2 flex-shrink-0">Live Patch Feed:</h4>
        <div className="overflow-y-auto pr-2 flex-grow max-h-[200px] md:max-h-none">
          {patchLog.length > 0 ? (
            <ul className="space-y-2">
              {patchLog.map(log => (
                <li key={log.id} className="text-xs font-roboto-mono flex items-start gap-2">
                  <span className="text-cyber-dim/70 w-20 flex-shrink-0">{formatTimestamp(log.timestamp)}</span>
                  <span className={`break-words ${log.status === 'APPLIED' ? 'text-cyber-accent' : 'text-red-500'}`}>{log.description}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-cyber-dim text-center">Awaiting patch activity...</p>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-cyber-primary/20 flex-shrink-0">
            <h4 className="font-orbitron text-cyber-accent">Vanguard Mandate</h4>
            <p className="text-xs text-cyber-dim font-roboto-mono mt-1 leading-relaxed">
                Vanguard bots are engaged, applying continuous, autonomous patchwork to maintain the integrity of critical digital infrastructure as per legal mandate.
            </p>
      </div>

    </div>
  );
};
