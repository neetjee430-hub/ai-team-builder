import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Building2, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { topCities } from '../data/constants';
import { SearchableSelect } from '../components/SearchableSelect';
import { CategorySelector } from '../components/CategorySelector';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState<'owner' | 'seeker'>('owner');
  const navigate = useNavigate();

  // Common Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Signup Fields
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLogin) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const userDoc = await getDoc(doc(db, 'users', userCred.user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.role === 'business') {
            navigate('/dashboard');
          } else {
            navigate('/seeker/dashboard');
          }
        } else {
          // Fallback
          navigate('/');
        }
      } else {
        if (!termsAccepted) {
          toast.error("Please accept the Terms of Service.");
          setLoading(false);
          return;
        }

        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;

        const userData = {
          uid,
          email,
          phone,
          name: fullName,
          role: role === 'owner' ? 'business' : 'jobseeker',
          createdAt: new Date().toISOString(),
          profileComplete: false,
          onboardingComplete: false,
        };

        await setDoc(doc(db, 'users', uid), userData);

        if (role === 'owner') {
          await setDoc(doc(db, 'businessProfiles', uid), {
            businessName,
            city,
            category: selectedCategories[0] || '',
            onboardingComplete: false
          });
          navigate('/onboarding');
        } else {
          await setDoc(doc(db, 'jobSeekerProfiles', uid), {
            city,
            categories: selectedCategories
          });
          navigate('/seeker/profile'); // Navigate to full profile setup
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCred = await signInWithPopup(auth, provider);
      const uid = userCred.user.uid;
      
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (!userDoc.exists()) {
        const userData = {
          uid,
          email: userCred.user.email,
          name: userCred.user.displayName,
          role: role === 'owner' ? 'business' : 'jobseeker',
          createdAt: new Date().toISOString(),
          profileComplete: false,
          onboardingComplete: false,
        };
        await setDoc(doc(db, 'users', uid), userData);
        
        if (role === 'owner') {
           await setDoc(doc(db, 'businessProfiles', uid), { onboardingComplete: false });
           navigate('/onboarding');
        } else {
           await setDoc(doc(db, 'jobSeekerProfiles', uid), {});
           navigate('/seeker/profile');
        }
      } else {
        const r = userDoc.data().role;
        if (r === 'business') navigate('/dashboard');
        else navigate('/seeker/dashboard');
      }
    } catch (error: any) {
      toast.error("Google Auth Failed");
    }
  };

  return (
    <div className="min-h-screen flex text-gray-900 bg-gray-50 flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-2/5 xl:w-1/3 bg-blue-950 text-white p-12 flex-col justify-between sticky top-0 h-screen">
        <div>
          <h1 className="text-4xl font-bold mb-4 cursor-pointer" onClick={() => navigate('/')}>HireIQ 🇮🇳</h1>
          <p className="text-xl text-blue-200">
            {isLogin ? 'Welcome back! Log in to continue.' : 
             role === 'owner' 
              ? 'Join thousands of small business owners hiring smarter.' 
              : 'Find the perfect job near you. Fast, simple, and AI-powered.'}
          </p>
        </div>
      </div>

      <div className="w-full lg:w-3/5 xl:w-2/3 flex items-start justify-center p-6 sm:p-12 h-screen overflow-y-auto">
        <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl border">
          {!isLogin && (
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
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-blue-950">
              {isLogin ? 'Sign In' : role === 'owner' ? 'Create Business Account' : 'Create Job Seeker Account'}
            </h2>

            <button type="button" onClick={handleGoogleAuth} className="w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl shadow-sm hover:bg-gray-50 transition flex items-center justify-center gap-2 mb-6">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
            <div className="flex items-center gap-4 my-4">
              <hr className="flex-1 border-gray-200" />
              <span className="text-gray-400 text-sm font-medium">Or continue with email</span>
              <hr className="flex-1 border-gray-200" />
            </div>

            {!isLogin && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border p-3 rounded-xl bg-gray-50" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Mobile Number *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500 font-medium">+91</span>
                    <input type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\\D/g, ''))} className="w-full border p-3 pl-12 rounded-xl bg-gray-50" required />
                  </div>
                </div>
              </div>
            )}

            {!isLogin && role === 'owner' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Business Name *</label>
                  <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full border p-3 rounded-xl bg-gray-50" required />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1.5">Business Category *</label>
                   <CategorySelector selectedIds={selectedCategories} maxSelect={1} onSelectionChange={setSelectedCategories} />
                </div>
                <div className="relative z-50">
                  <label className="block text-sm font-medium mb-1.5 ">City *</label>
                  <SearchableSelect options={topCities} value={city} onChange={setCity} placeholder="Search and select city..." />
                </div>
              </>
            )}

            {!isLogin && role === 'seeker' && (
              <>
                <div className="relative z-40">
                  <label className="block text-sm font-medium mb-1.5">Current City *</label>
                  <SearchableSelect options={topCities} value={city} onChange={setCity} placeholder="Search city..." />
                </div>
              </>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email Address *</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-3 rounded-xl bg-gray-50" required />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium mb-1.5">Password *</label>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-3 rounded-xl bg-gray-50" required minLength={8} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-500 hover:text-gray-700">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="flex items-center gap-2 mt-4">
                 <input type="checkbox" id="terms" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                 <label htmlFor="terms" className="text-sm text-gray-600">
                   I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                 </label>
              </div>
            )}

            <button type="submit" disabled={loading} className={`w-full text-white font-bold py-4 rounded-xl shadow-lg mt-8 ${role === 'owner' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50`}>
              {loading ? 'Processing...' : isLogin ? 'Sign In →' : 'Create Account →'}
            </button>
            
            <div className="text-center mt-6">
              <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-medium hover:underline">
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AuthPage;
