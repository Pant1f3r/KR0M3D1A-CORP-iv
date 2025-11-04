// components/IncidentResponse.tsx

import React, { useState } from 'react';
import type { IncidentResponseData } from '../types';
import { NetworkIcon } from './icons/NetworkIcon';
import { VirusIcon } from './icons/VirusIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface IncidentResponseProps {
  data: IncidentResponseData;
}

type ResponseTab = 'ddos' | 'malware' | 'reporting';

const TABS: { id: ResponseTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'ddos', label: 'DDoS Protocol', icon: NetworkIcon },
    { id: 'malware', label: 'Malware Protocol', icon: VirusIcon },
    { id: 'reporting', label: 'Reporting Directory', icon: PhoneIcon },
];

export const IncidentResponse: React.FC<IncidentResponseProps> = ({ data }) => {
    const [activeTab, setActiveTab] = useState<ResponseTab>('ddos');

    return (
        <div className="bg-cyber-surface/50 p-6 rounded-lg border border-cyber-primary/20 h-full flex flex-col">
            <h3 className="text-xl font-orbitron text-cyber-primary mb-4">Incident Response Protocol</h3>
            
            <div className="flex-shrink-0 border-b border-cyber-primary/20 mb-4">
                <div className="flex items-center gap-1">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 border-b-2 text-sm font-roboto-mono transition-all duration-300 ${
                                activeTab === tab.id
                                    ? 'border-cyber-primary text-cyber-primary bg-cyber-primary/10'
                                    : 'border-transparent text-cyber-dim hover:bg-cyber-surface/50 hover:text-cyber-text'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-grow overflow-y-auto">
                {activeTab === 'ddos' && (
                    <div className="animate-fade-in space-y-3">
                        <h4 className="font-orbitron text-lg text-cyber-secondary animate-flicker">Distributed Denial-of-Service Attack</h4>
                        <p className="font-roboto-mono text-sm text-cyber-dim whitespace-pre-wrap">{data.ddosProtocol}</p>
                    </div>
                )}
                {activeTab === 'malware' && (
                    <div className="animate-fade-in space-y-3">
                        <h4 className="font-orbitron text-lg text-yellow-400">Malware / Ransomware Containment</h4>
                        <p className="font-roboto-mono text-sm text-cyber-dim whitespace-pre-wrap">{data.malwareProtocol}</p>
                    </div>
                )}
                {activeTab === 'reporting' && (
                    <div className="animate-fade-in space-y-4">
                         <h4 className="font-orbitron text-lg text-cyber-accent">External Agency Reporting</h4>
                        <ul className="space-y-3">
                            {data.reportingDirectory.map(agency => (
                                <li key={agency.name} className="bg-cyber-bg/50 p-3 rounded-md">
                                    <h5 className="font-bold font-roboto-mono text-cyber-text">{agency.name}</h5>
                                    <p className="text-xs text-cyber-dim mb-1">{agency.description}</p>
                                    <a
                                        href={agency.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-cyber-primary hover:underline group"
                                    >
                                        Visit Site <ExternalLinkIcon className="w-3 h-3 opacity-70 group-hover:opacity-100"/>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};