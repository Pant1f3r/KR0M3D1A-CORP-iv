import React, { useState, useEffect, useRef } from 'react';
import type { KeyStat } from '../types';

export const StatCard: React.FC<KeyStat> = ({ label, value, unit, icon: Icon }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  // FIX: Initialize useRef with `undefined` to fix the "Expected 1 arguments, but got 0" error.
  const prevValueRef = useRef<string | number | undefined>(undefined);

  useEffect(() => {
    // Check if the value has actually changed and is not the initial render
    if (prevValueRef.current !== undefined && prevValueRef.current !== value) {
      setIsUpdating(true);
      const timer = setTimeout(() => setIsUpdating(false), 500); // Animation duration
      return () => clearTimeout(timer);
    }
    // Store the current value for the next comparison
    prevValueRef.current = value;
  }, [value]);
  
  return (
    <div className="bg-cyber-surface/50 border border-cyber-primary/20 rounded-lg p-6 flex items-center gap-4 transition-all duration-300 hover:bg-cyber-primary/10 hover:shadow-cyber-sm">
      <div className="bg-cyber-primary/10 p-3 rounded-full">
         <Icon className="w-8 h-8 text-cyber-primary" />
      </div>
      <div>
        <div className="text-sm text-cyber-dim font-roboto-mono">{label}</div>
        <div className={`text-3xl font-orbitron transition-colors duration-500 ${isUpdating ? 'text-cyber-primary' : 'text-cyber-text'}`}>
          {value}
          {unit && <span className="text-lg text-cyber-dim ml-1">{unit}</span>}
        </div>
      </div>
    </div>
  );
};
