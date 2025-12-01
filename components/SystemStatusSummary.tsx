
import React from 'react';
import { ShieldIcon } from './icons/ShieldIcon';
import { SignalIcon } from './icons/SignalIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';

interface SystemStatusSummaryProps {
  summary: string;
  riskScore: number;
  telemetry: {
    latencyMs: number;
    packetLossPercent: number;
    threatsDetected: number;
  };
}

export const SystemStatusSummary: React.FC<SystemStatusSummaryProps> = ({ summary, riskScore, telemetry }) => {
  const getStatusColor = (score: number) => {
    if (score > 80) return 'text-red-500';
    if (score > 50) return 'text-yellow-400';
    return 'text-cyber-accent';
  };
  
  const getStatusLabel = (score: number) => {
     if (score > 80) return 'CRITICAL FAILURE IMMINENT';
     if (score > 50) return 'SECURITY INTEGRITY DEGRADED';
     return 'SYSTEM NOMINAL';
  };

  const borderColor = riskScore > 80 ? 'border-red-500' : riskScore > 50 ? 'border-yellow-400' : 'border-cyber-primary';

  return (
    <div className={`bg-cyber-bg/30 border-l-4 ${borderColor} p-4 rounded-r-md mt-2 max-w-3xl relative overflow-hidden group`}>
        {/* Background animation effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>

      <div className="flex items-center gap-2 mb-2">
         <BrainCircuitIcon className={`w-5 h-5 ${getStatusColor(riskScore)}`} />
         <span className={`font-orbitron font-bold text-sm ${getStatusColor(riskScore)}`}>
            AI ANALYSIS: {getStatusLabel(riskScore)}
         </span>
      </div>
      
      <p className="text-cyber-text font-roboto-mono text-sm leading-relaxed relative z-10">
        {summary}
      </p>
      
      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-roboto-mono text-cyber-dim border-t border-cyber-dim/20 pt-2">
        <div className="flex items-center gap-1.5">
            <SignalIcon className="w-3 h-3 text-cyber-accent" />
            <span className="uppercase tracking-wider">Live Telemetry Factors:</span>
        </div>
        <span className={telemetry.latencyMs > 100 ? 'text-yellow-400' : ''}>Lat: {telemetry.latencyMs}ms</span>
        <span className={telemetry.packetLossPercent > 1 ? 'text-red-400' : ''}>Loss: {telemetry.packetLossPercent}%</span>
        <span className={telemetry.threatsDetected > 50 ? 'text-red-500 font-bold' : ''}>Threats: {telemetry.threatsDetected}</span>
      </div>
    </div>
  );
};
