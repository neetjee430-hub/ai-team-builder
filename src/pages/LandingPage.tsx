import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../context/LanguageContext';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Network, UserSquare2, BrainCircuit, Mic, Camera, FileCheck2, Fingerprint, Star, Play, X } from 'lucide-react';

const LandingPage = () => {
  const { t, i18n } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-amber-200 selection:text-amber-900 overflow-hidden">
      {/* Navbar */}
      <header className="flex justify-between items-center p-6 lg:px-12 border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-900 text-white p-1.5 rounded-lg">
            <BrainCircuit size={24} />
          </div>
          <h1 className="text-2xl font-bold text-blue-900 tracking-tight">HireGuru <span className="text-amber-500">AI</span></h1>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-gray-600 hover:text-blue-900 font-medium">Features</a>
          <a href="#how-it-works" className="text-gray-600 hover:text-blue-900 font-medium">How It Works</a>
          <a href="#pricing" className="text-gray-600 hover:text-blue-900 font-medium">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleLanguage} className="hidden sm:block text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-full transition-colors">
             EN / हिंदी
          </button>
          
          <div className="relative group">
            <Link to="/auth" className="inline-block bg-blue-900 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-800 transition-colors shadow-md text-center">
              {t('get_started')}
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative pt-20 pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10 max-w-5xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl lg:text-7xl font-extrabold mb-6 text-blue-950 tracking-tight leading-tight"
          >
             {language === 'en' ? "Your Business. Fully Staffed. " : "आपका बिज़नेस। पूरी टीम। "}
             <br className="hidden lg:block"/>
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-amber-500">
               {language === 'en' ? "Zero HR Knowledge Needed." : "बिना HR के।"}
             </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl lg:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto"
          >
            Tell us your business. Our AI builds your perfect team, interviews candidates, 
            reads their body language, and tells you exactly who to hire — in Hindi or English.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
              <Link to="/auth" className="bg-amber-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-600 transition-colors shadow-lg hover:shadow-amber-500/30 flex items-center justify-center">
                {t('get_started')}
              </Link>
              <button onClick={() => setIsVideoModalOpen(true)} className="bg-white border-2 border-gray-200 text-blue-900 px-8 py-4 rounded-xl font-bold text-lg hover:border-blue-900 hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2">
                <Play size={20} /> {t('watch_demo')}
              </button>
          </motion.div>
        </div>

        {/* Floating background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl pointer-events-none opacity-20 z-0">
           <div className="absolute top-[20%] left-[10%] bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 rotate-[-5deg]">
             <span className="text-2xl">💇‍♀️</span> <span className="font-bold text-gray-800">Salon ✓</span>
           </div>
           <div className="absolute top-[30%] right-[10%] bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 rotate-[5deg]">
             <span className="text-2xl">🏋️‍♂️</span> <span className="font-bold text-gray-800">Gym ✓</span>
           </div>
           <div className="absolute bottom-[20%] left-[15%] bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 rotate-[8deg]">
             <span className="text-2xl">👨‍🏫</span> <span className="font-bold text-gray-800">Coaching ✓</span>
           </div>
           <div className="absolute bottom-[25%] right-[15%] bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3 rotate-[-8deg]">
             <span className="text-2xl">🍳</span> <span className="font-bold text-gray-800">Restaurant ✓</span>
           </div>
        </div>
      </main>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-blue-950 mb-4">How It Works</h3>
            <p className="text-gray-500 text-lg">Just 4 simple steps to build your dream team.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {[
              { icon: <Building2 className="w-8 h-8"/>, title: "Step 1", desc: "Tell us your business" },
              { icon: <Network className="w-8 h-8"/>, title: "Step 2", desc: "AI builds your team blueprint" },
              { icon: <UserSquare2 className="w-8 h-8"/>, title: "Step 3", desc: "Candidate walks in or applies" },
              { icon: <BrainCircuit className="w-8 h-8"/>, title: "Step 4", desc: "AI interviews + scores them" },
              { icon: <Star className="w-8 h-8 text-amber-500 fill-amber-500"/>, title: "Step 5: Handpick Your Dream Team!", desc: "AI filters the noise and ranks the best. You make the final call securely." },
            ].map((step, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-2xl text-center hover:shadow-md transition-shadow">
                <div className="bg-blue-100 text-blue-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  {step.icon}
                </div>
                <h4 className="font-bold text-xl mb-2 text-gray-900">{step.title}</h4>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-blue-950 mb-4">Complete Hiring Suite</h3>
            <p className="text-gray-500 text-lg">Everything you need, built to be incredibly simple.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Network/>, title: "Team Blueprint AI", desc: "We tell you exactly who to hire and what to pay." },
              { icon: <Mic/>, title: "AI Voice Interviewer", desc: "Candidates speak to our AI in Hindi or English." },
              { icon: <Camera/>, title: "Body Language Analyser", desc: "Camera reads confidence, eye contact, and posture." },
              { icon: <FileCheck2/>, title: "Certificate Verifier", desc: "Upload documents — AI checks and scores them." },
              { icon: <Fingerprint/>, title: "Candidate Scorecard", desc: "Every candidate gets a score out of 100 with full breakdown." },
              { icon: <Star/>, title: "Hire Recommendation", desc: "AI tells you: Hire / Don't Hire / Maybe — with reasons." },
            ].map((feature, idx) => (
               <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-start hover:shadow-lg transition-all hover:-translate-y-1">
                 <div className="p-3 bg-amber-50 text-amber-600 rounded-xl mb-4">
                   {feature.icon}
                 </div>
                 <h4 className="font-bold text-xl mb-3 text-gray-900">{feature.title}</h4>
                 <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
               </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-blue-200 py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">HireGuru AI</h2>
          <p className="mb-6">Made in India 🇮🇳 for Indian Businesses</p>
          <div className="flex justify-center gap-6 text-sm">
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
           <div className="bg-black w-full max-w-4xl aspect-video rounded-2xl relative overflow-hidden ring-4 ring-gray-800 shadow-2xl">
              <button 
                onClick={() => setIsVideoModalOpen(false)} 
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                 <Play size={48} className="mb-4 opacity-50" />
                 <p className="text-xl font-bold">Demo Video</p>
                 <p className="text-sm">Video integration placeholder</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
