import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { VirtualReaderEvent, EventLevel } from '../types';
import { useAudioAlert } from '../contexts/AudioAlertContext';

import { AlertIcon } from './icons/AlertIcon';
import { ChartIcon } from './icons/ChartIcon';
import { InfoIcon } from './icons/InfoIcon';
import { KeyIcon } from './icons/KeyIcon';
import { WarningIcon } from './icons/WarningIcon';
import { WrenchIcon } from './icons/WrenchIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface VirtualReaderProps {
  events: VirtualReaderEvent[];
}

const eventLevelConfig: Record<EventLevel, { 
    color: string; 
    icon: React.ComponentType<{className?: string}>; 
    sound: { freq: number; type: OscillatorType, duration: number } | null 
}> = {
    CRITICAL: { color: 'text-red-500', icon: AlertIcon, sound: { freq: 1200, type: 'sine', duration: 0.15 } },
    SECURITY_BREACH: { color: 'text-purple-400 animate-flicker', icon: KeyIcon, sound: { freq: 1500, type: 'triangle', duration: 0.2 } },
    WARN: { color: 'text-yellow-400', icon: WarningIcon, sound: { freq: 800, type: 'sine', duration: 0.1 } },
    CONFIG_MISMATCH: { color: 'text-orange-400', icon: WrenchIcon, sound: { freq: 800, type: 'square', duration: 0.1 } },
    DATA_SPIKE: { color: 'text-cyan-400', icon: ChartIcon, sound: { freq: 600, type: 'sawtooth', duration: 0.08 } },
    INFO: { color: 'text-blue-400', icon: InfoIcon, sound: { freq: 400, type: 'sine', duration: 0.05 } },
    SYSTEM_OK: { color: 'text-green-400', icon: CheckCircleIcon, sound: null },
};

const allLevels = Object.keys(eventLevelConfig) as EventLevel[];


export const VirtualReader: React.FC<VirtualReaderProps> = ({ events }) => {
  const [displayedEvents, setDisplayedEvents] = useState<VirtualReaderEvent[]>([]);
  const { isMuted, toggleMute } = useAudioAlert();
  const [activeFilters, setActiveFilters] = useState<EventLevel[]>(allLevels);
  const audioContextRef = useRef<AudioContext | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Audio playback function
  const playSound = (sound: { freq: number; type: OscillatorType, duration: number } | null) => {
    if (isMuted || !sound) return;
    
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.error("Web Audio API is not supported in this browser.");
        return;
      }
    }
    const audioCtx = audioContextRef.current;
    
    // Resume context if it's suspended (e.g., due to user interaction policy)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime); // Start with some volume
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + sound.duration); // Fade out

    oscillator.type = sound.type;
    oscillator.frequency.setValueAtTime(sound.freq, audioCtx.currentTime);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + sound.duration);
  };

  const handleFilterToggle = (levelToToggle: EventLevel) => {
    setActiveFilters(prevFilters => 
        prevFilters.includes(levelToToggle)
            ? prevFilters.filter(level => level !== levelToToggle)
            : [...prevFilters, levelToToggle]
    );
  };

  const filteredEvents = useMemo(() => {
    if (activeFilters.length === allLevels.length) {
        return events; // No filtering needed if all are active
    }
    return events.filter(event => activeFilters.includes(event.level));
  }, [events, activeFilters]);


  useEffect(() => {
    let currentIndex = 0;
    setDisplayedEvents([]); // Clear previous events when filters change
    
    const interval = setInterval(() => {
      if (currentIndex < filteredEvents.length) {
        const newEvent = filteredEvents[currentIndex];
        setDisplayedEvents(prev => [...prev.slice(-15), newEvent]); // Keep a max of 16 events
        
        const config = eventLevelConfig[newEvent.level];
        if (config) {
            playSound(config.sound);
        }

        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 400); // New event every 400ms

    return () => clearInterval(interval);
  }, [filteredEvents, isMuted]); // Rerun if filteredEvents or mute state changes

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedEvents]);

  const formatTimestamp = (timestamp: string) => {
    try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) return timestamp; // Return original if invalid
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
        return timestamp;
    }
  };

  return (
    <div className="bg-cyber-bg/50 p-4 rounded-md h-96 flex flex-col font-roboto-mono text-sm">
      <div className="flex-grow overflow-y-auto pr-2" ref={containerRef}>
        {displayedEvents.map((event) => {
          const config = eventLevelConfig[event.level];
          if (!config) return null;
          const Icon = config.icon;

          return (
            <div key={event.id} className={`flex items-start gap-3 mb-2 animate-fade-in ${config.color}`}>
              <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="w-20 flex-shrink-0 text-cyber-dim/80">{formatTimestamp(event.timestamp)}</span>
              <span className="font-bold w-32 flex-shrink-0">{`[${event.level}]`}</span>
              <p className="flex-grow">{event.message}</p>
            </div>
          );
        })}
      </div>
       <div className="border-t border-cyber-primary/20 pt-2 flex justify-between items-center gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {allLevels.map(level => {
            const config = eventLevelConfig[level];
            const isActive = activeFilters.includes(level);
            // Create a short label for the button
            const label = level.replace('_', ' ').split(' ')[0];
            return (
              <button
                key={level}
                onClick={() => handleFilterToggle(level)}
                className={`px-2 py-1 rounded-md text-xs flex items-center gap-1.5 border transition-all duration-200 ${
                    isActive
                        ? 'bg-cyber-primary/20 border-cyber-primary/50 text-cyber-text'
                        : 'bg-transparent border-cyber-dim/20 text-cyber-dim opacity-60 hover:opacity-100 hover:border-cyber-dim/50'
                }`}
                title={`Toggle ${level}`}
              >
                <config.icon className="w-3 h-3" />
                <span>{label}</span>
              </button>
            )
          })}
        </div>
        <button 
          onClick={toggleMute}
          className="text-xs text-cyber-dim hover:text-cyber-primary transition-colors flex-shrink-0"
        >
          {isMuted ? 'AUDIO: MUTED' : 'AUDIO: ENABLED'}
        </button>
      </div>
    </div>
  );
};