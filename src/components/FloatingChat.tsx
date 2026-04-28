import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Maximize2, Minimize2, Send } from 'lucide-react';

export const FloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{sender: 'bot' | 'user', text: string}[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setIsTyping(true);
            setTimeout(() => {
                setMessages([{
                    sender: 'bot',
                    text: "Namaste! 🙏 I'm HireIQ Assistant!\n\nHow can I help you today? Are you a business owner looking to hire, or a job seeker looking for opportunities?"
                }]);
                setIsTyping(false);
            }, 1000);
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!input.trim()) return;
        
        setMessages(prev => [...prev, { sender: 'user', text: input }]);
        const currentInput = input;
        setInput('');
        setIsTyping(true);

        // Simulated AI response
        setTimeout(() => {
            let reply = "I can transfer you to support if you need more help! Pricing is Free for Job Seekers, Starter is ₹999/mo, and Pro is ₹2999/mo.";
            if (currentInput.toLowerCase().includes('hiring') || currentInput.toLowerCase().includes('business')) {
                reply = "Great! You can sign up as a Business Owner. Our AI Aria will help you build your team blueprint in 2 minutes.";
            } else if (currentInput.toLowerCase().includes('job') || currentInput.toLowerCase().includes('seeker')) {
                reply = "Awesome! Sign up as a Job Seeker to get matched with top companies and take an AI interview with MAX.";
            } else if (currentInput.toLowerCase().includes('pricing')) {
                reply = "Job Seekers use HireIQ for free! For businesses, it starts at ₹999/mo for the Starter plan.";
            }
            
            setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col mb-4"
                        style={{ height: '500px', maxHeight: '80vh' }}
                    >
                        <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] p-4 text-white flex justify-between items-center z-10 shadow-sm relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg border border-white/30 shadow-inner">
                                   🤖
                                </div>
                                <div>
                                    <h3 className="font-bold tracking-wide">HireIQ Assistant</h3>
                                    <div className="text-[10px] text-indigo-200 flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 relative z-10">
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-lg transition-colors cursor-pointer text-white">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl shadow-sm text-sm whitespace-pre-wrap ${msg.sender === 'user' ? 'bg-[#4F46E5] text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-1.5 items-center">
                                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                       <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="p-3 bg-white border-t border-gray-100 p-4">
                            <div className="flex gap-2 mb-3 overflow-x-auto pb-1 custom-scrollbar hide-scrollbar">
                                <button onClick={()=>setInput("I'm Hiring 🏢")} className="whitespace-nowrap px-3 py-1.5 bg-indigo-50 text-[#4F46E5] rounded-full text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition-colors">I'm Hiring 🏢</button>
                                <button onClick={()=>setInput("I'm Job Seeking 👤")} className="whitespace-nowrap px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100 hover:bg-amber-100 transition-colors">I'm Job Seeking 👤</button>
                                <button onClick={()=>setInput("Pricing 💰")} className="whitespace-nowrap px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-100 hover:bg-green-100 transition-colors">Pricing 💰</button>
                            </div>
                            <div className="flex gap-2 relative">
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask anything..."
                                    className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#4F46E5] outline-none"
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="w-11 h-11 bg-[#4F46E5] text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-[#6366f1] transition-colors shadow-sm"
                                >
                                    <Send size={18} className="ml-1" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white rounded-full flex items-center justify-center shadow-[0_10px_25px_rgba(79,70,229,0.5)] hover:shadow-[0_10px_35px_rgba(79,70,229,0.7)] transition-all transform hover:scale-110 relative"
            >
                {!isOpen && <div className="absolute inset-0 bg-[#4F46E5] rounded-full animate-ping opacity-20"></div>}
                
                {isOpen ? <X size={28} /> : (
                    <div className="relative">
                        <MessageCircle size={32} />
                        <div className="absolute -top-1 -right-2 w-4 h-4 bg-amber-500 rounded-full border-2 border-[#7C3AED] shadow-sm"></div>
                    </div>
                )}
            </button>
        </div>
    );
};
