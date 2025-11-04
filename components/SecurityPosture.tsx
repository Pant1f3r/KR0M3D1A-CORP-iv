

import React from 'react';
import { KeyIcon } from './icons/KeyIcon';
import type { AnalysisData } from '../types';
import { NodeClusterIcon } from './icons/NodeClusterIcon';
import { BrainCircuitIcon } from './icons/BrainCircuitIcon';
import { CoreAlignmentIcon } from './icons/CoreAlignmentIcon';
import { StampIcon } from './icons/StampIcon';
import { TargetIcon } from './icons/TargetIcon';

interface SecurityPostureProps {
  data: AnalysisData['securityPosture'];
}

interface PostureItemProps {
    icon: React.ElementType;
    label: string;
    value: string;
}

const PostureItem: React.FC<PostureItemProps> = ({ icon: Icon, label, value }) => (
    <div className="flex items-center gap-4 text-left bg-cyber-bg/20 p-4 rounded-md h-full ring-1 ring-cyber-surface hover:ring-cyber-accent/50 transition-all">
        <Icon className="w-8 h-8 text-cyber-accent flex-shrink-0" />
        <div>
            <h4 className="font-orbitron text-lg text-cyber-text leading-tight">{label}</h4>
            <p className="text-sm font-roboto-mono text-cyber-accent leading-tight whitespace-pre-wrap">{value}</p>
        </div>
    </div>
);

export const SecurityPosture: React.FC<SecurityPostureProps> = ({ data }) => {
    const { 
        cyberkuberneticNodeStatus,
        cyberneticInterfaceLock,
        quantumEditProtocol,
        heuristicCoreAlignment,
        cmmcComplianceLevel,
        ctemStatus
    } = data;

    return (
        <section>
            <h3 className="text-2xl font-orbitron text-cyber-primary mb-4">Security Posture Directives [ACTIVE]</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <PostureItem
                    icon={NodeClusterIcon}
                    label="Cyberkubernetic Node Status"
                    value={cyberkuberneticNodeStatus}
                />
                <PostureItem
                    icon={KeyIcon}
                    label="Cybernetic Interface Lock"
                    value={cyberneticInterfaceLock}
                />
                <PostureItem
                    icon={BrainCircuitIcon}
                    label="Quantum Edit Protocol"
                    value={quantumEditProtocol}
                />
                <PostureItem
                    icon={CoreAlignmentIcon}
                    label="Heuristic Core Alignment"
                    value={heuristicCoreAlignment}
                />
                <PostureItem
                    icon={StampIcon}
                    label="CMMC 2.0 Compliance"
                    value={cmmcComplianceLevel}
                />
                <PostureItem
                    icon={TargetIcon}
                    label="CTEM Status"
                    value={ctemStatus}
                />
            </div>
        </section>
    );
};