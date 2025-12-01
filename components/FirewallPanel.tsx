
// components/FirewallPanel.tsx

import React, { useState } from 'react';
import type { FirewallData, FirewallRule } from '../types';
import { FirewallIcon } from './icons/FirewallIcon';
import { AlertIcon } from './icons/AlertIcon';
import { PlusIcon } from './icons/PlusIcon';

interface FirewallPanelProps {
  data: FirewallData;
}

export const FirewallPanel: React.FC<FirewallPanelProps> = ({ data }) => {
  // Guard against missing data to prevent crashes
  const safeData = data || {
    rules: [],
    status: 'OFFLINE',
    activeConnections: 0,
    blockedRequests: 0,
    uptime: 'N/A'
  };

  const [rules, setRules] = useState<FirewallRule[]>(safeData.rules || []);
  const [status, setStatus] = useState(safeData.status || 'OFFLINE');
  const [isAdding, setIsAdding] = useState(false);
  const [newRule, setNewRule] = useState<Partial<FirewallRule>>({
    priority: 50,
    action: 'BLOCK',
    protocol: 'TCP',
    source: 'ANY',
    destination: 'ANY',
    port: 'ANY',
    description: '',
    status: 'ACTIVE'
  });

  if (!data) {
      return (
        <div className="bg-cyber-surface/50 p-6 rounded-lg border border-cyber-primary/20 flex flex-col min-h-[300px] justify-center items-center text-cyber-dim">
            <FirewallIcon className="w-12 h-12 mb-2 opacity-50" />
            <p>Firewall Data Unavailable</p>
        </div>
      );
  }

  const toggleRule = (id: string) => {
    setRules(prevRules => 
      prevRules.map(rule => 
        rule.id === id ? { ...rule, status: rule.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : rule
      )
    );
  };

  const isolateNetwork = () => {
    setStatus('ISOLATED');
    setRules(prevRules => prevRules.map(rule => ({ ...rule, status: 'ACTIVE', action: 'BLOCK' })));
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    const rule: FirewallRule = {
        id: `FW-${Math.floor(Math.random() * 10000)}`,
        priority: newRule.priority || 50,
        action: newRule.action as 'ALLOW' | 'BLOCK',
        protocol: newRule.protocol as 'TCP' | 'UDP' | 'ICMP' | 'ANY',
        source: newRule.source || 'ANY',
        destination: newRule.destination || 'ANY',
        port: newRule.port || 'ANY',
        description: newRule.description || 'Custom Rule',
        status: 'ACTIVE'
    };
    setRules([rule, ...rules]);
    setIsAdding(false);
    setNewRule({
        priority: 50,
        action: 'BLOCK',
        protocol: 'TCP',
        source: 'ANY',
        destination: 'ANY',
        port: 'ANY',
        description: '',
        status: 'ACTIVE'
    });
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'ACTIVE': return 'text-cyber-accent';
      case 'DEGRADED': return 'text-yellow-400';
      case 'OFFLINE': return 'text-cyber-dim';
      case 'ISOLATED': return 'text-red-500 animate-pulse';
      default: return 'text-cyber-dim';
    }
  };

  const getActionColor = (action: 'ALLOW' | 'BLOCK') => action === 'ALLOW' ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-cyber-surface/50 p-6 rounded-lg border border-cyber-primary/20 flex flex-col min-h-[300px]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-3">
            <FirewallIcon className="w-6 h-6 text-cyber-primary" />
            <h3 className="text-xl font-orbitron text-cyber-primary">Firewall Guardrails</h3>
        </div>
        <div className={`font-orbitron font-bold text-sm ${getStatusColor(status)}`}>
            STATUS: {status}
        </div>
      </div>

      <div className="flex justify-between items-center bg-cyber-bg/50 p-3 rounded-md mb-4 font-roboto-mono text-sm flex-shrink-0 overflow-x-auto">
        <div className="text-center px-2">
            <div className="text-cyber-dim text-xs whitespace-nowrap">ACTIVE CONNS</div>
            <div className="text-cyber-text font-bold text-lg">{safeData.activeConnections.toLocaleString()}</div>
        </div>
        <div className="text-center px-2 border-l border-cyber-primary/10">
            <div className="text-cyber-dim text-xs whitespace-nowrap">BLOCKED REQ</div>
            <div className="text-red-400 font-bold text-lg">{safeData.blockedRequests.toLocaleString()}</div>
        </div>
        <div className="text-center px-2 border-l border-cyber-primary/10">
            <div className="text-cyber-dim text-xs whitespace-nowrap">UPTIME</div>
            <div className="text-cyber-accent font-bold whitespace-nowrap">{safeData.uptime}</div>
        </div>
      </div>

      {/* Add Rule Button / Form */}
      <div className="mb-4 flex-shrink-0">
          {!isAdding ? (
              <button 
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 text-xs font-roboto-mono text-cyber-primary hover:text-white transition-colors border border-cyber-primary/30 hover:border-cyber-primary/70 px-3 py-1.5 rounded-md"
              >
                  <PlusIcon className="w-4 h-4" />
                  ADD NEW RULE
              </button>
          ) : (
              <form onSubmit={handleAddRule} className="bg-cyber-bg/30 p-3 rounded-md border border-cyber-primary/30 animate-fade-in">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      <div>
                          <label className="block text-[10px] text-cyber-dim mb-1">ACTION</label>
                          <select 
                            value={newRule.action} 
                            onChange={e => setNewRule({...newRule, action: e.target.value as any})}
                            className="w-full bg-cyber-surface border border-cyber-primary/20 rounded px-2 py-1 text-xs text-cyber-text focus:border-cyber-primary focus:outline-none"
                          >
                              <option value="BLOCK">BLOCK</option>
                              <option value="ALLOW">ALLOW</option>
                          </select>
                      </div>
                       <div>
                          <label className="block text-[10px] text-cyber-dim mb-1">PROTOCOL</label>
                          <select 
                            value={newRule.protocol} 
                            onChange={e => setNewRule({...newRule, protocol: e.target.value as any})}
                            className="w-full bg-cyber-surface border border-cyber-primary/20 rounded px-2 py-1 text-xs text-cyber-text focus:border-cyber-primary focus:outline-none"
                          >
                              <option value="TCP">TCP</option>
                              <option value="UDP">UDP</option>
                              <option value="ICMP">ICMP</option>
                              <option value="ANY">ANY</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-[10px] text-cyber-dim mb-1">PORT</label>
                          <input 
                            type="text" 
                            value={newRule.port}
                            onChange={e => setNewRule({...newRule, port: e.target.value})}
                            className="w-full bg-cyber-surface border border-cyber-primary/20 rounded px-2 py-1 text-xs text-cyber-text focus:border-cyber-primary focus:outline-none"
                            placeholder="e.g. 80, 443"
                          />
                      </div>
                      <div>
                          <label className="block text-[10px] text-cyber-dim mb-1">PRIORITY</label>
                          <input 
                            type="number" 
                            value={newRule.priority}
                            onChange={e => setNewRule({...newRule, priority: parseInt(e.target.value)})}
                            className="w-full bg-cyber-surface border border-cyber-primary/20 rounded px-2 py-1 text-xs text-cyber-text focus:border-cyber-primary focus:outline-none"
                          />
                      </div>
                      <div>
                          <label className="block text-[10px] text-cyber-dim mb-1">SOURCE</label>
                          <input 
                            type="text" 
                            value={newRule.source}
                            onChange={e => setNewRule({...newRule, source: e.target.value})}
                            className="w-full bg-cyber-surface border border-cyber-primary/20 rounded px-2 py-1 text-xs text-cyber-text focus:border-cyber-primary focus:outline-none"
                          />
                      </div>
                      <div>
                          <label className="block text-[10px] text-cyber-dim mb-1">DESTINATION</label>
                          <input 
                            type="text" 
                            value={newRule.destination}
                            onChange={e => setNewRule({...newRule, destination: e.target.value})}
                            className="w-full bg-cyber-surface border border-cyber-primary/20 rounded px-2 py-1 text-xs text-cyber-text focus:border-cyber-primary focus:outline-none"
                          />
                      </div>
                      <div className="col-span-2">
                           <label className="block text-[10px] text-cyber-dim mb-1">DESCRIPTION</label>
                          <input 
                            type="text" 
                            value={newRule.description}
                            onChange={e => setNewRule({...newRule, description: e.target.value})}
                            className="w-full bg-cyber-surface border border-cyber-primary/20 rounded px-2 py-1 text-xs text-cyber-text focus:border-cyber-primary focus:outline-none"
                            placeholder="Rule description..."
                          />
                      </div>
                  </div>
                  <div className="flex justify-end gap-2">
                      <button 
                        type="button" 
                        onClick={() => setIsAdding(false)}
                        className="text-xs text-cyber-dim hover:text-cyber-text px-3 py-1"
                      >
                          CANCEL
                      </button>
                      <button 
                        type="submit"
                        className="bg-cyber-primary/20 text-cyber-primary hover:bg-cyber-primary/40 border border-cyber-primary/50 text-xs px-3 py-1 rounded transition-colors"
                      >
                          SAVE RULE
                      </button>
                  </div>
              </form>
          )}
      </div>

      <div className="flex-grow overflow-y-auto mb-4 border border-cyber-primary/10 rounded-md">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-roboto-mono min-w-[400px]">
                <thead className="bg-cyber-primary/10 text-cyber-dim sticky top-0">
                    <tr>
                        <th className="p-2">ACT</th>
                        <th className="p-2">PROTO</th>
                        <th className="p-2">SOURCE</th>
                        <th className="p-2">DEST</th>
                        <th className="p-2 text-right">STATE</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-cyber-primary/10">
                    {rules.map(rule => (
                        <tr key={rule.id} className="hover:bg-cyber-surface/30 transition-colors group">
                            <td className={`p-2 font-bold ${getActionColor(rule.action)}`}>{rule.action}</td>
                            <td className="p-2 text-cyber-text">{rule.protocol}/{rule.port}</td>
                            <td className="p-2 text-cyber-dim truncate max-w-[80px]" title={rule.source}>{rule.source}</td>
                            <td className="p-2 text-cyber-dim truncate max-w-[80px]" title={rule.destination}>{rule.destination}</td>
                            <td className="p-2 text-right">
                                <button 
                                    onClick={() => toggleRule(rule.id)}
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all ${
                                        rule.status === 'ACTIVE' 
                                            ? 'border-cyber-accent text-cyber-accent hover:bg-cyber-accent/10' 
                                            : 'border-cyber-dim text-cyber-dim hover:bg-cyber-dim/10'
                                    }`}
                                >
                                    {rule.status}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      <div className="mt-auto pt-2 flex-shrink-0">
        <button 
            onClick={isolateNetwork}
            className={`w-full py-2 px-4 rounded font-orbitron font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                status === 'ISOLATED' 
                    ? 'bg-red-500 text-white cursor-not-allowed opacity-80'
                    : 'bg-red-900/50 text-red-400 border border-red-500 hover:bg-red-500 hover:text-white'
            }`}
            disabled={status === 'ISOLATED'}
        >
            {status === 'ISOLATED' ? (
                <>
                    <AlertIcon className="w-4 h-4 animate-pulse" />
                    NETWORK ISOLATED
                </>
            ) : (
                <>
                    <AlertIcon className="w-4 h-4" />
                    PANIC: ISOLATE NETWORK
                </>
            )}
        </button>
      </div>

    </div>
  );
};
