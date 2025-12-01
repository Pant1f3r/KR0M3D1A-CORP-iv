
// components/OscillatorAnalysis.tsx

import React from 'react';
import type { OscillatorSignal, OscillatorEvent } from '../types';
import { BarChartIcon } from './icons/BarChartIcon';
import { IntensityGauge } from './IntensityGauge';

interface OscillatorAnalysisProps {
  signal: OscillatorSignal;
  eventLog: OscillatorEvent[];
  analysisText: string;
}

export const OscillatorAnalysis: React.FC<OscillatorAnalysisProps> = ({ signal, eventLog, analysisText }) => {
  return (
    <section className="bg-cyber-surface/50 p-4 rounded-lg border border-cyber-primary/20 h-full flex flex-col min-h-[400px]">
      <div className="flex items-center gap-3 mb-2">
        <BarChartIcon className="w-6 h-6 text-cyber-primary" />
        <h3 className="text-xl font-orbitron text-cyber-primary">Oscillator Signal Analysis</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
        {/* Left: Gauge and Analysis */}
        <div className="flex flex-col gap-4">
          <div className="flex-shrink-0 flex items-center justify-center p-4 bg-cyber-bg/50 rounded-md">
            <IntensityGauge value={signal.intensity} isAttack={signal.isAttackSignal} />
          </div>
          <div className="flex-grow bg-cyber-bg/50 rounded-md p-4 overflow-y-auto max-h-[200px] md:max-h-none">
            <h4 className="font-orbitron text-cyber-accent mb-2">NEO's Interpretation</h4>
            <p className="text-sm font-roboto-mono text-cyber-dim leading-relaxed">
              {analysisText}
            </p>
          </div>
        </div>

        {/* Right: Event Log */}
        <div className="bg-cyber-bg/50 rounded-md p-4 flex flex-col min-h-0">
          <h4 className="font-orbitron text-cyber-secondary mb-2 flex-shrink-0">Attack Event Log</h4>
          <div className="overflow-y-auto flex-grow h-48 md:h-auto">
            {eventLog.length === 0 ? (
              <p className="text-sm text-cyber-dim text-center pt-8">No attack signals logged.</p>
            ) : (
              <table className="w-full text-left text-xs font-roboto-mono">
                <thead>
                  <tr className="text-cyber-dim border-b border-cyber-primary/20">
                    <th className="py-1 px-1">TIME</th>
                    <th className="py-1 px-1">SOURCE</th>
                    <th className="py-1 px-1">TRACE</th>
                    <th className="py-1 px-1 text-right">INT</th>
                  </tr>
                </thead>
                <tbody>
                  {eventLog.map((event) => (
                    <tr key={event.id} className="border-b border-cyber-surface hover:bg-cyber-surface/20">
                      <td className="py-1 px-1 text-cyber-dim whitespace-nowrap">{event.timestamp}</td>
                      <td className="py-1 px-1 text-cyber-secondary">{event.sourceSpace}</td>
                      <td className="py-1 px-1 text-cyan-400 truncate max-w-[80px]" title={event.traceVector}>{event.traceVector}</td>
                      <td className="py-1 px-1 text-cyber-secondary font-bold text-right">{event.intensity}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
