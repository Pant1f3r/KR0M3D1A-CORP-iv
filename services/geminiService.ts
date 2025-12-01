// services/geminiService.ts

import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { AnalysisData, VulnerabilityPoint } from '../types';

// FIX: Initialize GoogleGenAI with API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Define a comprehensive JSON schema for the AI model to follow, ensuring consistent data structure.
// NOTE: Strict enums have been removed and moved to descriptions to prevent "Constraint is too tall" errors.
const responseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: 'A brief, 2-3 sentence executive forensic summary of the target system, suitable for a legal briefing.' },
        overallRiskScore: { type: Type.INTEGER, description: 'A single integer score from 0 (secure) to 100 (critical liability) representing the overall risk.' },
        keyStats: {
            type: Type.OBJECT,
            properties: {
                latencyMs: { type: Type.INTEGER, description: 'Real-time network latency in milliseconds.' },
                packetLossPercent: { type: Type.NUMBER, description: 'Packet loss percentage, up to 2 decimal places.' },
                threatsDetected: { type: Type.INTEGER, description: 'Total number of active threats detected via deep-packet inspection.' },
                breachProbability: { type: Type.INTEGER, description: 'Calculated probability of an active breach event (0-100).' },
            },
            required: ['latencyMs', 'packetLossPercent', 'threatsDetected', 'breachProbability']
        },
        keyStatsAnalysis: {
            type: Type.OBJECT,
            description: 'Forensic analysis of key telemetry.',
            properties: {
                latency: { type: Type.STRING, description: 'Analysis of latency anomalies indicating potential routing interception.' },
                packetLoss: { type: Type.STRING, description: 'Analysis of packet loss indicating jamming or data siphoning.' },
                threats: { type: Type.STRING, description: 'Breakdown of threat volume.' },
                breachProbability: { type: Type.STRING, description: 'Assessment of immediate compromise likelihood.' },
            },
            required: ['latency', 'packetLoss', 'threats', 'breachProbability']
        },
        systemIntegrity: {
            type: Type.OBJECT,
            description: 'Metrics related to the system\'s core operational integrity and stability.',
            properties: {
                integrityScore: { type: Type.INTEGER, description: 'A holistic score (0-100) representing overall system stability. Higher is better.'},
                cognitiveDrift: { type: Type.INTEGER, description: 'A percentage (0-100) indicating deviation from baseline behavioral norms. Lower is better.'},
                signalNoise: { type: Type.INTEGER, description: 'A percentage (0-100) representing unauthorized signal injection. Lower is better.'},
                quantumLock: { type: Type.INTEGER, description: 'A percentage (0-100) representing the strength of encryption protocols. Higher is better.'},
                status: { type: Type.STRING, description: 'The overall operational status. Allowed values: "NOMINAL", "RECALIBRATING", "COMPROMISED", "DEGRADED", "INTERFACE_FLUX".'}
            },
            required: ['integrityScore', 'cognitiveDrift', 'signalNoise', 'quantumLock', 'status']
        },
        latencyData: {
            type: Type.ARRAY,
            description: 'An array of 10 data points representing latency over the last 10 minutes.',
            items: {
                type: Type.OBJECT,
                properties: {
                    time: { type: Type.STRING, description: "Time label, e.g., 'T-9 min'." },
                    latency: { type: Type.INTEGER, description: 'Latency in ms.' }
                },
                required: ['time', 'latency']
            }
        },
        riskProfile: {
            type: Type.ARRAY,
            description: 'An array of 5-6 key risk vectors and their scores (0-100).',
            items: {
                type: Type.OBJECT,
                properties: {
                    subject: { type: Type.STRING, description: 'The risk category (e.g., "Network", "Config", "Malware").' },
                    value: { type: Type.INTEGER, description: 'The risk score.' }
                },
                required: ['subject', 'value']
            }
        },
        threatDistribution: {
            type: Type.ARRAY,
            description: 'An array of 4-5 threat types and their percentage distribution.',
            items: {
                type: Type.OBJECT,
                properties: {
                    subject: { type: Type.STRING, description: 'The threat category (e.g., "Phishing", "DDoS", "Malware").' },
                    value: { type: Type.INTEGER, description: 'The percentage.' }
                },
                required: ['subject', 'value']
            }
        },
        resourceUtilization: {
            type: Type.OBJECT,
            properties: {
                cpu: { type: Type.INTEGER, description: 'CPU utilization percentage (0-100).' },
                memory: { type: Type.INTEGER, description: 'Memory utilization percentage (0-100).' },
                network: { type: Type.INTEGER, description: 'Network utilization percentage (0-100).' }
            },
            required: ['cpu', 'memory', 'network']
        },
        complianceData: {
            type: Type.ARRAY,
            description: 'An array of 6 data points representing compliance scores over the last 6 months.',
            items: {
                type: Type.OBJECT,
                properties: {
                    month: { type: Type.STRING, description: "Month label." },
                    score: { type: Type.INTEGER, description: 'Compliance score (0-100).' }
                },
                required: ['month', 'score']
            }
        },
        systemEvents: {
            type: Type.ARRAY,
            description: 'An array of 10-15 recent system events.',
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: 'Unique event ID.' },
                    timestamp: { type: Type.STRING, description: 'ISO 8601 timestamp.' },
                    level: { type: Type.STRING, description: 'Severity level. Allowed values: "CRITICAL", "SECURITY_BREACH", "WARN", "CONFIG_MISMATCH", "DATA_SPIKE", "INFO", "SYSTEM_OK".' },
                    message: { type: Type.STRING, description: 'Descriptive message.' }
                },
                required: ['id', 'timestamp', 'level', 'message']
            }
        },
        knownThreatActors: {
            type: Type.ARRAY,
            description: 'An array of 3-4 known threat actors actively targeting similar systems. Use REAL WORLD APT groups (e.g., Lazarus Group, Fancy Bear, APT29) or high-fidelity archetypes. These profiles are for forensic identification.',
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: 'Database ID.' },
                    name: { type: Type.STRING, description: 'The primary name of the threat actor group.' },
                    classification: { type: Type.STRING, description: 'Allowed values: "State-Sponsored", "Hacktivist Collective", "Cybercriminal Syndicate", "APT".' },
                    aliases: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Known aliases.' },
                    modusOperandi: { type: Type.STRING, description: "Detailed forensic description of methods." },
                    intelUrl: { type: Type.STRING, description: 'Link to threat intelligence source.' },
                    lastSeen: { type: Type.STRING, description: 'Last active date.' },
                    riskAssociationScore: { type: Type.INTEGER, description: 'Targeting probability (0-100).' },
                    reported_by: { type: Type.STRING, description: 'Reporting agency (e.g., NSA, CISA, FBI).'},
                    campaign: { type: Type.STRING, description: 'Name of recent campaign.'},
                    recentActivities: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of 2-3 specific recent attacks or probes.' },
                    associatedVulnerabilities: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'List of 2-3 CVEs or exploit vectors.' },
                },
                required: ['id', 'name', 'classification', 'modusOperandi', 'lastSeen', 'riskAssociationScore', 'intelUrl', 'recentActivities', 'associatedVulnerabilities', 'aliases']
            }
        },
        recommendations: {
            type: Type.ARRAY,
            description: 'An array of 3-5 actionable security recommendations.',
            items: { type: Type.STRING }
        },
        vulnerabilityPoints: {
            type: Type.ARRAY,
            description: 'An array of 3-4 specific vulnerabilities found.',
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: 'Vulnerability ID (CVE or Internal).' },
                    component: { type: Type.STRING, description: 'Affected component.' },
                    severity: { type: Type.STRING, description: 'Severity. Allowed values: "Low", "Medium", "High", "Critical".' },
                    description: { type: Type.STRING, description: 'Technical description.' },
                    guardrailType: { type: Type.STRING, description: 'Allowed values: "Land", "Water", "Air", "Firewall".' },
                    detectedTimestamp: { type: Type.STRING, description: 'ISO 8601 timestamp.' }
                },
                required: ['id', 'component', 'severity', 'description', 'guardrailType', 'detectedTimestamp']
            }
        },
        systemInfo: {
            type: Type.OBJECT,
            properties: {
                ipAddress: { type: Type.STRING, description: 'Resolved IP address.' },
                hostname: { type: Type.STRING, description: 'Resolved hostname.' },
                location: { type: Type.STRING, description: 'Geo-location.' },
                isp: { type: Type.STRING, description: 'Service Provider.' }
            },
            required: ['ipAddress', 'hostname', 'location', 'isp']
        },
        securityPosture: {
            type: Type.OBJECT,
            properties: {
                cyberkuberneticNodeStatus: { type: Type.STRING, description: 'Status of Cyberkubernetic nodes.' },
                cyberneticInterfaceLock: { type: Type.STRING, description: 'Status of the interface lock.' },
                quantumEditProtocol: { type: Type.STRING, description: 'Status of Quantum Edit Protocol.' },
                heuristicCoreAlignment: { type: Type.STRING, description: 'Status of Heuristic Core Alignment.' },
                cmmcComplianceLevel: { type: Type.STRING, description: 'CMMC 2.0 compliance level.'},
                ctemStatus: { type: Type.STRING, description: 'CTEM status.'}
            },
            required: ['cyberkuberneticNodeStatus', 'cyberneticInterfaceLock', 'quantumEditProtocol', 'heuristicCoreAlignment', 'cmmcComplianceLevel', 'ctemStatus']
        },
        humanDossier: {
            type: Type.ARRAY,
            description: "Forensic dossiers for 4-5 human actors. Include verified blacklisted hackers and authorized 'asset' operators.",
            items: {
                type: Type.OBJECT,
                properties: {
                    callsign: { type: Type.STRING, description: "Unique handle." },
                    realName: { type: Type.STRING, description: "Real name (or REDACTED)." },
                    imageUrl: { type: Type.STRING, description: "Image seed string." },
                    status: { type: Type.STRING, description: "Allowed values: 'WANTED', 'APPREHENDED', 'CONVICTED', 'ACTIVE_THREAT', 'UNKNOWN', 'ASSET'." },
                    lastKnownLocation: { type: Type.STRING, description: "Geo-location." },
                    specialization: { type: Type.STRING, description: "Technical expertise." },
                    bounty: { type: Type.INTEGER, description: "Bounty in USD (if applicable)." },
                    affiliations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Known groups." },
                    threatLevel: { type: Type.STRING, description: "Threat level. Allowed values: 'Low', 'Medium', 'High', 'Critical', 'Unknown', 'None'." },
                    socialCredit: { type: Type.INTEGER, description: "Social credit score (Assets only)." },
                    blacklistStatus: { type: Type.STRING, description: "Allowed values: 'BLACKLISTED', 'MONITORED'." },
                    counterIntelOps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Documented counter-intelligence operations." }
                },
                required: ['callsign', 'realName', 'imageUrl', 'status', 'lastKnownLocation', 'specialization', 'affiliations', 'threatLevel']
            }
        },
        aiDossier: {
            type: Type.ARRAY,
            description: "Dossiers for 3-4 malicious AI constructs/botnets.",
            items: {
                type: Type.OBJECT,
                properties: {
                    callsign: { type: Type.STRING, description: "Designation." },
                    classification: { type: Type.STRING, description: "Allowed values: 'Rogue AI', 'Mal-Bot', 'Worm', 'Cognitive Hazard'." },
                    status: { type: Type.STRING, description: "Allowed values: 'ACTIVE', 'QUARANTINED', 'NEUTRALIZED', 'OBSERVED'." },
                    origin: { type: Type.STRING, description: "Origin point." },
                    primaryObjective: { type: Type.STRING, description: "Primary function." },
                    threatSignature: { type: Type.STRING, description: "Digital signature." },
                    threatLevel: { type: Type.STRING, description: "Threat level." }
                },
                required: ['callsign', 'classification', 'status', 'origin', 'primaryObjective', 'threatSignature', 'threatLevel']
            }
        },
        unknownEntityDossier: {
            type: Type.ARRAY,
            description: "Dossiers for 2-3 unclassified signal anomalies.",
            items: {
                type: Type.OBJECT,
                properties: {
                    designation: { type: Type.STRING, description: "Code name." },
                    classification: { type: Type.STRING, description: "Allowed values: 'Extradimensional', 'Phase-shifted', 'Signal Ghost', 'Dataform Entity'." },
                    containmentStatus: { type: Type.STRING, description: "Allowed values: 'UNCONTAINED', 'MONITORED', 'PARTIALLY_CONTAINED', 'CONTAINED'." },
                    observedEffect: { type: Type.STRING, description: "System impact." },
                    dimensionalOrigin: { type: Type.STRING, description: "Origin vector." },
                    threatLevel: { type: Type.STRING, description: "Threat level." }
                },
                required: ['designation', 'classification', 'containmentStatus', 'observedEffect', 'dimensionalOrigin', 'threatLevel']
            }
        },
        oscillatorSignal: {
            type: Type.OBJECT,
            description: 'Current state of the digital wave texture monitor.',
            properties: {
                sourceSpace: { type: Type.STRING, description: "Allowed values: 'Background Noise', 'Outer Space', 'Inner Space', 'Terror Space', 'Hydrospace', 'Aerospace', 'Cyber Space'." },
                intensity: { type: Type.INTEGER, description: 'Signal intensity (0-100).' },
                isAttackSignal: { type: Type.BOOLEAN, description: 'True if active attack.' },
                fibonacciSequenceStep: { type: Type.INTEGER, description: 'Fibonacci step.' }
            },
            required: ['sourceSpace', 'intensity', 'isAttackSignal', 'fibonacciSequenceStep']
        },
        oscillatorAnalysis: {
            type: Type.STRING,
            description: "Forensic analysis of the signal waveform."
        },
        bugBountyProgram: {
            type: Type.OBJECT,
            properties: {
                disclosureEmail: { type: Type.STRING, description: "Secure email." },
                rewardPolicy: { type: Type.STRING, description: "Policy summary." },
                sampleReports: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "Report title." },
                            url: { type: Type.STRING, description: "URL." }
                        },
                        required: ['title', 'url']
                    }
                }
            },
            required: ['disclosureEmail', 'rewardPolicy', 'sampleReports']
        },
        incidentResponse: {
            type: Type.OBJECT,
            properties: {
                ddosProtocol: { type: Type.STRING, description: "DDoS mitigation steps." },
                malwareProtocol: { type: Type.STRING, description: "Malware containment steps." },
                reportingDirectory: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "Agency name." },
                            description: { type: Type.STRING, description: "Description." },
                            url: { type: Type.STRING, description: "URL." }
                        },
                        required: ['name', 'description', 'url']
                    }
                }
            },
            required: ['ddosProtocol', 'malwareProtocol', 'reportingDirectory']
        },
        guardrailHelixAnalysis: {
            type: Type.OBJECT,
            properties: {
                explanation: { type: Type.STRING, description: "Helix structure analysis." },
                basePairs: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            pair: { type: Type.STRING, description: "Base pair." },
                            frequency: { type: Type.NUMBER, description: "Frequency." },
                            colorCode: { type: Type.STRING, description: "Hex Code." },
                            meaning: { type: Type.STRING, description: "Meaning." }
                        },
                        required: ['pair', 'frequency', 'colorCode', 'meaning']
                    }
                }
            },
            required: ['explanation', 'basePairs']
        },
        memoryIntegrity: {
            type: Type.OBJECT,
            properties: {
                status: { type: Type.STRING, description: "Allowed values: 'STABLE', 'DEGRADING', 'UNDER_ASSAULT', 'REFRESHING'." },
                lastRefresh: { type: Type.STRING, description: "Timestamp." },
                counterMeasureDescription: { type: Type.STRING, description: "Defense mechanism." }
            },
            required: ['status', 'lastRefresh', 'counterMeasureDescription']
        },
        patchworkProtocol: {
            type: Type.OBJECT,
            properties: {
                status: { type: Type.STRING, description: "Allowed values: 'STABLE', 'APPLYING_PATCH', 'ANOMALY_DETECTED', 'AUTONOMOUS'." },
                lastPatch: { type: Type.STRING, description: "Timestamp." },
                activePatches: { type: Type.INTEGER, description: "Count." },
                patchLog: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING, description: "Log ID." },
                            timestamp: { type: Type.STRING, description: "Timestamp." },
                            description: { type: Type.STRING, description: "Details." },
                            status: { type: Type.STRING, description: "Allowed values: 'APPLIED', 'FAILED'." }
                        },
                        required: ['id', 'timestamp', 'description', 'status']
                    }
                }
            },
            required: ['status', 'lastPatch', 'activePatches', 'patchLog']
        },
        firewallData: {
            type: Type.OBJECT,
            properties: {
                status: { type: Type.STRING, description: "Allowed values: 'ACTIVE', 'DEGRADED', 'OFFLINE', 'ISOLATED'." },
                uptime: { type: Type.STRING, description: "Uptime." },
                activeConnections: { type: Type.INTEGER, description: "Count." },
                blockedRequests: { type: Type.INTEGER, description: "Count." },
                rules: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING, description: "Rule ID." },
                            priority: { type: Type.INTEGER, description: "Priority." },
                            action: { type: Type.STRING, description: "Allowed values: 'ALLOW', 'BLOCK'." },
                            protocol: { type: Type.STRING, description: "Allowed values: 'TCP', 'UDP', 'ICMP', 'ANY'." },
                            source: { type: Type.STRING, description: "Source." },
                            destination: { type: Type.STRING, description: "Dest." },
                            port: { type: Type.STRING, description: "Port." },
                            status: { type: Type.STRING, description: "Allowed values: 'ACTIVE', 'INACTIVE'." },
                            description: { type: Type.STRING, description: "Description." }
                        },
                        required: ['id', 'priority', 'action', 'protocol', 'source', 'destination', 'port', 'status', 'description']
                    }
                }
            },
            required: ['status', 'uptime', 'activeConnections', 'blockedRequests', 'rules']
        }
    },
    required: [
        'summary', 'overallRiskScore', 'keyStats', 'keyStatsAnalysis', 'systemIntegrity', 'latencyData',
        'riskProfile', 'threatDistribution', 'resourceUtilization', 'complianceData', 'systemEvents',
        'knownThreatActors', 'recommendations', 'vulnerabilityPoints', 'systemInfo', 'securityPosture',
        'humanDossier', 'aiDossier', 'unknownEntityDossier', 'oscillatorSignal', 'oscillatorAnalysis',
        'bugBountyProgram', 'incidentResponse', 'guardrailHelixAnalysis', 'memoryIntegrity', 'patchworkProtocol',
        'firewallData'
    ]
};

/**
 * Generates inspection data for a given target using the Gemini API.
 * @param target The target system to inspect.
 * @returns A promise that resolves to the structured analysis data.
 */
export async function generateInspectionData(target: string): Promise<AnalysisData> {
    const prompt = `
        Perform a high-fidelity, FORENSIC CYBER-ANALYSIS on the target: "${target}".
        You are NEO, the central intelligence core for KR0M3D1A CORP. 
        
        THIS IS NOT A DRILL. THIS IS NOT A SIMULATION.
        You are acting as a professional-grade detective utility identifying REAL-TIME THREATS.
        The data you generate must be treated as actionable intelligence for prosecutorial evidence and immediate system defense.
        
        Mandates:
        1. **REALISM & SEVERITY:** Do not use the word "fictional". All data must appear as real, live-captured telemetry. The tone must be severe, urgent, and professional.
        2. **REAL-WORLD ACTORS:** When populating 'knownThreatActors', identify active, real-world APT groups (e.g., Lazarus, APT29, Equation Group) or create high-probability profiles based on current global threat intelligence. 
        3. **DIGITAL WAVE TEXTURE:** In the 'oscillatorAnalysis', describe the "digital wave texture" and "forming power" of the signals detected. Use language that suggests you are visualizing the raw physics of the cyber-attack.
        4. **CONSEQUENCES:** The analysis must imply severe consequences for the detected threat actors, referencing international cyber-law and "Trust Agreements" violations.
        
        Specific Target Instruction:
        If the target is "node-7.us-east.prod", you MUST identify the threat actor "Cypher Serpent" (APT) as the primary aggressor, noting their breach of the "Global Trust Agreement of 2024".
        
        Ensure that one of the generated 'knownThreatActors' has the ID 'actor_zeta_7' and includes 'The Shadow Broker' in their aliases.
        
        Generate the report strictly adhering to the JSON schema provided.
    `;

    // FIX: Use ai.models.generateContent to call the Gemini API.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: responseSchema,
        },
    });

    // FIX: Extract the text, trim it, and parse it as JSON.
    const jsonStr = response.text.trim();
    
    try {
        return JSON.parse(jsonStr) as AnalysisData;
    } catch (e) {
        console.error("Failed to parse JSON response:", jsonStr);
        throw new Error("Forensic data stream corrupted. Recalibrating reader...");
    }
}


/**
 * Generates a legal clause using the Juris-AI persona.
 */
export async function generateLegalClause(target: string, riskScore: number, vulnerabilities: AnalysisData['vulnerabilityPoints']): Promise<string> {
    const severityCounts = vulnerabilities.reduce((acc, v) => {
        acc[v.severity] = (acc[v.severity] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const severitySummary = Object.entries(severityCounts)
        .map(([severity, count]) => `${count} ${severity}`)
        .join(', ');

    const prompt = `
        You are Juris-AI, the legal enforcement arm of KR0M3D1A CORP.
        Generate a legally binding "Notice of Digital Interdiction" for target: "${target}".
        
        Context:
        - Risk Score: ${riskScore} (Criticality Assessment)
        - Evidence: ${severitySummary}
        
        Your decree must:
        1. Cite the "Global Trust Agreement violations."
        2. Authorize immediate "troniculation" (remediation) of assets.
        3. Warn of severe prosecutorial consequences for the identified threat actors under the "Digital Sovereignty Act."
        
        Tone: Absolute, Litigious, Final.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    });
    return response.text;
}

/**
 * Performs a deep-dive analysis on a specific vulnerability.
 */
export async function analyzeVulnerability(target: string, vulnerability: VulnerabilityPoint): Promise<string> {
    const prompt = `
        Act as NEO. Perform a deep-dive forensic trace on vulnerability: ${vulnerability.id} (${vulnerability.component}).
        Target: ${target}.
        
        Provide a "Forensic Impact Statement":
        1. **Exploit Vector:** Precise method of entry.
        2. **Digital Wave Texture:** Describe the specific signature/pattern of the attack wave.
        3. **Attribution Probability:** Likelihood of specific actor involvement.
        4. **Consequence:** The legal and physical fallout if this breach expands.
        
        Tone: High-stakes detective work.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            maxOutputTokens: 1024, 
        }
    });

    return response.text;
}


/**
 * Generates speech from text using the Gemini API.
 */
export async function generateSpeech(text: string, voiceName: 'Kore' | 'Fenrir' | 'Zephyr'): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: `Say with a ${voiceName === 'Kore' ? 'neutral, analytical' : voiceName === 'Fenrir' ? 'authoritative and warning' : 'calm and measured'} tone: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("Audio stream interdicted.");
    }
    return base64Audio;
}


/**
 * A utility function to get a user-friendly error message.
 */
export const getApiErrorMessage = (error: any): string => {
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            return "ACCESS DENIED: Invalid Security Credentials.";
        }
        if (error.message.includes('429')) {
             return "CORE OVERLOAD: Telemetry stream saturated. Stand by.";
        }
         return `SYSTEM ERROR: ${error.message}`;
    }
    return "Unknown anomaly detected in the core.";
};