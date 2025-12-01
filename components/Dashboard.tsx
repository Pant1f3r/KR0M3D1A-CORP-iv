// components/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import type { AnalysisData, OscillatorEvent } from '../types';
import { StatCard } from './StatCard';
import { LatencyChart } from './LatencyChart';
import { RiskRadarChart } from './RiskRadarChart';
import { VirtualReader } from './VirtualReader';
import { ExportControl } from './ExportControl';
import { ThreatDistributionChart } from './ThreatDistributionChart';
import { ComplianceChart } from './ComplianceChart';
import { ResourceUtilizationDisplay } from './ResourceUtilizationDisplay';
import { ThreatActorCard } from './ThreatActorCard';
import { CognitiveOverride } from './CognitiveOverride';
import { SecurityPosture } from './SecurityPosture';
import { GuardrailCodex } from './GuardrailCodex';
import { SystemIntegrity } from './SystemIntegrity';
import { CrimTechDossier } from './CrimTechDossier';
import { Oscillator } from './Oscillator';
import { OscillatorAnalysis } from './OscillatorAnalysis';
import { BugBountyProgram } from './BugBountyProgram';
import { IncidentResponse } from './IncidentResponse';
import { GuardrailHelix } from './GuardrailHelix';
import { MemoryIntegrity } from './MemoryIntegrity';
import { PatchworkProtocol } from './PatchworkProtocol';
import { FirewallPanel } from './FirewallPanel';
import { LegalDisclaimer } from './LegalDisclaimer';

import { ServerIcon } from './icons/ServerIcon';
import { CrosshairIcon } from './icons/CrosshairIcon';
import { GlobeIcon } from './icons/GlobeIcon';
import { BuildingIcon } from './icons/BuildingIcon';
import { BugIcon } from './icons/BugIcon';
import { ChecklistIcon } from './icons/ChecklistIcon';
import { KeyStatsAnalysis } from './KeyStatsAnalysis';
import { RealtimeDataToggle } from './RealtimeDataToggle';
import { UpdateIntervalControl } from './UpdateIntervalControl';
import { JurisAI } from './JurisAI';
import { SystemStatusSummary } from './SystemStatusSummary';
import { WifiIcon } from './icons/WifiIcon';

// Icons for Tabs
import { ShieldIcon } from './icons/ShieldIcon';
import { SignalIcon } from './icons/SignalIcon';
import { EyeIcon } from './icons/EyeIcon';
import { GavelIcon } from './icons/GavelIcon';
import { NodeClusterIcon } from './icons/NodeClusterIcon';

interface DashboardProps {
  data: AnalysisData;
  target: string;
  isRealtime: boolean;
  onToggleRealtime: () => void;
  updateInterval: number;
  onIntervalChange: (interval: number) => void;
  oscillatorEventLog: OscillatorEvent[];
  onMemoryRefresh: () => void;
}

type TabId = 'command' | 'intelligence' | 'signals' | 'defense' | 'governance';

export const Dashboard: React.FC<DashboardProps> = ({ 
  data, target, isRealtime, onToggleRealtime, updateInterval, onIntervalChange, oscillatorEventLog, onMemoryRefresh
}) => {
  // Destructure with default fallbacks to prevent crashes if Gemini API returns partial data
  const { 
    summary = "System analysis pending...",
    overallRiskScore = 0,
    keyStats = { latencyMs: 0, packetLossPercent: 0, threatsDetected: 0, breachProbability: 0 },
    latencyData = [],
    riskProfile = [],
    systemInfo = { ipAddress: '0.0.0.0', hostname: 'unknown', location: 'unknown', isp: 'unknown' },
    threatDistribution = [],
    complianceData = [],
    resourceUtilization = { cpu: 0, memory: 0, network: 0 },
    systemEvents = [],
    knownThreatActors = [],
    recommendations = [],
    vulnerabilityPoints = [],
    securityPosture = { cyberkuberneticNodeStatus: 'Unknown', cyberneticInterfaceLock: 'Unknown', quantumEditProtocol: 'Unknown', heuristicCoreAlignment: 'Unknown', cmmcComplianceLevel: 'Unknown', ctemStatus: 'Unknown' },
    systemIntegrity = { integrityScore: 0, cognitiveDrift: 0, signalNoise: 0, quantumLock: 0, status: 'NOMINAL' },
    keyStatsAnalysis = { latency: '', packetLoss: '', threats: '', breachProbability: '' },
    humanDossier = [],
    aiDossier = [],
    unknownEntityDossier = [],
    oscillatorSignal = { sourceSpace: 'Background Noise', intensity: 0, isAttackSignal: false, fibonacciSequenceStep: 0 },
    oscillatorAnalysis = "No signal data available.",
    bugBountyProgram = { disclosureEmail: '', rewardPolicy: '', sampleReports: [] },
    incidentResponse = { ddosProtocol: '', malwareProtocol: '', reportingDirectory: [] },
    guardrailHelixAnalysis = { explanation: '', basePairs: [] },
    memoryIntegrity = { status: 'STABLE', lastRefresh: 'N/A', counterMeasureDescription: '' },
    patchworkProtocol = { status: 'STABLE', lastPatch: 'N/A', activePatches: 0, patchLog: [] },
    firewallData = { status: 'OFFLINE', uptime: '0m', activeConnections: 0, blockedRequests: 0, rules: [] }
  } = data;
  
  const [activeTab, setActiveTab] = useState<TabId>('command');
  const [transmissionStats, setTransmissionStats] = useState({ tx: 120, rx: 450, ping: 12 });

  // Simulate real-time network transmission fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
        setTransmissionStats({
            tx: Math.floor(Math.random() * 500) + 800, // Mb/s
            rx: Math.floor(Math.random() * 800) + 2000, // Mb/s
            ping: Math.floor(Math.random() * 10) + 8 // ms
        });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: 'Live Latency', value: keyStats.latencyMs, unit: 'ms', icon: ServerIcon },
    { label: 'Packet Loss', value: keyStats.packetLossPercent, unit: '%', icon: ServerIcon },
    { label: 'Active Threats', value: keyStats.threatsDetected, icon: BugIcon },
    { label: 'Breach Probability', value: keyStats.breachProbability, unit: '%', icon: ChecklistIcon }
  ];

  const getRiskColor = (score: number) => {
    if (score > 75) return 'text-red-500 animate-flicker';
    if (score > 50) return 'text-yellow-400';
    return 'text-cyber-accent';
  };

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'command', label: 'Command Overview', icon: NodeClusterIcon },
    { id: 'intelligence', label: 'Threat Intelligence', icon: EyeIcon },
    { id: 'signals', label: 'Signal Core', icon: SignalIcon },
    { id: 'defense', label: 'Defense Protocols', icon: ShieldIcon },
    { id: 'governance', label: 'Governance & Action', icon: GavelIcon },
  ];

  return (
    <div className="space-y-6">
        {/* Real-Time Transmission Status Bar */}
        <div className="bg-cyber-surface/30 border-y border-cyber-primary/20 py-2 px-4 flex flex-wrap items-center justify-between gap-4 font-roboto-mono text-xs text-cyber-dim overflow-hidden">
            <div className="flex items-center gap-2">
                <WifiIcon className="w-4 h-4 text-cyber-secondary animate-pulse" />
                <span className="text-cyber-secondary tracking-wider font-bold">LIVE NETWORK TRANSMISSION</span>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-cyber-primary">UPLINK:</span>
                    <span className="w-16 inline-block text-right text-cyber-text">{transmissionStats.tx} MB/s</span>
                    <div className="w-12 h-1 bg-cyber-bg/50 rounded-full overflow-hidden">
                         <div className="h-full bg-cyber-primary animate-pulse" style={{width: `${(transmissionStats.tx / 1500) * 100}%`}}></div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-cyber-accent">DOWNLINK:</span>
                    <span className="w-16 inline-block text-right text-cyber-text">{transmissionStats.rx} MB/s</span>
                    <div className="w-12 h-1 bg-cyber-bg/50 rounded-full overflow-hidden">
                         <div className="h-full bg-cyber-accent animate-pulse" style={{width: `${(transmissionStats.rx / 3000) * 100}%`}}></div>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                    <span className="text-cyber-dim">PING:</span>
                    <span className="text-cyber-text">{transmissionStats.ping}ms</span>
                </div>
                <div className="hidden md:flex items-center gap-2 text-[10px] opacity-70">
                    <span className="text-cyber-dim">ENCRYPTION:</span>
                    <span className="text-cyber-secondary">AES-4096-GCM (ACTIVE)</span>
                </div>
            </div>
        </div>

        {/* Global Header Section - Always Visible */}
        <section className="bg-cyber-surface/50 p-6 rounded-lg border border-cyber-primary/20">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-grow">
                    <h2 className="text-3xl font-orbitron text-cyber-primary">Forensic Trace Report: <span className="text-white">{target}</span></h2>
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm font-roboto-mono text-cyber-dim">
                        <div className="flex items-center gap-2"><GlobeIcon className="w-4 h-4 text-cyber-accent" /> IP: {systemInfo.ipAddress}</div>
                        <div className="flex items-center gap-2"><ServerIcon className="w-4 h-4 text-cyber-accent" /> Host: {systemInfo.hostname}</div>
                        <div className="flex items-center gap-2"><CrosshairIcon className="w-4 h-4 text-cyber-accent" /> Location: {systemInfo.location}</div>
                        <div className="flex items-center gap-2"><BuildingIcon className="w-4 h-4 text-cyber-accent" /> ISP: {systemInfo.isp}</div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4 md:items-end flex-shrink-0">
                    <div className="text-center">
                        <div className="text-lg font-roboto-mono text-cyber-dim">Criticality Score</div>
                        <div className={`text-5xl font-orbitron ${getRiskColor(overallRiskScore)}`}>{overallRiskScore}</div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2">
                      <UpdateIntervalControl interval={updateInterval} onIntervalChange={onIntervalChange} />
                      <RealtimeDataToggle isRealtime={isRealtime} onToggle={onToggleRealtime} />
                      <ExportControl data={data} target={target} />
                    </div>
                </div>
            </div>
        </section>

        {/* Navigation Tabs - Page by Page Setup */}
        <nav className="flex overflow-x-auto border-b border-cyber-primary/20 no-scrollbar">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-2 px-6 py-3 font-roboto-mono text-sm transition-all duration-300 border-b-2 whitespace-nowrap
                            ${isActive 
                                ? 'border-cyber-primary text-cyber-primary bg-cyber-primary/5' 
                                : 'border-transparent text-cyber-dim hover:text-cyber-text hover:bg-cyber-surface/30'
                            }
                        `}
                    >
                        <Icon className={`w-4 h-4 ${isActive ? 'animate-pulse' : ''}`} />
                        {tab.label}
                    </button>
                );
            })}
        </nav>

        {/* Page Content */}
        <div className="min-h-[600px] animate-fade-in">
            
            {/* COMMAND OVERVIEW PAGE */}
            {activeTab === 'command' && (
                <div className="space-y-6">
                    <SystemStatusSummary 
                        summary={summary}
                        riskScore={overallRiskScore}
                        telemetry={keyStats}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {statCards.map(stat => <StatCard key={stat.label} {...stat} />)}
                    </div>

                    <KeyStatsAnalysis analysis={keyStatsAnalysis} />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6 min-w-0">
                            <div className="bg-cyber-surface/50 p-4 rounded-lg border border-cyber-primary/20 min-w-0">
                                <h3 className="text-xl font-orbitron text-cyber-primary mb-4">Latency Signal Trace</h3>
                                <LatencyChart data={latencyData} />
                            </div>
                            <div className="bg-cyber-surface/50 p-4 rounded-lg border border-cyber-primary/20 min-w-0">
                                <h3 className="text-xl font-orbitron text-cyber-primary mb-4">Live Network Stream</h3>
                                <VirtualReader events={systemEvents} />
                            </div>
                        </div>
                        <div className="space-y-6 min-w-0">
                            <div className="bg-cyber-surface/50 p-4 rounded-lg border border-cyber-primary/20 min-w-0">
                                <h3 className="text-xl font-orbitron text-cyber-primary mb-4">Risk Profile</h3>
                                <RiskRadarChart data={riskProfile} />
                            </div>
                            <div className="bg-cyber-surface/50 p-4 rounded-lg border border-cyber-primary/20 min-w-0">
                                <h3 className="text-xl font-orbitron text-cyber-primary mb-4">Threat Distribution</h3>
                                <ThreatDistributionChart data={threatDistribution} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* INTELLIGENCE PAGE */}
            {activeTab === 'intelligence' && (
                <div className="space-y-8">
                     <section>
                        <h3 className="text-2xl font-orbitron text-cyber-primary mb-4">Identified Threat Actors</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {knownThreatActors.map(actor => <ThreatActorCard key={actor.name} actor={actor} />)}
                        </div>
                    </section>
                    
                    <CrimTechDossier humanProfiles={humanDossier} aiProfiles={aiDossier} unknownEntityProfiles={unknownEntityDossier} />
                </div>
            )}

            {/* SIGNALS PAGE */}
            {activeTab === 'signals' && (
                <div className="space-y-8">
                    {/* Fixed height removed to prevent overflow issues, added min-h for consistency */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[400px]">
                        <Oscillator signal={oscillatorSignal} />
                        <OscillatorAnalysis signal={oscillatorSignal} eventLog={oscillatorEventLog} analysisText={oscillatorAnalysis} />
                    </div>

                    <h3 className="text-2xl font-orbitron text-cyber-primary mt-8 mb-4">Core System Integrity</h3>
                    {/* Updated to xl:grid-cols-3 to prevent card squashing on smaller screens */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <SystemIntegrity data={systemIntegrity} />
                        <MemoryIntegrity data={memoryIntegrity} onRefresh={onMemoryRefresh} />
                        <GuardrailHelix data={guardrailHelixAnalysis} />
                    </div>
                </div>
            )}

            {/* DEFENSE PAGE */}
            {activeTab === 'defense' && (
                <div className="space-y-6">
                     {/* Updated to xl:grid-cols-3 to prevent overlapping on medium screens (laptops/tablets) */}
                     {/* Added min-w-0 to children to ensure they respect grid tracks */}
                     <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                         <div className="xl:col-span-1 space-y-6 min-w-0">
                            <FirewallPanel data={firewallData} />
                            <IncidentResponse data={incidentResponse} />
                         </div>
                         <div className="xl:col-span-2 space-y-6 min-w-0">
                            <PatchworkProtocol data={patchworkProtocol} />
                            <GuardrailCodex vulnerabilities={vulnerabilityPoints} target={target} />
                         </div>
                     </div>
                     <BugBountyProgram data={bugBountyProgram} />
                </div>
            )}

            {/* GOVERNANCE PAGE */}
            {activeTab === 'governance' && (
                <div className="space-y-6">
                    <SecurityPosture data={securityPosture} />
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <CognitiveOverride 
                            recommendations={recommendations}
                            target={target}
                            systemInfo={systemInfo}
                            overallRiskScore={overallRiskScore}
                            vulnerabilities={vulnerabilityPoints} 
                        />
                        <JurisAI 
                        target={target} 
                        overallRiskScore={overallRiskScore}
                        vulnerabilities={vulnerabilityPoints}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-cyber-surface/50 p-4 rounded-lg border border-cyber-primary/20">
                            <h3 className="text-xl font-orbitron text-cyber-primary mb-4">Compliance Trends</h3>
                            <ComplianceChart data={complianceData} />
                        </div>
                        <div className="bg-cyber-surface/50 p-4 rounded-lg border border-cyber-primary/20">
                            <h3 className="text-xl font-orbitron text-cyber-primary mb-4">Resource Utilization</h3>
                            <ResourceUtilizationDisplay data={resourceUtilization} />
                        </div>
                    </div>
                </div>
            )}
        </div>
        
        <LegalDisclaimer />
    </div>
  );
};