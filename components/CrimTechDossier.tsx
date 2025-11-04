import React, { useState } from 'react';
import type { HumanProfile, AIProfile, UnknownEntityProfile } from '../types';
import { HumanProfileCard } from './HumanProfileCard';
import { AIProfileCard } from './AIProfileCard';
import { UnknownEntityProfileCard } from './UnknownEntityProfileCard';
import { UserXIcon } from './icons/UserXIcon';
import { ChipIcon } from './icons/ChipIcon';
import { AlienIcon } from './icons/AlienIcon';

interface CrimTechDossierProps {
  humanProfiles: HumanProfile[];
  aiProfiles: AIProfile[];
  unknownEntityProfiles: UnknownEntityProfile[];
}

type DossierTab = 'human' | 'ai' | 'unknown';

const TABS: { id: DossierTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'human', label: 'Human Intelligence', icon: UserXIcon },
    { id: 'ai', label: 'Malicious Constructs', icon: ChipIcon },
    { id: 'unknown', label: 'Unknown Signals', icon: AlienIcon },
];

export const CrimTechDossier: React.FC<CrimTechDossierProps> = ({ humanProfiles, aiProfiles, unknownEntityProfiles }) => {
    const [activeTab, setActiveTab] = useState<DossierTab>('human');

    return (
        <section>
            <div className="flex items-end border-b-2 border-cyber-primary/20 mb-4">
                <h3 className="text-2xl font-orbitron text-cyber-primary mr-6">Crim-Tech Dossier: Real-Time Threat Feed</h3>
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
            
            <div>
                {activeTab === 'human' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
                        {humanProfiles.map(profile => (
                            <HumanProfileCard key={profile.callsign} profile={profile} />
                        ))}
                    </div>
                )}
                 {activeTab === 'ai' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
                        {aiProfiles.map(profile => (
                            <AIProfileCard key={profile.callsign} profile={profile} />
                        ))}
                    </div>
                )}
                 {activeTab === 'unknown' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in">
                        {unknownEntityProfiles.map(profile => (
                            <UnknownEntityProfileCard key={profile.designation} profile={profile} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};