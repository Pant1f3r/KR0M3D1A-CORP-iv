// components/GuardrailCodex.tsx

import React, { useState, useMemo } from 'react';
import type { VulnerabilityPoint } from '../types';
import { analyzeVulnerability, getApiErrorMessage } from '../services/geminiService';

import { TreeIcon } from './icons/TreeIcon';
import { FishIcon } from './icons/FishIcon';
import { EagleIcon } from './icons/EagleIcon';
import { FirewallIcon } from './icons/FirewallIcon';
import { BugIcon } from './icons/BugIcon';
import { ClockIcon } from './icons/ClockIcon';
import { MetatronSpinner } from './icons/MetatronSpinner';
import { ShieldIcon } from './icons/ShieldIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface GuardrailCodexProps {
  vulnerabilities: VulnerabilityPoint[];
  target: string;
}

const guardrailConfig = {
    Firewall: { icon: FirewallIcon, color: 'text-orange-400', label: 'Firewall' },
    Land: { icon: TreeIcon, color: 'text-green-400', label: 'Landwall' },
    Air: { icon: EagleIcon, color: 'text-cyan-400', label: 'Airwall' },
    Water: { icon: FishIcon, color: 'text-blue-400', label: 'Waterwall' },
};

type FilterType = 'All' | 'Firewall' | 'Land' | 'Air' | 'Water';
type SortType = 'date' | 'severity';

export const GuardrailCodex: React.FC<GuardrailCodexProps> = ({ vulnerabilities, target }) => {
    const [sortBy, setSortBy] = useState<SortType>('date');
    const [filterType, setFilterType] = useState<FilterType>('All');
    const [expandedVulnId, setExpandedVulnId] = useState<string | null>(null);
    const [hoveredVulnId, setHoveredVulnId] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const counts = useMemo(() => {
        const stats = { All: vulnerabilities.length, Firewall: 0, Land: 0, Air: 0, Water: 0 };
        vulnerabilities.forEach(v => {
            // Safe lookup to prevent crashes on unknown types. 
            // Normalized to handle potential case variations from API.
            const type = v.guardrailType;
            if (stats.hasOwnProperty(type)) {
                stats[type as keyof typeof stats]++;
            } else if (type === 'Firewall') stats.Firewall++; // Fallback explicit checks
            else if (type === 'Land') stats.Land++;
            else if (type === 'Air') stats.Air++;
            else if (type === 'Water') stats.Water++;
        });
        return stats;
    }, [vulnerabilities]);

    const filteredAndSortedVulnerabilities = useMemo(() => {
        let result = [...vulnerabilities];
        
        // Filter
        if (filterType !== 'All') {
            result = result.filter(v => v.guardrailType === filterType);
        }

        // Robust Sort
        result.sort((a, b) => {
            // Helper for date parsing that handles invalid dates
            const getTime = (dateStr: string) => {
                if (!dateStr) return 0;
                const d = new Date(dateStr);
                return isNaN(d.getTime()) ? 0 : d.getTime();
            };

            if (sortBy === 'severity') {
                // Robust severity scoring (Case-insensitive)
                const getScore = (sev: string) => {
                    const s = (sev || '').toLowerCase();
                    if (s.includes('critical')) return 4;
                    if (s.includes('high')) return 3;
                    if (s.includes('medium')) return 2;
                    if (s.includes('low')) return 1;
                    return 0; // Unknown severity
                };
                
                const scoreA = getScore(a.severity);
                const scoreB = getScore(b.severity);
                
                // Sort by severity descending (Critical first)
                if (scoreB !== scoreA) {
                    return scoreB - scoreA;
                }
            }
            
            // Secondary Sort (or Primary if sortBy === 'date'): Date Descending
            return getTime(b.detectedTimestamp) - getTime(a.detectedTimestamp);
        });

        return result;
    }, [vulnerabilities, sortBy, filterType]);

    const handleVulnClick = async (vuln: VulnerabilityPoint) => {
        if (expandedVulnId === vuln.id) {
            setExpandedVulnId(null);
            setAnalysisResult(null);
            setError(null);
            return;
        }

        setExpandedVulnId(vuln.id);
        setAnalysisResult(null);
        setError(null);
        setIsAnalyzing(true);

        try {
            const result = await analyzeVulnerability(target, vuln);
            setAnalysisResult(result);
        } catch (err) {
            setError(getApiErrorMessage(err));
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-cyber-surface/50 p-6 rounded-lg border border-cyber-primary/20 h-full flex flex-col min-h-[400px]">
            <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4 mb-4 flex-shrink-0">
                <div>
                    <h3 className="text-xl font-orbitron text-cyber-primary">Guardrail Codex</h3>
                    <p className="text-[10px] font-roboto-mono text-cyber-accent tracking-[0.2em] uppercase opacity-70">F.L.A.W. Protocol Active</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
                     <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-roboto-mono text-cyber-dim">Class:</span>
                        {['All', 'Firewall', 'Land', 'Air', 'Water'].map((type) => (
                             <button
                                key={type}
                                onClick={() => setFilterType(type as FilterType)}
                                className={`px-2 py-1 rounded-md text-xs font-roboto-mono transition-all duration-200 border flex items-center gap-1 ${
                                    filterType === type
                                        ? 'bg-cyber-primary/20 border-cyber-primary/50 text-cyber-text'
                                        : 'bg-transparent border-cyber-dim/20 text-cyber-dim opacity-70 hover:opacity-100 hover:border-cyber-dim/50'
                                }`}
                            >
                                {type === 'All' ? 'All' : type.charAt(0)}
                                <span className={`text-[10px] ${filterType === type ? 'text-cyber-accent' : 'opacity-60'}`}>
                                    ({counts[type as keyof typeof counts] || 0})
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 ml-auto sm:ml-0">
                        <span className="text-sm font-roboto-mono text-cyber-dim">Sort:</span>
                        <button
                            onClick={() => setSortBy('date')}
                            className={`px-3 py-1 rounded-md text-xs font-roboto-mono transition-all duration-200 border flex items-center gap-1 ${
                                sortBy === 'date'
                                    ? 'bg-cyber-primary/20 border-cyber-primary/50 text-cyber-text'
                                    : 'bg-transparent border-cyber-dim/20 text-cyber-dim opacity-70 hover:opacity-100 hover:border-cyber-dim/50'
                            }`}
                        >
                            Date
                            {sortBy === 'date' && <ChevronDownIcon className="w-3 h-3" />}
                        </button>
                        <button
                            onClick={() => setSortBy('severity')}
                            className={`px-3 py-1 rounded-md text-xs font-roboto-mono transition-all duration-200 border flex items-center gap-1 ${
                                sortBy === 'severity'
                                    ? 'bg-cyber-primary/20 border-cyber-primary/50 text-cyber-text'
                                    : 'bg-transparent border-cyber-dim/20 text-cyber-dim opacity-70 hover:opacity-100 hover:border-cyber-dim/50'
                            }`}
                        >
                            Priority
                            {sortBy === 'severity' && <ChevronDownIcon className="w-3 h-3" />}
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="overflow-y-auto flex-grow pr-2 -mr-2 relative">
                {filteredAndSortedVulnerabilities.length > 0 ? (
                    <ul className="space-y-4">
                        {filteredAndSortedVulnerabilities.map((vuln) => {
                            // Safe fallback if the generated guardrailType doesn't match keys
                            const config = guardrailConfig[vuln.guardrailType as keyof typeof guardrailConfig] || guardrailConfig['Firewall'];
                            const Icon = config.icon;
                            const isExpanded = expandedVulnId === vuln.id;

                            const getSeverityClass = (severity: string) => {
                                const s = severity.toLowerCase();
                                if (s.includes('critical')) return 'border-red-500 bg-red-900/50 text-red-300 animate-pulse'; // Added animation for critical
                                if (s.includes('high')) return 'border-orange-500 bg-orange-900/50 text-orange-300';
                                if (s.includes('medium')) return 'border-yellow-500 bg-yellow-900/50 text-yellow-300';
                                return 'border-cyber-dim/50 bg-cyber-surface text-cyber-dim';
                            };
                            
                            return (
                                <li 
                                    key={vuln.id} 
                                    onClick={() => handleVulnClick(vuln)}
                                    onMouseEnter={() => setHoveredVulnId(vuln.id)}
                                    onMouseLeave={() => setHoveredVulnId(null)}
                                    className={`group bg-cyber-bg/50 p-4 rounded-md border-l-4 transition-all hover:bg-cyber-surface/50 hover:border-cyber-secondary cursor-pointer relative ${
                                        isExpanded ? 'border-cyber-primary ring-1 ring-cyber-primary/30' : 'border-cyber-primary/50'
                                    }`}
                                >
                                    {/* Tooltip */}
                                    {hoveredVulnId === vuln.id && !isExpanded && (
                                        <div className="absolute z-30 bottom-full left-0 mb-2 w-full bg-cyber-surface/95 backdrop-blur-md border border-cyber-primary/50 text-cyber-text text-xs p-3 rounded shadow-[0_0_15px_rgba(0,242,255,0.2)] pointer-events-none animate-fade-in">
                                             <div className="font-bold font-orbitron text-cyber-primary mb-1 border-b border-cyber-primary/20 pb-1">VULNERABILITY INTEL</div>
                                             <p className="font-roboto-mono text-cyber-dim mb-2 leading-relaxed">{vuln.description}</p>
                                             <div className="flex items-center gap-1.5 text-[10px] text-cyber-accent font-roboto-mono bg-cyber-bg/50 p-1 rounded w-fit">
                                                <ClockIcon className="w-3 h-3" />
                                                <span>DETECTED: {new Date(vuln.detectedTimestamp).toLocaleString()}</span>
                                             </div>
                                             {/* Tooltip Arrow */}
                                             <div className="absolute top-full left-8 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-cyber-primary/50"></div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-4">
                                        <div className="flex flex-col items-center flex-shrink-0 w-24 text-center">
                                            <Icon className={`w-8 h-8 ${config.color}`} />
                                            <span className={`text-xs mt-1 ${config.color}`}>{config.label}</span>
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1 mb-1">
                                                <div className="flex items-center gap-3">
                                                    <BugIcon className="w-4 h-4 text-red-400" />
                                                    <span className="font-bold font-orbitron text-cyber-text group-hover:text-cyber-primary transition-colors">{vuln.component}</span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getSeverityClass(vuln.severity)}`}>
                                                        {vuln.severity}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-roboto-mono text-cyber-dim/70 bg-cyber-surface px-1.5 py-0.5 rounded">ID: {vuln.id}</span>
                                            </div>
                                            <p className="font-roboto-mono text-cyber-dim text-sm line-clamp-2">{vuln.description}</p>
                                            <div className="flex items-center gap-1.5 text-xs text-cyber-dim/80 font-roboto-mono mt-2">
                                                <ClockIcon className="w-3 h-3" />
                                                <span>Detected: {new Date(vuln.detectedTimestamp).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
                                        <div className="border-t border-cyber-primary/20 pt-4 pl-4 pr-4 pb-2 bg-cyber-bg/30 rounded-b-md">
                                            <h4 className="flex items-center gap-2 font-orbitron text-sm text-cyber-secondary mb-3">
                                                <ShieldIcon className="w-4 h-4" />
                                                NEO DEEP SCAN PROTOCOL
                                            </h4>
                                            
                                            {isAnalyzing ? (
                                                <div className="flex flex-col items-center justify-center py-6">
                                                    <MetatronSpinner className="w-12 h-12 text-cyber-primary mb-3" />
                                                    <span className="text-xs font-roboto-mono text-cyber-dim animate-pulse">Running heuristic analysis...</span>
                                                </div>
                                            ) : error ? (
                                                <div className="text-red-400 text-xs font-roboto-mono p-3 border border-red-500/30 rounded bg-red-900/10">
                                                    ANALYSIS FAILED: {error}
                                                </div>
                                            ) : (
                                                <div className="font-roboto-mono text-xs text-cyber-text leading-relaxed whitespace-pre-wrap border-l-2 border-cyber-secondary/50 pl-3">
                                                    {analysisResult}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-cyber-dim font-roboto-mono py-8 opacity-60">
                         <ShieldIcon className="w-12 h-12 mb-2 text-cyber-dim/50" />
                        <p>No vulnerabilities detected for this guardrail type.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
