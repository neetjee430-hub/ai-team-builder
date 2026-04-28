import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { generateTeamBlueprint } from '../services/geminiOrchestrator';

interface ChatMessage {
  id: string;
  sender: 'aria' | 'user';
  text: string;
  options?: string[]; // Quick reply chips
  inputType?: 'text' | 'number' | 'multi-select';
}

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Collected Data
  const [businessData, setBusinessData] = useState<any>({ roles: [] });

  // Add initial message
  useEffect(() => {
    if (messages.length === 0) {
      addAriaMessage(
        "Namaste! 🙏 Welcome to HireIQ! I'm Aria, your personal AI hiring assistant. I'm excited to help you build your dream team! This will only take about 4 minutes. Ready to get started?",
        ["Yes, let's build my team! 🚀", "Tell me more first"]
      );
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addAriaMessage = (text: string, options?: string[], inputType?: 'text' | 'number' | 'multi-select') => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'aria', text, options, inputType }]);
      setIsTyping(false);
    }, 1200);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text }]);
    handleNextStep(text);
  };

  const handleNextStep = (answer: string) => {
    const updatedData = { ...businessData };
    
    switch (step) {
      case 0:
        if (answer.includes("Tell me more")) {
          addAriaMessage("HireIQ uses AI to help you build a team blueprint, auto-generate job listings, have our AI interview candidates, and show ranked results. Ready now?", ["Yes! Let's go! 🚀"]);
        } else {
          setStep(1);
          addAriaMessage("First, tell me what your company does — what products or services do you offer?", [], 'text');
        }
        break;
      case 1:
        updatedData.description = answer;
        setStep(2);
        addAriaMessage("Great! And which city and area is your business located in?", [], 'text');
        break;
      case 2:
        updatedData.city = answer;
        setStep(3);
        addAriaMessage("Got it! How many people are currently working with you?", ["Just Me", "2–5", "6–20", "21–50", "200+"]);
        break;
      case 3:
        updatedData.employeeCount = answer;
        setStep(4);
        addAriaMessage("Which roles are you looking to hire for RIGHT NOW? (Type roles separated by comma)", [], 'text');
        break;
      case 4:
        const roles = answer.split(',').map(r => r.trim()).filter(r => r);
        updatedData.roles = roles.map(r => ({ title: r, count: '', salary: '', experience: '', skills: '' }));
        updatedData.currentRoleIdx = 0;
        setStep(5);
        addAriaMessage(`Perfect! Let me understand each role better. Starting with ${roles[0]}. How many ${roles[0]} do you need?`, ["1", "2", "3", "4", "5", "10+"]);
        break;
      case 5:
        updatedData.roles[updatedData.currentRoleIdx].count = answer;
        setStep(6);
        addAriaMessage(`What monthly salary range are you offering for ${updatedData.roles[updatedData.currentRoleIdx].title}?`, ["₹10K–15K", "₹15K–25K", "₹25K–40K", "₹40K–60K", "Negotiable"]);
        break;
      case 6:
        updatedData.roles[updatedData.currentRoleIdx].salary = answer;
        setStep(7);
        addAriaMessage(`What experience level do you need for ${updatedData.roles[updatedData.currentRoleIdx].title}?`, ["Fresher", "1–3 Years", "3–5 Years", "5+ Years", "Any"]);
        break;
      case 7:
        updatedData.roles[updatedData.currentRoleIdx].experience = answer;
        setStep(8);
        addAriaMessage(`Any must-have skills or qualifications for ${updatedData.roles[updatedData.currentRoleIdx].title}?`, [], 'text');
        break;
      case 8:
        updatedData.roles[updatedData.currentRoleIdx].skills = answer;
        if (updatedData.currentRoleIdx < updatedData.roles.length - 1) {
          updatedData.currentRoleIdx++;
          setStep(5);
          addAriaMessage(`Great! Now for ${updatedData.roles[updatedData.currentRoleIdx].title}. How many do you need?`, ["1", "2", "3", "4", "5", "10+"]);
        } else {
          setStep(9);
          addAriaMessage("Almost there! What are your preferred working hours?", ["9am–6pm", "10am–7pm", "Night Shift", "Flexible"]);
        }
        break;
      case 9:
        updatedData.hours = answer;
        setStep(10);
        addAriaMessage("What's your preferred work model for these roles?", ["On-site Only", "Remote", "Hybrid", "Varies"]);
        break;
      case 10:
        updatedData.workModel = answer;
        setStep(11);
        addAriaMessage("How urgently do you need to hire?", ["ASAP", "Within 1 Week", "Within 1 Month", "Flexible"]);
        break;
      case 11:
        updatedData.urgency = answer;
        setStep(12);
        addAriaMessage("Last question! 😊 What makes your business a great place to work? Why should talented people join your team?", [], 'text');
        break;
      case 12:
        updatedData.values = answer;
        setStep(13);
        addAriaMessage(`🎉 Fantastic work! Here's your info:
City: ${updatedData.city}
Roles: ${updatedData.roles.map((r: any) => `${r.count}x ${r.title}`).join(', ')}
Urgency: ${updatedData.urgency}

Does everything look correct?`, ["✅ Yes! Build My Dream Team!", "✏️ Let me change something"]);
        break;
      case 13:
        if (answer.includes("Yes")) {
           completeOnboarding(updatedData);
        } else {
           setStep(0);
           addAriaMessage("Let's start over! What does your business do?");
        }
        break;
    }
    
    setBusinessData(updatedData);
  };

  const completeOnboarding = async (data: any) => {
    addAriaMessage("🚀 Amazing! I'm now generating your complete Team Blueprint with AI-powered job descriptions and market insights!");
    
    // Save to Firestore and LocalStorage
    try {
      if (auth.currentUser) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { onboardingComplete: true });
        await updateDoc(doc(db, 'businessProfiles', auth.currentUser.uid), {
           description: data.description,
           city: data.city,
           employeeCount: data.employeeCount,
           roles: data.roles,
           hours: data.hours,
           workModel: data.workModel,
           urgency: data.urgency,
           companyValues: data.values,
           onboardingComplete: true
        });
      }
      
      const payload = {
         description: data.description,
         calculatedArea: 500, // Dummy
         budgetRangeId: 3, 
         categoryIds: [],
         roles: data.roles
      };
      
      localStorage.setItem('businessData', JSON.stringify(payload));
      
      // We will redirect and generate the blueprint on the dashboard side to avoid waiting here too long
      setTimeout(() => navigate('/dashboard'), 3000);
      
    } catch (e) {
      console.error(e);
      setTimeout(() => navigate('/dashboard'), 1500);
    }
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between z-10 shadow-sm">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl relative">
                👩‍💼
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
             </div>
             <div>
               <h2 className="font-bold text-gray-900 text-lg leading-tight">Aria (AI Assistant)</h2>
               <p className="text-xs text-green-600 font-medium">Online</p>
             </div>
          </div>
          <div className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
            Step {Math.min(step + 1, 14)} of 14
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
                {msg.sender === 'aria' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm mr-3 mt-1 shrink-0">👩‍💼</div>
                )}
                <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm mr-3 shrink-0">👩‍💼</div>
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
          {messages.length > 0 && messages[messages.length - 1].sender === 'aria' && !isTyping ? (
            <div className="space-y-4">
              {messages[messages.length - 1].options && messages[messages.length - 1].options?.length! > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {messages[messages.length - 1].options?.map((opt, i) => (
                    <button 
                      key={i} 
                      onClick={() => addUserMessage(opt)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-bold border border-blue-200 transition-colors"
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
                    className="flex-1 border p-4 rounded-xl bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                  <button type="submit" disabled={!inputText.trim()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 font-bold rounded-xl disabled:opacity-50 transition-colors">
                    Send
                  </button>
                </form>
              )}
            </div>
          ) : (
            <div className="h-14 flex items-center justify-center text-gray-400 text-sm">
              {isTyping ? "Aria is typing..." : "Please wait..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
