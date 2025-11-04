import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center h-8 w-14 rounded-full bg-cyber-surface border-2 border-cyber-primary/50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-cyber-primary"
      aria-label="Toggle theme"
    >
      <span
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          theme === 'cyber' ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <SunIcon className="w-5 h-5 text-yellow-400" />
      </span>
      <span
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
          theme === 'cyber' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <MoonIcon className="w-5 h-5 text-cyber-secondary" />
      </span>
      <span
        className={`inline-block w-6 h-6 transform bg-cyber-primary rounded-full transition-transform duration-300 ${
          theme === 'cyber' ? 'translate-x-1' : 'translate-x-7'
        }`}
      />
    </button>
  );
};
