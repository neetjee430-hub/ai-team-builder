import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { toast } from 'react-toastify';

interface ChatMessage {
  id: string;
  sender: 'zara' | 'user';
  text: string;
  options?: string[];
  inputType?: 'text' | 'multi-select';
}

const JobSeekerOnboarding = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [seekerData, setSeekerData] = useState<any>({});

  useEffect(() => {
    if (messages.length === 0) {
      addZaraMessage(
        "Hi! 👋 I'm Zara, your personal career assistant at HireIQ! I've gone through your profile and I'm genuinely impressed! I just have a few quick questions to understand your goals better and prepare a PERFECT interview experience for you. Ready?",
        ["Yes, let's go! 🚀", "Tell me more about the interview first"]
      );
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addZaraMessage = (text: string, options?: string[], inputType?: 'text' | 'multi-select') => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'zara', text, options, inputType }]);
      setIsTyping(false);
    }, 1200);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text }]);
    handleNextStep(text);
  };

  const handleNextStep = (answer: string) => {
    const updatedData = { ...seekerData };
    
    switch (step) {
      case 0:
        if (answer.includes("Tell me more")) {
          addZaraMessage("MAX is our AI interviewer. It's a friendly 10-15 minute voice chat. No pass or fail, just a way to understand you better so we match you with the best jobs! Ready?", ["Yes, ready! 🎯"]);
        } else {
          setStep(1);
          addZaraMessage("What kind of work are you most passionate about or experienced in? What do you love doing?", ["Sales & Marketing", "Customer Service", "Technical/IT", "Operations", "Creative"], 'text');
        }
        break;
      case 1:
        updatedData.passion = answer;
        setStep(2);
        addZaraMessage("What's your biggest motivation for looking for a job right now?", ["Better Salary 💰", "Career Growth 📈", "New Industry 🔄", "Closer to Home 🏠", "Currently Unemployed 🔍"]);
        break;
      case 2:
        updatedData.motivation = answer;
        setStep(3);
        addZaraMessage("What does your ideal workplace look like?", ["Busy & Fast-Paced", "Calm & Structured", "Creative & Flexible", "Team-Based", "Independent"]);
        break;
      case 3:
        updatedData.environment = answer;
        setStep(4);
        addZaraMessage("What are your top 3 superpowers? Pick the ones that best describe you at work! 💪 (comma separate them)", [], 'text');
        break;
      case 4:
        updatedData.superpowers = answer;
        setStep(5);
        addZaraMessage("Is there anything specific you want MAX to know before your interview? Any concerns, special goals?", [], 'text');
        break;
      case 5:
        updatedData.concerns = answer;
        setStep(6);
        addZaraMessage(`Wonderful! 🌟 I now know you so much better!

Based on what you've shared, MAX has prepared your personalized interview.

⏱️ Duration: ~10–15 minutes
🎤 Speak your answers naturally
📊 You'll get your score + feedback IMMEDIATELY after
✨ Relax — this is NOT pass/fail.

Are you ready to meet MAX? 🎙️`, ["Start My AI Interview with MAX 🎙️", "Maybe Later - To Dashboard"]);
        break;
      case 6:
        if (answer.includes("Start")) {
           completeOnboarding(updatedData, true);
        } else {
           completeOnboarding(updatedData, false);
        }
        break;
    }
    
    setSeekerData(updatedData);
  };

  const completeOnboarding = async (data: any, startInterview: boolean) => {
    try {
      if (auth.currentUser) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { onboardingComplete: true });
        await updateDoc(doc(db, 'jobSeekerProfiles', auth.currentUser.uid), {
           careerInsights: data,
           onboardingComplete: true
        });
      }
      
      if (startInterview) {
         const sessionId = Date.now().toString();
         navigate(`/interview/${sessionId}`);
      } else {
         navigate('/seeker/dashboard');
      }
    } catch (e: any) {
      toast.error(e.message);
      navigate('/seeker/dashboard');
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-indigo-500 to-purple-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl relative">
                👩🏽‍💼
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
             </div>
             <div>
               <h2 className="font-bold text-gray-900 text-lg leading-tight">Zara (Career Coach)</h2>
               <p className="text-xs text-green-600 font-medium">Online</p>
             </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'zara' && (
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm mr-3 mt-1 shrink-0">👩🏽‍💼</div>
                )}
                <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${msg.sender === 'user' ? 'bg-purple-600 text-white rounded-tr-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-sm mr-3 shrink-0">👩🏽‍💼</div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 flex gap-1.5 items-center">
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {messages.length > 0 && messages[messages.length - 1].sender === 'zara' && !isTyping ? (
            <div className="space-y-4">
              {messages[messages.length - 1].options && messages[messages.length - 1].options?.length! > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {messages[messages.length - 1].options?.map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => addUserMessage(opt)}
                      className="bg-purple-50 hover:bg-purple-100 text-purple-700 whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-bold border border-purple-200 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); if(inputText.trim()) { addUserMessage(inputText); setInputText(''); } }} className="flex gap-3">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type your response..." 
                    autoFocus
                    className="flex-1 border p-4 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                  />
                  <button type="submit" disabled={!inputText.trim()} className="bg-purple-600 hover:bg-purple-700 text-white px-6 font-bold rounded-xl disabled:opacity-50 transition-colors">
                    Send
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="h-14 flex items-center justify-center text-gray-400 text-sm">
              {isTyping ? "Zara is typing..." : "Please wait..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerOnboarding;
