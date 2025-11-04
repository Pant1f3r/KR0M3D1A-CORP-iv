import React from 'react';
import type { AIProfile } from '../types';
import { ChipIcon } from './icons/ChipIcon';
import { CrosshairIcon } from './icons/CrosshairIcon';
import { ServerIcon } from './icons/ServerIcon';
import { AlertIcon } from './icons/AlertIcon';
import { WarningIcon } from './icons/WarningIcon';
import { InfoIcon } from './icons/InfoIcon';
import { CodeIcon } from './icons/CodeIcon';

interface AIProfileCardProps {
  profile: AIProfile;
}

export const AIProfileCard: React.FC<AIProfileCardProps> = ({ profile }) => {
    const getStatusStyles = (status: AIProfile['status']) => {
        switch (status) {
            case 'ACTIVE': return 'bg-red-500/80 text-white animate-pulse';
            case 'QUARANTINED': return 'bg-cyber-accent/80 text-black';
            case 'NEUTRALIZED': return 'bg-blue-500/80 text-white';
            case 'OBSERVED': return 'bg-yellow-400/80 text-black';
            default: return 'bg-cyber-dim/80 text-white';
        }
    };
    
    const getThreatStyles = (level: AIProfile['threatLevel']) => {
        switch(level) {
            case 'Critical': return { color: 'text-red-500', icon: AlertIcon };
            case 'High': return { color: 'text-orange-400', icon: WarningIcon };
            case 'Medium': return { color: 'text-yellow-400', icon: InfoIcon };
            default: return { color: 'text-cyber-dim', icon: InfoIcon };
        }
    };

    const threatInfo = getThreatStyles(profile.threatLevel);
    const ThreatIcon = threatInfo.icon;

    return (
        <div className="bg-cyber-surface/50 border border-cyber-primary/20 rounded-lg p-4 flex flex-col gap-3 transition-all duration-300 hover:bg-cyber-primary/10 hover:shadow-cyber-sm relative overflow-hidden h-full">
            <div className={`absolute top-2 right-[-30px] rotate-45 px-4 py-0.5 text-xs font-bold font-orbitron tracking-wider uppercase ${getStatusStyles(profile.status)}`}>
                {profile.status}
            </div>
            
            <div className="flex items-center gap-3">
                <ChipIcon className="w-8 h-8 text-cyber-primary" />
                <div>
                    <h4 className="font-orbitron text-xl text-cyber-text">{profile.callsign}</h4>
                    <p className="text-xs text-cyber-dim font-roboto-mono">CLASSIFICATION: {profile.classification}</p>
                </div>
            </div>

            <div className="space-y-2 text-sm font-roboto-mono text-cyber-dim border-t border-cyber-primary/10 pt-2">
                <div className="flex items-start gap-2"><ServerIcon className="w-4 h-4 text-cyber-accent mt-0.5 flex-shrink-0" /><span><strong className="text-cyber-dim/80">Origin:</strong> {profile.origin}</span></div>
                <div className="flex items-start gap-2"><CrosshairIcon className="w-4 h-4 text-cyber-accent mt-0.5 flex-shrink-0" /><span><strong className="text-cyber-dim/80">Objective:</strong> {profile.primaryObjective}</span></div>
                <div className="flex items-start gap-2"><CodeIcon className="w-4 h-4 text-cyber-accent mt-0.5 flex-shrink-0" /><span><strong className="text-cyber-dim/80">Signature:</strong> {profile.threatSignature}</span></div>
            </div>

            <div className="flex justify-between items-center mt-auto border-t border-cyber-primary/10 pt-2">
                 <div className="flex items-center gap-2">
                    <ThreatIcon className={`w-5 h-5 ${threatInfo.color}`} />
                    <span className={`font-orbitron font-bold ${threatInfo.color}`}>{profile.threatLevel.toUpperCase()}</span>
                </div>
            </div>
        </div>
    );
};