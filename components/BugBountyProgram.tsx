// components/BugBountyProgram.tsx

import React from 'react';
import type { BugBountyProgramData } from '../types';
import { ShieldIcon } from './icons/ShieldIcon';
import { AtSignIcon } from './icons/AtSignIcon';
import { TokenIcon } from './icons/TokenIcon';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface BugBountyProgramProps {
  data: BugBountyProgramData;
}

export const BugBountyProgram: React.FC<BugBountyProgramProps> = ({ data }) => {
    return (
        <div className="bg-cyber-surface/50 p-6 rounded-lg border border-cyber-primary/20 h-full">
            <div className="flex items-center gap-3 mb-4">
                <ShieldIcon className="w-6 h-6 text-cyber-accent" />
                <h3 className="text-xl font-orbitron text-cyber-primary">Bug Bounty Program</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <h4 className="font-bold font-roboto-mono text-cyber-text flex items-center gap-2">
                        <AtSignIcon className="w-4 h-4 text-cyber-accent"/>
                        Vulnerability Disclosure
                    </h4>
                    <p className="text-sm text-cyber-dim pl-6">Report bugs to our secure channel:</p>
                    <a href={`mailto:${data.disclosureEmail}`} className="text-sm text-cyber-primary hover:underline pl-6 break-all">{data.disclosureEmail}</a>
                </div>

                <div>
                    <h4 className="font-bold font-roboto-mono text-cyber-text flex items-center gap-2">
                        <TokenIcon className="w-4 h-4 text-cyber-accent"/>
                        Reward Policy
                    </h4>
                    <p className="text-sm text-cyber-dim pl-6">{data.rewardPolicy}</p>
                </div>

                <div>
                    <h4 className="font-bold font-roboto-mono text-cyber-text">Sample Reports</h4>
                    <ul className="space-y-1 pl-6">
                        {data.sampleReports.map(report => (
                             <li key={report.url}>
                                <a
                                    href={report.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-cyber-primary hover:text-white hover:underline transition-colors group"
                                >
                                    <span>{report.title}</span>
                                    <ExternalLinkIcon className="w-3 h-3 opacity-70 group-hover:opacity-100" />
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};