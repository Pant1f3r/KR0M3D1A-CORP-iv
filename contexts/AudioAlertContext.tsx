import React, { createContext, useContext, useState, useMemo } from 'react';

interface AudioAlertContextType {
  isMuted: boolean;
  toggleMute: () => void;
}

const AudioAlertContext = createContext<AudioAlertContextType | undefined>(undefined);

export const AudioAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(true); // Start muted by default

  const toggleMute = () => {
    setIsMuted(prevMuted => !prevMuted);
  };

  const value = useMemo(() => ({ isMuted, toggleMute }), [isMuted]);

  return (
    <AudioAlertContext.Provider value={value}>
      {children}
    </AudioAlertContext.Provider>
  );
};

export const useAudioAlert = (): AudioAlertContextType => {
  const context = useContext(AudioAlertContext);
  if (!context) {
    throw new Error('useAudioAlert must be used within an AudioAlertProvider');
  }
  return context;
};
