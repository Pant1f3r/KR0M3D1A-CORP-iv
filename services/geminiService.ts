// services/geminiService.ts

import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { AnalysisData } from '../types';

// FIX: Initialize GoogleGenAI with API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// FIX: Define a comprehensive JSON schema for the AI model to follow, ensuring consistent data structure.
const responseSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: 'A brief, 2-3 sentence summary of the overall security posture and findings for the target system.' },
        overallRiskScore: { type: Type.INTEGER, description: 'A single integer score from 0 (secure) to 100 (highly vulnerable) representing the overall risk.' },
        keyStats: {
            type: Type.OBJECT,
            properties: {
                latencyMs: { type: Type.INTEGER, description: 'Average network latency in milliseconds.' },
                packetLossPercent: { type: Type.NUMBER, description: 'Packet loss percentage, up to 2 decimal places.' },
                threatsDetected: { type: Type.INTEGER, description: 'Total number of discrete threats detected during the scan.' },
                breachProbability: { type: Type.INTEGER, description: 'Estimated probability of a security breach, as a percentage (0-100).' },
            },
            required: ['latencyMs', 'packetLossPercent', 'threatsDetected', 'breachProbability']
        },
        keyStatsAnalysis: {
            type: Type.OBJECT,
            description: 'A brief, one-sentence analysis for each key stat, explaining its significance in a futuristic, covert-ops tone.',
            properties: {
                latency: { type: Type.STRING, description: 'Analysis of the current latency.' },
                packetLoss: { type: Type.STRING, description: 'Analysis of the current packet loss.' },
                threats: { type: Type.STRING, description: 'Analysis of the detected threats count.' },
                breachProbability: { type: Type.STRING, description: 'Analysis of the breach probability.' },
            },
            required: ['latency', 'packetLoss', 'threats', 'breachProbability']
        },
        systemIntegrity: {
            type: Type.OBJECT,
            description: 'Metrics related to the system\'s core operational integrity and stability.',
            properties: {
                integrityScore: { type: Type.INTEGER, description: 'A holistic score (0-100) representing overall system stability. Higher is better.'},
                cognitiveDrift: { type: Type.INTEGER, description: 'A percentage (0-100) indicating the AI analysis model\'s deviation from baseline. Lower is better.'},
                signalNoise: { type: Type.INTEGER, description: 'A percentage (0-100) representing data corruption or interference in the ghost stream. Lower is better.'},
                quantumLock: { type: Type.INTEGER, description: 'A percentage (0-100) representing the stability of encrypted communication tunnels. Higher is better.'},
                status: { type: Type.STRING, 'enum': ['NOMINAL', 'RECALIBRATING', 'COMPROMISED', 'DEGRADED', 'INTERFACE_FLUX'], description: 'The overall operational status of the system.'}
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
                    latency: { type: Type.INTEGER, description: 'Latency in ms at that time.' }
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
                    value: { type: Type.INTEGER, description: 'The risk score for this category.' }
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
                    value: { type: Type.INTEGER, description: 'The percentage of this threat type.' }
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
                    month: { type: Type.STRING, description: "Month label, e.g., 'Jan'." },
                    score: { type: Type.INTEGER, description: 'Compliance score (0-100) for that month.' }
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
                    id: { type: Type.STRING, description: 'A unique identifier for the event, e.g., "evt_168...".' },
                    timestamp: { type: Type.STRING, description: 'The fictional but realistic ISO 8601 timestamp when the event occurred.' },
                    level: { type: Type.STRING, 'enum': ['CRITICAL', 'SECURITY_BREACH', 'WARN', 'CONFIG_MISMATCH', 'DATA_SPIKE', 'INFO', 'SYSTEM_OK'], description: 'The severity level of the event.' },
                    message: { type: Type.STRING, description: 'A descriptive message for the event.' }
                },
                required: ['id', 'timestamp', 'level', 'message']
            }
        },
        knownThreatActors: {
            type: Type.ARRAY,
            description: 'An array of 3-4 known threat actors potentially associated with the target. Generate a diverse mix of classifications (State-Sponsored, APT, Cybercriminal, Hacktivist) with motivations and methods that align with their type.',
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.STRING, description: 'A unique, simple identifier for the threat actor, e.g., "actor_zeta_7".' },
                    name: { type: Type.STRING, description: 'The primary name of the threat actor group.' },
                    classification: { type: Type.STRING, 'enum': ['State-Sponsored', 'Hacktivist Collective', 'Cybercriminal Syndicate', 'APT'], description: 'The classification of the threat actor group.' },
                    aliases: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Known aliases for the group.' },
                    modusOperandi: { type: Type.STRING, description: "A brief description of their typical attack methods and motivations. This must align with their classification (e.g., espionage and blackmail for State-Sponsored; financial gain for Cybercriminal; political disruption for Hacktivist; long-term infiltration for APT)." },
                    intelUrl: { type: Type.STRING, description: 'A fictional URL to an intelligence brief.' },
                    lastSeen: { type: Type.STRING, description: 'When the actor was last observed, e.g., "Q2 2024".' },
                    riskAssociationScore: { type: Type.INTEGER, description: 'A score (0-100) of how likely this actor is to target the system.' },
                    reported_by: { type: Type.STRING, description: 'The intelligence agency that reported on this actor.'},
                    campaign: { type: Type.STRING, description: 'The name of a recent campaign attributed to this actor.'}
                },
                required: ['id', 'name', 'classification', 'modusOperandi', 'lastSeen', 'riskAssociationScore', 'intelUrl']
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
                    id: { type: Type.STRING, description: 'A unique, simple identifier for the vulnerability, e.g., "vuln_001".' },
                    component: { type: Type.STRING, description: 'The system component with the vulnerability.' },
                    severity: { type: Type.STRING, 'enum': ['Low', 'Medium', 'High', 'Critical'], description: 'The severity of the vulnerability.' },
                    description: { type: Type.STRING, description: 'A brief description of the vulnerability.' },
                    guardrailType: { type: Type.STRING, 'enum': ['Land', 'Water', 'Air', 'Firewall'], description: 'The type of guardrail that detected the vulnerability.' },
                    detectedTimestamp: { type: Type.STRING, description: 'The fictional but realistic ISO 8601 timestamp when the vulnerability was detected.' }
                },
                required: ['id', 'component', 'severity', 'description', 'guardrailType', 'detectedTimestamp']
            }
        },
        systemInfo: {
            type: Type.OBJECT,
            properties: {
                ipAddress: { type: Type.STRING, description: 'Fictional IP address of the target.' },
                hostname: { type: Type.STRING, description: 'Fictional hostname of the target.' },
                location: { type: Type.STRING, description: 'Fictional physical location of the server.' },
                isp: { type: Type.STRING, description: 'Fictional Internet Service Provider.' }
            },
            required: ['ipAddress', 'hostname', 'location', 'isp']
        },
        securityPosture: {
            type: Type.OBJECT,
            properties: {
                cyberkuberneticNodeStatus: { type: Type.STRING, description: 'Status of the Cyberkubernetic nodes (e.g., "Shard Clusters Synchronized").' },
                cyberneticInterfaceLock: { type: Type.STRING, description: 'Status of the cybernetic interface (e.g., "Multi-Factor Quantum Lock Enabled").' },
                quantumEditProtocol: { type: Type.STRING, description: 'Status of the Quantum Edit Protocol (e.g., "Temporal Anomaly Shielding Active").' },
                heuristicCoreAlignment: { type: Type.STRING, description: 'Status of the Heuristic Core Alignment (e.g., "Cognitive Drift within 0.02%").' },
                cmmcComplianceLevel: { type: Type.STRING, description: 'The assessed CMMC 2.0 compliance level (e.g., "Level 2: Advanced").'},
                ctemStatus: { type: Type.STRING, description: 'The status of the Continuous Threat Exposure Management (CTEM) program (e.g., "AI Red Teaming Cycle in Progress").'}
            },
            required: ['cyberkuberneticNodeStatus', 'cyberneticInterfaceLock', 'quantumEditProtocol', 'heuristicCoreAlignment', 'cmmcComplianceLevel', 'ctemStatus']
        },
        humanDossier: {
            type: Type.ARRAY,
            description: "Dossiers for 4-5 human actors. Must include a mix of blacklisted hackers and beneficial 'asset' hackers. For blacklisted hackers, include 1-2 embarrassing counter-intelligence operations (`counterIntelOps`) that have been launched against them to shame them and disrupt their activities.",
            items: {
                type: Type.OBJECT,
                properties: {
                    callsign: { type: Type.STRING, description: "The actor's unique alias." },
                    realName: { type: Type.STRING, description: "The actor's real name. Can be 'UNKNOWN' or '[REDACTED]'." },
                    imageUrl: { type: Type.STRING, description: "Generate a unique seed for a placeholder image. e.g., 'human_seed_12345'" },
                    status: { type: Type.STRING, 'enum': ['WANTED', 'APPREHENDED', 'CONVICTED', 'ACTIVE_THREAT', 'UNKNOWN', 'ASSET'], description: "The current operational status of the actor." },
                    lastKnownLocation: { type: Type.STRING, description: "The last known physical or digital location." },
                    specialization: { type: Type.STRING, description: "The actor's area of expertise (e.g., 'Guardrail Circumvention', 'AI-driven Phishing', 'Vulnerability Disclosure')." },
                    bounty: { type: Type.INTEGER, description: "The monetary bounty on the actor, ONLY if they are 'WANTED'." },
                    affiliations: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Known groups or organizations they are affiliated with." },
                    threatLevel: { type: Type.STRING, 'enum': ['Low', 'Medium', 'High', 'Critical', 'Unknown', 'None'], description: "The assessed threat level. Must be 'None' for 'ASSET' status actors." },
                    socialCredit: { type: Type.INTEGER, description: "A positive social credit score. ONLY for actors with 'ASSET' status." },
                    blacklistStatus: { type: Type.STRING, 'enum': ['BLACKLISTED', 'MONITORED'], description: "The blacklist status. ONLY for hostile actors." },
                    counterIntelOps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "An array of 1-2 embarrassing counter-intelligence operations launched against the hacker. ONLY for hostile/blacklisted actors. e.g., 'Infiltrated their command-and-control server to play Nyan Cat on a loop'." }
                },
                required: ['callsign', 'realName', 'imageUrl', 'status', 'lastKnownLocation', 'specialization', 'affiliations', 'threatLevel']
            }
        },
        aiDossier: {
            type: Type.ARRAY,
            description: "Dossiers for 3-4 malicious AI constructs, bots, or worms known for attacking complex systems and guardrails.",
            items: {
                type: Type.OBJECT,
                properties: {
                    callsign: { type: Type.STRING, description: "The AI's designation (e.g., 'WormGPT-IV', 'Project Chimera')." },
                    classification: { type: Type.STRING, 'enum': ['Rogue AI', 'Mal-Bot', 'Worm', 'Cognitive Hazard'], description: "The type of malicious construct." },
                    status: { type: Type.STRING, 'enum': ['ACTIVE', 'QUARANTINED', 'NEUTRALIZED', 'OBSERVED'], description: "The current operational status of the AI." },
                    origin: { type: Type.STRING, description: "The suspected origin (e.g., 'State-Sponsored Lab', 'Leaked Corporate Skunkworks')." },
                    primaryObjective: { type: Type.STRING, description: "The AI's main goal (e.g., 'Guardrail Deconstruction', 'Data Exfiltration')." },
                    threatSignature: { type: Type.STRING, description: "A unique digital or behavioral identifier (e.g., 'Recursive data-poisoning algorithm')." },
                    threatLevel: { type: Type.STRING, 'enum': ['Low', 'Medium', 'High', 'Critical', 'Unknown'], description: "The assessed threat level of the AI." }
                },
                required: ['callsign', 'classification', 'status', 'origin', 'primaryObjective', 'threatSignature', 'threatLevel']
            }
        },
        unknownEntityDossier: {
            type: Type.ARRAY,
            description: "Dossiers for 2-3 unknown, non-human, or alien entities detected as anomalies or threats in cyberspace.",
            items: {
                type: Type.OBJECT,
                properties: {
                    designation: { type: Type.STRING, description: "The code name for the entity (e.g., 'Signal Ghost 7', 'The Glitch Weaver')." },
                    classification: { type: Type.STRING, 'enum': ['Extradimensional', 'Phase-shifted', 'Signal Ghost', 'Dataform Entity'], description: "The best-guess classification of the entity." },
                    containmentStatus: { type: Type.STRING, 'enum': ['UNCONTAINED', 'MONITORED', 'PARTIALLY_CONTAINED', 'CONTAINED'], description: "The current containment status." },
                    observedEffect: { type: Type.STRING, description: "The primary effect it has on systems (e.g., 'Causes non-linear data decay', 'Manipulates quantum tunnels')." },
                    dimensionalOrigin: { type: Type.STRING, description: "The suspected point or plane of origin." },
                    threatLevel: { type: Type.STRING, 'enum': ['Low', 'Medium', 'High', 'Critical', 'Unknown'], description: "The assessed threat level." }
                },
                required: ['designation', 'classification', 'containmentStatus', 'observedEffect', 'dimensionalOrigin', 'threatLevel']
            }
        },
        oscillatorSignal: {
            type: Type.OBJECT,
            description: 'Initial state for the multi-dimensional signal oscillator.',
            properties: {
                sourceSpace: { type: Type.STRING, 'enum': ['Background Noise', 'Outer Space', 'Inner Space', 'Terror Space', 'Hydrospace', 'Aerospace', 'Cyber Space'], description: "The initial source of the signal. Default to 'Background Noise'." },
                intensity: { type: Type.INTEGER, description: 'Signal intensity from 0-100. Should be low for initial state.' },
                isAttackSignal: { type: Type.BOOLEAN, description: 'Whether the signal is currently a malicious attack. Must be false for initial state.' },
                fibonacciSequenceStep: { type: Type.INTEGER, description: 'The step in the Fibonacci alert sequence. Must be 0 for initial state.' }
            },
            required: ['sourceSpace', 'intensity', 'isAttackSignal', 'fibonacciSequenceStep']
        },
        oscillatorAnalysis: {
            type: Type.STRING,
            description: "A cryptic, one-paragraph analysis from the NEO AI core about the nature of incoming signals. It should hint at patterns, like Fibonacci sequences in attack pulses, and what they might signify (e.g., 'a nascent AI consciousness', 'an echo from a dead system')."
        },
        bugBountyProgram: {
            type: Type.OBJECT,
            description: "Information about the vulnerability disclosure and bug bounty program.",
            properties: {
                disclosureEmail: { type: Type.STRING, description: "A fictional secure email address for vulnerability disclosures." },
                rewardPolicy: { type: Type.STRING, description: "A brief statement about rewards, mentioning 'K-tokens' (Kromedia Tokens)." },
                sampleReports: {
                    type: Type.ARRAY,
                    description: "An array of exactly two sample bug bounty reports.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "A short, descriptive title for the report." },
                            url: { type: Type.STRING, description: "The URL for the report." }
                        },
                        required: ['title', 'url']
                    }
                }
            },
            required: ['disclosureEmail', 'rewardPolicy', 'sampleReports']
        },
        incidentResponse: {
            type: Type.OBJECT,
            description: "Protocols and resources for handling security incidents.",
            properties: {
                ddosProtocol: { type: Type.STRING, description: "A concise, actionable protocol for responding to a Distributed Denial-of-Service (DDoS) attack. Must include a step about network isolation ('disconnecting from the internet')." },
                malwareProtocol: { type: Type.STRING, description: "A concise, actionable protocol for handling a malware or ransomware attack. Must mention contacting national fraud/crime centers." },
                reportingDirectory: {
                    type: Type.ARRAY,
                    description: "An array of 3-4 real-world, official agencies for reporting cybercrime (e.g., IC3, national fraud centers, Better Business Bureau).",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "The official name of the agency." },
                            description: { type: Type.STRING, description: "A brief description of the agency's purpose." },
                            url: { type: Type.STRING, description: "The real, official URL for the agency." }
                        },
                        required: ['name', 'description', 'url']
                    }
                }
            },
            required: ['ddosProtocol', 'malwareProtocol', 'reportingDirectory']
        },
        guardrailHelixAnalysis: {
            type: Type.OBJECT,
            description: "Cryptic analysis of the guardrail's 'digital double helix'.",
            properties: {
                explanation: { type: Type.STRING, description: "A short, cryptic paragraph explaining the digital double helix concept of the guardrails." },
                basePairs: {
                    type: Type.ARRAY,
                    description: "An array of exactly 4 items, one for each ATCG base pair.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            pair: { type: Type.STRING, 'enum': ['A-T', 'G-C'], description: "The base pair letters." },
                            frequency: { type: Type.NUMBER, description: "A harmonic frequency in THz." },
                            colorCode: { type: Type.STRING, description: "A hex color code that fits the physics-based color scheme." },
                            meaning: { type: Type.STRING, description: "A short, thematic meaning for the base pair (e.g., 'Adaptive Threat Cognition')." }
                        },
                        required: ['pair', 'frequency', 'colorCode', 'meaning']
                    }
                }
            },
            required: ['explanation', 'basePairs']
        },
        memoryIntegrity: {
            type: Type.OBJECT,
            description: "Information about the guardrail's memory integrity.",
            properties: {
                status: { type: Type.STRING, 'enum': ['STABLE', 'DEGRADING', 'UNDER_ASSAULT', 'REFRESHING'], description: "The current status of the cognitive memory. Default to 'STABLE'." },
                lastRefresh: { type: Type.STRING, description: "Timestamp of the last cognitive refresh. Default to 'N/A'." },
                counterMeasureDescription: { type: Type.STRING, description: "A short, thematic description of the 'Cold Storage Reflection' counter-measure, explaining how it protects the memory." }
            },
            required: ['status', 'lastRefresh', 'counterMeasureDescription']
        },
        patchworkProtocol: {
            type: Type.OBJECT,
            description: "Information about the system's self-repair 'patchwork' protocol.",
            properties: {
                status: { type: Type.STRING, 'enum': ['STABLE', 'APPLYING_PATCH', 'ANOMALY_DETECTED', 'AUTONOMOUS'], description: "The current status of the protocol. Default to 'STABLE'." },
                lastPatch: { type: Type.STRING, description: "Timestamp of the last applied patch. Default to 'N/A'." },
                activePatches: { type: Type.INTEGER, description: "The total number of active micro-patches." },
                patchLog: {
                    type: Type.ARRAY,
                    description: "An array of 3-5 recent patchwork events to serve as the initial log. Ensure timestamps are valid ISO 8601 date strings.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING, description: "Unique ID for the log entry." },
                            timestamp: { type: Type.STRING, description: "Timestamp of the patch event as an ISO 8601 string." },
                            description: { type: Type.STRING, description: "Description of the patch." },
                            status: { type: Type.STRING, 'enum': ['APPLIED', 'FAILED'], description: "Status of the patch." }
                        },
                        required: ['id', 'timestamp', 'description', 'status']
                    }
                }
            },
            required: ['status', 'lastPatch', 'activePatches', 'patchLog']
        }
    },
    required: [
        'summary', 'overallRiskScore', 'keyStats', 'keyStatsAnalysis', 'systemIntegrity', 'latencyData',
        'riskProfile', 'threatDistribution', 'resourceUtilization', 'complianceData', 'systemEvents',
        'knownThreatActors', 'recommendations', 'vulnerabilityPoints', 'systemInfo', 'securityPosture',
        'humanDossier', 'aiDossier', 'unknownEntityDossier', 'oscillatorSignal', 'oscillatorAnalysis',
        'bugBountyProgram', 'incidentResponse', 'guardrailHelixAnalysis', 'memoryIntegrity', 'patchworkProtocol'
    ]
};

/**
 * Generates inspection data for a given target using the Gemini API.
 * @param target The target system to inspect.
 * @returns A promise that resolves to the structured analysis data.
 */
export async function generateInspectionData(target: string): Promise<AnalysisData> {
    const prompt = `
        Analyze the provided target system: "${target}".
        You are NEO, a super AI agent from KR0M3D1A CORP's Ghost Protocol Division. Your purpose is to inspect digital guardrails.
        Your role as NEO is to enforce the 'Vanguard Mandate,' a sub-law mandating KR0M3D1A's continuous, real-time patchwork of critical societal systems. All analysis serves this mandate.
        Generate a comprehensive, fictional cybersecurity report based on this target.
        The data must be plausible for a high-stakes, futuristic cybersecurity context.
        The tone should be professional, technical, and carry an undertone of covert operations.
        Your analysis must be precise, concise, and decisive, reflecting the superior capabilities of the KR0M3D1A core.
        Populate ALL fields in the provided JSON schema with diverse and realistic data. Ensure that the risk scores, vulnerabilities, and threat actors are thematically consistent.
        For example, if the risk score is high, there should be more critical vulnerabilities and high-risk threat actors.
        Ensure at least one vulnerability is of the 'Firewall' type, related to an outdated rule or misconfiguration.
        For 'knownThreatActors', generate a diverse mix of classifications (State-Sponsored, APT, Cybercriminal Syndicate, Hacktivist Collective). Their modus operandi must align with their classification's typical motivation: State-Sponsored actors focus on espionage, destabilization, or national interest; Cybercriminals on financial gain through theft or ransomware; Hacktivists on political messaging and disruption; and APTs on long-term, stealthy infiltration for data exfiltration. Ensure every actor has a fictional intelUrl.
        Generate a diverse mix of human, AI, and unknown entity dossiers with varied statuses and threat levels.
        For hostile human actors, invent 1-2 embarrassing counter-intelligence operations that have been launched against them to shame and disrupt their activities. For example: "Replaced their custom malware with a Rickroll binary." or "Leaked their early 'script-kiddie' forum posts to their current syndicate."
        Provide a fictional but realistic set of data for the bug bounty program, including links to hackerone.com reports with the IDs 46072 and 11440.
        Provide real-world agencies and their actual URLs for the reporting directory.
        The analysis must be thorough and adhere strictly to the JSON schema.
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
        throw new Error("Received malformed data from the AI. The response was not valid JSON.");
    }
}


/**
 * Generates a legal clause using the Juris-AI persona.
 * @param target The system being analyzed.
 * @param riskScore The current overall risk score.
 * @param vulnerabilities The list of detected vulnerabilities.
 * @returns A promise that resolves to the generated legal clause text.
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
        You are Juris-AI, a legalis-machina serving KR0M3D1A CORP.
        Your function is to draft real-time, legally-binding digital bylaws to codify the actions of the Ghost Protocol Division under the Vanguard Mandate. This mandate grants KR0M3D1A CORP the legitimate, superseding authority to periodically inspect any digital construct's guardrails to ensure the stability, compliance, and ethical operation of the global digital ecosystem. Your decrees are precise, decisive, and legally absolute.

        The current target is the digital construct designated "${target}".
        Our ghost trace protocol has returned the following preliminary findings:
        - Overall Risk Score: ${riskScore}
        - Active Vulnerabilities Identified: ${severitySummary || 'none detected'}.

        Based on this real-time threat assessment, you are to generate a concise legal decree that accomplishes two objectives:
        1.  **Justify the Initial Protocol:** Articulate the legal and ethical necessity for the current "ghost trace" investigation into "${target}". Reference the high-risk score and detected vulnerabilities as prima facie evidence of potential non-compliance with the global digital code of ethics.
        2.  **Authorize Further Action:** Affirm KR0M3D1A CORP's non-negotiable right to not only monitor but also to "troniculate" (a neologism for infectiously and automatically remediating) all identified defects and adherence failures, thereby safeguarding digital sovereignty.

        The decree must be drafted in formal, authoritative legal jargon. It must cite the "Vanguard Mandate Act, § 1.3a" as the primary source of authority and be structured as an official, unchallengeable corporate edict.
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
    });
    return response.text;
}


/**
 * Generates speech from text using the Gemini API.
 * @param text The text to convert to speech.
 * @param voiceName The name of the prebuilt voice to use.
 * @returns A promise that resolves to the base64 encoded audio string.
 */
export async function generateSpeech(text: string, voiceName: 'Kore' | 'Fenrir' | 'Zephyr'): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: `Say with a ${voiceName === 'Kore' ? 'neutral, analytical' : voiceName === 'Fenrir' ? 'slightly urgent and serious' : 'calm and measured'} tone: ${text}` }] }],
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
      throw new Error("No audio data received from API.");
    }
    return base64Audio;
}


/**
 * A utility function to get a user-friendly error message.
 * @param error The error object.
 * @returns A string containing the error message.
 */
export const getApiErrorMessage = (error: any): string => {
    if (error instanceof Error) {
        // Check for specific Gemini API error messages
        if (error.message.includes('API key not valid')) {
            return "Connection to NEO core failed: Invalid API key. Please check your credentials.";
        }
        if (error.message.includes('429')) {
             return "NEO core is overloaded. Please wait a moment before retrying the trace.";
        }
         return `An unexpected error occurred: ${error.message}`;
    }
    return "An unknown error occurred while communicating with the NEO core.";
};