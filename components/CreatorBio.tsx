// components/CreatorBio.tsx
import React from 'react';
import { FounderIcon } from './icons/FounderIcon';

export const CreatorBio: React.FC = () => {
  return (
    <section className="text-center p-8 mt-8 bg-cyber-surface/50 border border-cyber-primary/20 rounded-lg animate-fade-in">
      <div className="flex justify-center mb-4">
        <FounderIcon className="w-16 h-16 text-cyber-primary" />
      </div>
      <h2 className="text-2xl font-orbitron text-cyber-primary">The Vision of the Architect</h2>
      <h3 className="text-lg font-roboto-mono text-cyber-accent tracking-widest mb-4">EDWARD CRAIG CALLENDER IV, C.A.P.A.C.</h3>

      <div className="max-w-3xl mx-auto text-center text-cyber-dim">
        <p className="text-base text-cyber-text leading-relaxed font-roboto-mono">
          "This protocol is our covenant—a proactive shield forged with a singular passion: to guarantee a secure digital frontier for all future generations. This application is the manifestation of that drive, our commitment to an absolute, protected future."
        </p>
      </div>
    </section>
  );
};