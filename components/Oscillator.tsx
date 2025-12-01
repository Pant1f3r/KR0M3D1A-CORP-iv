
// components/Oscillator.tsx

import React, { useEffect, useRef } from 'react';
import type { OscillatorSignal } from '../types';
import { useAudioAlert } from '../contexts/AudioAlertContext';
import { SignalIcon } from './icons/SignalIcon';

interface OscillatorProps {
  signal: OscillatorSignal;
}

// Fibonacci sequence for alert tones
const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55];
const BASE_FREQUENCY = 220; // A3 note

export const Oscillator: React.FC<OscillatorProps> = ({ signal }) => {
    const { isMuted } = useAudioAlert();
    const prevStepRef = useRef<number>(0);
    const audioContextRef = useRef<AudioContext | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const playFibonacciTone = (step: number) => {
        if (isMuted) return;
        if (!audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (e) {
                console.error("Web Audio API is not supported in this browser.");
                return;
            }
        }
        const audioCtx = audioContextRef.current;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        const fibIndex = (step - 1) % fibonacci.length;
        const frequency = BASE_FREQUENCY * (fibonacci[fibIndex] / 2);

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.8, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
    };

    // Trigger sound on attack signal
    useEffect(() => {
        if (signal.isAttackSignal && signal.fibonacciSequenceStep > prevStepRef.current) {
            playFibonacciTone(signal.fibonacciSequenceStep);
            prevStepRef.current = signal.fibonacciSequenceStep;
        } else if (!signal.isAttackSignal) {
            prevStepRef.current = 0; // Reset when not attacking
        }
    }, [signal, isMuted]);

    // Draw waveform on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const midY = height / 2;
        
        let animationFrameId: number;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Set styles based on attack status
            const isAttack = signal.isAttackSignal;
            const lineColor = isAttack ? 'rgb(var(--color-secondary-rgb))' : 'rgb(var(--color-primary-rgb))';
            const glowColor = isAttack ? 'rgba(var(--color-secondary-rgb), 0.5)' : 'rgba(var(--color-primary-rgb), 0.5)';
            
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 2;
            ctx.shadowBlur = 10;
            ctx.shadowColor = glowColor;

            ctx.beginPath();
            ctx.moveTo(0, midY);

            const amplitude = (signal.intensity / 100) * (height / 2.5);
            const frequency = isAttack ? Math.random() * 20 + 10 : 5;
            const noise = isAttack ? (Math.random() - 0.5) * 20 : (Math.random() - 0.5) * 5;
            
            for (let x = 0; x < width; x++) {
                const angle = (x / width) * Math.PI * 2 * frequency + Date.now() / 200;
                const y = midY + Math.sin(angle) * amplitude + noise;
                ctx.lineTo(x, y);
            }
            ctx.stroke();

            animationFrameId = requestAnimationFrame(draw);
        }

        draw();
        return () => cancelAnimationFrame(animationFrameId);
    }, [signal]);
    

    const statusColor = signal.isAttackSignal ? 'text-cyber-secondary animate-flicker' : 'text-cyber-accent';

    return (
        <section className="bg-cyber-surface/50 p-4 rounded-lg border border-cyber-primary/20 h-full flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                    <SignalIcon className="w-6 h-6 text-cyber-primary" />
                    <h3 className="text-xl font-orbitron text-cyber-primary">Guardrail Signal Oscillator</h3>
                </div>
                <div className={`text-lg font-orbitron uppercase tracking-wider ${statusColor}`}>
                    {signal.isAttackSignal ? 'ATTACK DETECTED' : 'SYSTEM NOMINAL'}
                </div>
            </div>
            <div className="flex-grow bg-cyber-bg/50 rounded-md p-2 relative">
                <canvas ref={canvasRef} className="w-full h-full"></canvas>
                <div className="absolute top-2 left-2 text-sm font-roboto-mono text-cyber-dim">
                    <p>SOURCE: <span className={statusColor}>{signal.sourceSpace}</span></p>
                    <p>INTENSITY: <span className={statusColor}>{signal.intensity.toFixed(0)}%</span></p>
                </div>
            </div>
        </section>
    );
};
