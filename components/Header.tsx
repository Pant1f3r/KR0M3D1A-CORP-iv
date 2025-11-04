import React from 'react';
import { ShieldIcon } from './icons/ShieldIcon';
import { ThemeToggle } from './ThemeToggle';
import { AudioAlertToggle } from './AudioAlertToggle';

export const Header: React.FC = () => {
  return (
    <header className="bg-cyber-surface/70 backdrop-blur-sm border-b-2 border-cyber-primary/30 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldIcon className="w-8 h-8 text-cyber-primary animate-pulse-glow" />
          <div>
            <h1 className="text-2xl md:text-3xl font-orbitron text-cyber-primary animate-flicker leading-none">
              KR0M3D1A CORP
            </h1>
            <p className="text-xs text-cyber-accent font-roboto-mono tracking-widest">GHOST PROTOCOL DIVISION</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <AudioAlertToggle />
          <ThemeToggle />
          <div className="text-xs font-roboto-mono text-cyber-accent">
            STATUS: <span className="font-bold">ONLINE</span>
          </div>
        </div>
      </div>
    </header>
  );
};
