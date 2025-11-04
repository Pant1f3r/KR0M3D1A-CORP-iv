import React from 'react';
import { NeoIcon } from './icons/NeoIcon';

interface ChatbotToggleButtonProps {
  onClick: () => void;
}

export const ChatbotToggleButton: React.FC<ChatbotToggleButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 bg-cyber-primary hover:bg-white text-cyber-bg p-4 rounded-full shadow-cyber hover:shadow-lg transition-all duration-300 z-50 animate-pulse-glow"
      aria-label="Open AI Chat"
    >
      <NeoIcon className="w-8 h-8" />
    </button>
  );
};
