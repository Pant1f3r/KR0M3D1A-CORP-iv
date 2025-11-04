import React, { useEffect, useRef } from 'react';
import type { HumanProfile } from '../types';
import { useAudioAlert } from '../contexts/AudioAlertContext';
import { GlobeIcon } from './icons/GlobeIcon';
import { BugIcon } from './icons/BugIcon';
import { TagIcon } from './icons/TagIcon';
import { AlertIcon } from './icons/AlertIcon';
import { WarningIcon } from './icons/WarningIcon';
import { InfoIcon } from './icons/InfoIcon';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { ZapIcon } from './icons/ZapIcon';

interface HumanProfileCardProps {
  profile: HumanProfile;
}

export const HumanProfileCard: React.FC<HumanProfileCardProps> = ({ profile }) => {
    const { isMuted } = useAudioAlert();
    const prevStatusRef = useRef<HumanProfile['status'] | undefined>(undefined);
    const audioContextRef = useRef<AudioContext | null>(null);

    const playCaptureSound = () => {
        if (isMuted) return;
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const audioCtx = audioContextRef.current;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.3);
    };

    useEffect(() => {
        if (prevStatusRef.current && prevStatusRef.current !== 'APPREHENDED' && profile.status === 'APPREHENDED') {
            playCaptureSound();
        }
        prevStatusRef.current = profile.status;
    }, [profile.status, isMuted]);

    const getStatusStyles = (status: HumanProfile['status'], blacklistStatus?: HumanProfile['blacklistStatus']) => {
        if (blacklistStatus === 'BLACKLISTED') return 'bg-red-500/80 text-white animate-pulse';
        switch (status) {
            case 'WANTED': return 'bg-red-500/80 text-white animate-pulse';
            case 'APPREHENDED': return 'bg-cyber-accent/80 text-black';
            case 'CONVICTED': return 'bg-blue-500/80 text-white';
            case 'ACTIVE_THREAT': return 'bg-yellow-400/80 text-black animate-flicker';
            case 'ASSET': return 'bg-green-400/80 text-black';
            default: return 'bg-cyber-dim/80 text-white';
        }
    };
    
    const getThreatStyles = (level: HumanProfile['threatLevel']) => {
        switch(level) {
            case 'Critical': return { color: 'text-red-500', icon: AlertIcon };
            case 'High': return { color: 'text-orange-400', icon: WarningIcon };
            case 'Medium': return { color: 'text-yellow-400', icon: InfoIcon };
            default: return { color: 'text-cyber-dim', icon: InfoIcon };
        }
    };

    const threatInfo = getThreatStyles(profile.threatLevel);
    const ThreatIcon = threatInfo.icon;
    const isAsset = profile.status === 'ASSET' && profile.socialCredit;
    const borderColor = isAsset ? 'border-cyber-accent/50' : 'border-cyber-primary/20';

    // Use a placeholder service for "real-time" images
    const imageUrl = `https://i.pravatar.cc/150?u=${profile.imageUrl}`;

    return (
        <div className={`bg-cyber-surface/50 border ${borderColor} rounded-lg p-4 flex flex-col gap-3 transition-all duration-300 hover:bg-cyber-primary/10 hover:shadow-cyber-sm relative overflow-hidden h-full`}>
            <div className={`absolute top-2 right-[-30px] rotate-45 px-4 py-0.5 text-xs font-bold font-orbitron tracking-wider uppercase ${getStatusStyles(profile.status, profile.blacklistStatus)}`}>
                {profile.blacklistStatus === 'BLACKLISTED' ? 'BLACKLISTED' : profile.status.replace('_', ' ')}
            </div>
            
            <div className="flex items-center gap-4">
                <img src={imageUrl} alt={profile.callsign} className={`w-16 h-16 rounded-full border-2 ${isAsset ? 'border-cyber-accent/70' : 'border-cyber-primary/50'} object-cover`} />
                <div className="flex-grow">
                    <h4 className="font-orbitron text-xl text-cyber-text">{profile.callsign}</h4>
                    <p className="text-xs text-cyber-dim font-roboto-mono">REAL NAME: {profile.realName}</p>
                </div>
            </div>

            <div className="space-y-2 text-sm font-roboto-mono text-cyber-dim border-t border-cyber-surface pt-2">
                <div className="flex items-start gap-2"><BugIcon className="w-4 h-4 text-cyber-accent mt-0.5 flex-shrink-0" /><span><strong className="text-cyber-dim/80">Specialization:</strong> {profile.specialization}</span></div>
                <div className="flex items-start gap-2"><GlobeIcon className="w-4 h-4 text-cyber-accent mt-0.5 flex-shrink-0" /><span><strong className="text-cyber-dim/80">Last Location:</strong> {profile.lastKnownLocation}</span></div>
                <div className="flex items-start gap-2"><TagIcon className="w-4 h-4 text-cyber-accent mt-0.5 flex-shrink-0" /><span><strong className="text-cyber-dim/80">Affiliations:</strong> {profile.affiliations.join(', ')}</span></div>
            </div>

            {profile.counterIntelOps && profile.counterIntelOps.length > 0 && (
                <div className="mt-1 pt-2 border-t border-cyber-surface">
                    <h5 className="font-roboto-mono text-xs font-bold text-cyber-secondary flex items-center gap-2">
                        <ZapIcon className="w-4 h-4" />
                        COUNTER-INTEL OPS
                    </h5>
                    <ul className="list-disc list-inside pl-2 text-xs font-roboto-mono text-cyber-dim space-y-1 mt-1">
                        {profile.counterIntelOps.map((op, index) => (
                            <li key={index}>{op}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex justify-between items-center mt-auto border-t border-cyber-surface pt-2">
                 {isAsset ? (
                    <div className="flex items-center gap-2">
                        <TrendingUpIcon className="w-5 h-5 text-green-400" />
                        <span className="font-orbitron font-bold text-green-400">SOCIAL CREDIT: {profile.socialCredit}</span>
                    </div>
                 ) : (
                    <div className="flex items-center gap-2">
                        {profile.threatLevel !== 'None' && (
                            <>
                                <ThreatIcon className={`w-5 h-5 ${threatInfo.color}`} />
                                <span className={`font-orbitron font-bold ${threatInfo.color}`}>{profile.threatLevel.toUpperCase()}</span>
                            </>
                        )}
                    </div>
                 )}
                {profile.status === 'WANTED' && profile.bounty && (
                    <div className="font-roboto-mono text-xs text-red-400">
                        BOUNTY: <span className="font-bold">${profile.bounty.toLocaleString()}</span>
                    </div>
                )}
            </div>
        </div>
    );
};