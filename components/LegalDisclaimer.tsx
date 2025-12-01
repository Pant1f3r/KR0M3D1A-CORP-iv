import React from 'react';
import { AlertIcon } from './icons/AlertIcon';

export const LegalDisclaimer: React.FC = () => {
  return (
    <div className="border-t-4 border-red-600 bg-black text-red-500 p-6 font-roboto-mono text-xs md:text-sm mt-12 mb-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-900/10 animate-pulse pointer-events-none"></div>
        <div className="flex items-start gap-4 relative z-10">
            <AlertIcon className="w-8 h-8 flex-shrink-0 animate-flicker" />
            <div>
                <h4 className="font-bold text-lg mb-2 uppercase tracking-widest font-orbitron">
                    Forensic Integrity Warning: Authorized Use Only
                </h4>
                <p className="mb-2">
                    This utility generates <strong className="text-white">REAL-TIME FORENSIC DATA</strong>. The tracking of threat actors, digital wave textures, and vulnerability signatures constitutes actionable intelligence.
                </p>
                <p className="mb-2">
                    Visitors are advised that this is <strong className="text-white">NOT A SIMULATION</strong>. This application emulates and simulates digital wave texture forming power to expose nefariously acting entities.
                </p>
                <p>
                    <strong>SEVERE CONSEQUENCES:</strong> Any identified threat actor found violating Trust Agreements or engaging in illicit activity on the World Wide Web will be subject to immediate digital interdiction, tracking, and referral to international cyber-authorities. Misuse of this detective tool for unauthorized surveillance is a federal offense.
                </p>
                <div className="mt-4 text-[10px] text-red-700 uppercase tracking-[0.2em]">
                    KR0M3D1A CORP // GLOBAL SURVEILLANCE MATRIX // NODE: ALPHA-1
                </div>
            </div>
        </div>
    </div>
  );
};