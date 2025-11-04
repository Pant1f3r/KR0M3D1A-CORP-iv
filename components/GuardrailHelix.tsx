// components/GuardrailHelix.tsx

import React from 'react';
import type { GuardrailHelixData } from '../types';
import { HelixIcon } from './icons/HelixIcon';

interface GuardrailHelixProps {
  data: GuardrailHelixData;
}

export const GuardrailHelix: React.FC<GuardrailHelixProps> = ({ data }) => {
  const { explanation, basePairs } = data;

  return (
    <div className="bg-cyber-surface/50 p-6 rounded-lg border border-cyber-primary/20 h-full">
      <div className="flex items-center gap-3 mb-4">
        <HelixIcon className="w-6 h-6 text-cyber-accent" />
        <h3 className="text-xl font-orbitron text-cyber-primary">Guardrail Digital Helix</h3>
      </div>

      <p className="font-roboto-mono text-sm text-cyber-dim mb-4">{explanation}</p>

      <div>
        <h4 className="font-bold font-roboto-mono text-cyber-text mb-2">Harmonic Base Frequencies (ATCG)</h4>
        <ul className="space-y-3">
          {basePairs.map((item, index) => (
            <li key={`${item.pair}-${index}`} className="flex items-center gap-4 bg-cyber-bg/50 p-3 rounded-md">
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-orbitron text-cyber-bg font-bold shadow-inner"
                style={{ backgroundColor: item.colorCode, textShadow: '0 0 2px black' }}
              >
                {item.pair}
              </div>
              <div className="flex-grow">
                <p className="font-bold text-cyber-text">{item.meaning}</p>
                <p className="text-xs text-cyber-dim font-roboto-mono">{item.frequency.toFixed(2)} THz</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
