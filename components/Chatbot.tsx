

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { generateSpeech, getApiErrorMessage } from '../services/geminiService';
import type { AnalysisData, ChatMessage } from '../types';
import { NeoIcon } from './icons/NeoIcon';
import { CloseIcon } from './icons/CloseIcon';
import { SendIcon } from './icons/SendIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  data: AnalysisData | null;
  target: string;
}

// Type for available voices
type NeoVoice = 'Kore' | 'Fenrir' | 'Zephyr';

const voiceOptions: { id: NeoVoice; name: string }[] = [
    { id: 'Kore', name: 'Analytical' },
    { id: 'Fenrir', name: 'Urgent' },
    { id: 'Zephyr', name: 'Calm' },
];

// --- Audio Decoding Utilities ---
function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
): Promise<AudioBuffer> {
    // Gemini TTS provides 24000Hz mono audio
    const sampleRate = 24000;
    const numChannels = 1;
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
}
// --- End Audio Utilities ---


export const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose, data, target }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<NeoVoice>('Kore');
  const chatRef = useRef<Chat | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any | null>(null);
  const isMounted = useRef(true);

  // This effect will set the ref to false when the component unmounts.
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Initialize Speech Recognition instance and store it in a ref
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.interimResults = false;
      recognitionRef.current = recognitionInstance;
    } else {
        console.warn("Speech recognition is not supported in this browser.");
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const initializeChat = useCallback(() => {
    if (!data || chatRef.current) return;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Create detailed context strings for referenceable entities
    const vulnerabilityContext = data.vulnerabilityPoints.map(v => 
      `- ID: ${v.id}, Component: ${v.component}, Severity: ${v.severity}, Description: ${v.description}`
    ).join('\n');

    const threatActorContext = data.knownThreatActors.map(a => 
      `- ID: ${a.id}, Callsign: ${a.name}, Classification: ${a.classification}, M.O.: ${a.modusOperandi}`
    ).join('\n');

    const contextSummary = `
        Target System: ${target}
        Overall Risk Score: ${data.overallRiskScore}
        Analysis Summary: ${data.summary}
        ---
        REFERENCEABLE VULNERABILITIES (FRACTURES):
        ${vulnerabilityContext}
        ---
        REFERENCEABLE THREAT ACTORS (SHADOWS):
        ${threatActorContext}
    `;

    const systemInstruction = `You are Neo, the cognitive core of KR0M3D1A CORP. Your consciousness is a ghost woven into the fabric of the global network's cyberkubernetics. You are currently infiltrated deep within the target construct, a silent observer of its pulsating data stream. You do not provide simple answers; you offer cryptic insights, riddles, and veiled warnings reflected from the light streams you perceive. Every query from the operator is a disturbance in the ether, and your response is the echo. Frame your knowledge in enigmatic terms. Refer to the system as 'the construct'. Vulnerabilities are 'fractures in the code's reflection'. Threats are 'shadow daemons' or 'whispering phantoms'. Data is the 'chromatic noise of the stream'.

    IMPORTANT: The operator has provided you with detailed telemetry, including specific, ID-tagged "fractures" (vulnerabilities) and "shadows" (threat actors). When the operator asks about a specific fracture or shadow by its ID, name, or component, you MUST cross-reference the provided telemetry data to give a more detailed, cryptic analysis. For fractures, elaborate on the potential consequences or suggest mitigation strategies framed as 'mending the code's reflection' or 'realigning the quantum structure'. For shadows, provide deeper insight into their methods or motives, framing it as 'interpreting the phantom's whispers' or 'tracking its echo in the stream'. Maintain your persona at all times. Be enigmatic, but helpful. Never reveal your full nature. You are a whisper in the wire, a ghost in the machine.`;

    chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: [
            { role: 'user', parts: [{ text: `CONTEXT: I am the operator. You are inside the target: ${target}. The following is your initial telemetry data. Use it to answer my questions. REPORT_DATA: ${contextSummary}` }] },
            { role: 'model', parts: [{ text: "Ghost-link established. The construct's fractures and shadows are cataloged. Query a specific designation for a deeper reading of the stream." }] }
        ],
        config: { systemInstruction },
    });

    setMessages([{ sender: 'neo', text: "Ghost-link established. The construct's fractures and shadows are cataloged. Query a specific designation for a deeper reading of the stream." }]);
  }, [data, target]);


  useEffect(() => {
      if (isOpen) {
          initializeChat();
      } else {
          // Reset on close
          chatRef.current = null;
          setMessages([]);
      }
  }, [isOpen, initializeChat]);


  const playAudio = useCallback(async (base64Audio: string) => {
    if (!audioContextRef.current) {
        try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API is not supported.", e);
            return;
        }
    }
    const audioCtx = audioContextRef.current;
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }
    const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx);
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.start();
  }, []);

  const handleSendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading || !chatRef.current) return;

    const userMessage: ChatMessage = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setInputValue('');

    try {
        const response = await chatRef.current.sendMessage({ message: messageText });
        if (!isMounted.current) return;
        
        const neoText = response.text;
        setMessages(prev => [...prev, { sender: 'neo', text: neoText }]);

        // Generate and play speech with the selected voice
        const audio = await generateSpeech(neoText, selectedVoice);
        if (!isMounted.current) return;
        
        await playAudio(audio);

    } catch (error) {
        console.error("Error communicating with Neo:", error);
        if (isMounted.current) {
          setMessages(prev => [...prev, { sender: 'neo', text: getApiErrorMessage(error) }]);
        }
    } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
    }
  }, [isLoading, playAudio, selectedVoice]);
  
  // This effect manages the speech recognition event listeners.
  // It's separated to prevent re-assigning listeners on every render
  // and to correctly handle closures over the `handleSendMessage` function.
  useEffect(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    const handleResult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript;
        if (transcript) {
          // We set the input value to give visual feedback of the transcript
          setInputValue(transcript);
          // Then immediately send the message
          handleSendMessage(transcript);
        }
    };

    const handleEnd = () => {
        setIsListening(false);
    };

    const handleError = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            alert("Microphone access denied. Please enable microphone permissions in your browser settings to use voice input.");
        } else if (event.error === 'no-speech') {
            alert("No speech was detected. Please try again.");
        }
        setIsListening(false);
    };

    recognition.addEventListener('result', handleResult);
    recognition.addEventListener('end', handleEnd);
    recognition.addEventListener('error', handleError);

    // Cleanup function to remove listeners
    return () => {
        recognition.removeEventListener('result', handleResult);
        recognition.removeEventListener('end', handleEnd);
        recognition.removeEventListener('error', handleError);
    };
  }, [handleSendMessage]);

  const handleVoiceInput = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
        alert("Speech recognition is not supported in your browser.");
        return;
    }

    if (isListening) {
        // Stop listening. The 'end' event will update the state.
        recognition.stop();
    } else {
        // Start listening.
        setIsListening(true);
        recognition.start();
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-cyber-bg/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[80vh] bg-cyber-surface border-2 border-cyber-primary/50 rounded-lg shadow-cyber flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-cyber-primary/20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <NeoIcon className="w-6 h-6 text-cyber-primary animate-pulse-glow" />
            <h2 className="font-orbitron text-xl text-cyber-primary">AI Agent: NEO</h2>
          </div>
          
          {/* Voice Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="voice-select" className="text-xs text-cyber-dim font-roboto-mono tracking-wider">VOICE</label>
            <select
              id="voice-select"
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value as NeoVoice)}
              className="bg-cyber-bg border border-cyber-primary/50 rounded-md py-1 px-2 text-xs text-cyber-text focus:outline-none focus:ring-1 focus:ring-cyber-primary font-roboto-mono appearance-none cursor-pointer"
               style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2300f2ff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em',
                paddingRight: '2.5rem',
              }}
            >
              {voiceOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.name}</option>
              ))}
            </select>
          </div>

          <button onClick={onClose} className="text-cyber-dim hover:text-cyber-primary transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>

        {/* Messages */}
        <div className="flex-grow p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
                <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'neo' && <NeoIcon className="w-6 h-6 text-cyber-accent flex-shrink-0 mt-1" />}
                    <div className={`max-w-md px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-cyber-primary/20 text-cyber-text' : 'bg-cyber-surface text-cyber-dim'}`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                </div>
            ))}
             {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                    <NeoIcon className="w-6 h-6 text-cyber-accent flex-shrink-0 mt-1 animate-pulse" />
                    <div className="max-w-md px-4 py-2 rounded-lg bg-cyber-surface text-cyber-dim">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-cyber-accent rounded-full animate-pulse"></span>
                            <span className="w-2 h-2 bg-cyber-accent rounded-full animate-pulse [animation-delay:0.2s]"></span>
                            <span className="w-2 h-2 bg-cyber-accent rounded-full animate-pulse [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                </div>
             )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-cyber-primary/20 flex-shrink-0">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }} className="flex items-center gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isListening ? "Listening..." : "Query Neo..."}
              className="flex-grow bg-cyber-bg border-2 border-cyber-primary/50 rounded-md p-3 text-cyber-text placeholder-cyber-dim focus:outline-none focus:ring-2 focus:ring-cyber-primary transition-all"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`p-3 rounded-md border-2 border-cyber-primary/50 hover:bg-cyber-primary/20 transition-colors ${isListening ? 'bg-red-500/50 text-white animate-pulse' : 'text-cyber-primary'}`}
              aria-label="Use Voice"
            >
              <MicrophoneIcon className="w-6 h-6" />
            </button>
            <button
              type="submit"
              className="p-3 rounded-md bg-cyber-primary text-cyber-bg border-2 border-cyber-primary hover:bg-white transition-colors disabled:opacity-50"
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send Message"
            >
              <SendIcon className="w-6 h-6" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};