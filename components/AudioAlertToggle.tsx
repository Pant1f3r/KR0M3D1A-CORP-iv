import React from 'react';
import { useAudioAlert } from '../contexts/AudioAlertContext';
import { SpeakerOnIcon } from './icons/SpeakerOnIcon';
import { SpeakerOffIcon } from './icons/SpeakerOffIcon';

export const AudioAlertToggle: React.FC = () => {
  const { isMuted, toggleMute } = useAudioAlert();

  return (
    <button
      onClick={toggleMute}
      className="p-2 rounded-full text-cyber-dim hover:text-cyber-primary hover:bg-cyber-surface transition-colors"
      aria-label={isMuted ? 'Unmute system alerts' : 'Mute system alerts'}
    >
      {isMuted ? (
        <SpeakerOffIcon className="w-5 h-5" />
      ) : (
        <SpeakerOnIcon className="w-5 h-5 text-cyber-accent" />
      )}
    </button>
  );
};
