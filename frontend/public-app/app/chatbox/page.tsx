'use client';

import React, { Suspense, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Simple markdown-like renderer for structured responses
function MessageRenderer({ text }: { text: string }) {
  const lines = text.split('\n');
  const elements: any[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('**') && line.endsWith('**')) {
      // Header
      const headerText = line.slice(2, -2);
      elements.push(
        <h3 key={key++} className="font-bold text-lg mb-3 mt-4 first:mt-0 text-indigo-700">
          {headerText}
        </h3>
      );
    } else if (line.startsWith('- ')) {
      // Bullet point
      const bulletText = line.slice(2);
      elements.push(
        <li key={key++} className="mb-2 ml-4 flex items-start">
          <span className="text-indigo-500 mr-2 mt-1.5">•</span>
          <span className="flex-1">{parseInlineMarkdown(bulletText)}</span>
        </li>
      );
    } else if (line.match(/^\d+\.\s/)) {
      // Numbered list
      const numText = line.replace(/^\d+\.\s/, '');
      elements.push(
        <li key={key++} className="mb-2 ml-4 flex items-start">
          <span className="text-indigo-500 mr-2 mt-1.5 font-medium">{line.split('.')[0]}.</span>
          <span className="flex-1">{parseInlineMarkdown(numText)}</span>
        </li>
      );
    } else if (line === '') {
      // Empty line for spacing
      elements.push(<div key={key++} className="h-2" />);
    } else {
      // Regular paragraph
      elements.push(
        <p key={key++} className="mb-3 leading-relaxed">
          {parseInlineMarkdown(line)}
        </p>
      );
    }
  }

  return <div className="space-y-1">{elements}</div>;
}

// Parse inline markdown (bold, italic, etc.)
function parseInlineMarkdown(text: string): any[] {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-indigo-800">{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
}

function ChatContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m MediBot, your advanced healthcare assistant. How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };
      }
    }
  }, []);

  const speak = (text: string) => {
    if (synthRef.current && autoSpeak) {
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      const voices = synthRef.current.getVoices();
      const preferredVoice = voices.find(voice => voice.name.includes('Google US English') || voice.name.includes('Samantha'));
      if (preferredVoice) utterance.voice = preferredVoice;

      synthRef.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const sendMessage = async (messagetext: string = input) => {
    if (!messagetext.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messagetext.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await response.json();

      if (response.ok) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        if (autoSpeak) speak(data.response);
      } else {
        const errorText = data.error || 'Sorry, I encountered an error. Please try again.';
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: errorText,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        if (autoSpeak) speak(errorText);
      }
    } catch (error) {
      const errorText = 'Network error. Please check your connection and try again.';
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      if (autoSpeak) speak(errorText);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-800">
      <div className="flex-1 flex flex-col max-w-6xl mx-auto w-full h-[100dvh] shadow-2xl bg-white overflow-hidden relative">
        
        {/* Modern Header with Glassmorphism */}
        <header className="bg-white/90 backdrop-blur-xl border-b border-indigo-50 p-6 flex items-center justify-between sticky top-0 z-20 shadow-sm transition-all duration-300">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:shadow-indigo-300 transition-all duration-300 transform group-hover:scale-105">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-white shadow-sm animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 tracking-tight">MediBot Plus</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex w-2 h-2 bg-emerald-500 rounded-full"></span>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Always Online</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
                onClick={() => {
                  if (autoSpeak) stopSpeaking();
                  setAutoSpeak(!autoSpeak);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  autoSpeak 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
                title={autoSpeak ? "Disable auto-speech" : "Enable auto-speech"}
              >
                {autoSpeak ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    <span>Voice On</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                    <span>Voice Off</span>
                  </>
                )}
             </button>
             
             {isSpeaking && (
                <button 
                  onClick={stopSpeaking}
                  className="p-2 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors border border-rose-100"
                  title="Stop Speaking Now"
                >
                   <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" /></svg>
                </button>
             )}
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-slate-50/50 scroll-smooth custom-scrollbar">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className={`flex w-full ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${message.isUser ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-6 py-4 rounded-3xl shadow-sm border text-[15px] md:text-base leading-relaxed tracking-wide ${
                      message.isUser
                        ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white rounded-tr-sm border-transparent shadow-indigo-200'
                        : 'bg-white text-slate-700 border-slate-100 rounded-tl-sm shadow-slate-100'
                    }`}
                  >
                    {message.isUser ? (
                      <span className="whitespace-pre-wrap">{message.text}</span>
                    ) : (
                      <MessageRenderer text={message.text} />
                    )}
                  </div>
                  <span className={`text-[11px] font-semibold mt-2 px-1 ${message.isUser ? 'text-indigo-300' : 'text-slate-400'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex justify-start"
            >
               <div className="bg-white px-5 py-4 rounded-3xl rounded-tl-sm shadow-sm border border-slate-100 flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
               </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="bg-white p-6 border-t border-slate-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] relative z-10">
          <div className="flex items-end gap-3 max-w-5xl mx-auto">
             <button
                onClick={toggleListening}
                className={`p-4 rounded-2xl transition-all duration-200 flex-shrink-0 border-2 ${
                  isListening 
                    ? 'bg-red-50 border-red-100 text-red-500 shadow-lg shadow-red-100 scale-105' 
                    : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-indigo-100 hover:text-indigo-500 hover:shadow-md'
                }`}
                title={isListening ? "Stop listening" : "Start voice input"}
             >
                <div className={`${isListening ? 'animate-pulse' : ''}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
             </button>

            <div className="flex-1 relative group">
               <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your health question here..."
                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 resize-none min-h-[60px] max-h-[160px] text-slate-700 placeholder-slate-400 font-medium scrollbar-hide outline-none"
                rows={1}
                disabled={isLoading}
              />
            </div>
            
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className={`p-4 rounded-2xl flex-shrink-0 transition-all duration-200 shadow-lg ${
                !input.trim() || isLoading
                  ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none border-2 border-slate-100'
                  : 'bg-indigo-600 text-white shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-105 active:scale-95'
              }`}
            >
              {isLoading ? (
                <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-400 mt-4 font-semibold uppercase tracking-wider">
             AI-generated content • Consult a professional for medical advice
          </p>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-300/20 rounded-full blur-[100px] mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-violet-300/20 rounded-full blur-[120px] mix-blend-multiply"></div>
      </div>
    </main>
  );
}

export default function ChatbotPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading Chatbot...</p>
        </div>
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
