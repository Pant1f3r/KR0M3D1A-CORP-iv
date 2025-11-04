
import React, { useState, useRef, useEffect } from 'react';
import type { AnalysisData } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';

interface ExportControlProps {
  data: AnalysisData;
  target: string;
}

export const ExportControl: React.FC<ExportControlProps> = ({ data, target }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleJsonExport = () => {
    const sanitizedTarget = target.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `kromedia_corp_report_${sanitizedTarget}_${new Date().toISOString().split('T')[0]}.json`;
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = filename;
    link.click();
    setIsOpen(false);
  };

  const handlePdfExport = () => {
    window.print();
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left export-control" ref={dropdownRef}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-cyber-surface hover:bg-cyber-primary/20 border border-cyber-primary/50 rounded-md text-sm font-roboto-mono text-cyber-primary transition-all duration-300"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <DownloadIcon className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-cyber-surface/90 ring-1 ring-cyber-primary ring-opacity-50 focus:outline-none backdrop-blur-sm z-10"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" role="none">
            <button
              onClick={handleJsonExport}
              className="w-full text-left block px-4 py-2 text-sm text-cyber-dim hover:bg-cyber-primary/10 hover:text-cyber-text transition-colors duration-200"
              role="menuitem"
            >
              Download JSON
            </button>
            <button
              onClick={handlePdfExport}
              className="w-full text-left block px-4 py-2 text-sm text-cyber-dim hover:bg-cyber-primary/10 hover:text-cyber-text transition-colors duration-200"
              role="menuitem"
            >
              Save as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};