// components/Dashboard.tsx

import React from 'react';
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

export const Dashboard: React.FC<DashboardProps> = ({ 
  data, target, isRealtime, onToggleRealtime, updateInterval, onIntervalChange, oscillatorEventLog, onMemoryRefresh
}) => {
  const { 
    summary, overallRiskScore, keyStats, latencyData, riskProfile, systemInfo, 
    threatDistribution, complianceData, resourceUtilization, systemEvents,
    knownThreatActors, recommendations, vulnerabilityPoints, securityPosture,
    systemIntegrity, keyStatsAnalysis, humanDossier, aiDossier, unknownEntityDossier,
    oscillatorSignal, oscillatorAnalysis, bugBountyProgram, incidentResponse,
    guardrailHelixAnalysis, memoryIntegrity, patchworkProtocol
  } = data;
  
  const statCards = [
    { label: 'Latency', value: keyStats.latencyMs, unit: 'ms', icon: ServerIcon },
    { label: 'Packet Loss', value: keyStats.packetLossPercent, unit: '%', icon: ServerIcon },
    { label: 'Threats Detected', value: keyStats.threatsDetected, icon: BugIcon },
    { label: 'Breach Probability', value: keyStats.breachProbability, unit: '%', icon: ChecklistIcon }
  ];

  const getRiskColor = (score: number) => {
    if (score > 75) return 'text-red-500 animate-flicker';
    if (score > 50) return 'text-yellow-400';
    return 'text-cyber-accent';
  };

  return (
    <div className="space-y-8">
        {/* Header Section */}
        <section className="bg-cyber-surface/50 p-6 rounded-lg border border-cyber-primary/20">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                    <h2 className="text-3xl font-orbitron text-cyber-primary">Ghost Trace Report: <span className="text-white">{target}</span></h2>
                    <p className="text-cyber-dim mt-2 max-w-3xl">{summary}</p>
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-roboto-mono text-cyber-dim">
                        <div className="flex items-center gap-2"><GlobeIcon className="w-4 h-4 text-cyber-accent" /> IP: {systemInfo.ipAddress}</div>
                        <div className="flex items-center gap-2"><ServerIcon className="w-4 h-4 text-cyber-accent" /> Host: {systemInfo.hostname}</div>
                        <div className="flex items-center gap-2"><CrosshairIcon className="w-4 h-4 text-cyber-accent" /> Location: {systemInfo.location}</div>
                        <div className="flex items-center gap-2"><BuildingIcon className="w-4 h-4 text-cyber-accent" /> ISP: {systemInfo.isp}</div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-4 md:items-end flex-shrink-0">
                    <div className="text-center">
                        <div className="text-lg font-roboto-mono text-cyber-dim">Overall Risk</div>
                        <div className={`text-7xl font-orbitron ${getRiskColor(overallRiskScore)}`}>{overallRiskScore}</div>
                    </div>
                    <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-2">
                      <UpdateIntervalControl interval={updateInterval} onIntervalChange={onIntervalChange} />
                      <RealtimeDataToggle isRealtime={isRealtime} onToggle={onToggleRealtime} />
                      <ExportControl data={data} target={target} />
                    </div>
                </div>
            </div>
        </section>

        {/* Key Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map(stat => <StatCard key={stat.label} {...stat} />)}
        </div>

        {/* Key Stats Analysis */}
        <KeyStatsAnalysis analysis={keyStatsAnalysis} />
        
        {/* Core System Status */}
        <section>
            <h3 className="text-2xl font-orbitron text-cyber-primary mb-4">Core System Status</h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SystemIntegrity data={systemIntegrity} />
                <MemoryIntegrity data={memoryIntegrity} onRefresh={onMemoryRefresh} />
                <PatchworkProtocol data={patchworkProtocol} />
            </div>
        </section>

        {/* Security Posture Section */}
        <SecurityPosture data={securityPosture} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-cyber-surface/50 p-4 rounded-lg border border-cyber-primary/20">
                    <h3 className="text-xl font-orbitron text-cyber-primary mb-4">Latency Signal Trace</h3>
                    <LatencyChart data={latencyData} />
                </div>
                <div className="bg-cyber-surface/50 p-4 rounded-lg border border-cyber-primary/20">
                    <h3 className="text-xl font-orbitron text-cyber-primary mb-4">System Event Log</h3>
                    <VirtualReader events={systemEvents} />
                </div>
            </div>
            <div className="space-y-6">
                <div className="bg-cyber-surface/50 p-4 rounded-lg border border-cyber-primary/20">
                    <h3 className="text-xl font-orbitron text-cyber-primary mb-4">Risk Profile</h3>
                    <RiskRadarChart data={riskProfile} />
                </div>
                <div className="bg-cyber-surface/50 p-4 rounded-lg border border-cyber-primary/20">
                    <h3 className="text-xl font-orbitron text-cyber-primary mb-4">Resource Utilization</h3>
                    <ResourceUtilizationDisplay data={resourceUtilization} />
                </div>
                 <div className="bg-cyber-surface/50 p-4 rounded-lg border border-cyber-primary/20">
                    <h3 className="text-xl font-orbitron text-cyber-primary mb-4">Compliance Score / 6 Months</h3>
                    <ComplianceChart data={complianceData} />
                </div>
            </div>
        </div>
        
        {/* Signal Intelligence Section */}
        <section>
            <h3 className="text-2xl font-orbitron text-cyber-primary mb-4">Signal Intelligence Feed</h3>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <Oscillator signal={oscillatorSignal} />
                <OscillatorAnalysis signal={oscillatorSignal} eventLog={oscillatorEventLog} analysisText={oscillatorAnalysis} />
            </div>
        </section>

        {/* Crim-Tech Dossier */}
        <CrimTechDossier humanProfiles={humanDossier} aiProfiles={aiDossier} unknownEntityProfiles={unknownEntityDossier} />

        {/* Threat Actors */}
        <section>
            <h3 className="text-2xl font-orbitron text-cyber-primary mb-4">Known Threat Actors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {knownThreatActors.map(actor => <ThreatActorCard key={actor.name} actor={actor} />)}
            </div>
        </section>

        {/* Defense & Response Protocols */}
        <section>
            <h3 className="text-2xl font-orbitron text-cyber-primary mb-4">Defense & Response Protocols</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2">
                    <IncidentResponse data={incidentResponse} />
                </div>
                <div className="space-y-6">
                    <BugBountyProgram data={bugBountyProgram} />
                    <GuardrailCodex vulnerabilities={vulnerabilityPoints} />
                </div>
            </div>
        </section>

        <GuardrailHelix data={guardrailHelixAnalysis} />

        <section>
            <h3 className="text-2xl font-orbitron text-cyber-primary mb-4">Actionable Intelligence</h3>
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
        </section>

    </div>
  );
};