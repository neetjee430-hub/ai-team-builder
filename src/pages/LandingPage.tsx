import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, CheckCircle2, Star, Menu, ChevronDown, Mic, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MarqueeRow = ({ text, reverse = false, className = '' }: any) => {
    return (
        <div className={`overflow-hidden whitespace-nowrap flex ${className}`}>
            <motion.div 
                className="flex items-center space-x-8 px-4"
                animate={{ x: reverse ? ['0%', '-50%'] : ['-50%', '0%'] }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
                <div className="flex gap-8 items-center">{text}</div>
                <div className="flex gap-8 items-center">{text}</div>
                <div className="flex gap-8 items-center">{text}</div>
            </motion.div>
        </div>
    );
};

export default function LandingPage() {
    const { lang, t, toggleLang } = useLanguage();
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
    const [demoTab, setDemoTab] = useState<'owner' | 'seeker'>('owner');
    const [ownerUrl, setOwnerUrl] = useState(localStorage.getItem('demo_owner_url') || '');
    const [seekerUrl, setSeekerUrl] = useState(localStorage.getItem('demo_seeker_url') || '');
    const [tempUrl, setTempUrl] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const saveUrl = () => {
        if (!tempUrl) return;
        const validUrl = tempUrl.includes('youtube') || tempUrl.includes('youtu.be') ? tempUrl : '';
        if (demoTab === 'owner') {
            setOwnerUrl(validUrl);
            localStorage.setItem('demo_owner_url', validUrl);
        } else {
            setSeekerUrl(validUrl);
            localStorage.setItem('demo_seeker_url', validUrl);
        }
        setTempUrl('');
    };

    const isHindi = lang === 'hi';

    const tagline = isHindi ? "भारत का सबसे स्मार्ट AI हायरिंग प्लेटफॉर्म" : "India's Smartest AI Hiring Platform";
    
    // We already have translated text in context but the original code had these keys fallback.
    // Using `t()` for translated content.
    const heroHeadline1 = t('hero_headline_1') || "Stop Hiring the";
    const heroHeadline2 = t('hero_headline_2') || "Wrong People.";
    const heroSub = t('hero_sub') || "HireGuru AI conducts voice interviews in Hindi or English, reads body language live, checks certificates, and tells you exactly who to hire — in under 10 minutes.";
    const getStarted = t('hero_cta_primary') || "Get Started Free →";
    const watchDemo = t('hero_cta_secondary') || "Watch Demo ▶";

    const trustItems = "🇮🇳 Built for India • 🤖 Powered by Gemini AI • 🔒 Privacy First • 🗣️ Hindi + English • ⚡ Interview in 10 Minutes • 45+ Business Types Supported • ".repeat(4);
    const businessItems = "💇 Salon • 🏋️ Gym • 📚 Coaching • 🍽️ Restaurant • 🏥 Clinic • 👗 Boutique • 🎓 School • ☕ Café • 🏠 Real Estate • 🚗 Driving School • 💊 Pharmacy • 📸 Studio • 🏨 Hotel • 🔧 Repair Shop • 🧹 Cleaning • 🎂 Bakery • 💅 Nail Studio • 🐾 Pet Clinic • ✈️ Travel Agency • 🎮 Gaming Zone • ".repeat(3);

    return (
        <div className="min-h-screen bg-[#0F172A] text-white font-sans overflow-x-hidden selection:bg-amber-200 selection:text-amber-900">
            {/* TRUST BAR */}
            <div className="bg-blue-600 text-white text-xs font-bold py-2 relative z-50">
                <MarqueeRow text={trustItems} />
            </div>

            {/* NAVBAR */}
            <nav className={`fixed w-full z-40 transition-all duration-300 ${scrolled ? 'bg-[#0F172A]/80 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'} top-8`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                                <span className="text-amber-500">HireGuru</span> AI
                            </h1>
                        </div>
                        
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                            <a href="#features" className="hover:text-amber-500 transition-colors">{t('nav_features')}</a>
                            <a href="#how-it-works" className="hover:text-amber-500 transition-colors">{t('nav_how_it_works')}</a>
                            <a href="#pricing" className="hover:text-amber-500 transition-colors">{t('nav_pricing')}</a>
                            <button onClick={toggleLang} className="bg-white/10 px-3 py-1 rounded-full hover:bg-white/20">
                                {isHindi ? 'English' : 'हिंदी'}
                            </button>
                        </div>
                        
                        <div className="hidden md:flex items-center gap-4">
                            <Link to="/auth" className="text-white hover:text-gray-300 font-medium text-sm">{t('nav_login')}</Link>
                            <div className="relative group">
                                <button onMouseEnter={() => setIsSignUpOpen(true)} onMouseLeave={() => setIsSignUpOpen(false)} className="bg-amber-500 text-[#0F172A] px-5 py-2.5 rounded-lg font-bold hover:bg-amber-400 transition-colors flex items-center gap-2">
                                    {t('nav_signup')} <ChevronDown size={16} />
                                </button>
                                <AnimatePresence>
                                    {isSignUpOpen && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                            onMouseEnter={() => setIsSignUpOpen(true)} onMouseLeave={() => setIsSignUpOpen(false)}
                                            className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl p-2 z-50 text-gray-900 border"
                                        >
                                            <Link to="/auth" onClick={()=>localStorage.setItem('temp_role', 'owner')} className="block p-3 hover:bg-blue-50 rounded-lg transition-colors">
                                                <div className="font-bold">🏢 {t('nav_business_owner')}</div>
                                                <div className="text-xs text-gray-500 mt-1">Hire staff automatically</div>
                                            </Link>
                                            <Link to="/auth" onClick={()=>localStorage.setItem('temp_role', 'seeker')} className="block p-3 hover:bg-amber-50 rounded-lg transition-colors">
                                                <div className="font-bold">👤 {t('nav_job_seeker')}</div>
                                                <div className="text-xs text-gray-500 mt-1">Give AI interviews & get hired easily</div>
                                            </Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <Menu size={28} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <div className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center min-h-[90vh]">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-[#0F172A] to-[#0F172A]"></div>
                
                {/* Particles */}
                <div className="absolute inset-0 z-0 opacity-30">
                    {[...Array(30)].map((_, i) => (
                        <div key={i} className="absolute rounded-full bg-blue-400 animate-pulse" style={{
                            width: Math.random() * 6 + 2 + 'px',
                            height: Math.random() * 6 + 2 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            animationDuration: Math.random() * 3 + 2 + 's',
                            animationDelay: Math.random() * 2 + 's'
                        }}></div>
                    ))}
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-300 font-medium text-sm mb-8">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            🇮🇳 Made in India • Powered by Gemini AI
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight tracking-tight">
                            {heroHeadline1}<br/>
                            <span className="text-amber-500">{heroHeadline2}</span>
                        </h1>
                        <p className="text-lg lg:text-xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            {heroSub}
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                            <Link to="/auth" className="w-full sm:w-auto px-8 py-4 bg-amber-500 text-[#0F172A] font-bold rounded-xl hover:bg-amber-400 transition-all shadow-[0_0_40px_rgba(245,158,11,0.3)] hover:scale-105 text-lg flex items-center justify-center gap-2">
                                {getStarted}
                            </Link>
                            <button onClick={() => setIsVideoModalOpen(true)} className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/20 text-white font-bold rounded-xl hover:bg-white/10 transition-all text-lg flex items-center justify-center gap-2">
                                <Play size={20} className="fill-current" /> {watchDemo}
                            </button>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-semibold text-gray-400">
                            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> {t('hero_trust_1').replace('✅ ', '')}</div>
                            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> {t('hero_trust_2').replace('✅ ', '')}</div>
                            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> {t('hero_trust_3').replace('✅ ', '')}</div>
                            <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Free for small teams</div>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-lg lg:max-w-none relative animate-float">
                        <div className="relative bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl overflow-hidden aspect-[4/3] p-1">
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>
                            <div className="w-full h-full rounded-2xl bg-gray-800 relative overflow-hidden flex flex-col justify-end p-6">
                                {/* Simulated AI Interview Mockup */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-32 h-32 bg-blue-500/20 rounded-full blur-2xl animate-pulse"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-24 h-24 bg-blue-600 rounded-full border-4 border-blue-400 shadow-[0_0_50px_rgba(37,99,235,0.8)] flex items-center justify-center">
                                    <Activity className="w-10 h-10 text-white animate-pulse" />
                                </div>
                                
                                {/* Live Captions */}
                                <div className="relative z-20 space-y-3">
                                    <div className="bg-[#0F172A]/80 border border-gray-700 backdrop-blur-md p-3 rounded-xl max-w-[80%] inline-block">
                                        <p className="text-sm font-medium text-amber-500 mb-1">AI Interviewer</p>
                                        <p className="text-white text-sm">Tell me about a difficult customer you handled?</p>
                                    </div>
                                    <div className="bg-blue-600/20 border border-blue-500/30 backdrop-blur-md p-3 rounded-xl max-w-[80%] ml-auto text-right">
                                        <p className="text-xs font-bold text-blue-300 mb-1 uppercase tracking-widest flex items-center gap-1 justify-end"><Mic size={10} className="animate-pulse" /> Listening</p>
                                        <p className="text-white text-sm">Ek baar customer bahut naraaz tha, maine unki baat suni aur...</p>
                                    </div>
                                </div>

                                {/* Floating Body Lang Badge */}
                                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur border border-gray-700 p-2 rounded-lg z-20 flex flex-col gap-1 w-28">
                                    <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Confidence</div>
                                    <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                        <div className="h-full bg-green-500 w-[82%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STATS BAR */}
            <div className="border-y border-gray-800 bg-gray-900/50 relative z-20">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white font-bold">
                        <div><div className="text-5xl text-amber-500 mb-2">45+</div><div className="text-gray-400 text-sm">Business Types Supported</div></div>
                        <div><div className="text-5xl text-amber-500 mb-2">10</div><div className="text-gray-400 text-sm">Min Average Interview</div></div>
                        <div><div className="text-5xl text-amber-500 mb-2">100%</div><div className="text-gray-400 text-sm">AI Powered</div></div>
                        <div><div className="text-5xl text-amber-500 mb-2 font-black">₹0</div><div className="text-gray-400 text-sm">Free to Start</div></div>
                    </div>
                </div>
            </div>

            {/* HOW IT WORKS */}
            <div id="how-it-works" className="py-24 bg-[#0F172A] relative scroll-m-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-6">{t('how_header')}</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                        <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl">
                            <h3 className="text-2xl font-bold text-amber-500 mb-8 border-b border-gray-800 pb-4">🏢 {t('nav_business_owner')}</h3>
                            <div className="space-y-8">
                                {[
                                    { step: 1, title: t('step1_title'), desc: t('step1_desc'), icon: '🏢' },
                                    { step: 2, title: t('step2_title'), desc: t('step2_desc'), icon: '🧠' },
                                    { step: 3, title: t('step3_title'), desc: t('step3_desc'), icon: '📋' },
                                    { step: 4, title: t('step4_title'), desc: t('step4_desc'), icon: '🤖' },
                                    { step: 5, title: t('step5_title'), desc: t('step5_desc'), icon: '✅' },
                                ].map(s => (
                                    <div key={s.step} className="flex gap-4">
                                        <div className="w-12 h-12 bg-blue-900/50 text-2xl flex items-center justify-center rounded-xl shrink-0 font-black">{s.icon}</div>
                                        <div>
                                            <h4 className="text-lg font-bold mb-1">Step {s.step}: {s.title}</h4>
                                            <p className="text-gray-400 leading-relaxed text-sm">{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-blue-900/20 border border-blue-900/50 p-8 rounded-3xl">
                            <h3 className="text-2xl font-bold text-blue-400 mb-8 border-b border-blue-900/50 pb-4">👤 For Job Seekers</h3>
                            <div className="space-y-8">
                                {[
                                    { step: 1, title: 'Create your profile', desc: 'Add basics online. No resume needed.', icon: '👤' },
                                    { step: 2, title: 'Browse jobs near you', desc: 'Find openings at top local businesses instantly matching your skills.', icon: '🎯' },
                                    { step: 3, title: 'Take AI interview from home', desc: 'Talk to the AI on your phone in Hindi or English.', icon: '🎙️' },
                                    { step: 4, title: 'Get hired instantly', desc: 'Employers see your score and hire you fast.', icon: '💼' },
                                ].map(s => (
                                    <div key={s.step} className="flex gap-4">
                                        <div className="w-12 h-12 bg-blue-800 text-2xl flex items-center justify-center rounded-xl shrink-0 font-black">{s.icon}</div>
                                        <div>
                                            <h4 className="text-lg font-bold mb-1">Step {s.step}: {s.title}</h4>
                                            <p className="text-gray-400 leading-relaxed text-sm">{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-12 p-6 bg-blue-600 text-white rounded-xl text-center">
                                <h4 className="font-bold text-xl mb-3">Looking for a job right now?</h4>
                                <Link to="/auth" className="inline-block bg-white text-blue-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg">Find Jobs Near Me →</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FEATURES GRID */}
            <div id="features" className="py-24 bg-gray-900 relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">Everything You Need to Hire Right</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Enterprise-grade hiring AI, simplified for local businesses.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: 'AI Team Blueprint', icon: '🧠', desc: 'Our AI tells you exactly who to hire, how many, and what salary to offer. No guesswork.' },
                            { title: 'Conversational Voice Interview', icon: '🎙️', desc: 'AI speaks to candidates in Hindi or English. No scripts. No forms. Just conversation.' },
                            { title: 'Live Body Language', icon: '👁️', desc: 'Camera tracks eye contact, posture, confidence signals in real time.' },
                            { title: 'Pressure Questions', icon: '⏱️', desc: 'AI fires surprise follow-ups to test real confidence — not rehearsed answers.' },
                            { title: 'Certificate Verification', icon: '📄', desc: 'Candidates upload certificates. AI extracts info, scores relevance instantly.' },
                            { title: 'Roleplay Scenarios', icon: '🎭', desc: 'AI roleplays real work situations — angry customer, urgent problem. See real reactions.' },
                            { title: 'Confidence Graph', icon: '📊', desc: 'See exactly when confidence dropped or rose throughout the interview timeline.' },
                            { title: 'Hindi + 10 Languages', icon: '🌐', desc: 'Works in Hindi, English, Hinglish, Marathi, Tamil. Your candidate chooses comfort.' },
                        ].map((f, i) => (
                            <div key={i} className="bg-[#0F172A] border border-gray-800 p-6 rounded-2xl hover:border-amber-500/50 transition-colors group">
                                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
                                <h4 className="text-lg font-bold mb-2">{f.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MARQUEE */}
            <div className="py-16 overflow-hidden bg-blue-900 border-y border-blue-800 shadow-2xl">
                <div className="text-center mb-8"><h3 className="text-2xl font-bold">Built for Every Indian Business</h3></div>
                <MarqueeRow text={businessItems} className="text-2xl md:text-3xl font-black text-blue-300/30" />
            </div>

            {/* TESTIMONIALS */}
            <div className="py-24 bg-[#0F172A]">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-black text-center mb-16">Loved by local businesses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 relative">
                            <div className="flex gap-1 text-amber-500 mb-4"><Star className="fill-current"/><Star className="fill-current"/><Star className="fill-current"/><Star className="fill-current"/><Star className="fill-current"/></div>
                            <p className="text-gray-300 mb-6 italic leading-relaxed font-medium text-lg">"HireGuru ne mera sab kuch badal diya. Pehle galat log hire karta tha. Ab AI sab kuch handle karta hai."</p>
                            <div className="font-bold">— Ramesh Sharma</div>
                            <div className="text-gray-500 text-sm">Salon Owner, Indore</div>
                        </div>
                        <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 relative">
                            <div className="flex gap-1 text-amber-500 mb-4"><Star className="fill-current"/><Star className="fill-current"/><Star className="fill-current"/><Star className="fill-current"/><Star className="fill-current"/></div>
                            <p className="text-gray-300 mb-6 italic leading-relaxed font-medium text-lg">"Mere coaching institute ke liye teachers select karna bahut aasaan ho gaya. Body language analysis amazing hai!"</p>
                            <div className="font-bold">— Priya Agarwal</div>
                            <div className="text-gray-500 text-sm">Coaching Institute, Jaipur</div>
                        </div>
                        <div className="bg-gray-900 p-8 rounded-3xl border border-gray-800 relative">
                            <div className="flex gap-1 text-amber-500 mb-4"><Star className="fill-current"/><Star className="fill-current"/><Star className="fill-current"/><Star className="fill-current"/><Star className="fill-current"/></div>
                            <p className="text-gray-300 mb-6 italic leading-relaxed font-medium text-lg">"Restaurant staff dhundhna nightmare tha. Ab HireGuru AI sab kar leta hai. Maine 3 best staff hire kiye pichle month."</p>
                            <div className="font-bold">— Mohammed Ismail</div>
                            <div className="text-gray-500 text-sm">Restaurant, Surat</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRICING */}
            <div id="pricing" className="py-24 bg-gray-900 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black mb-4">Simple, Honest Pricing</h2>
                        <p className="text-xl text-gray-400">Scale your team without scaling costs.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="bg-[#0F172A] border border-gray-800 p-8 rounded-3xl">
                            <h3 className="text-xl font-bold text-gray-400 mb-2">FREE FOREVER</h3>
                            <div className="text-5xl font-black mb-6">₹0<span className="text-lg text-gray-500 font-medium">/mo</span></div>
                            <ul className="space-y-4 mb-8 text-gray-300">
                                <li className="flex gap-2"><CheckCircle2 className="text-green-500 shrink-0"/> 1 active job role</li>
                                <li className="flex gap-2"><CheckCircle2 className="text-green-500 shrink-0"/> 5 AI interviews/month</li>
                                <li className="flex gap-2"><CheckCircle2 className="text-green-500 shrink-0"/> Basic scoring</li>
                                <li className="flex gap-2"><CheckCircle2 className="text-green-500 shrink-0"/> Team Blueprint (1)</li>
                                <li className="flex gap-2"><CheckCircle2 className="text-green-500 shrink-0"/> Hindi + English</li>
                            </ul>
                            <Link to="/auth" className="block w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white text-center rounded-xl font-bold transition">Start Free →</Link>
                        </div>
                        <div className="bg-gradient-to-b from-blue-900 to-[#0F172A] border-2 border-blue-500 p-8 rounded-3xl relative transform md:-translate-y-4 shadow-2xl">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black px-4 py-1 rounded-full text-sm font-bold shadow-lg">MOST POPULAR</div>
                            <h3 className="text-xl font-bold text-blue-200 mb-2">GROWTH</h3>
                            <div className="text-5xl font-black mb-6">₹499<span className="text-lg text-blue-300/50 font-medium">/mo</span></div>
                            <ul className="space-y-4 mb-8 text-white">
                                <li className="flex gap-2"><CheckCircle2 className="text-amber-500 shrink-0"/> 10 active job roles</li>
                                <li className="flex gap-2"><CheckCircle2 className="text-amber-500 shrink-0"/> 50 AI interviews/month</li>
                                <li className="flex gap-2"><CheckCircle2 className="text-amber-500 shrink-0"/> Body language analysis</li>
                                <li className="flex gap-2"><CheckCircle2 className="text-amber-500 shrink-0"/> Certificate verification</li>
                                <li className="flex gap-2"><CheckCircle2 className="text-amber-500 shrink-0"/> Confidence timeline</li>
                            </ul>
                            <Link to="/auth" className="block w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-black text-center rounded-xl font-black shadow-lg transition">Start 14-day Free Trial →</Link>
                        </div>
                        <div className="bg-[#0F172A] border border-gray-800 p-8 rounded-3xl">
                            <h3 className="text-xl font-bold text-gray-400 mb-2">PRO</h3>
                            <div className="text-5xl font-black mb-6">₹1,499<span className="text-lg text-gray-500 font-medium">/mo</span></div>
                            <ul className="space-y-4 mb-8 text-gray-300">
                                <li className="flex gap-2"><CheckCircle2 className="text-green-500 shrink-0"/> Unlimited roles</li>
                                <li className="flex gap-2"><CheckCircle2 className="text-green-500 shrink-0"/> Unlimited interviews</li>
                                <li className="flex gap-2"><CheckCircle2 className="text-green-500 shrink-0"/> Roleplay scenarios</li>
                                <li className="flex gap-2"><CheckCircle2 className="text-green-500 shrink-0"/> 10 Languages</li>
                                <li className="flex gap-2"><CheckCircle2 className="text-green-500 shrink-0"/> Custom branding</li>
                            </ul>
                            <button className="block w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white text-center rounded-xl font-bold transition">Contact Us →</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* WATCH DEMO MODAL */}
            {isVideoModalOpen && (
                <div className="fixed inset-0 bg-[#0F172A]/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4 min-h-screen z-50">
                    <div className="bg-gray-900 w-full max-w-4xl rounded-3xl relative overflow-hidden ring-1 ring-gray-700 shadow-2xl flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-black/40">
                            <div className="flex gap-2">
                                <button onClick={() => setDemoTab('owner')} className={`px-4 py-2 rounded-lg font-bold transition-colors ${demoTab === 'owner' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:bg-gray-800'}`}>🏢 Business Owner Demo</button>
                                <button onClick={() => setDemoTab('seeker')} className={`px-4 py-2 rounded-lg font-bold transition-colors ${demoTab === 'seeker' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}>👤 Job Seeker Demo</button>
                            </div>
                            <button 
                                onClick={() => setIsVideoModalOpen(false)} 
                                className="w-10 h-10 bg-gray-800 text-gray-400 rounded-full flex items-center justify-center hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="w-full aspect-video flex flex-col items-center justify-center relative bg-black">
                            {((demoTab === 'owner' && ownerUrl) || (demoTab === 'seeker' && seekerUrl)) ? (
                                <iframe 
                                    src={demoTab === 'owner' ? ownerUrl : seekerUrl} 
                                    className="w-full h-full absolute inset-0 border-none"
                                    allowFullScreen
                                    title="Demo Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                />
                            ) : (
                                <div className="text-center p-8 bg-gray-900 rounded-2xl border border-gray-800 max-w-lg w-full relative z-10">
                                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
                                        <Play size={40} className="ml-2" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Demo coming soon!</h3>
                                    <p className="text-gray-400 mb-8">We're finalizing our awesome demo video.</p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 border-b border-gray-800 pb-8">
                                        <Link to="/auth" onClick={()=>localStorage.setItem('temp_role', 'owner')} className="bg-blue-900/50 hover:bg-blue-600 text-blue-200 px-6 py-3 rounded-xl font-bold transition whitespace-nowrap">Try as Owner →</Link>
                                        <Link to="/auth" onClick={()=>localStorage.setItem('temp_role', 'seeker')} className="bg-amber-500/20 hover:bg-amber-500 text-amber-500 hover:text-black px-6 py-3 rounded-xl font-bold transition whitespace-nowrap">Try as Seeker →</Link>
                                    </div>

                                    <div className="text-left pt-2">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">── Admin: Add YouTube URL ──</p>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                placeholder="https://www.youtube.com/embed/..." 
                                                className="flex-1 bg-black text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 border border-gray-800"
                                                value={tempUrl}
                                                onChange={(e) => setTempUrl(e.target.value)}
                                            />
                                            <button onClick={saveUrl} className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-bold transition">Save</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="bg-black py-16 border-t border-gray-900">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-gray-400">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mb-4">
                            <span className="text-amber-500">HireGuru</span> AI
                        </h2>
                        <p className="mb-4">India's Smartest AI Hiring Platform.</p>
                        <p className="font-bold text-gray-500">🇮🇳 Proudly Made in India</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Product</h4>
                        <ul className="space-y-3">
                            <li><a href="#features" className="hover:text-amber-500 transition">Features</a></li>
                            <li><a href="#pricing" className="hover:text-amber-500 transition">Pricing</a></li>
                            <li><button onClick={()=>setIsVideoModalOpen(true)} className="hover:text-amber-500 transition">Watch Demo</button></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider">For Users</h4>
                        <ul className="space-y-3">
                            <li><Link to="/auth" className="hover:text-amber-500 transition">For Business Owners</Link></li>
                            <li><Link to="/auth" className="hover:text-amber-500 transition">For Job Seekers</Link></li>
                            <li><a href="#how-it-works" className="hover:text-amber-500 transition">How It Works</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Support</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="hover:text-amber-500 transition">Contact Us</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition">Terms of Service</a></li>
                            <li><a href="#" className="hover:green-500 text-green-600 font-bold transition">WhatsApp Support</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-900 text-center text-xs text-gray-600">
                    © 2025 HireGuru AI. Powered by Google Gemini AI.
                </div>
            </footer>
        </div>
    );
}
