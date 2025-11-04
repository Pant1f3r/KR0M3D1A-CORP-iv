
import React, { useState } from 'react';

interface InspectorInputProps {
  onInspect: (target: string) => void;
  isLoading: boolean;
}

export const InspectorInput: React.FC<InspectorInputProps> = ({ onInspect, isLoading }) => {
  const [target, setTarget] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (target.trim() && !isLoading) {
      onInspect(target.trim());
    }
  };

  return (
    <section className="bg-cyber-surface/50 p-6 rounded-lg border border-cyber-primary/20 shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Designate target for Ether Protocol (e.g., node-7.us-east.prod)"
          className="flex-grow bg-cyber-bg border-2 border-cyber-primary/50 rounded-md p-3 text-cyber-text placeholder-cyber-dim focus:outline-none focus:ring-2 focus:ring-cyber-primary focus:border-cyber-primary transition-all duration-300 font-roboto-mono"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !target.trim()}
          className="px-8 py-3 bg-cyber-primary text-cyber-bg font-bold font-orbitron rounded-md hover:bg-white hover:shadow-cyber transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'TRACING...' : 'INITIATE GHOST TRACE'}
        </button>
      </form>
    </section>
  );
};
