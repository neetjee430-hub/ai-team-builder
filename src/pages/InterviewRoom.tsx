import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, Mic, Activity, AlertCircle, Timer, PlaySquare, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceEngine } from '../hooks/useVoiceEngine';
import { useBodyLanguage } from '../hooks/useBodyLanguage';
import { getNextQuestion, analyzeAnswer, scoreInterview } from '../services/geminiOrchestrator';
import { LanguageContext } from '../context/LanguageContext';

type Phase = "loading" | "setup" | "positioning" | "countdown" | "interview" | "roleplay" | "reflection" | "processing" | "complete" | "error";

const InterviewRoom = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const hasInitialized = useRef(false);

    const languageCtx = useContext(LanguageContext);
    const globalLang = languageCtx?.lang || 'en';
    const t = languageCtx?.t || ((k: string) => k);

    const [phase, setPhase] = useState<Phase>("loading");
    const [loadingStep, setLoadingStep] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // Setup state
    const [lang, setLang] = useState<"hi-IN" | "en-IN" | "hinglish">(globalLang === 'hi' ? "hi-IN" : "en-IN");
    const [useCamera, setUseCamera] = useState(false);
    const [consent, setConsent] = useState(false);
    const [micGranted, setMicGranted] = useState(false);
    const [camGranted, setCamGranted] = useState(false);

    // Interview state
    const [context, setContext] = useState<any | null>(null);
    const [currentQuestionText, setCurrentQuestionText] = useState("");
    const [currentQuestionData, setCurrentQuestionData] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [turnCount, setTurnCount] = useState(1);
    
    // UI state
    const [avatarState, setAvatarState] = useState<"speaking" | "listening" | "thinking">("thinking");

    // Reflection state
    const [selfScore, setSelfScore] = useState(5);
    const [hardestQuestion, setHardestQuestion] = useState("");
    const [doDifferent, setDoDifferent] = useState("");

    const videoRef = useRef<HTMLVideoElement>(null);

    const { 
        speak, stopSpeaking, isSpeaking, 
        startListening, isListening, transcript, micError 
    } = useVoiceEngine();

    const { 
        faceDetected, eyeContact, 
        posture, expression, focus, compositeScore, snapshots 
    } = useBodyLanguage(videoRef, useCamera && (phase === 'positioning' || phase === 'interview' || phase === 'roleplay'));

    // INITIALIZATION
    useEffect(() => {
        if (hasInitialized.current) return;
        
        // Timeout to catch infinite setups
        const errorTimer = setTimeout(() => {
            if (phase === 'loading') {
                setErrorMessage("Initialization took too long. Please check your internet connection.");
                setPhase("error");
            }
        }, 8000);

        const init = async () => {
            try {
                if (hasInitialized.current) return;
                hasInitialized.current = true;
                
                setLoadingStep("Step 1/3: Loading your interview details...");
                await new Promise(r => setTimeout(r, 800));

                const sessionStr = localStorage.getItem(`interview_session_${sessionId}`);
                let candidateInfo = { name: "Candidate", yearsExperience: 2, docSummary: "" };
                let jobId = "1";

                if (sessionStr) {
                    try {
                        const parsed = JSON.parse(sessionStr);
                        candidateInfo = parsed.candidateInfo || candidateInfo;
                        jobId = parsed.jobId || "1";
                    } catch (e) {}
                }

                setLoadingStep("Step 2/3: Preparing AI interviewer...");
                await new Promise(r => setTimeout(r, 600));

                setContext({
                    language: lang,
                    job: {
                        roleTitle: jobId === "1" ? "Senior Hair Stylist" : "Receptionist",
                        businessType: jobId === "1" ? "Salon" : "Front Desk",
                        businessName: "Glamour Salon",
                        city: "Indore",
                        skillsRequired: jobId === "1" ? ["Hair coloring", "Keratin", "Styling"] : ["Communication", "Scheduling"],
                        experienceRequired: String(candidateInfo.yearsExperience),
                        salaryRange: "15000-20000"
                    },
                    candidate: {
                        name: candidateInfo.name || "Candidate",
                        yearsExperience: Number(candidateInfo.yearsExperience) || 0,
                        declaredSkills: [],
                        docSummary: candidateInfo.docSummary || ""
                    },
                    conversationHistory: [],
                    coveredTopics: [],
                    redFlagsDetected: [],
                    interviewDuration: 0,
                    turnNumber: 0
                });

                setLoadingStep("Step 3/3: Setup ready");
                clearTimeout(errorTimer);
                
                // Bug fix 3: Default to Voice + Camera instead of asking
                setUseCamera(true);
                setPhase("setup");
            } catch (err) {
                console.error("Init failed:", err);
                setErrorMessage("Could not load interview. Please try again.");
                setPhase("error");
                clearTimeout(errorTimer);
            }
        };

        init();
        return () => clearTimeout(errorTimer);
    }, []); // Empty dependency array as requested

    useEffect(() => {
        if (context) {
            setContext({ ...context, language: lang });
        }
    }, [lang]);

    // Track AI avatar state
    useEffect(() => {
        if (isSpeaking) setAvatarState("speaking");
        else if (isListening) setAvatarState("listening");
        else setAvatarState("thinking");
    }, [isSpeaking, isListening]);

    // Flow Management
    const requestPermissions = async (type: 'mic' | 'cam') => {
        try {
            if (type === 'mic') {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                setMicGranted(true);
            } else {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) videoRef.current.srcObject = stream;
                setCamGranted(true);
                setMicGranted(true); // Cam permissions normally include mic
            }
        } catch (e) {
             console.error(e);
        }
    };

    const handleStartInterviewFromSetup = async () => {
        // Attempt camera first
        let stream = null;
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            if (videoRef.current) videoRef.current.srcObject = stream;
            setCamGranted(true);
            setMicGranted(true);
            setUseCamera(true);
        } catch (e) {
            console.warn("Camera denied, falling back to voice only");
            setUseCamera(false);
            try {
                await navigator.mediaDevices.getUserMedia({ audio: true });
                setMicGranted(true);
            } catch (err) {
                console.error("Mic denied");
                // Will show fallback in UI
            }
        }
        
        setPhase(stream ? "positioning" : "countdown");
        if (!stream) {
            startCountdown();
        }
    };

    const startCountdown = () => {
        setPhase("countdown");
        setTimeout(() => {
            setPhase("interview");
            runNextTurn(context!); // Passes current context
        }, 3000); // 3-second countdown
    };

    const stopListeningRef = useRef<any>(null);

    const runNextTurn = async (currentCtx: any) => {
        setAvatarState("thinking");
        setCurrentQuestionText("Thinking of the next question...");

        try {
            const nextQ = await getNextQuestion(currentCtx);
            
            if (nextQ.stop_interview) {
                setPhase("reflection");
                return;
            }

            if (nextQ.transition_to_roleplay) {
                setPhase("roleplay");
            }

            setCurrentQuestionData(nextQ);
            setCurrentQuestionText(nextQ.question);
            setTimeLeft(nextQ.show_timer ? nextQ.time_limit_seconds : null);
            setTurnCount(prev => prev + 1);

            await speak(nextQ.spoken_question, currentCtx.language);
            
            // Start listening after speaking finishes
            stopListeningRef.current = startListening(
                currentCtx.language, 
                (interimText) => {}, 
                async (finalText) => {
                    await processAnswer(currentCtx, nextQ, finalText);
                }
            );

        } catch (err) {
            console.error("Failed to fetch turn:", err);
            setErrorMessage("Connection lost. Retrying turn...");
            setTimeout(() => runNextTurn(currentCtx), 2000);
        }
    };

    const handleManualNext = () => {
        if (isListening && stopListeningRef.current) {
             const el = document.getElementById('chat-input') as HTMLTextAreaElement | null;
             stopListeningRef.current(true, el?.value); // forces final read
        }
    };

    const processAnswer = async (currentCtx: any, questionData: any, answerText: string) => {
        setAvatarState("thinking");
        setCurrentQuestionText("Analyzing answer...");

        let safeAnswer = answerText || "[No answer provided]";

        // Async extraction
        const extraction = await analyzeAnswer(questionData.question, safeAnswer, currentCtx);
        
        let newCtx = { ...currentCtx };
        newCtx.conversationHistory.push({
            question: questionData.question,
            questionType: questionData.question_type,
            answerTranscript: safeAnswer,
            answerKeyPoints: extraction.key_points,
            answerScore: extraction.answer_quality_0_10
        });

        if (extraction.claimed_skills) {
            newCtx.candidate.declaredSkills = [...new Set([...newCtx.candidate.declaredSkills, ...extraction.claimed_skills])];
        }
        if (extraction.red_flags) {
            newCtx.redFlagsDetected = [...new Set([...newCtx.redFlagsDetected, ...extraction.red_flags])];
        }

        newCtx.turnNumber += 1;
        setContext(newCtx);

        // If roleplay, maybe end roleplay after 2-3 turns
        if (phase === 'roleplay' && newCtx.turnNumber >= 8) {
            setPhase("reflection");
            return;
        }

        if (newCtx.turnNumber >= 8) {
            setPhase("reflection");
        } else {
            runNextTurn(newCtx);
        }
    };

    const submitReflectionAndProcess = async () => {
        setPhase("processing");
        const finalSnapshots = snapshots;
        try {
            const scoreRes = await scoreInterview({...context, selfAssessment: {score: selfScore, hardest: hardestQuestion, doDifferent}, bodyLanguageSnapshots: finalSnapshots});
            localStorage.setItem(`interview_scorecard_${sessionId}`, JSON.stringify(scoreRes));
            setPhase("complete");
        } catch (e) {
            console.error("Scorecard error", e);
            setPhase("complete");
        }
    };

    const handleRetry = () => {
        hasInitialized.current = false;
        setPhase("loading");
        setErrorMessage("");
    };

    // UI RENDERERS
    if (phase === "loading") {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center animate-pulse mb-8 shadow-[0_0_40px_rgba(37,99,235,0.6)]">
                    <Activity className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold mb-6">Preparing Interview...</h2>
                <div className="flex gap-3 items-center text-gray-400">
                    <span className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-black text-xs font-bold">✓</span>
                    <span>{loadingStep || "Initializing..."}</span>
                </div>
            </div>
        );
    }

    if (phase === "error") {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold mb-4">Oops!</h2>
                <p className="text-gray-400 mb-8">{errorMessage}</p>
                <button onClick={() => window.location.reload()} className="bg-amber-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-amber-400 transition-colors">
                    Try Again
                </button>
            </div>
        );
    }

    if (phase === "setup") {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
                <div className="max-w-xl w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
                    <div className="text-center mb-8">
                       <h1 className="text-3xl font-bold mb-2">Welcome to your AI Interview 🎙️</h1>
                       <p className="text-gray-400">Let's set up for the best experience</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-300 mb-3 uppercase tracking-wider">Step 1 — Choose your language</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {["hi-IN", "en-IN", "hinglish"].map((l) => (
                                    <button 
                                        key={l}
                                        onClick={() => setLang(l as any)}
                                        className={`py-3 rounded-lg font-bold border transition-colors ${lang === l ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'}`}
                                    >
                                        {l === 'hi-IN' ? 'हिंदी' : l === 'en-IN' ? 'English' : 'Hinglish'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-300 mb-3 uppercase tracking-wider">Step 2 — Choose mode</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button onClick={() => setUseCamera(false)} className={`p-4 rounded-xl text-left border transition-all ${!useCamera ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-gray-900 border-gray-700 text-gray-400'}`}>
                                   <div className="flex items-center gap-2 font-bold mb-1"><Mic size={18} /> Voice Only</div>
                                   <p className="text-xs opacity-70">Recommended. Works on any device, no camera needed.</p>
                                </button>
                                <button onClick={() => setUseCamera(true)} className={`p-4 rounded-xl text-left border transition-all ${useCamera ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-gray-900 border-gray-700 text-gray-400'}`}>
                                   <div className="flex items-center gap-2 font-bold mb-1"><Camera size={18} /> Voice + Camera</div>
                                   <p className="text-xs opacity-70">Adds body language analysis. Camera recommended but optional.</p>
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-300 mb-3 uppercase tracking-wider">Step 3 — Permissions</h3>
                            <div className="space-y-3">
                               <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-700">
                                   <div className="flex items-center gap-3"><Mic className="text-gray-400"/> <span>Microphone</span></div>
                                   {micGranted ? <span className="text-green-500 font-bold">✅ Granted</span> : <button onClick={() => requestPermissions('mic')} className="text-blue-400 hover:text-blue-300 font-medium">Request Access ▶</button>}
                               </div>
                               {useCamera && (
                                   <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-700">
                                       <div className="flex items-center gap-3"><Camera className="text-gray-400"/> <span>Camera</span></div>
                                       {camGranted ? <span className="text-green-500 font-bold">✅ Granted</span> : <button onClick={() => requestPermissions('cam')} className="text-blue-400 hover:text-blue-300 font-medium">Request Access ▶</button>}
                                   </div>
                               )}
                            </div>
                        </div>

                        <label className="flex items-start gap-3 p-4 bg-blue-900/20 border border-blue-900 rounded-xl cursor-pointer">
                            <input type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)} className="mt-1 w-5 h-5 accent-blue-500" />
                            <span className="text-sm text-blue-200">I allow HireIQ AI to use my microphone {useCamera && 'and camera'} for this interview session. No video recordings will be stored.</span>
                        </label>

                        <button 
                            disabled={!consent || (!useCamera && !micGranted) || (useCamera && !camGranted)}
                            onClick={handleStartInterviewFromSetup}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${consent && ((!useCamera && micGranted) || (useCamera && camGranted)) ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                        >
                            I'm Ready — Start My Interview →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (phase === "positioning") {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8 items-center bg-gray-900 p-8 rounded-2xl">
                    <div className="flex-1 w-full max-w-sm">
                        <div className="aspect-[3/4] relative rounded-2xl overflow-hidden bg-black border-2 border-gray-700 shadow-2xl">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                            <div className="absolute inset-x-0 top-[20%] bottom-[30%] mx-auto w-[60%] border-2 border-dashed border-white/50 rounded-[40%] flex items-center justify-center">
                                {/* Positioning oval */}
                            </div>
                            <div className="absolute bottom-4 left-0 right-0 text-center">
                                {faceDetected ? 
                                  <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-sm">✅ Position looks good!</span> :
                                  <span className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold text-sm">⚠️ Move closer to center</span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold mb-6">📐 Position Guide</h2>
                        <ul className="space-y-4 mb-8 text-gray-300">
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500"/> Sit 2-3 feet from camera</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500"/> Face visible and well-lit</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500"/> Upper body clearly in frame</li>
                            <li className="flex items-center gap-3"><CheckCircle2 className="text-green-500"/> Good lighting on your face</li>
                        </ul>
                        <button 
                            disabled={!faceDetected}
                            onClick={startCountdown}
                            className={`w-full py-4 rounded-xl font-bold transition-all ${faceDetected ? 'bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:bg-amber-400' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
                        >
                            Looks Good — Start Interview →
                        </button>
                        <button onClick={startCountdown} className="w-full text-center mt-4 text-gray-500 text-sm hover:text-white transition">
                            Skip camera setup (voice only)
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (phase === "countdown") {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
                <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-9xl font-black text-amber-500 drop-shadow-[0_0_50px_rgba(245,158,11,0.5)] mb-8"
                >
                    3..2..1
                </motion.div>
                <div className="text-xl text-gray-300">Your AI interviewer is ready. Speak naturally.</div>
                {lang === 'hi-IN' && <div className="text-lg text-gray-400 mt-2">आपका AI इंटरव्यूअर तैयार है। स्वाभाविक रूप से बोलें।</div>}
            </div>
        );
    }

    // MAIN INTERVIEW & ROLEPLAY
    if (phase === "interview" || phase === "roleplay") {
        return (
            <div className="min-h-screen bg-[#0F172A] text-white flex flex-col md:flex-row overflow-hidden">
                {/* LEFT: AI AVATAR */}
                <div className="w-full md:w-1/4 p-6 border-r border-gray-800 flex flex-col items-center justify-center bg-gray-950 relative">
                    <div className="text-center mb-8">
                       <h2 className="text-lg font-bold mb-1">HireIQ AI</h2>
                       <div className="text-xs text-gray-500 uppercase tracking-widest">{phase === 'roleplay' ? '🎭 ROLEPLAY MODE' : 'INTERVIEWER'}</div>
                    </div>

                    <div className="relative mb-12">
                        {/* Avatar representation using CSS */}
                        <div className={`w-32 h-32 rounded-full flex items-center justify-center relative z-10 transition-colors duration-500 ${
                            avatarState === 'speaking' ? 'bg-amber-500 border-4 border-amber-300' :
                            avatarState === 'listening' ? 'bg-blue-600 border-4 border-blue-400 animate-pulse' :
                            'bg-gray-800 border-2 border-gray-700'
                        }`}>
                            <Activity className={`w-12 h-12 ${avatarState === 'thinking' ? 'text-gray-500 opacity-50' : 'text-white'}`} />
                        </div>
                        {avatarState === 'speaking' && (
                            <div className="absolute inset-0 bg-amber-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
                        )}
                        {avatarState === 'listening' && (
                            <div className="absolute inset-0 bg-blue-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                        )}
                    </div>

                    <div className="bg-gray-900 rounded-full px-4 py-2 flex items-center gap-2 mb-4">
                        {avatarState === 'speaking' && <><VolumeIcon className="text-amber-500 animate-pulse"/> <span className="text-amber-500 font-medium text-sm">Speaking...</span></>}
                        {avatarState === 'listening' && <><Mic className="text-blue-400 animate-pulse"/> <span className="text-blue-400 font-medium text-sm">Listening...</span></>}
                        {avatarState === 'thinking' && <><Timer className="text-gray-500"/> <span className="text-gray-500 font-medium text-sm">Thinking...</span></>}
                    </div>

                    <div className="text-sm text-gray-500 mb-2">🗣️ Language: {lang === 'hi-IN' ? 'Hindi' : 'English'}</div>
                    <div className="text-sm text-gray-500">Question {turnCount} of ~8</div>
                </div>

                {/* CENTER: QUESTION & TRANSCRIPT */}
                <div className="flex-1 flex flex-col p-6 relative">
                    <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentQuestionText}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center mb-12"
                            >
                                <h1 className="text-3xl md:text-4xl font-medium leading-relaxed tracking-tight text-white/90">
                                    {currentQuestionText}
                                </h1>
                                {currentQuestionData?.why_this_question && (
                                    <p className="text-sm text-gray-500 mt-6 max-w-xl mx-auto italic">
                                        "{currentQuestionData.why_this_question}"
                                    </p>
                                )}
                            </motion.div>
                        </AnimatePresence>

                        
                        {/* Live Transcript / Chat Mode Input */}
                        <div className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl p-6 min-h-[160px] relative mt-4 shadow-inner">
                            <div className="absolute -top-3 left-6 bg-gray-800 text-xs font-bold px-3 py-1 rounded-full text-gray-400 uppercase tracking-widest border border-gray-700 shadow-md">
                                Your Answer
                            </div>
                            
                            {!isListening ? (
                                <p className="text-gray-500 italic mt-2 text-center">Wait for MAX to finish speaking...</p>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex border border-gray-700 bg-gray-800 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-[#4F46E5] transition-all shadow-sm">
                                        <div className="p-3 bg-gray-700/50 text-gray-400 border-r border-gray-700 flex items-center justify-center">
                                            <Mic size={20} className={isListening ? "text-blue-400 animate-pulse" : ""} />
                                        </div>
                                        <textarea 
                                           id="chat-input"
                                           className="w-full bg-transparent text-white p-4 outline-none resize-none min-h-[100px]"
                                           placeholder="Type your answer here or just speak naturally (Voice is active)..."
                                           defaultValue={transcript || ''}
                                           onKeyDown={(e) => {
                                               if (e.key === 'Enter' && !e.shiftKey) {
                                                   e.preventDefault();
                                                   if (stopListeningRef.current) {
                                                       const val = e.currentTarget.value;
                                                       stopListeningRef.current(true, val);
                                                   }
                                               }
                                           }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center px-1">
                                        <span className="text-xs text-gray-500 font-medium">Press Enter to submit or use voice</span>
                                        <button 
                                           onClick={() => {
                                               const el = document.getElementById('chat-input') as HTMLTextAreaElement;
                                               if(stopListeningRef.current) stopListeningRef.current(true, el?.value);
                                           }}
                                           className="px-4 py-1.5 bg-[#4F46E5] hover:bg-[#6366f1] text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                                        >
                                           Submit Answer
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>


                        {/* ACTIONS */}
                        <div className="mt-8 flex gap-4 opacity-50 hover:opacity-100 transition-opacity">
                            <button onClick={() => speak(currentQuestionText, lang)} className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-sm font-medium hover:bg-gray-700">
                                <PlaySquare size={16}/> Repeat Question
                            </button>
                            {isListening && (
                                <button onClick={handleManualNext} className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black rounded-lg text-sm font-medium transition-colors">
                                    ⏭️ I'm Done Answering
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT: CAMERA & METRICS (if enabled) */}
                {useCamera && (
                    <div className="w-full md:w-1/4 bg-gray-950 p-6 flex flex-col border-l border-gray-800">
                        <div className="aspect-[3/4] relative rounded-2xl overflow-hidden bg-black border-2 border-gray-800 mb-6">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                                🔒 Not Recorded
                            </div>
                        </div>

                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Activity size={16}/> Live Metrics
                            </h3>
                            
                            <div className="space-y-4">
                                <MetricBar label="👁️ Eye Contact" score={eyeContact} />
                                <MetricBar label="🧍 Posture (est)" score={posture} />
                                <MetricBar label="😊 Expression (est)" score={expression} />
                                <MetricBar label="🎯 Focus" score={focus} />
                            </div>

                            <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 text-center">
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Live Confidence</div>
                                <div className={`text-4xl font-black ${compositeScore > 75 ? 'text-green-500' : compositeScore > 50 ? 'text-amber-500' : 'text-red-500'}`}>
                                    {compositeScore}%
                                </div>
                            </div>

                            <p className="text-[10px] text-gray-600 mt-6 text-center">
                                Assistive signals only — not the sole basis for hiring decisions
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (phase === "reflection") {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
                <div className="max-w-xl w-full bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-700">
                    <h2 className="text-3xl font-bold mb-2">Interview Complete! 🎉</h2>
                    <p className="text-gray-400 mb-8">Just 3 quick questions about your experience.</p>

                    <div className="space-y-8">
                        <div>
                            <label className="block font-medium mb-4">1. How would you rate your performance out of 10?</label>
                            <input type="range" min="1" max="10" value={selfScore} onChange={(e)=>setSelfScore(Number(e.target.value))} className="w-full accent-amber-500" />
                            <div className="flex justify-between text-2xl mt-2">
                                <span className={selfScore <= 3 ? 'opacity-100' : 'opacity-30'}>😕</span>
                                <span className={selfScore > 3 && selfScore <= 6 ? 'opacity-100' : 'opacity-30'}>😐</span>
                                <span className={selfScore > 6 && selfScore <= 8 ? 'opacity-100' : 'opacity-30'}>😊</span>
                                <span className={selfScore > 8 ? 'opacity-100' : 'opacity-30'}>🔥</span>
                            </div>
                        </div>

                        <div>
                            <label className="block font-medium mb-2">2. Which question felt the hardest?</label>
                            <input type="text" value={hardestQuestion} onChange={(e)=>setHardestQuestion(e.target.value)} maxLength={150} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="e.g. The roleplay scenario" />
                        </div>

                        <div>
                            <label className="block font-medium mb-2">3. If you did this again, what would you do differently?</label>
                            <textarea value={doDifferent} onChange={(e)=>setDoDifferent(e.target.value)} maxLength={200} rows={3} className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-amber-500 outline-none" placeholder="Be more concise, speak louder, etc." />
                        </div>

                        <button onClick={submitReflectionAndProcess} className="w-full bg-amber-500 text-black font-bold py-4 rounded-xl hover:bg-amber-400 transition-colors shadow-lg">
                            Submit & See Result →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (phase === "processing") {
        return (
            <div className="min-h-screen bg-blue-950 flex flex-col items-center justify-center text-white/90">
                <Activity className="w-20 h-20 text-amber-500 animate-bounce mb-8" />
                <h2 className="text-3xl font-black mb-6">🧠 AI is analyzing your interview...</h2>
                <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3 bg-blue-900/50 px-6 py-3 rounded-lg"><span className="text-amber-500 animate-pulse">●</span> Reviewing answers...</div>
                    <div className="flex items-center gap-3 bg-blue-900/50 px-6 py-3 rounded-lg"><span className="text-amber-500 animate-pulse">●</span> Analyzing communication style...</div>
                    <div className="flex items-center gap-3 bg-blue-900/50 px-6 py-3 rounded-lg"><span className="text-amber-500 animate-pulse">●</span> Processing body language...</div>
                    <div className="flex items-center gap-3 bg-blue-900/50 px-6 py-3 rounded-lg"><span className="text-amber-500 animate-pulse">●</span> Generating scorecard...</div>
                </div>
            </div>
        );
    }

    if (phase === "complete") {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6 text-center">
                <div className="max-w-md w-full">
                    <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h1 className="text-4xl font-black mb-4">Interview Complete!</h1>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Thank you {context?.candidate.name}! Your interview has been submitted securely.
                    </p>
                    <div className="bg-gray-800 p-6 rounded-2xl mb-8 space-y-4 text-left">
                        <h3 className="font-bold text-gray-300 uppercase tracking-widest text-xs mb-4">What happens next:</h3>
                        <p className="flex gap-3"><span className="text-amber-500">📋</span> Your AI scorecard is being reviewed by the employer.</p>
                        <p className="flex gap-3"><span className="text-amber-500">📞</span> They will contact you shortly if it's a match.</p>
                        <p className="flex gap-3"><span className="text-amber-500">💪</span> All the best!</p>
                    </div>
                    <button onClick={() => navigate('/seeker/dashboard')} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors">
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

// HELPER COMPONENT
const VolumeIcon = ({ className }: { className?: string }) => (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
    </svg>
);

const MetricBar = ({ label, score }: { label: string, score: number }) => {
    const color = score > 75 ? 'bg-green-500' : score > 50 ? 'bg-amber-500' : 'bg-red-500';
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">{label}</span>
                <span className="font-bold text-gray-300">{score}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${score}%` }}></div>
            </div>
        </div>
    );
};

export default InterviewRoom;
