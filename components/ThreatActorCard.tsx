
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
import { CloseIcon } from './icons/CloseIcon';
import { BugIcon } from './icons/BugIcon';

interface ThreatActorCardProps {
  actor: ThreatActor;
}

export const ThreatActorCard: React.FC<ThreatActorCardProps> = ({ actor }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
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

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(true);
  };

  const closeExpandedView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
  };

  return (
    <>
      <div 
        className="bg-cyber-bg/50 p-4 rounded-lg border border-cyber-surface hover:border-cyber-secondary/50 transition-colors duration-300 flex flex-col h-full relative cursor-pointer group"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleCardClick}
        title="Click to view detailed profile"
      >
        {/* Tooltip */}
        {showTooltip && !isExpanded && (
          <div className="absolute z-50 bottom-[105%] left-1/2 transform -translate-x-1/2 w-64 bg-cyber-surface/95 backdrop-blur-md border border-cyber-primary/50 text-cyber-text text-xs p-3 rounded shadow-[0_0_15px_rgba(0,242,255,0.2)] pointer-events-none transition-opacity duration-200 animate-fade-in">
            <div className="font-orbitron font-bold text-cyber-primary mb-2 border-b border-cyber-primary/20 pb-1">
              TACTICAL INTEL
            </div>
            <div className="space-y-2 font-roboto-mono">
              <div>
                <span className="text-cyber-dim block text-[10px] uppercase tracking-wider mb-0.5">Modus Operandi</span>
                <span className="text-cyber-text leading-tight block">{actor.modusOperandi}</span>
              </div>
              <div>
                <span className="text-cyber-dim block text-[10px] uppercase tracking-wider mb-0.5">Last Known Activity</span>
                <span className="text-cyber-text leading-tight block line-clamp-2">
                   {actor.recentActivities?.[0] || actor.lastSeen}
                </span>
              </div>
            </div>
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-cyber-primary/50"></div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-grow">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-3 min-w-0">
              <UserHexagonIcon className="w-6 h-6 text-cyber-secondary flex-shrink-0 group-hover:text-cyber-primary transition-colors" />
              <div className="flex-grow truncate">
                  <div className="flex items-center gap-2">
                    <span 
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${getRiskBgColor(actor.riskAssociationScore)} ${pulseClass}`}
                      title={`Risk Score: ${actor.riskAssociationScore}`}
                    ></span>
                    <h5 className="font-orbitron text-lg text-cyber-text truncate group-hover:text-cyber-primary transition-colors">{actor.name}</h5>
                    {actor.intelUrl && (
                      <a 
                        href={actor.intelUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        onClick={(e) => e.stopPropagation()}
                        className="text-cyber-primary hover:text-white transition-colors"
                        title="View Intel Source"
                      >
                        <ExternalLinkIcon className="w-4 h-4" />
                      </a>
                    )}
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
              <p className="font-roboto-mono text-sm text-cyber-dim -mt-1 line-clamp-2">{actor.modusOperandi}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
             {actor.name === 'Metatron Q' && (
                  <button 
                      onClick={(e) => { e.stopPropagation(); setIsVideoOpen(true); }}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-cyber-secondary/10 hover:bg-cyber-secondary/20 border border-cyber-secondary/50 rounded-md text-sm font-roboto-mono text-cyber-secondary transition-all duration-300"
                  >
                      <PlayIcon className="w-4 h-4" />
                      Play Threat Briefing
                  </button>
              )}
             <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                }}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-cyber-primary/10 hover:bg-cyber-primary/20 border border-cyber-primary/50 rounded-md text-xs font-orbitron text-cyber-primary transition-all duration-300 hover:shadow-[0_0_10px_rgba(0,242,255,0.3)] group-hover:bg-cyber-primary/20"
            >
                <UserHexagonIcon className="w-4 h-4" />
                EXPAND PROFILE
            </button>
          </div>
        </div>
        
        {/* Footer Area: Intelligence & Chronology */}
        <div className="flex-shrink-0 mt-auto pt-3 border-t border-cyber-surface space-y-3 mt-3">
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
                            onClick={(e) => e.stopPropagation()}
                            className="text-cyber-primary hover:text-white transition-colors group/link px-1 py-0.5 rounded hover:bg-cyber-primary/10 text-sm"
                        >
                            Access Intel Brief
                        </a>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Expanded Modal Overlay */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-cyber-bg/90 backdrop-blur-md animate-fade-in" onClick={closeExpandedView}>
          <div 
            className="w-full max-w-4xl bg-cyber-surface border-2 border-cyber-primary/50 rounded-lg shadow-cyber flex flex-col overflow-hidden max-h-[90vh]" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-cyber-primary/20 bg-cyber-bg/50">
               <div className="flex items-center gap-4">
                 <UserHexagonIcon className="w-10 h-10 text-cyber-primary animate-pulse-glow" />
                 <div>
                    <h2 className="text-2xl font-orbitron text-cyber-text">{actor.name}</h2>
                    <p className="text-sm font-roboto-mono text-cyber-secondary tracking-widest uppercase">{actor.classification}</p>
                 </div>
               </div>
               <button onClick={closeExpandedView} className="text-cyber-dim hover:text-cyber-primary transition-colors p-2">
                 <CloseIcon className="w-8 h-8" />
               </button>
            </div>
            
            {/* Modal Content */}
            <div className="overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
               
               {/* Column 1: Metadata */}
               <div className="space-y-6 lg:border-r lg:border-cyber-primary/20 lg:pr-6">
                  <div className="bg-cyber-bg/30 p-4 rounded-lg text-center">
                     <div className="text-sm text-cyber-dim font-roboto-mono mb-1">THREAT RISK ASSESSMENT</div>
                     <div className={`text-6xl font-orbitron ${getRiskColor(actor.riskAssociationScore)}`}>{actor.riskAssociationScore}</div>
                     <div className="w-full h-1 bg-cyber-surface mt-2 rounded-full overflow-hidden">
                        <div className={`h-full ${getRiskBgColor(actor.riskAssociationScore)}`} style={{ width: `${actor.riskAssociationScore}%` }}></div>
                     </div>
                  </div>

                  <div className="space-y-3 font-roboto-mono text-sm">
                      <div>
                          <span className="text-cyber-dim block text-xs uppercase tracking-wider mb-1">Unique Identifier</span>
                          <span className="text-cyber-text bg-cyber-surface px-2 py-1 rounded border border-cyber-dim/20">{actor.id}</span>
                      </div>
                      <div>
                          <span className="text-cyber-dim block text-xs uppercase tracking-wider mb-1">Known Aliases</span>
                          {actor.aliases && actor.aliases.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                  {actor.aliases.map(alias => (
                                      <span key={alias} className="text-cyber-text bg-cyber-surface px-2 py-1 rounded text-xs border border-cyber-dim/20">{alias}</span>
                                  ))}
                              </div>
                          ) : <span className="text-cyber-dim italic">None identified</span>}
                      </div>
                      <div>
                          <span className="text-cyber-dim block text-xs uppercase tracking-wider mb-1">Active Campaign</span>
                          <div className="flex items-center gap-2">
                            <CrosshairIcon className="w-4 h-4 text-cyber-accent" />
                            <span className="text-cyber-text">{actor.campaign || 'N/A'}</span>
                          </div>
                      </div>
                      <div>
                          <span className="text-cyber-dim block text-xs uppercase tracking-wider mb-1">Last Sighting</span>
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-cyber-accent" />
                            <span className="text-cyber-text">{actor.lastSeen}</span>
                          </div>
                      </div>
                      {actor.intelUrl && (
                        <div className="pt-2">
                           <a
                              href={actor.intelUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-cyber-primary hover:text-white transition-colors border border-cyber-primary/50 hover:bg-cyber-primary/20 px-4 py-2 rounded-md w-full justify-center font-bold"
                          >
                              <ExternalLinkIcon className="w-4 h-4" />
                              OPEN INTEL BRIEF
                          </a>
                        </div>
                      )}
                  </div>
               </div>

               {/* Column 2 & 3: Detailed Intel */}
               <div className="lg:col-span-2 space-y-6">
                  {/* Modus Operandi */}
                  <div className="bg-cyber-surface/30 p-4 rounded-lg border border-cyber-secondary/20">
                      <h3 className="flex items-center gap-2 font-orbitron text-lg text-cyber-secondary mb-3">
                          <ZapIcon className="w-5 h-5" />
                          Modus Operandi
                      </h3>
                      <p className="font-roboto-mono text-cyber-text leading-relaxed whitespace-pre-wrap">
                          {actor.modusOperandi}
                      </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Recent Activities */}
                      <div>
                          <h3 className="flex items-center gap-2 font-orbitron text-lg text-yellow-400 mb-3">
                              <CrosshairIcon className="w-5 h-5" />
                              Recent Activities
                          </h3>
                          {actor.recentActivities && actor.recentActivities.length > 0 ? (
                            <ul className="space-y-2">
                                {actor.recentActivities.map((activity, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm font-roboto-mono text-cyber-dim">
                                        <span className="text-yellow-400 mt-1">▹</span>
                                        <span>{activity}</span>
                                    </li>
                                ))}
                            </ul>
                          ) : (
                            <p className="text-sm font-roboto-mono text-cyber-dim italic">No specific recent activities logged in this cycle.</p>
                          )}
                      </div>

                      {/* Associated Vulnerabilities */}
                      <div>
                          <h3 className="flex items-center gap-2 font-orbitron text-lg text-red-400 mb-3">
                              <BugIcon className="w-5 h-5" />
                              Associated Exploits
                          </h3>
                          {actor.associatedVulnerabilities && actor.associatedVulnerabilities.length > 0 ? (
                            <ul className="space-y-2">
                                {actor.associatedVulnerabilities.map((vuln, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm font-roboto-mono text-cyber-dim">
                                        <span className="text-red-400 mt-1">⚠</span>
                                        <span>{vuln}</span>
                                    </li>
                                ))}
                            </ul>
                          ) : (
                            <p className="text-sm font-roboto-mono text-cyber-dim italic">No direct vulnerability associations found.</p>
                          )}
                      </div>
                  </div>
               </div>

            </div>
          </div>
        </div>
      )}

      {isVideoOpen && <VideoPlayer onClose={() => setIsVideoOpen(false)} />}
    </>
  );
};
