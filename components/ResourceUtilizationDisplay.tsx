import React from 'react';
import type { ResourceUtilization } from '../types';

interface ResourceUtilizationDisplayProps {
  data: ResourceUtilization;
}

const UtilizationBar: React.FC<{ label: string; value: number }> = ({ label, value }) => {
    const getBarColor = (val: number) => {
        if (val > 90) return 'bg-red-500';
        if (val > 70) return 'bg-yellow-400';
        return 'bg-cyber-accent';
    };

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-1 text-sm font-roboto-mono">
                <span className="text-cyber-dim">{label}</span>
                <span className={`font-bold ${getBarColor(value).replace('bg-', 'text-')}`}>{value}%</span>
            </div>
            <div className="w-full bg-cyber-surface rounded-full h-2.5">
                <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${getBarColor(value)}`} 
                    style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    );
};

export const ResourceUtilizationDisplay: React.FC<ResourceUtilizationDisplayProps> = ({ data }) => {
  return (
    <div className="p-4">
      <UtilizationBar label="CPU" value={data.cpu} />
      <UtilizationBar label="Memory" value={data.memory} />
      <UtilizationBar label="Network" value={data.network} />
    </div>
  );
};
