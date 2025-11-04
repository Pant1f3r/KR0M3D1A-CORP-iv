// App.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { InspectorInput } from './components/InspectorInput';
import { Dashboard } from './components/Dashboard';
import { generateInspectionData, getApiErrorMessage } from './services/geminiService';
import type { AnalysisData, AnalysisError, OscillatorSignal, OscillatorEvent, PatchworkEvent } from './types';
import { Chatbot } from './components/Chatbot';
import { ChatbotToggleButton } from './components/ChatbotToggleButton';
import { MetatronSpinner } from './components/icons/MetatronSpinner';
import { ThemeProvider } from './contexts/ThemeContext';
import { AudioAlertProvider } from './contexts/AudioAlertContext';
import { AlertIcon } from './components/icons/AlertIcon';
import { CreatorBio } from './components/CreatorBio';

const AppContent: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<AnalysisError | null>(null);
  const [inspectedTarget, setInspectedTarget] = useState<string>('');
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isRealtime, setIsRealtime] = useState<boolean>(true);
  const [updateInterval, setUpdateInterval] = useState<number>(2500); // Default 2.5 seconds
  const [oscillatorEventLog, setOscillatorEventLog] = useState<OscillatorEvent[]>([]);

  const handleInspect = useCallback(async (target: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysisData(null);
    setOscillatorEventLog([]); // Clear log on new inspection
    setIsChatOpen(false); // Close chat on new inspection
    try {
      const data = await generateInspectionData(target);
      
      // Data Expiration Policy: Filter logs older than 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const isRecent = (timestampStr: string): boolean => {
        // Heuristic to avoid parsing relative timestamps like "Just now" as invalid dates
        if (!/^\d{4}-\d{2}-\d{2}/.test(timestampStr)) {
          return true;
        }
        const eventDate = new Date(timestampStr);
        // Check for invalid date
        if (isNaN(eventDate.getTime())) {
          return true; // Keep if date is unparsable
        }
        return eventDate >= thirtyDaysAgo;
      };

      const filteredEvents = data.systemEvents.filter(event => isRecent(event.timestamp));
      const filteredPatchLog = data.patchworkProtocol.patchLog.filter(log => isRecent(log.timestamp));

      const processedData: AnalysisData = {
        ...data,
        systemEvents: filteredEvents,
        patchworkProtocol: {
            ...data.patchworkProtocol,
            patchLog: filteredPatchLog,
        },
      };

      setAnalysisData(processedData);
      setInspectedTarget(target);
      setIsRealtime(true); // Always start with real-time on for new inspection
    } catch (err)      {
      console.error(err);
      setError({ message: getApiErrorMessage(err) });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleMemoryRefresh = useCallback(() => {
    setAnalysisData(prev => {
        if (!prev) return null;
        // Prevent refresh if not stable
        if (prev.memoryIntegrity.status !== 'STABLE' && prev.memoryIntegrity.status !== 'DEGRADING') return prev;
        return {
            ...prev,
            memoryIntegrity: { ...prev.memoryIntegrity, status: 'REFRESHING' }
        };
    });
    setTimeout(() => {
        setAnalysisData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                memoryIntegrity: { ...prev.memoryIntegrity, status: 'STABLE', lastRefresh: 'Just now' }
            };
        });
    }, 3000); // 3-second refresh cycle
  }, []);

  // Effect for simulating real-time data updates
  useEffect(() => {
    if (!analysisData || isLoading || !isRealtime) {
      return;
    }

    const intervalId = setInterval(() => {
      setAnalysisData(prevData => {
        if (!prevData) return null;

        const { keyStats, humanDossier, aiDossier, unknownEntityDossier, oscillatorSignal, memoryIntegrity, patchworkProtocol } = prevData;
        
        // Simulate key stats fluctuations
        const newLatency = Math.max(20, keyStats.latencyMs + Math.floor(Math.random() * 10) - 5);
        const newPacketLoss = Math.max(0, Math.min(5, keyStats.packetLossPercent + (Math.random() * 0.2 - 0.1)));
        const newThreats = keyStats.threatsDetected + (Math.random() > 0.95 ? 1 : 0);

        // Simulate Dossier updates
        let newHumanDossier = [...humanDossier];
        let newAIDossier = [...aiDossier];
        let newUnknownEntityDossier = [...unknownEntityDossier];

        if (isRealtime && Math.random() < 0.3) { // 30% chance to update something in dossiers
            const dossierType = Math.random();
            if (dossierType < 0.5 && newHumanDossier.length > 0) {
                const profileIndex = Math.floor(Math.random() * newHumanDossier.length);
                const oldProfile = newHumanDossier[profileIndex];
                if ((oldProfile.status === 'ACTIVE_THREAT' || oldProfile.status === 'WANTED') && Math.random() < 0.1) {
                    newHumanDossier[profileIndex] = { ...oldProfile, status: 'APPREHENDED', lastKnownLocation: 'KROMEDIA CORP. Black Site' };
                }
            } else if (dossierType < 0.8 && newAIDossier.length > 0) {
                const profileIndex = Math.floor(Math.random() * newAIDossier.length);
                const oldProfile = newAIDossier[profileIndex];
                if (oldProfile.status === 'ACTIVE' && Math.random() < 0.15) {
                    newAIDossier[profileIndex] = { ...oldProfile, status: 'QUARANTINED' };
                }
            } else if (newUnknownEntityDossier.length > 0) {
                const profileIndex = Math.floor(Math.random() * newUnknownEntityDossier.length);
                const oldProfile = newUnknownEntityDossier[profileIndex];
                if (oldProfile.containmentStatus === 'UNCONTAINED' && Math.random() < 0.05) {
                    newUnknownEntityDossier[profileIndex] = { ...oldProfile, containmentStatus: 'CONTAINED' };
                }
            }
        }

        // Simulate Oscillator Signal
        let newOscillatorSignal: OscillatorSignal = { ...oscillatorSignal };
        if (isRealtime && Math.random() < 0.15 && !oscillatorSignal.isAttackSignal) { // 15% chance to trigger an attack if not already attacking
            const attackSpaces: OscillatorSignal['sourceSpace'][] = ['Outer Space', 'Inner Space', 'Terror Space', 'Hydrospace', 'Aerospace', 'Cyber Space', 'Hyperspace'];
            const source = attackSpaces[Math.floor(Math.random() * attackSpaces.length)];
            const intensity = Math.floor(Math.random() * 30) + 70; // 70-100
            const fibonacciStep = oscillatorSignal.fibonacciSequenceStep + 1;
            
            newOscillatorSignal = {
                sourceSpace: source,
                intensity,
                isAttackSignal: true,
                fibonacciSequenceStep: fibonacciStep,
            };

            // Add to event log
            const hostileActors = [
                ...prevData.humanDossier.filter(p => p.status !== 'ASSET').map(p => p.callsign),
                ...prevData.aiDossier.map(p => p.callsign),
                ...prevData.unknownEntityDossier.map(p => p.designation),
            ];
            const randomActor = hostileActors.length > 0 ? hostileActors[Math.floor(Math.random() * hostileActors.length)] : 'Unknown Entity';
            
            const traceVectors = ['Tor Network', 'Ghost Trace', 'Dark Web Node', 'I2P Relay', 'Compromised IoT Swarm', 'Quantum Tunnel Anomaly'];
            const randomVector = traceVectors[Math.floor(Math.random() * traceVectors.length)];

            const newEvent: OscillatorEvent = {
                id: `osc_evt_${Date.now()}_${Math.random()}`,
                timestamp: new Date().toLocaleTimeString(),
                sourceSpace: source,
                intensity,
                fibonacciSequenceStep: fibonacciStep,
                threatActor: randomActor,
                traceVector: randomVector,
            };
            setOscillatorEventLog(prevLog => [newEvent, ...prevLog].slice(0, 20)); // Keep last 20 events

        } else { // Return to normal
            newOscillatorSignal = {
                ...oscillatorSignal,
                sourceSpace: 'Background Noise',
                intensity: Math.max(1, oscillatorSignal.intensity + Math.floor(Math.random() * 6) - 3), // 1-10 range fluctuation
                isAttackSignal: false,
            };
        }

        // Simulate Memory Integrity
        let newMemoryIntegrity = { ...memoryIntegrity };
        if (newOscillatorSignal.isAttackSignal && newMemoryIntegrity.status === 'STABLE') {
            // High intensity attacks have a chance to affect memory
            if (newOscillatorSignal.intensity > 85 && Math.random() < 0.2) {
                newMemoryIntegrity.status = 'UNDER_ASSAULT';
            } else if (Math.random() < 0.1) {
                newMemoryIntegrity.status = 'DEGRADING';
            }
        } else if (!newOscillatorSignal.isAttackSignal && (newMemoryIntegrity.status === 'DEGRADING' || newMemoryIntegrity.status === 'UNDER_ASSAULT')) {
             if (Math.random() < 0.2) { // Chance to self-stabilize
                newMemoryIntegrity.status = 'STABLE';
             }
        }

        // Simulate Autonomous Patchwork Protocol
        let newPatchworkProtocol = { ...patchworkProtocol };
        if (isRealtime) {
            newPatchworkProtocol.status = 'AUTONOMOUS';
            // 20% chance per tick to log a new patch
            if (Math.random() < 0.20 && prevData.vulnerabilityPoints.length > 0) {
                const targetVuln = prevData.vulnerabilityPoints[Math.floor(Math.random() * prevData.vulnerabilityPoints.length)];
                const newPatch: PatchworkEvent = {
                    id: `patch_${Date.now()}_${Math.random()}`,
                    timestamp: new Date().toISOString(),
                    description: `Reinforced guardrail at ${targetVuln.component} [Ref: ${targetVuln.id}]`,
                    status: 'APPLIED',
                    targetVulnerabilityId: targetVuln.id,
                };
                newPatchworkProtocol = {
                    ...newPatchworkProtocol,
                    activePatches: newPatchworkProtocol.activePatches + 1,
                    lastPatch: 'Just now',
                    patchLog: [newPatch, ...newPatchworkProtocol.patchLog].slice(0, 10),
                };
            }
        } else {
             // If not realtime, revert to STABLE if it was AUTONOMOUS
            if (newPatchworkProtocol.status === 'AUTONOMOUS') {
                newPatchworkProtocol.status = 'STABLE';
            }
        }

        return {
          ...prevData,
          keyStats: {
            ...keyStats,
            latencyMs: newLatency,
            packetLossPercent: parseFloat(newPacketLoss.toFixed(2)),
            threatsDetected: newThreats,
          },
          humanDossier: newHumanDossier,
          aiDossier: newAIDossier,
          unknownEntityDossier: newUnknownEntityDossier,
          oscillatorSignal: newOscillatorSignal,
          memoryIntegrity: newMemoryIntegrity,
          patchworkProtocol: newPatchworkProtocol,
        };
      });
    }, updateInterval); // Update every X seconds based on user setting

    return () => clearInterval(intervalId); // Cleanup on unmount or when dependencies change
  }, [analysisData, isLoading, isRealtime, updateInterval]);


  return (
    <div className="min-h-screen font-roboto-mono bg-cyber-bg text-cyber-text bg-grid-pattern transition-colors duration-500">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <InspectorInput onInspect={handleInspect} isLoading={isLoading} />
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center p-8 mt-8 bg-cyber-surface/50 border border-cyber-primary/20 rounded-lg">
             <MetatronSpinner className="w-24 h-24 text-cyber-primary mb-4" />
            <p className="text-cyber-primary text-lg font-orbitron animate-pulse">Executing Ether Protocol...</p>
            <p className="text-cyber-dim mt-2">Obfuscating signal... Bouncing trace...</p>
          </div>
        )}

        {error && (
            <div role="alert" className="mt-6 flex items-start gap-4 p-4 bg-red-900/50 border-l-4 border-red-500 text-red-300 rounded-r-lg">
                <AlertIcon className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
                <div>
                    <h3 className="font-orbitron font-bold text-red-400">CRITICAL SYSTEM ALERT</h3>
                    <p className="text-sm font-roboto-mono mt-1">{error.message}</p>
                </div>
            </div>
        )}

        {analysisData && !isLoading && (
          <div className="mt-8">
            <Dashboard 
              data={analysisData} 
              target={inspectedTarget}
              isRealtime={isRealtime}
              onToggleRealtime={() => setIsRealtime(prev => !prev)}
              updateInterval={updateInterval}
              onIntervalChange={setUpdateInterval}
              oscillatorEventLog={oscillatorEventLog}
              onMemoryRefresh={handleMemoryRefresh}
            />
          </div>
        )}

        {!analysisData && !isLoading && !error && (
          <CreatorBio />
        )}

      </main>
      <footer className="text-center p-4 text-cyber-dim text-sm">
        <p>KR0M3D1A CORP v2.5 :: NEO Cognitive AI Core</p>
      </footer>
      
      {analysisData && !isLoading && (
        <>
          <ChatbotToggleButton onClick={() => setIsChatOpen(true)} />
          <Chatbot 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)}
            data={analysisData}
            target={inspectedTarget}
          />
        </>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AudioAlertProvider>
      <AppContent />
    </AudioAlertProvider>
  </ThemeProvider>
);

export default App;