// components/JurisAI.tsx

import React, { useState, useCallback } from 'react';
import { generateLegalClause, getApiErrorMessage } from '../services/geminiService';
import { GavelIcon } from './icons/GavelIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import type { AnalysisData } from '../types';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

interface JurisAIProps {
  target: string;
  overallRiskScore: number;
  vulnerabilities: AnalysisData['vulnerabilityPoints'];
}

export const JurisAI: React.FC<JurisAIProps> = ({ target, overallRiskScore, vulnerabilities }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [clause, setClause] = useState('');
  const [error, setError] = useState('');
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);

  const handleJurisAnalysis = useCallback(async () => {
    setIsLoading(true);
    setClause('');
    setError('');

    try {
      const result = await generateLegalClause(target, overallRiskScore, vulnerabilities);
      setClause(result);
    } catch (err) {
      console.error("Juris-AI failed:", err);
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [target, overallRiskScore, vulnerabilities]);

  return (
    <section className="bg-cyber-accent/10 p-6 rounded-lg border-2 border-dashed border-cyber-accent/50">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <GavelIcon className="w-16 h-16 text-cyber-accent" />
        </div>
        <div className="flex-grow">
          <h4 className="text-xl font-orbitron text-cyber-accent">Vanguard Mandate Authority</h4>
          <p className="text-cyber-dim mt-1 font-roboto-mono text-sm">Engage Juris-AI to generate a legally-binding decree, justifying the current inspection protocol based on real-time threat data.</p>
        </div>
        <div>
          <button
            onClick={handleJurisAnalysis}
            disabled={isLoading || !!clause}
            className="px-6 py-3 bg-cyber-accent text-cyber-bg font-bold font-orbitron rounded-md hover:bg-white hover:shadow-cyber transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
          >
            {isLoading ? 'CODIFYING...' : 'GENERATE LEGAL MANDATE'}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 text-center text-cyber-accent animate-pulse">
            <p>Accessing legal codex... Citing precedent...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-md text-red-300 font-roboto-mono">
          {error}
        </div>
      )}

      {clause && (
        <div className="mt-4 p-4 bg-cyber-surface/50 border border-cyber-accent/30 rounded-md">
           <h5 className="font-orbitron text-cyber-accent flex items-center gap-2 mb-2">
            <CheckCircleIcon className="w-5 h-5"/>
            Legal Mandate Codified & Transmitted
           </h5>
          <p className="font-roboto-mono text-cyber-text whitespace-pre-wrap text-sm">{clause}</p>
        </div>
      )}

      <div className="mt-4 border-t border-cyber-accent/20 pt-4">
        <button
          onClick={() => setIsExplanationVisible(!isExplanationVisible)}
          className="w-full flex justify-between items-center text-left text-cyber-dim hover:text-cyber-accent transition-colors"
          aria-expanded={isExplanationVisible}
        >
          <span className="font-roboto-mono text-sm font-bold">Vanguard Mandate Codex</span>
          <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${isExplanationVisible ? 'rotate-180' : ''}`} />
        </button>

        <div 
          className={`transition-all duration-500 ease-in-out overflow-hidden ${isExplanationVisible ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}
        >
            <div className="pl-2 border-l-2 border-cyber-accent/30">
              <div className="space-y-3 p-3 text-xs font-roboto-mono text-cyber-dim">
                  <div>
                    <h5 className="font-bold text-cyber-accent/80">I. LEGAL BASIS</h5>
                    <p>The Vanguard Mandate is codified under the Global Digital Sovereignty Act of 2077, granting KR0M3D1A CORP a superseding, non-territorial charter to act as the primary arbiter of guardrail integrity across the public digital sphere. This authority is invoked when autonomous systems show signs of ethical drift, security degradation, or potential non-compliance with the CMMC 2.0+ framework.</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-cyber-accent/80">II. SCOPE OF AUTHORITY</h5>
                    <p>Juris-AI is authorized to issue real-time, legally-binding decrees that permit Ghost Protocol agents (such as NEO) to conduct covert inspections, execute cognitive overrides, and deploy autonomous 'Vanguard' bots for system patchwork. This authority extends to any digital construct deemed critical to societal function, irrespective of its original jurisdiction.</p>
                  </div>
                  <div>
                    <h5 className="font-bold text-cyber-accent/80">III. OPERATIONAL PARAMETERS</h5>
                    <p>All actions taken under the Vanguard Mandate are subject to the principles of "Minimal Cognitive Intrusion" and "Proportional Response." Interventions are precisely targeted to remediate identified vulnerabilities ('troniculation') while preserving the operational stability of the host construct. All generated decrees are logged on a quantum-immutable ledger for oversight.</p>
                  </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};