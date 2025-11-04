// components/GuardrailCodex.tsx

import React, { useState, useMemo } from 'react';
import type { VulnerabilityPoint } from '../types';

import { TreeIcon } from './icons/TreeIcon';
import { FishIcon } from './icons/FishIcon';
import { EagleIcon } from './icons/EagleIcon';
import { BookIcon } from './icons/BookIcon';
import { BugIcon } from './icons/BugIcon';
import { ClockIcon } from './icons/ClockIcon';

interface GuardrailCodexProps {
  vulnerabilities: VulnerabilityPoint[];
}

const guardrailConfig = {
    Land: { icon: TreeIcon, color: 'text-green-400', label: 'Physical Guardrail' },
    Water: { icon: FishIcon, color: 'text-blue-400', label: 'Protocol Guardrail' },
    Air: { icon: EagleIcon, color: 'text-cyan-400', label: 'Network Guardrail' },
    Firewall: { icon: BookIcon, color: 'text-orange-400', label: 'Firewall Guardrail' },
};

export const GuardrailCodex: React.FC<GuardrailCodexProps> = ({ vulnerabilities }) => {
    const [sortBy, setSortBy] = useState<'date' | 'severity'>('date');

    const severityOrder: Record<VulnerabilityPoint['severity'], number> = {
        'Critical': 4,
        'High': 3,
        'Medium': 2,
        'Low': 1,
    };
    
    const sortedVulnerabilities = useMemo(() => {
        const sortable = [...vulnerabilities];
        sortable.sort((a, b) => {
            if (sortBy === 'severity') {
                const severityComparison = severityOrder[b.severity] - severityOrder[a.severity];
                if (severityComparison !== 0) return severityComparison;
            }
            // Default sort or tie-breaker is by date
            return new Date(b.detectedTimestamp).getTime() - new Date(a.detectedTimestamp).getTime();
        });
        return sortable;
    }, [vulnerabilities, sortBy]);

    return (
        <div className="bg-cyber-surface/50 p-6 rounded-lg border border-cyber-primary/20 h-full">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <h3 className="text-xl font-orbitron text-cyber-primary">Guardrail Codex: Identified Bugs</h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-roboto-mono text-cyber-dim">Sort By:</span>
                    <button
                        onClick={() => setSortBy('date')}
                        className={`px-3 py-1 rounded-md text-xs font-roboto-mono transition-all duration-200 ${
                            sortBy === 'date'
                                ? 'bg-cyber-primary/20 border border-cyber-primary/50 text-cyber-text'
                                : 'bg-transparent border border-cyber-dim/20 text-cyber-dim opacity-70 hover:opacity-100 hover:border-cyber-dim/50'
                        }`}
                    >
                        Date
                    </button>
                    <button
                        onClick={() => setSortBy('severity')}
                        className={`px-3 py-1 rounded-md text-xs font-roboto-mono transition-all duration-200 ${
                            sortBy === 'severity'
                                ? 'bg-cyber-primary/20 border border-cyber-primary/50 text-cyber-text'
                                : 'bg-transparent border border-cyber-dim/20 text-cyber-dim opacity-70 hover:opacity-100 hover:border-cyber-dim/50'
                        }`}
                    >
                        Priority
                    </button>
                </div>
            </div>
            
            {sortedVulnerabilities.length > 0 ? (
                <ul className="space-y-4">
                    {sortedVulnerabilities.map((vuln) => {
                        const config = guardrailConfig[vuln.guardrailType];
                        const Icon = config.icon;

                        const getSeverityClass = (severity: VulnerabilityPoint['severity']) => {
                            switch (severity) {
                                case 'Critical': return 'border-red-500 bg-red-900/50 text-red-300';
                                case 'High': return 'border-orange-500 bg-orange-900/50 text-orange-300';
                                case 'Medium': return 'border-yellow-500 bg-yellow-900/50 text-yellow-300';
                                default: return 'border-cyber-dim/50 bg-cyber-surface text-cyber-dim';
                            }
                        };
                        
                        return (
                            <li key={vuln.id} className="bg-cyber-bg/50 p-4 rounded-md border-l-4 border-cyber-primary/50 transition-all hover:bg-cyber-surface/50 hover:border-cyber-secondary">
                                <div className="flex items-start gap-4">
                                    <div className="flex flex-col items-center flex-shrink-0 w-24 text-center">
                                        <Icon className={`w-8 h-8 ${config.color}`} />
                                        <span className={`text-xs mt-1 ${config.color}`}>{config.label}</span>
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1 mb-1">
                                            <div className="flex items-center gap-3">
                                                <BugIcon className="w-4 h-4 text-red-400" />
                                                <span className="font-bold font-orbitron text-cyber-text">{vuln.component}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getSeverityClass(vuln.severity)}`}>
                                                    {vuln.severity}
                                                </span>
                                            </div>
                                            <span className="text-xs font-roboto-mono text-cyber-dim/70 bg-cyber-surface px-1.5 py-0.5 rounded">ID: {vuln.id}</span>
                                        </div>
                                        <p className="font-roboto-mono text-cyber-dim text-sm">{vuln.description}</p>
                                        <div className="flex items-center gap-1.5 text-xs text-cyber-dim/80 font-roboto-mono mt-2">
                                            <ClockIcon className="w-3 h-3" />
                                            <span>Detected: {new Date(vuln.detectedTimestamp).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <p className="text-cyber-dim font-roboto-mono text-center py-4">No significant bugs detected at guardrail intersections.</p>
            )}
        </div>
    );
};