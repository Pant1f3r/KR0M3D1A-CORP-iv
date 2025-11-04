// components/ThreatActorCard.tsx

import React, { useState } from 'react';
import type { ThreatActor } from '../types';
import { UserHexagonIcon } from './icons/UserHexagonIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { TagIcon } from './icons/TagIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { CrosshairIcon } from './icons/CrosshairIcon';
import { VideoPlayer } from './VideoPlayer';
import { PlayIcon } from './icons/PlayIcon';
import { ZapIcon } from './icons/ZapIcon';

interface ThreatActorCardProps {
  actor: ThreatActor;
}

export const ThreatActorCard: React.FC<ThreatActorCardProps> = ({ actor }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  
  const getRiskColor = (score: number) => {
    if (score > 75) return 'text-red-500';
    if (score > 50) return 'text-yellow-400';
    return 'text-cyber-dim';
  };

  const getRiskBgColor = (score: number) => {
    if (score > 75) return 'bg-red-500';
    if (score > 50) return 'bg-yellow-400';
    return 'bg-cyber-accent';
  };

  const pulseClass = actor.riskAssociationScore > 75 ? 'animate-pulse-glow' : '';

  return (
    <>
      <div className="bg-cyber-bg/50 p-4 rounded-lg border border-cyber-surface hover:border-cyber-secondary/50 transition-colors duration-300 flex flex-col h-full">
        {/* Main Content */}
        <div className="flex-grow">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-3 min-w-0">
              <UserHexagonIcon className="w-6 h-6 text-cyber-secondary flex-shrink-0" />
              <div className="flex-grow truncate">
                  <div className="flex items-center gap-2">
                    <span 
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${getRiskBgColor(actor.riskAssociationScore)} ${pulseClass}`}
                      title={`Risk Score: ${actor.riskAssociationScore}`}
                    ></span>
                    <h5 className="font-orbitron text-lg text-cyber-text truncate">{actor.name}</h5>
                  </div>
                  <p className="text-xs font-roboto-mono text-cyber-secondary/80 tracking-wider truncate">{actor.classification}</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-cyber-dim">RISK</div>
              <div className={`font-orbitron text-2xl ${getRiskColor(actor.riskAssociationScore)}`}>
                {actor.riskAssociationScore}
              </div>
            </div>
          </div>
          
          <div className="text-xs text-cyber-dim font-roboto-mono mb-3 ml-9 flex items-center gap-3 flex-wrap">
              <span className="font-bold bg-cyber-surface px-1.5 py-0.5 rounded">ID: {actor.id}</span>
              {actor.aliases && actor.aliases.length > 0 && (
                <div className="flex items-center gap-2 truncate">
                    <TagIcon className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">AKA: {actor.aliases.join(', ')}</span>
                </div>
              )}
          </div>
          
          <div className="flex items-start gap-2">
            <ZapIcon className="w-4 h-4 text-cyber-accent flex-shrink-0 mt-1" />
            <div>
              <h6 className="font-bold font-roboto-mono text-xs text-cyber-dim/80 uppercase tracking-wider">Modus Operandi</h6>
              <p className="font-roboto-mono text-sm text-cyber-dim -mt-1">{actor.modusOperandi}</p>
            </div>
          </div>

          {actor.name === 'Metatron Q' && (
              <div className="mt-4">
                  <button 
                      onClick={() => setIsVideoOpen(true)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-cyber-secondary/10 hover:bg-cyber-secondary/20 border border-cyber-secondary/50 rounded-md text-sm font-roboto-mono text-cyber-secondary transition-all duration-300"
                  >
                      <PlayIcon className="w-4 h-4" />
                      Play Threat Briefing
                  </button>
              </div>
          )}
        </div>
        
        {/* Footer Area: Intelligence & Chronology */}
        <div className="flex-shrink-0 mt-auto pt-3 border-t border-cyber-surface space-y-3">
            {actor.campaign && (
                <div className="flex items-start gap-2">
                    <CrosshairIcon className="w-4 h-4 text-cyber-accent flex-shrink-0 mt-1" />
                    <div>
                        <h6 className="font-bold font-roboto-mono text-xs text-cyber-dim/80 uppercase tracking-wider">Active Campaign</h6>
                        <p className="font-roboto-mono text-sm text-cyber-text -mt-1">{actor.campaign}</p>
                    </div>
                </div>
            )}
            {actor.reported_by && (
                <div className="flex items-start gap-2">
                    <ShieldIcon className="w-4 h-4 text-cyber-accent flex-shrink-0 mt-1" />
                    <div>
                        <h6 className="font-bold font-roboto-mono text-xs text-cyber-dim/80 uppercase tracking-wider">Intel Source</h6>
                        <p className="font-roboto-mono text-sm text-cyber-text -mt-1">{actor.reported_by}</p>
                    </div>
                </div>
            )}
            <div className="flex items-start gap-2">
                <CalendarIcon className="w-4 h-4 text-cyber-accent flex-shrink-0 mt-1" />
                <div>
                    <h6 className="font-bold font-roboto-mono text-xs text-cyber-dim/80 uppercase tracking-wider">Last Seen</h6>
                    <p className="font-roboto-mono text-sm text-cyber-text -mt-1">{actor.lastSeen}</p>
                </div>
            </div>
            {actor.intelUrl && (
                <div className="flex items-start gap-2">
                    <ExternalLinkIcon className="w-4 h-4 text-cyber-accent flex-shrink-0 mt-1" />
                    <div className="-mt-1">
                        <a
                            href={actor.intelUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyber-primary hover:text-white transition-colors group px-1 py-0.5 rounded hover:bg-cyber-primary/10 text-sm"
                        >
                            Access Intel Brief
                        </a>
                    </div>
                </div>
            )}
        </div>
      </div>
      {isVideoOpen && <VideoPlayer onClose={() => setIsVideoOpen(false)} />}
    </>
  );
};
