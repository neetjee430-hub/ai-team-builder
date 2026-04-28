import React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import { CategorySelector } from '../components/CategorySelector';
import { Building2, User } from 'lucide-react';
import { topCities } from '../data/constants';
import { SearchableSelect } from '../components/SearchableSelect';

const AuthPage = () => {
  const { language } = useLanguage();
  const [role, setRole] = useState<'owner' | 'seeker'>('owner');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  const [city, setCity] = useState('');
  const [seekerCity, setSeekerCity] = useState('');
  const [userName, setUserName] = useState('');
  
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'owner' && !otpVerified) {
      alert("Please verify your mobile number with OTP first.");
      return;
    }
    if (userName) {
      localStorage.setItem('userName', userName);
    }
    if (role === 'owner') navigate('/onboarding');
    else navigate('/seeker/dashboard');
  };

  return (
    <div className="min-h-screen flex text-gray-900 bg-gray-50 flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-2/5 xl:w-1/3 bg-blue-950 text-white p-12 flex-col justify-between sticky top-0 h-screen">
        <div>
          <h1 className="text-4xl font-bold mb-4">HireGuru AI</h1>
          <p className="text-xl text-blue-200">
            {role === 'owner' 
              ? 'Join thousands of small business owners hiring smarter.' 
              : 'Find the perfect job near you. Fast, simple, and AI-powered.'}
          </p>
        </div>
      </div>

      <div className="w-full lg:w-3/5 xl:w-2/3 flex items-start justify-center p-6 sm:p-12 h-screen overflow-y-auto">
        <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl border">
          <div className="flex bg-gray-100 p-1.5 rounded-xl mb-8">
            <button 
              onClick={() => setRole('owner')}
              className={`flex-1 py-3 rounded-lg font-bold flex justify-center gap-2 ${role === 'owner' ? 'bg-white shadow border border-amber-500' : 'text-gray-500'}`}
            >
              <Building2 size={20} /> I'm a Business Owner
            </button>
            <button 
              onClick={() => setRole('seeker')}
              className={`flex-1 py-3 rounded-lg font-bold flex justify-center gap-2 ${role === 'seeker' ? 'bg-white shadow border border-blue-500' : 'text-gray-500'}`}
            >
              <User size={20} /> I'm a Job Seeker
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {role === 'owner' ? (
                 <div className="space-y-5">
                    <h2 className="text-2xl font-bold mb-6 text-blue-950">Create Business Account</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       <div><label className="block text-sm font-medium mb-1.5">Full Name</label><input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full border p-3 rounded-xl bg-gray-50" required /></div>
                       <div>
                         <label className="block text-sm font-medium mb-1.5">Mobile Number (OTP required)</label>
                         <div className="relative">
                           <span className="absolute left-3 top-3 text-gray-500 font-medium">+91</span>
                           <input type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} className="w-full border p-3 pl-12 rounded-xl bg-gray-50" required disabled={otpSent && otpVerified} />
                           {phone.length === 10 && !otpSent && (
                             <button type="button" onClick={() => setOtpSent(true)} className="absolute right-2 top-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold hover:bg-blue-200">Get OTP &rarr;</button>
                           )}
                           {otpSent && otpVerified && (
                             <span className="absolute right-3 top-3 text-green-500 font-bold">&#10003;</span>
                           )}
                         </div>
                       </div>
                    </div>
                    
                    <AnimatePresence>
                      {otpSent && !otpVerified && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <label className="block text-sm font-medium mb-1.5 text-blue-900">Enter 4-digit OTP sent to {"+91 " + phone}</label>
                          <div className="flex gap-4 items-center">
                            <input type="text" maxLength={4} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="border p-3 border-blue-200 rounded-xl bg-white w-32 tracking-[0.5em] text-center font-bold" placeholder="••••" required />
                            <button type="button" onClick={() => { if(otp.length === 4) setOtpVerified(true); }} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">Verify</button>
                            <button type="button" onClick={() => setOtpSent(false)} className="text-sm text-blue-600 hover:underline">Change Number</button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div><label className="block text-sm font-medium mb-1.5">Business Name</label><input type="text" className="w-full border p-3 rounded-xl bg-gray-50" required /></div>
                    <div className="relative z-50">
                       <label className="block text-sm font-medium mb-1.5 ">City</label>
                       <SearchableSelect options={topCities} value={city} onChange={setCity} placeholder="Search and select city..." />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       <div><label className="block text-sm font-medium mb-1.5">Password</label><input type="password" className="w-full border p-3 rounded-xl bg-gray-50" required /></div>
                       <div><label className="block text-sm font-medium mb-1.5">Confirm Password</label><input type="password" className="w-full border p-3 rounded-xl bg-gray-50" required /></div>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-6 text-blue-950">Create Job Seeker Account</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       <div><label className="block text-sm font-medium mb-1.5">Full Name</label><input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full border p-3 rounded-xl bg-gray-50" required /></div>
                       <div>
                         <label className="block text-sm font-medium mb-1.5">Mobile Number</label>
                         <div className="relative">
                           <span className="absolute left-3 top-3 text-gray-500 font-medium">+91</span>
                           <input type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} className="w-full border p-3 pl-12 rounded-xl bg-gray-50" required />
                         </div>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       <div><label className="block text-sm font-medium mb-1.5">Age</label><input type="number" className="w-full border p-3 rounded-xl bg-gray-50" required /></div>
                       <div className="relative z-40"><label className="block text-sm font-medium mb-1.5">City</label><SearchableSelect options={topCities} value={seekerCity} onChange={setSeekerCity} placeholder="Search city..." /></div>
                    </div>
                    <div>
                       <label className="block text-sm font-medium mb-2 font-bold">What type of work are you looking for? (Select up to 3)</label>
                       <CategorySelector selectedIds={selectedCategories} maxSelect={3} onSelectionChange={setSelectedCategories} seekerMode={true} />
                    </div>
                    <div>
                       <label className="block text-sm font-medium mb-2 font-bold">Years of experience</label>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                         {['Fresher', '< 1 year', '1-3 years', '3-5 years', '5+ years'].map((exp, i) => (
                           <label key={i} className="flex gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"><input type="radio" name="experience" required /> <span className="text-sm font-medium">{exp}</span></label>
                         ))}
                       </div>
                    </div>
                    <div>
                       <label className="block text-sm font-medium mb-2 font-bold">Expected Salary (Monthly)</label>
                       <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                         {['₹5K - ₹10K', '₹10K - ₹20K', '₹20K - ₹30K', '₹30K+'].map((sal, i) => (
                           <label key={i} className="flex gap-2 p-3 border rounded-lg cursor-pointer hover:bg-blue-50 text-center justify-center"><input type="radio" name="salary" className="hidden" required /> <span className="text-sm font-bold text-gray-700">{sal}</span></label>
                         ))}
                       </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                       <div><label className="block text-sm font-medium mb-1.5">Password</label><input type="password" className="w-full border p-3 rounded-xl bg-gray-50" required /></div>
                       <div><label className="block text-sm font-medium mb-1.5">Confirm Password</label><input type="password" className="w-full border p-3 rounded-xl bg-gray-50" required /></div>
                    </div>
                 </div>
               )}
               <button type="submit" className={`w-full text-white font-bold py-4 rounded-xl shadow-lg mt-8 ${role === 'owner' ? 'bg-amber-500' : 'bg-blue-600'}`}>
                 {role === 'owner' ? 'Create Business Account →' : 'Find Jobs Near Me →'}
               </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
