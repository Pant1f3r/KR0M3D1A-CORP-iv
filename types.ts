
// types.ts

import type React from 'react';

// Main data structure for the entire analysis report
export interface AnalysisData {
  summary: string;
  overallRiskScore: number;
  keyStats: {
    latencyMs: number;
    packetLossPercent: number;
    threatsDetected: number;
    breachProbability: number;
  };
  keyStatsAnalysis: {
    latency: string;
    packetLoss: string;
    threats: string;
    breachProbability: string;
  };
  systemIntegrity: SystemIntegrity;
  latencyData: LatencyDataPoint[];
  riskProfile: RiskProfileDataPoint[];
  threatDistribution: RiskProfileDataPoint[];
  resourceUtilization: ResourceUtilization;
  complianceData: ComplianceDataPoint[];
  systemEvents: VirtualReaderEvent[];
  knownThreatActors: ThreatActor[];
  recommendations: string[];
  vulnerabilityPoints: VulnerabilityPoint[];
  systemInfo: {
    ipAddress: string;
    hostname: string;
    location: string;
    isp: string;
  };
  securityPosture: {
    cyberkuberneticNodeStatus: string;
    cyberneticInterfaceLock: string;
    quantumEditProtocol: string;
    heuristicCoreAlignment: string;
    cmmcComplianceLevel: string;
    ctemStatus: string;
  };
  humanDossier: HumanProfile[];
  aiDossier: AIProfile[];
  unknownEntityDossier: UnknownEntityProfile[];
  oscillatorSignal: OscillatorSignal;
  oscillatorAnalysis: string;
  bugBountyProgram: BugBountyProgramData;
  incidentResponse: IncidentResponseData;
  guardrailHelixAnalysis: GuardrailHelixData;
  memoryIntegrity: MemoryIntegrityData;
  patchworkProtocol: PatchworkData;
  firewallData: FirewallData;
}

// Data for the new Firewall Component
export interface FirewallRule {
  id: string;
  priority: number;
  action: 'ALLOW' | 'BLOCK';
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'ANY';
  source: string;
  destination: string;
  port: string;
  status: 'ACTIVE' | 'INACTIVE';
  description: string;
}

export interface FirewallData {
  status: 'ACTIVE' | 'DEGRADED' | 'OFFLINE' | 'ISOLATED';
  uptime: string;
  activeConnections: number;
  blockedRequests: number;
  rules: FirewallRule[];
}

// Data for the new System Patchwork Protocol
export interface PatchworkEvent {
  id: string;
  timestamp: string;
  description: string;
  status: 'APPLIED' | 'FAILED';
  targetVulnerabilityId?: string;
}

export interface PatchworkData {
  status: 'STABLE' | 'APPLYING_PATCH' | 'ANOMALY_DETECTED' | 'AUTONOMOUS';
  lastPatch: string;
  activePatches: number;
  patchLog: PatchworkEvent[];
}

// Data for the new Memory Integrity Protocol section
export interface MemoryIntegrityData {
  status: 'STABLE' | 'DEGRADING' | 'UNDER_ASSAULT' | 'REFRESHING';
  lastRefresh: string;
  counterMeasureDescription: string;
}

// Data for the new Guardrail Digital Helix section
export interface GuardrailHelixData {
  explanation: string;
  basePairs: {
    pair: 'A-T' | 'G-C';
    frequency: number; // in THz
    colorCode: string; // hex color
    meaning: string;
  }[];
}


// Data for the new Incident Response Protocol section
export interface IncidentResponseData {
    ddosProtocol: string;
    malwareProtocol: string;
    reportingDirectory: ReportingAgency[];
}

// Data for a single agency in the reporting directory
export interface ReportingAgency {
    name: string;
    description: string;
    url: string;
}


// Data for the new Signal Oscillator
export interface OscillatorSignal {
    sourceSpace: 'Background Noise' | 'Outer Space' | 'Inner Space' | 'Terror Space' | 'Hydrospace' | 'Aerospace' | 'Cyber Space' | 'Hyperspace';
    intensity: number; // 0-100
    isAttackSignal: boolean;
    fibonacciSequenceStep: number; // To track tone playback
}

// Data for a single logged oscillator event
export interface OscillatorEvent {
    id: string;
    timestamp: string;
    sourceSpace: OscillatorSignal['sourceSpace'];
    intensity: number;
    fibonacciSequenceStep: number;
    threatActor: string;
    traceVector: string;
}


// Data for human profiles in the Crim-Tech Dossier
export interface HumanProfile {
  callsign: string;
  realName: string;
  imageUrl: string;
  status: 'WANTED' | 'APPREHENDED' | 'CONVICTED' | 'ACTIVE_THREAT' | 'UNKNOWN' | 'ASSET';
  lastKnownLocation: string;
  specialization: string;
  bounty?: number;
  affiliations: string[];
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical' | 'Unknown' | 'None';
  socialCredit?: number;
  blacklistStatus?: 'BLACKLISTED' | 'MONITORED';
  counterIntelOps?: string[];
}

// Data for AI/Bot profiles in the Crim-Tech Dossier
export interface AIProfile {
  callsign: string;
  classification: 'Rogue AI' | 'Mal-Bot' | 'Worm' | 'Cognitive Hazard';
  status: 'ACTIVE' | 'QUARANTINED' | 'NEUTRALIZED' | 'OBSERVED';
  origin: string;
  primaryObjective: string;
  threatSignature: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical' | 'Unknown';
}

// Data for Unknown/Alien entities in the Crim-Tech Dossier
export interface UnknownEntityProfile {
  designation: string;
  classification: 'Extradimensional' | 'Phase-shifted' | 'Signal Ghost' | 'Dataform Entity';
  containmentStatus: 'UNCONTAINED' | 'MONITORED' | 'PARTIALLY_CONTAINED' | 'CONTAINED';
  observedEffect: string;
  dimensionalOrigin: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical' | 'Unknown';
}


// Data for the new System Integrity section
export interface SystemIntegrity {
    integrityScore: number;
    cognitiveDrift: number;
    signalNoise: number;
    quantumLock: number;
    status: 'NOMINAL' | 'RECALIBRATING' | 'COMPROMISED' | 'DEGRADED' | 'INTERFACE_FLUX';
}

export interface AnalysisError {
  message: string;
}

// Data for individual stat cards
export interface KeyStat {
  label: string;
  value: string | number;
  unit?: string;
  icon: React.ComponentType<{ className?: string }>;
}

// Data for latency over time chart
export interface LatencyDataPoint {
  time: string;
  latency: number;
}

// Data for risk profile radar chart and threat distribution pie chart
export interface RiskProfileDataPoint {
  subject: string;
  value: number;
}

// Data for resource utilization bars
export interface ResourceUtilization {
  cpu: number;
  memory: number;
  network: number;
}

// Data for compliance score chart
export interface ComplianceDataPoint {
  month: string;
  score: number;
}

// Data for a single event in the virtual reader
export interface VirtualReaderEvent {
  id: string;
  timestamp: string;
  level: EventLevel;
  message: string;
}

export type EventLevel =
  | 'CRITICAL'
  | 'SECURITY_BREACH'
  | 'WARN'
  | 'CONFIG_MISMATCH'
  | 'DATA_SPIKE'
  | 'INFO'
  | 'SYSTEM_OK';

// Data for a single threat actor
export type ThreatActorClassification = 'State-Sponsored' | 'Hacktivist Collective' | 'Cybercriminal Syndicate' | 'APT';
export interface ThreatActor {
    id: string;
    name: string;
    classification: ThreatActorClassification;
    aliases?: string[];
    modusOperandi: string;
    intelUrl?: string;
    lastSeen: string;
    riskAssociationScore: number;
    reported_by?: string;
    campaign?: string;
    recentActivities?: string[];
    associatedVulnerabilities?: string[];
}

// Data for vulnerability points
export interface VulnerabilityPoint {
    id: string;
    component: string;
    severity: 'Low' | 'Medium' | 'High' | 'Critical';
    description: string;
    guardrailType: 'Land' | 'Water' | 'Air' | 'Firewall';
    detectedTimestamp: string;
}

// Data structure for chatbot messages
export interface ChatMessage {
  sender: 'user' | 'neo';
  text: string;
}

// Data for the Bug Bounty Program
export interface BugBountyProgramData {
    disclosureEmail: string;
    rewardPolicy: string;
    sampleReports: {
        title: string;
        url: string;
    }[];
}
