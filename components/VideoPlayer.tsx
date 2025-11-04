
import React from 'react';
import { CloseIcon } from './icons/CloseIcon';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { GrokFeed } from './GrokFeed';

interface VideoPlayerProps {
  onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = React.useState(true);
  
  return (
    <div className="fixed inset-0 bg-cyber-bg/90 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-4xl bg-cyber-surface border-2 border-cyber-secondary/50 rounded-lg shadow-cyber flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-3 border-b border-cyber-secondary/20 flex-shrink-0 bg-cyber-bg/50">
          <h2 className="font-orbitron text-lg text-cyber-secondary animate-flicker">ENCRYPTED INTEL FEED :: GROK-7 :: THREAT_ID: METATRON_Q</h2>
          <button onClick={onClose} className="text-cyber-dim hover:text-cyber-secondary transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        
        {/* Video Screen */}
        <div className="aspect-video bg-black relative overflow-hidden">
            <GrokFeed isPlaying={isPlaying} />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute top-2 left-2 text-red-500 font-roboto-mono text-xs animate-pulse">● REC</div>
             <div className="absolute bottom-2 left-2 text-cyber-accent font-roboto-mono text-xs">
                <p>TRACE ACTIVE: 89.231.5.67</p>
                <p>SIGNAL DECRYPTION: 98%</p>
            </div>
        </div>

        {/* Controls */}
        <div className="p-3 bg-cyber-bg/50 border-t border-cyber-secondary/20 flex-shrink-0 flex items-center gap-4">
            <button onClick={() => setIsPlaying(!isPlaying)} className="text-cyber-text hover:text-cyber-secondary">
                {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
            </button>
            <div className="text-cyber-dim font-roboto-mono text-sm">00:17 / 00:38</div>
            <div className="flex-grow h-2 bg-cyber-surface rounded-full relative">
                <div className="absolute top-0 left-0 h-full bg-cyber-secondary/50 rounded-full w-[45%]"></div>
                <div className="absolute top-0 left-0 h-full bg-cyber-secondary rounded-full w-[25%] animate-pulse-glow"></div>
            </div>
        </div>
      </div>
    </div>
  );
};
