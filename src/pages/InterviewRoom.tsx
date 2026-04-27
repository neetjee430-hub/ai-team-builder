import { useState, useEffect, useRef } from 'react';
import { Camera, Mic, Activity, AlertCircle, PlaySquare, EyeOff, Timer, MessageSquare, Bell, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type FlowStep = {
  type: 'question' | 'counter' | 'flash' | 'timer_question' | 'roleplay' | 'distraction_question' | 'reflection';
  text: string;
  duration?: number;
  timeLimit?: number;
};

const interviewFlow: FlowStep[] = [
  { type: 'question', text: "Please introduce yourself, detailing your exact experience relevant to this specific role." },
  { type: 'question', text: "Describe a time you handled an extremely unsatisfied client. Walk me through your steps." },
  { type: 'counter', text: "Wait—you said you handled it perfectly. But if a client is shouting at the front desk, calm words aren't always enough. Exactly what is your step-by-step de-escalation protocol? You have 30 seconds." },
  { type: 'flash', text: "SCENARIO: Your colleague didn't show up. You have 5 waiting clients ALONE. The manager is unreachable.", duration: 3000 },
  { type: 'question', text: "In the scenario just shown on screen, how do you prioritize and communicate with those 5 clients?" },
  { type: 'timer_question', text: "Pressure Test: You have exactly 30 seconds to explain your biggest professional weakness and how it impacts your work. Start now.", timeLimit: 30 },
  { type: 'roleplay', text: "ROLEPLAY: I am now a furious customer. 'Hey! This treatment burned my scalp! What kind of cheap products are you using here?!' Respond to me in real-time." },
  { type: 'distraction_question', text: "Final operational question: What advanced tools or techniques do you use to maintain high standards day-to-day?" },
  { type: 'reflection', text: "Interview Complete. Please answer 3 quick self-assessment questions." }
];

const InterviewRoom = () => {
  const [status, setStatus] = useState('positioning'); // positioning, recording, processing, complete
  const [stepIndex, setStepIndex] = useState(0);
  const [warning, setWarning] = useState('');
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showDistraction, setShowDistraction] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Reflection states
  const [selfScore, setSelfScore] = useState(5);
  const [hardestQ, setHardestQ] = useState('');
  const [diffAction, setDiffAction] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const step = interviewFlow[stepIndex] || { type: 'complete' };

  useEffect(() => {
    // Setup Speech Recognition
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition && !recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript + ' ';
        }
        setTranscript(prev => prev + currentTranscript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event.error);
        if (event.error === 'not-allowed') setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        if(isListening) {
          try { recognitionRef.current.start(); } catch(e){}
        }
      };
    }
  }, [isListening]);

  useEffect(() => {
    if (isListening && recognitionRef.current) {
      try { recognitionRef.current.start(); } catch(e) {}
    } else if (!isListening && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
  }, [isListening]);

  useEffect(() => {
    // Setup mock webcam feed
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.error("Webcam error:", err));
    }
  }, []);

  // Speak the question when step changes
  useEffect(() => {
    if (status === 'recording' && step.type !== 'reflection') {
      setTranscript(''); // reset transcript for new question
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(step.text);
      utterance.rate = 0.95;
      utterance.pitch = 1;
      
      // Stop listening while AI speaks
      setIsListening(false);
      
      utterance.onend = () => {
         // Start listening after AI speaks
         setIsListening(true);
      };
      
      window.speechSynthesis.speak(utterance);
    } else if (step.type === 'reflection') {
      setIsListening(false);
    }
  }, [stepIndex, status, step.text, step.type]);

  // Strict frame monitoring simulation
  useEffect(() => {
    if (status === 'recording' && step.type !== 'reflection') {
      const interval = setInterval(() => {
        if (Math.random() > 0.85) {
          setWarning('STRICT WARNING: Face/body out of frame. Please sit properly in the center.');
          setTimeout(() => setWarning(''), 5000);
        }
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [status, step.type]);

  // Handle Flow Specifics (Timers, Flashes, Distractions)
  useEffect(() => {
    if (status !== 'recording') return;

    if (step.type === 'flash') {
      const t = setTimeout(() => handleNextStep(), step.duration || 3000);
      return () => clearTimeout(t);
    }

    if (step.type === 'timer_question') {
      setTimeLeft(step.timeLimit || 30);
    } else {
      setTimeLeft(null);
    }

    if (step.type === 'distraction_question') {
      const t = setTimeout(() => setShowDistraction(true), 5000); // Popup 5 secs in
      return () => clearTimeout(t);
    } else {
      setShowDistraction(false);
    }
  }, [stepIndex, status, step.type, step.duration, step.timeLimit]);

  // Countdown logic for timer question
  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timeLeft]);

  const handleStart = () => {
    setStatus('recording');
  };

  const handleNextStep = () => {
    if (stepIndex < interviewFlow.length - 1) {
      setStepIndex(prev => prev + 1);
    } else {
      finishInterview();
    }
  };

  const finishInterview = () => {
    setIsListening(false);
    setStatus('processing');
    setTimeout(() => {
      setStatus('complete');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col md:flex-row">
      {/* Left side: AI Interviewer */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center items-center border-r border-gray-800 bg-gray-950 relative">
        <div className="w-full max-w-md flex flex-col items-center">
          
          {step.type !== 'reflection' && (
            <>
              {/* AI Avatar */}
              <div className="relative mb-8">
                <div className={`absolute inset-0 rounded-full blur-2xl ${
                  step.type === 'roleplay' ? 'bg-red-500/30 animate-pulse' :
                  status === 'recording' ? 'bg-amber-500/30 animate-pulse' : 'bg-blue-500/20'
                }`}></div>
                <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center relative z-10 transition-colors duration-500
                  ${step.type === 'roleplay' ? 'border-red-500 bg-red-500/10 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 
                    step.type === 'counter' ? 'border-orange-500 bg-orange-500/10' :
                    status === 'recording' ? 'border-amber-500 bg-amber-500/10 animate-pulse' : 'border-blue-500 bg-blue-500/10'}`}>
                   {step.type === 'roleplay' ? <User className="w-12 h-12 text-red-500" /> : <Activity className={`w-12 h-12 ${status === 'recording' ? 'text-amber-500' : 'text-blue-500'}`} />}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 mb-6 text-center text-gray-300">
                 <div className="flex items-center gap-2 font-medium">
                   <Mic className={status === 'recording' ? "animate-pulse text-amber-500" : "text-gray-500"} />
                   <span>
                     {step.type === 'roleplay' ? 'AI is roleplaying scenario...' : 
                      step.type === 'counter' ? 'AI generated follow-up...' :
                      status === 'recording' ? 'AI is listening & analyzing...' : 'AI is preparing'}
                   </span>
                 </div>
                 <p className="text-sm text-gray-500 px-4">Your responses, vocal pitch, and micro-expressions are securely analyzed in real-time.</p>
              </div>
              
              {status === 'recording' && step.type !== 'flash' && (
                <div className="w-full mb-8">
                   <div className="bg-gray-800 p-4 rounded-xl shadow-inner mb-4">
                     <p className="uppercase text-xs font-bold text-gray-400 tracking-wider mb-2">Current Question</p>
                     <p className="text-lg font-medium text-white">{step.text}</p>
                   </div>
                   
                   <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 min-h-32">
                     <p className="uppercase text-xs font-bold text-gray-500 tracking-wider mb-2 flex items-center gap-2">
                       Your Answer
                       {isListening && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
                     </p>
                     <p className={`text-base ${transcript ? 'text-gray-100' : 'text-gray-500 italic'}`}>
                        {transcript || (isListening ? 'Listening...' : 'Wait for AI to finish speaking...')}
                     </p>
                   </div>
                </div>
              )}
            </>
          )}

          <AnimatePresence mode="wait">
            {step.type === 'flash' && status === 'recording' ? (
              <motion.div 
                key="flash"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white text-red-600 p-8 rounded-2xl shadow-2xl border-4 border-red-500 w-full text-center"
              >
                 <AlertCircle size={48} className="mx-auto mb-4" />
                 <h2 className="text-2xl font-black">{step.text}</h2>
              </motion.div>
            ) : step.type === 'reflection' && status === 'recording' ? (
              <motion.div 
                key="reflection"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full text-left bg-gray-800 p-6 rounded-2xl"
              >
                <h3 className="text-xl font-bold mb-6 text-amber-500">Post-Interview Honesty Check</h3>
                <div className="space-y-4">
                  <div>
                     <label className="block text-sm text-gray-300 mb-2">1. How would you rate your performance out of 10? (Be honest)</label>
                     <input type="range" min="1" max="10" value={selfScore} onChange={e=>setSelfScore(Number(e.target.value))} className="w-full" />
                     <div className="text-center font-bold text-lg">{selfScore}/10</div>
                  </div>
                  <div>
                     <label className="block text-sm text-gray-300 mb-2">2. Which question did you find the most difficult?</label>
                     <textarea value={hardestQ} onChange={e=>setHardestQ(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm h-20 outline-none focus:border-amber-500"></textarea>
                  </div>
                  <div>
                     <label className="block text-sm text-gray-300 mb-2">3. What would you do differently if you took this again?</label>
                     <textarea value={diffAction} onChange={e=>setDiffAction(e.target.value)} className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm h-20 outline-none focus:border-amber-500"></textarea>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={stepIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`text-2xl font-bold leading-relaxed mb-6 min-h-[120px] text-center ${
                  step.type === 'counter' ? 'text-orange-400' :
                  step.type === 'roleplay' ? 'text-red-400 italic' : ''
                }`}
              >
                {step.text}
              </motion.div>
            )}
          </AnimatePresence>

          {status === 'recording' && step.type !== 'flash' && (
            <button 
              onClick={handleNextStep}
              className="mt-6 w-full py-4 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-lg"
            >
              {step.type === 'reflection' ? 'Submit Assessment & Finish' : 'Answer Given / Next Question'}
            </button>
          )}

        </div>
      </div>

      {/* Right side: Camera Feed */}
      <div className="w-full md:w-1/2 relative bg-black flex items-center justify-center p-4 overflow-hidden">
        
        {/* Distraction Injection */}
        <AnimatePresence>
          {showDistraction && (
             <motion.div 
               initial={{ x: 300, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               exit={{ x: 300, opacity: 0 }}
               className="absolute top-8 right-8 z-50 bg-white text-gray-900 p-4 rounded-2xl shadow-2xl flex items-center gap-4 w-72"
             >
                <div className="bg-blue-100 p-2 rounded-full"><MessageSquare className="text-blue-600" /></div>
                <div>
                  <p className="font-bold text-sm">New Message Received</p>
                  <p className="text-gray-500 text-xs">Priya: Are we still meeting at 5?</p>
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* Camera overlay UI */}
        <div className="w-full max-w-md aspect-[3/4] sm:aspect-video relative rounded-2xl overflow-hidden border-2 border-gray-800 bg-gray-900 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover ${step.type === 'flash' ? 'opacity-30' : 'opacity-100'} transition-opacity duration-300`}
          />

          {/* Countdown Timer Overlay */}
          <AnimatePresence>
            {timeLeft !== null && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className={`absolute top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-black text-2xl border-4 backdrop-blur-md shadow-2xl flex items-center gap-3
                  ${timeLeft <= 10 ? 'bg-red-500/90 border-red-200 text-white animate-pulse' : 
                    timeLeft <= 20 ? 'bg-orange-500/90 border-orange-200 text-white' : 
                                     'bg-gray-900/90 border-amber-500 text-amber-500'}`}
              >
                <Timer size={24} /> 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
              </motion.div>
            )}
          </AnimatePresence>

          {warning && status === 'recording' && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600/90 text-white px-6 py-4 rounded-xl font-bold text-center border-2 border-red-400 shadow-2xl backdrop-blur-sm z-50 flex flex-col items-center gap-2 animate-in fade-in zoom-in w-11/12 max-w-sm">
              <EyeOff size={32} />
              <span>{warning}</span>
            </div>
          )}

          {status === 'positioning' && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/70 p-6 text-center backdrop-blur-sm">
              <div className="border-2 border-dashed border-amber-500 w-48 h-64 rounded-[40px] mb-6 flex items-center justify-center relative">
                 <div className="absolute -top-3 bg-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full">Align Face & Shoulders</div>
              </div>
              <p className="font-semibold text-lg mb-2">Posture & Eye-Contact Tracking Active</p>
              <p className="text-gray-300 text-sm mb-6 max-w-xs">Face the camera strictly. Our AI tracks micro-expressions and stress indicators in real-time.</p>
              <button 
                onClick={handleStart}
                className="bg-amber-500 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-amber-600 transition-colors shadow-xl"
              >
                Begin Assessment
              </button>
            </div>
          )}

          {status === 'recording' && step.type !== 'reflection' && (
            <div className="absolute bottom-4 right-4 flex flex-col gap-2">
              <div className="bg-gray-900/80 backdrop-blur px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold border border-gray-700 flex items-center gap-2 text-white">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Vocal Stress Analyzer: ON
              </div>
              <div className="bg-gray-900/80 backdrop-blur px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold border border-gray-700 flex items-center gap-2 text-white">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                Micro-Expression Track: ON
              </div>
            </div>
          )}

          {status === 'processing' && (
             <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-blue-950/90 text-center backdrop-blur-md p-6">
                <Activity className="w-16 h-16 text-blue-400 animate-bounce mb-6" />
                <h2 className="text-2xl font-black text-white mb-2">Synthesizing Profile...</h2>
                <div className="space-y-2 text-sm text-blue-200 mt-4 text-left max-w-xs mx-auto">
                   <div className="space-x-2"><span className="text-amber-500">✓</span><span>Vocal Pitch Interpolated</span></div>
                   <div className="space-x-2"><span className="text-amber-500">✓</span><span>Cross-Consistency Checked</span></div>
                   <div className="space-x-2"><span className="text-amber-500">✓</span><span>Stress-Response Baseline Mapped</span></div>
                </div>
             </div>
          )}

          {status === 'complete' && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-green-950/90 text-center backdrop-blur-md p-8">
               <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.5)]">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
               </div>
               <h2 className="text-3xl font-black text-white mb-4">Assessment Complete</h2>
               <p className="text-green-100 mb-8 max-w-sm">We will inform you via Gmail and mobile when you get hired by anyone. Your verified profile is successfully submitted.</p>
               <button 
                 onClick={() => window.location.href='/seeker/dashboard'}
                 className="bg-white text-green-950 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 w-full shadow-lg"
               >
                 Return to Dashboard
               </button>
            </div>
          )}
        </div>
        
        {/* Privacy Note */}
        <div className="absolute bottom-6 left-6 flex items-start gap-3 text-gray-500 text-xs sm:text-sm max-w-sm pointer-events-none">
          <AlertCircle size={24} className="shrink-0 mt-0.5" />
          <p>Zero-Retention Privacy: Video, audio, and biometrics are strictly processed on-device in memory. No recordings are ever transmitted or saved.</p>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoom;
