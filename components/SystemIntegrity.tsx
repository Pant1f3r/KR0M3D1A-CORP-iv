
// components/SystemIntegrity.tsx

import React from 'react';
// FIX: Rename the imported type to avoid a name conflict with the component.
import type { SystemIntegrity as SystemIntegrityType } from '../types';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { WaveformIcon } from './icons/WaveformIcon';
import { AtomIcon } from './icons/AtomIcon';

interface SystemIntegrityProps {
  data: SystemIntegrityType;
}

const IntegrityGauge: React.FC<{ score: number }> = ({ score }) => {
  const getScoreColor = (s: number) => {
    if (s < 50) return 'text-red-500';
    if (s < 80) return 'text-yellow-400';
    return 'text-cyber-accent';
  };

  const circumference = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="text-cyber-surface"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
        />
        {/* Progress circle */}
        <circle
          className={getScoreColor(score)}
          strokeWidth="8"
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
            transition: 'stroke-dashoffset 0.5s ease-out',
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-orbitron text-4xl ${getScoreColor(score)}`}>{score}</span>
        <span className="text-xs text-cyber-dim">INTEGRITY</span>
      </div>
    </div>
  );
};

const SubMetric: React.FC<{ icon: React.ElementType; label: string; value: number; lowerIsBetter?: boolean }> = ({ icon: Icon, label, value, lowerIsBetter = false }) => {
    const getValueColor = (val: number) => {
        const isBad = lowerIsBetter ? val > 50 : val < 50;
        const isAverage = lowerIsBetter ? (val > 20 && val <=50) : (val >= 50 && val < 80);
        if (isBad) return 'text-red-500';
        if (isAverage) return 'text-yellow-400';
        return 'text-cyber-accent';
    };
    return (
        <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-1">
                <Icon className="w-5 h-5 text-cyber-dim" />
                <span className="text-sm font-roboto-mono text-cyber-dim">{label}</span>
            </div>
            <p className={`font-orbitron text-xl ${getValueColor(value)}`}>{value}%</p>
        </div>
    );
};


export const SystemIntegrity: React.FC<SystemIntegrityProps> = ({ data }) => {
    const { integrityScore, cognitiveDrift, signalNoise, quantumLock, status } = data;
    
    // FIX: Use the renamed type here to resolve the name conflict.
    const getStatusInfo = (s: SystemIntegrityType['status']) => {
        switch (s) {
            case 'NOMINAL': return { color: 'border-cyber-accent', textColor: 'text-cyber-accent', label: 'SYSTEM NOMINAL' };
            case 'RECALIBRATING': return { color: 'border-yellow-400', textColor: 'text-yellow-400', label: 'RECALIBRATING...' };
            case 'DEGRADED': return { color: 'border-orange-400', textColor: 'text-orange-400', label: 'PERFORMANCE DEGRADED' };
            case 'INTERFACE_FLUX': return { color: 'border-purple-400', textColor: 'text-purple-400', label: 'INTERFACE IN FLUX' };
            case 'COMPROMISED': return { color: 'border-red-500', textColor: 'text-red-500', label: 'INTEGRITY COMPROMISED' };
            default: return { color: 'border-cyber-dim', textColor: 'text-cyber-dim', label: 'STATUS UNKNOWN' };
        }
    };
    
    const statusInfo = getStatusInfo(status);

    return (
        <div className={`bg-cyber-surface/50 p-6 rounded-lg border-t-4 ${statusInfo.color} h-full flex flex-col justify-between min-h-[350px]`}>
             {/* Title and Status */}
            <div className="text-center mb-4">
                <h3 className="text-xl font-orbitron text-cyber-primary">System Integrity</h3>
                <p className={`mt-2 text-xl font-orbitron ${statusInfo.textColor} ${status === 'RECALIBRATING' || status === 'COMPROMISED' || status === 'INTERFACE_FLUX' ? 'animate-flicker' : ''}`}>
                    {statusInfo.label}
                </p>
            </div>
            
            {/* Center: Main Gauge */}
            <div className="flex justify-center my-4">
                <IntegrityGauge score={integrityScore} />
            </div>
            
            {/* Sub-metrics */}
            <div className="grid grid-cols-3 gap-2 text-center mt-4 pt-4 border-t border-cyber-primary/10">
                <SubMetric icon={BrainCircuitIcon} label="Drift" value={cognitiveDrift} lowerIsBetter />
                <SubMetric icon={WaveformIcon} label="Noise" value={signalNoise} lowerIsBetter />
                <SubMetric icon={AtomIcon} label="Lock" value={quantumLock} />
            </div>
        </div>
    );
};
