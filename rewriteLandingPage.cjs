const fs = require('fs');

const content = `import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, CheckCircle2, Star, Menu, ChevronDown, Mic, Activity } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const MarqueeRow = ({ text, reverse = false, className = '' }: any) => {
    return (
        <div className={\`overflow-hidden whitespace-nowrap flex \${className}\`}>
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
    const { lang, toggleLang } = useLanguage();
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

    const heroSub = "India's #1 AI-powered hiring platform. Let AI interview candidates, score them, and build your dream team — while you focus on growing your business.";
    
    // Feature data
    const features = [
       { title: 'AI Conversational Onboarding', icon: '🤖', desc: 'Tell Aria what you need. She builds your entire hiring blueprint in minutes.' },
       { title: 'Voice + Chat AI Interview', icon: '🎙️', desc: 'MAX conducts full interviews — voice or text — 24/7, in Hindi or English.' },
       { title: 'Smart Team Blueprint', icon: '🧠', desc: 'AI maps your perfect team structure based on your business, budget, and goals.' },
       { title: 'AI Candidate Scoring', icon: '📊', desc: 'Every candidate scored on: Communication, Confidence, Knowledge, Culture Fit, Honesty, and Role Suitability.' },
       { title: 'Real-Time Notifications', icon: '🔔', desc: 'Candidates get hired with one click. Auto-notify via Email + WhatsApp + SMS.' },
       { title: 'WhatsApp-First Support', icon: '💬', desc: 'Get hiring support on WhatsApp — the platform your team already uses.' },
       { title: 'Bias-Free Hiring', icon: '🛡️', desc: 'AI evaluates skills only. No gender, age, or background bias. Fair for all.' },
       { title: '100% Mobile Ready', icon: '📱', desc: 'Run your entire hiring process from your phone — no laptop needed.' }
    ];

    const businessItems = "💇 Salon • 🏋️ Gym • 📚 Coaching • 🍽️ Restaurant • 🏥 Clinic • 👗 Boutique • 🎓 School • ☕ Café • 🏠 Real Estate • 🚗 Logistics • 💊 Pharmacy • 📸 Studio • 🏨 Hotel • 🔧 Repair Shop • 🧹 Cleaning • ".repeat(3);

    return (
        <div className="min-h-screen bg-[#0F172A] text-white font-sans overflow-x-hidden selection:bg-[#4F46E5]/30 selection:text-white">
            {/* ANNOUNCEMENT BAR */}
            <div className="bg-[#4F46E5] text-white text-xs font-bold py-2 text-center relative z-50 shadow-md">
                🎉 New: Voice AI Interviews now available in Hindi!
            </div>

            {/* NAVBAR */}
            <nav className={\`fixed w-full z-40 transition-all duration-300 \${scrolled ? 'bg-[#0F172A]/80 backdrop-blur-md border-b border-gray-800' : 'bg-transparent'} top-8\`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 font-['Inter']">
                                HireIQ 🇮🇳
                            </h1>
                        </div>
                        
                        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                            <a href="#features" className="hover:text-amber-500 transition-colors">Features</a>
                            <a href="#pricing" className="hover:text-amber-500 transition-colors">Pricing</a>
                            <button onClick={()=>setIsVideoModalOpen(true)} className="hover:text-amber-500 transition-colors">Demo</button>
                            <Link to="/auth" onClick={()=>localStorage.setItem('temp_role', 'owner')} className="hover:text-amber-500 transition-colors">For Business</Link>
                            <Link to="/auth" onClick={()=>localStorage.setItem('temp_role', 'seeker')} className="hover:text-amber-500 transition-colors">For Job Seekers</Link>
                            <a href="#how-it-works" className="hover:text-amber-500 transition-colors">How It Works</a>
                            <a href="#support" className="hover:text-amber-500 transition-colors">Support</a>
                            <button onClick={toggleLang} className="bg-white/10 px-3 py-1 rounded-full hover:bg-white/20">
                                {isHindi ? 'English' : 'हिंदी'}
                            </button>
                        </div>
                        
                        <div className="hidden md:flex items-center gap-4">
                            <Link to="/auth" className="text-white hover:text-gray-300 font-medium text-sm">Login</Link>
                            <Link to="/auth" className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-5 py-2.5 rounded-lg font-bold hover:shadow-lg hover:opacity-90 transition-all">
                                Get Started Free 🚀
                            </Link>
                        </div>

                        <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <Menu size={28} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <div className="relative pt-40 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center min-h-[90vh]">
                <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#4F46E5]/30 via-[#0F172A] to-[#0F172A]"></div>
                
                {/* Particles */}
                <div className="absolute inset-0 z-0 opacity-30">
                    {[...Array(30)].map((_, i) => (
                        <div key={i} className="absolute rounded-full bg-[#4F46E5] animate-pulse" style={{
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#4F46E5]/20 border border-[#4F46E5]/30 text-blue-200 font-medium text-sm mb-8">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                            ⚡ Powered by Gemini AI
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
                            Hire Smarter.<br/>
                            Build Teams Faster.<br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-[#F59E0B]">Proudly Made in India. 🇮🇳</span>
                        </h1>

                        <p className="text-lg lg:text-xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                            {heroSub}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                            <Link to="/auth" onClick={()=>localStorage.setItem('temp_role', 'owner')} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:scale-105 transition-all text-lg flex items-center justify-center gap-2">
                                🏢 I'm a Business Owner
                            </Link>
                            <Link to="/auth" onClick={()=>localStorage.setItem('temp_role', 'seeker')} className="w-full sm:w-auto px-8 py-4 bg-white text-[#0F172A] font-bold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all text-lg flex items-center justify-center gap-2 shadow-lg">
                                👤 I'm a Job Seeker
                            </Link>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-gray-400 bg-gray-900/50 p-4 rounded-xl border border-gray-800/50">
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-400"/> 🔒 100% Secure</span>
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-400"/> 🤖 AI-Powered</span>
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-400"/> 🇮🇳 Made in India</span>
                            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-green-400"/> ⚡ Setup in 5 mins</span>
                        </div>
                    </div>

                    <div className="flex-1 w-full max-w-lg lg:max-w-none relative animate-float">
                        <div className="relative bg-[#1E293B] border border-gray-700/50 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden aspect-[4/3] p-1">
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10 pointer-events-none"></div>
                            
                            <div className="absolute top-4 right-4 z-20">
                                <div className="bg-[#4F46E5]/20 border border-[#4F46E5]/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-300 flex items-center gap-2 shadow-lg">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                    LIVE INTERVIEW
                                </div>
                            </div>
                            
                            <div className="w-full h-full rounded-2xl bg-gray-900 relative overflow-hidden flex flex-col p-6">
                                {/* Simulated AI Interview Mockup */}
                                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                     <div className="relative">
                                         <div className="absolute inset-0 bg-[#4F46E5]/20 rounded-full blur-2xl animate-pulse scale-150"></div>
                                         <div className="w-24 h-24 bg-[#4F46E5] rounded-full flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(79,70,229,0.6)] border-4 border-[#1E293B] relative z-10">
                                             👨🏻‍💼
                                         </div>
                                     </div>
                                </div>
                                
                                <div className="mt-auto relative z-20 space-y-4">
                                    <div className="bg-[#1E293B]/80 border border-gray-700 backdrop-blur-md p-4 rounded-2xl max-w-[85%] rounded-tl-sm shadow-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">MAX (AI Interviewer)</span>
                                        </div>
                                        <p className="text-white text-sm leading-relaxed">Tell me about a difficult customer you handled and how you resolved the situation?</p>
                                    </div>
                                    
                                    <div className="bg-[#4F46E5]/20 border border-[#4F46E5]/30 backdrop-blur-md p-4 rounded-2xl max-w-[85%] ml-auto rounded-tr-sm text-right shadow-lg">
                                        <div className="flex items-center gap-2 justify-end mb-2">
                                            <span className="text-xs font-bold text-[#A5B4FC] uppercase tracking-wider flex items-center gap-1"><Mic size={12} className="animate-pulse" /> Listening</span>
                                        </div>
                                        <p className="text-white text-sm leading-relaxed">Ek baar customer bahut naraaz tha, maine shanti se unki baat suni aur alternative options diye...</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Floating Stats Badges */}
                            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="absolute bottom-6 -left-6 z-30 bg-white text-gray-900 p-3 rounded-xl shadow-xl flex items-center gap-3 border border-gray-200">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-black">94</div>
                                <div>
                                    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">Overall Score</div>
                                    <div className="font-bold text-sm">Highly Recommended</div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SOCIAL PROOF BAR */}
            <div className="bg-[#0F172A] border-y border-gray-800">
                <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-sm font-bold text-gray-500 uppercase tracking-widest text-center md:text-left">Trusted By 3,200+ Businesses</div>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all">
                        {/* Placeholder Logos */}
                        <div className="text-xl font-black font-serif italic text-white flex gap-2 items-center"><Activity/> Economic Times</div>
                        <div className="text-xl font-black text-white flex gap-2 items-center"><Star/> YourStory</div>
                        <div className="text-xl font-bold tracking-tighter text-white">Inc42</div>
                    </div>
                </div>
            </div>

            {/* FEATURES GRID */}
            <div id="features" className="py-24 bg-[#0F172A] relative">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">Why 3,200+ Businesses Choose HireIQ</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Everything you need to hire faster and smarter.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="bg-[#1E293B] border border-gray-700/50 p-6 rounded-2xl hover:border-[#4F46E5] hover:shadow-[0_10px_30px_rgba(79,70,229,0.1)] transition-all group">
                                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-inner">{f.icon}</div>
                                <h4 className="text-lg font-bold mb-2 text-white">{f.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* HOW IT WORKS */}
            <div id="how-it-works" className="py-24 bg-[#1E293B] relative border-y border-gray-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">How HireIQ Works</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                        {/* BUSINESS FLOW */}
                        <div className="bg-[#0F172A] border border-gray-800 p-8 rounded-3xl relative overflow-hidden group hover:border-[#4F46E5]/50 transition-colors">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4F46E5]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                            <h3 className="text-2xl font-bold text-white mb-8 border-b border-gray-800 pb-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[#4F46E5]/20 text-[#A5B4FC] flex items-center justify-center shrink-0">🏢</div>
                                For Business Owners
                            </h3>
                            <div className="space-y-8 relative z-10">
                                {[
                                    { step: 1, title: 'Chat with Aria (2 mins)', desc: 'Our AI assistant Aria asks smart questions and builds your complete Team Blueprint.' },
                                    { step: 2, title: 'AI Interviews Candidates', desc: 'MAX automatically interviews candidates 24/7, scores them, and ranks them for you.' },
                                    { step: 3, title: 'Review & Hire (1 Click)', desc: 'See ranked candidates, read AI reports, hit "Hire" — candidate gets notified instantly.' },
                                ].map(s => (
                                    <div key={s.step} className="flex gap-5">
                                        <div className="w-10 h-10 bg-gray-800 border-2 border-gray-700 text-white flex items-center justify-center rounded-full shrink-0 font-bold shadow-md">
                                            {s.step}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold mb-1">{s.title}</h4>
                                            <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SEEKER FLOW */}
                        <div className="bg-[#0F172A] border border-gray-800 p-8 rounded-3xl relative overflow-hidden group hover:border-amber-500/50 transition-colors">
                            <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/3"></div>
                            <h3 className="text-2xl font-bold text-white mb-8 border-b border-gray-800 pb-4 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">👤</div>
                                For Job Seekers
                            </h3>
                            <div className="space-y-8 relative z-10">
                                {[
                                    { step: 1, title: 'Create Free Profile (5 mins)', desc: 'Upload your CV and let our AI instantly parse your details.' },
                                    { step: 2, title: 'Complete AI Interview', desc: 'Chat with MAX on your phone for 15 minutes. No pass or fail, just placement.' },
                                    { step: 3, title: 'Get Matched & Hired', desc: 'Employers see your scores. We notify you the moment an employer wants to hire you.' },
                                ].map(s => (
                                    <div key={s.step} className="flex gap-5">
                                        <div className="w-10 h-10 bg-gray-800 border-2 border-gray-700 text-white flex items-center justify-center rounded-full shrink-0 font-bold shadow-md">
                                            {s.step}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold mb-1">{s.title}</h4>
                                            <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 text-center pt-8 border-t border-gray-800">
                                <Link to="/auth" onClick={()=>localStorage.setItem('temp_role', 'seeker')} className="inline-block w-full sm:w-auto bg-amber-500 text-black px-8 py-3 rounded-xl font-bold hover:bg-amber-400 transition-all shadow-lg">Find Jobs Near Me →</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MARQUEE */}
            <div className="py-12 overflow-hidden bg-[#0F172A]">
                <MarqueeRow text={businessItems} className="text-3xl font-black text-gray-800" />
            </div>

            {/* TESTIMONIALS */}
            <div className="py-24 bg-[#1E293B] border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-16">Loved by Indian Businesses</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Testimonial 1 */}
                        <div className="bg-[#0F172A] p-8 rounded-3xl border border-gray-700/50 shadow-xl relative mt-4">
                            <div className="absolute -top-6 left-8 bg-blue-100 p-2 rounded-xl text-3xl shadow-sm">👨🏽‍💼</div>
                            <div className="flex gap-1 text-amber-500 mb-6 mt-2"><Star size={16} className="fill-current"/><Star size={16} className="fill-current"/><Star size={16} className="fill-current"/><Star size={16} className="fill-current"/><Star size={16} className="fill-current"/></div>
                            <p className="text-gray-300 mb-6 italic leading-relaxed text-sm">"HireIQ hired 6 waiters and 2 managers for my new outlet. Took 3 days. Normally would take 3 weeks."</p>
                            <div className="font-bold text-white">— Ramesh Sharma</div>
                            <div className="text-gray-500 text-xs mt-1">Restaurant Owner, Pune</div>
                        </div>
                        {/* Testimonial 2 */}
                        <div className="bg-[#0F172A] p-8 rounded-3xl border border-gray-700/50 shadow-xl relative mt-4 md:-mt-4">
                            <div className="absolute -top-6 left-8 bg-purple-100 p-2 rounded-xl text-3xl shadow-sm">👩🏽‍💼</div>
                            <div className="flex gap-1 text-amber-500 mb-6 mt-2"><Star size={16} className="fill-current"/><Star size={16} className="fill-current"/><Star size={16} className="fill-current"/><Star size={16} className="fill-current"/><Star size={16} className="fill-current"/></div>
                            <p className="text-gray-300 mb-6 italic leading-relaxed text-sm">"The AI interview scores are surprisingly accurate. We shortlisted 5 from 80 applicants in an hour."</p>
                            <div className="font-bold text-white">— Priya Nair</div>
                            <div className="text-gray-500 text-xs mt-1">HR Manager, Kochi IT Firm</div>
                        </div>
                        {/* Testimonial 3 */}
                        <div className="bg-[#0F172A] p-8 rounded-3xl border border-gray-700/50 shadow-xl relative mt-4">
                            <div className="absolute -top-6 left-8 bg-green-100 p-2 rounded-xl text-3xl shadow-sm">👨🏻‍💻</div>
                            <div className="flex gap-1 text-amber-500 mb-6 mt-2"><Star size={16} className="fill-current"/><Star size={16} className="fill-current"/><Star size={16} className="fill-current"/><Star size={16} className="fill-current"/><Star size={16} className="fill-current"/></div>
                            <p className="text-gray-300 mb-6 italic leading-relaxed text-sm">"The Team Blueprint feature helped me understand what roles I actually needed. Saved me from a bad hire."</p>
                            <div className="font-bold text-white">— Arjun Mehta</div>
                            <div className="text-gray-500 text-xs mt-1">Startup Founder, Bangalore</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PRICING SECTION */}
            <div id="pricing" className="py-24 bg-[#0F172A] border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-xl text-gray-400">Scale your team without scaling costs.</p>
                        
                        <div className="inline-flex items-center gap-2 bg-gray-800 p-1 rounded-full mt-8 border border-gray-700">
                            <button className="px-6 py-2 bg-[#4F46E5] text-white rounded-full font-medium text-sm shadow-sm">Monthly</button>
                            <button className="px-6 py-2 text-gray-400 hover:text-white rounded-full font-medium text-sm transition-colors flex items-center gap-2">
                                Annual <span className="bg-green-500/20 text-green-400 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-green-500/30">20% OFF</span>
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-[#1E293B] border border-gray-700 p-8 rounded-3xl flex flex-col hover:border-gray-500 transition-colors">
                            <h3 className="text-xl font-bold text-gray-400 mb-1">FREE</h3>
                            <div className="text-sm font-medium text-gray-500 mb-6">For Job Seekers (Always Free)</div>
                            <div className="text-5xl font-black mb-8 text-white">₹0<span className="text-lg text-gray-500 font-medium">/mo</span></div>
                            <ul className="space-y-4 mb-10 text-gray-300 flex-1">
                                <li className="flex gap-3"><CheckCircle2 className="text-gray-400 shrink-0 w-5 h-5"/> Complete AI Profile</li>
                                <li className="flex gap-3"><CheckCircle2 className="text-gray-400 shrink-0 w-5 h-5"/> 1 AI Interview / month</li>
                                <li className="flex gap-3"><CheckCircle2 className="text-gray-400 shrink-0 w-5 h-5"/> Job Match Feed</li>
                                <li className="flex gap-3"><CheckCircle2 className="text-gray-400 shrink-0 w-5 h-5"/> Hire Notifications</li>
                            </ul>
                            <Link to="/auth" onClick={()=>localStorage.setItem('temp_role', 'seeker')} className="block w-full py-4 bg-gray-800 hover:bg-gray-700 text-white text-center rounded-xl font-bold transition">Sign Up Free</Link>
                        </div>
                        
                        <div className="bg-gradient-to-b from-[#1e1b4b] to-[#1E293B] border-2 border-[#4F46E5] p-8 rounded-3xl relative transform md:-translate-y-4 shadow-[0_20px_50px_rgba(79,70,229,0.15)] flex flex-col">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-[#F59E0B] text-[#0F172A] px-4 py-1.5 rounded-full text-xs font-black shadow-lg uppercase tracking-wider">MOST POPULAR</div>
                            <h3 className="text-xl font-bold text-white mb-1">STARTER</h3>
                            <div className="text-sm font-medium text-[#A5B4FC] mb-6">For Small Businesses</div>
                            <div className="text-5xl font-black mb-8 text-white">₹999<span className="text-lg text-gray-400 font-medium whitespace-nowrap line-through ml-2">₹1,250</span></div>
                            <ul className="space-y-4 mb-10 text-gray-200 flex-1">
                                <li className="flex gap-3"><CheckCircle2 className="text-amber-500 shrink-0 w-5 h-5"/> 5 Job Postings</li>
                                <li className="flex gap-3"><CheckCircle2 className="text-amber-500 shrink-0 w-5 h-5"/> AI Team Blueprint</li>
                                <li className="flex gap-3"><CheckCircle2 className="text-amber-500 shrink-0 w-5 h-5"/> 50 AI Interviews / month</li>
                                <li className="flex gap-3"><CheckCircle2 className="text-amber-500 shrink-0 w-5 h-5"/> Basic Analytics</li>
                                <li className="flex gap-3"><CheckCircle2 className="text-amber-500 shrink-0 w-5 h-5"/> Email + WhatsApp Alerts</li>
                            </ul>
                            <Link to="/auth" onClick={()=>localStorage.setItem('temp_role', 'owner')} className="block w-full py-4 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] hover:opacity-90 text-white text-center rounded-xl font-bold transition shadow-lg">Start Free Trial →</Link>
                        </div>
                        
                        <div className="bg-[#1E293B] border border-gray-700 p-8 rounded-3xl flex flex-col hover:border-gray-500 transition-colors">
                            <h3 className="text-xl font-bold text-gray-400 mb-1">PRO</h3>
                            <div className="text-sm font-medium text-gray-500 mb-6">For Growing Businesses</div>
                            <div className="text-5xl font-black mb-8 text-white">₹2,999<span className="text-lg text-gray-500 font-medium">/mo</span></div>
                            <ul className="space-y-4 mb-10 text-gray-300 flex-1">
                                <li className="flex gap-3"><CheckCircle2 className="text-gray-400 shrink-0 w-5 h-5"/> Unlimited Job Postings</li>
                                <li className="flex gap-3"><CheckCircle2 className="text-gray-400 shrink-0 w-5 h-5"/> Unlimited AI Interviews</li>
                                <li className="flex gap-3"><CheckCircle2 className="text-gray-400 shrink-0 w-5 h-5"/> Custom Questions</li>
                                <li className="flex gap-3"><CheckCircle2 className="text-gray-400 shrink-0 w-5 h-5"/> Advanced Analytics</li>
                                <li className="flex gap-3"><CheckCircle2 className="text-gray-400 shrink-0 w-5 h-5"/> PDF Report Downloads</li>
                            </ul>
                            <button className="block w-full py-4 bg-gray-800 hover:bg-gray-700 text-white text-center rounded-xl font-bold transition">Get Pro</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA SECTION */}
            <div className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] py-20 border-y border-blue-900/50">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to transform your hiring?</h2>
                    <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">Join thousands of Indian businesses hiring the right people, faster.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/auth" className="bg-white text-[#0F172A] px-8 py-4 rounded-xl font-bold shadow-xl hover:scale-105 transition-all text-lg">
                            Get Started Free
                        </Link>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="bg-[#0F172A] py-16 pt-20">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-gray-400">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2 mb-4 font-['Inter']">
                            HireIQ 🇮🇳
                        </h2>
                        <p className="mb-4 leading-relaxed">India's Smartest AI Hiring Platform.</p>
                        <p className="font-bold text-gray-500 mb-6">Powered by Google Gemini 🤖</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Product</h4>
                        <ul className="space-y-4">
                            <li><a href="#features" className="hover:text-amber-500 transition">Features</a></li>
                            <li><a href="#pricing" className="hover:text-amber-500 transition">Pricing</a></li>
                            <li><a href="#how-it-works" className="hover:text-amber-500 transition">How it Works</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition">API Docs</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">For Users</h4>
                        <ul className="space-y-4">
                            <li><Link to="/auth" className="hover:text-amber-500 transition">For Business Owners</Link></li>
                            <li><Link to="/auth" className="hover:text-amber-500 transition">For Job Seekers</Link></li>
                            <li><Link to="/auth" className="hover:text-amber-500 transition">Enterprise Solutions</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Support</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-amber-500 transition">Contact Us</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-amber-500 transition">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-green-400 text-green-500 font-bold transition flex items-center gap-2"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg> WhatsApp Support</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-900 text-center text-xs text-gray-600">
                    © 2025 HireIQ India. All Rights Reserved.
                </div>
            </footer>
        </div>
    );
}
`;

fs.writeFileSync('src/pages/LandingPage.tsx', content);
console.log("Updated LandingPage.tsx");
