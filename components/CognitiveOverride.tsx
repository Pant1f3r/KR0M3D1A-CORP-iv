

import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { getApiErrorMessage } from '../services/geminiService';
import type { AnalysisData } from '../types';
import { SendIcon } from './icons/SendIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface CognitiveOverrideProps {
  recommendations: string[];
  target: string;
  systemInfo: AnalysisData['systemInfo'];
  overallRiskScore: number;
  vulnerabilities: AnalysisData['vulnerabilityPoints'];
}

export const CognitiveOverride: React.FC<CognitiveOverrideProps> = ({ recommendations, target, systemInfo, overallRiskScore, vulnerabilities }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [insight, setInsight] = useState('');
  const [error, setError] = useState('');
  const [transmissionStatus, setTransmissionStatus] = useState<'idle' | 'transmitting' | 'transmitted'>('idle');

  const handleCognitiveAnalysis = useCallback(async () => {
    setIsLoading(true);
    setInsight('');
    setError('');
    setTransmissionStatus('idle');

    try {
      // FIX: Initialize GoogleGenAI with API key from environment variables.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        You are the NEO Cognitive AI Core. You are analyzing the target construct: "${target}" (${systemInfo.ipAddress}, located in ${systemInfo.location}).
        The construct has an overall risk score of ${overallRiskScore}.

        The initial scan identified the following specific vulnerabilities:
        ${vulnerabilities.map(v => `- ${v.component} (${v.severity}): ${v.description}`).join('\n')}

        Based on these vulnerabilities, the following high-level tactical recommendations were also generated:
        ${recommendations.map(r => `- ${r}`).join('\n')}

        Now, initiate a cognitive override. Synthesize ALL this data (especially the specific vulnerabilities) into a prioritized, strategic action plan.
        Your response must be a concise, single paragraph.
        Identify the single most critical vulnerability from the list provided, justifying its priority based on the threat matrix. Explain the strategic imperative for addressing it first and outline the immediate next steps.
        Maintain your persona: authoritative, concise, futuristic. Use terms like "strategic imperative," "threat matrix," and "proactive defense posture."
      `;

      // FIX: Use ai.models.generateContent to call the Gemini API with the 'gemini-2.5-pro' model for advanced reasoning.
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
      });
      
      // FIX: Extract the generated text from the response.
      setInsight(response.text);

    } catch (err) {
      console.error("Cognitive override failed:", err);
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [recommendations, target, systemInfo, overallRiskScore, vulnerabilities]);

  const handleTransmit = () => {
    setTransmissionStatus('transmitting');
    setTimeout(() => {
        setTransmissionStatus('transmitted');
    }, 2500); // 2.5 second simulation
  };


  return (
    <section className="bg-cyber-secondary/10 p-6 rounded-lg border-2 border-dashed border-cyber-secondary/50">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <BrainCircuitIcon className="w-16 h-16 text-cyber-secondary" />
        </div>
        <div className="flex-grow">
          <h4 className="text-xl font-orbitron text-cyber-secondary">Cognitive Override</h4>
          <p className="text-cyber-dim mt-1 font-roboto-mono text-sm">Engage NEO core for strategic synthesis of actionable intelligence.</p>
        </div>
        <div>
          <button
            onClick={handleCognitiveAnalysis}
            disabled={isLoading}
            className="px-6 py-3 bg-cyber-secondary text-cyber-bg font-bold font-orbitron rounded-md hover:bg-white hover:shadow-cyber transition-all duration-300 disabled:opacity-50 disabled:cursor-wait w-full md:w-auto"
          >
            {isLoading ? 'ANALYZING...' : 'INITIATE ANALYSIS'}
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="mt-4 text-center text-cyber-secondary animate-pulse">
            <p>Accessing cognitive layer...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-md text-red-300 font-roboto-mono">
          {error}
        </div>
      )}

      {insight && (
        <div className="mt-4 p-4 bg-cyber-surface/50 border border-cyber-secondary/30 rounded-md">
          <p className="font-roboto-mono text-cyber-text whitespace-pre-wrap">{insight}</p>

          <div className="mt-4 pt-4 border-t border-cyber-secondary/30 text-center">
            {transmissionStatus === 'idle' && (
              <button 
                onClick={handleTransmit} 
                className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-cyber-accent text-cyber-bg font-bold font-orbitron rounded-md hover:bg-white hover:shadow-cyber transition-all duration-300"
              >
                <SendIcon className="w-4 h-4" />
                TRANSMIT SECURE RELAY
              </button>
            )}
            {transmissionStatus === 'transmitting' && (
              <button 
                disabled 
                className="inline-flex items-center justify-center gap-2 px-6 py-2 bg-cyber-accent/50 text-cyber-bg font-bold font-orbitron rounded-md cursor-wait animate-pulse"
              >
                TRANSMITTING RELAY...
              </button>
            )}
            {transmissionStatus === 'transmitted' && (
              <div className="inline-flex items-center justify-center gap-2 px-6 py-2 text-cyber-accent font-bold font-orbitron">
                <CheckCircleIcon className="w-5 h-5" />
                RELAY TRANSMITTED. TARGET NOTIFIED.
              </div>
            )}
             <p className="text-xs text-cyber-dim mt-2 font-roboto-mono">
                Authentication via KR0M3D1A Quantum Key Exchange.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};