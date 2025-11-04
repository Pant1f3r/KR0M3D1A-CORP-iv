
import React from 'react';
import type { AnalysisData } from '../types';
import { ServerIcon } from './icons/ServerIcon';
import { BugIcon } from './icons/BugIcon';
import { ChecklistIcon } from './icons/ChecklistIcon';

interface KeyStatsAnalysisProps {
  analysis: AnalysisData['keyStatsAnalysis'];
}

const AnalysisItem: React.FC<{ icon: React.ElementType; label: string; text: string }> = ({ icon: Icon, label, text }) => (
    <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-cyber-secondary flex-shrink-0 mt-1" />
        <div>
            <h4 className="font-orbitron text-cyber-text">{label}</h4>
            <p className="text-sm font-roboto-mono text-cyber-dim">{text}</p>
        </div>
    </div>
);

export const KeyStatsAnalysis: React.FC<KeyStatsAnalysisProps> = ({ analysis }) => {
    return (
        <section className="bg-cyber-surface/50 p-6 rounded-lg border border-cyber-primary/20">
            <h3 className="text-xl font-orbitron text-cyber-primary mb-4">Key Telemetry Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <AnalysisItem icon={ServerIcon} label="Latency / Packet Loss" text={`${analysis.latency} ${analysis.packetLoss}`} />
                <AnalysisItem icon={BugIcon} label="Threats Detected" text={analysis.threats} />
                <AnalysisItem icon={ChecklistIcon} label="Breach Probability" text={analysis.breachProbability} />
            </div>
        </section>
    )
}
