import React, { useState, useEffect } from 'react';
import { Camera, Save, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { toast } from 'react-toastify';

const SeekerProfile = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  const [data, setData] = useState({
    name: '',
    dob: '',
    gender: 'Male',
    city: '',
    languages: [],
    highestEducation: 'Graduate',
    fieldOfStudy: '',
    isFresher: true,
    totalExp: '<1 year',
    currentSalary: '',
    expectedSalary: '₹15K–25K',
    preferredWorkType: 'Full-Time',
    skills: '',
    certifications: '',
    jobTypeSeeking: '',
    preferredWorkEnv: 'Corporate Office',
    noticePeriod: 'Immediate'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.currentUser) {
         try {
           const docSnap = await getDoc(doc(db, 'jobSeekerProfiles', auth.currentUser.uid));
           const userSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
           if (docSnap.exists() && userSnap.exists()) {
             setData(prev => ({
               ...prev,
               ...docSnap.data(),
               name: userSnap.data().name || '',
               city: docSnap.data().city || ''
             }));
           }
         } catch(e) {
            handleFirestoreError(e, OperationType.GET, `jobSeekerProfiles/${auth.currentUser.uid}`);
         }
      }
      setLoadingInitial(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async (isFinal = false) => {
    if (!auth.currentUser) return;
    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'jobSeekerProfiles', auth.currentUser.uid), data);
      await updateDoc(doc(db, 'users', auth.currentUser.uid), { name: data.name });
      
      if (isFinal) {
        await updateDoc(doc(db, 'users', auth.currentUser.uid), { profileComplete: true });
        toast.success("Profile Setup Complete! 🎉");
        navigate('/onboarding/jobseeker/chat');
      } else {
        toast.success("Progress saved!");
        setStep(step + 1);
      }
    } catch (error: any) {
      handleFirestoreError(error, OperationType.UPDATE, `jobSeekerProfiles/${auth.currentUser.uid}`);
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingInitial) return <div className="h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-blue-900 text-white p-6 shadow-md sticky top-0 z-10 flex items-center gap-4">
        <button onClick={() => navigate('/seeker/dashboard')} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
           <h1 className="text-xl font-bold">Complete Your Profile - Step {step} of 7</h1>
           <div className="w-full bg-blue-950 h-2 mt-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full transition-all duration-500 ease-in-out" style={{ width: `${(step / 7) * 100}%` }}></div>
           </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 space-y-6 mt-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border">
           {step === 1 && (
              <div className="space-y-4">
                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Info</h2>
                 <div><label className="block text-sm font-medium mb-1">Full Name</label><input type="text" value={data.name} onChange={e=>setData({...data, name: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50" /></div>
                 <div><label className="block text-sm font-medium mb-1">Date of Birth</label><input type="date" value={data.dob} onChange={e=>setData({...data, dob: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50" /></div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Gender</label>
                    <select value={data.gender} onChange={e=>setData({...data, gender: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50">
                       <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                 </div>
                 <div><label className="block text-sm font-medium mb-1">Current City</label><input type="text" value={data.city} onChange={e=>setData({...data, city: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50" /></div>
              </div>
           )}

           {step === 2 && (
              <div className="space-y-4">
                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
                 <div>
                    <label className="block text-sm font-medium mb-1">Highest Education</label>
                    <select value={data.highestEducation} onChange={e=>setData({...data, highestEducation: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50">
                       <option>10th Pass</option><option>12th Pass</option><option>ITI/Diploma</option><option>Graduate</option><option>Post-Graduate</option>
                    </select>
                 </div>
                 <div><label className="block text-sm font-medium mb-1">Field of Study</label><input type="text" value={data.fieldOfStudy} onChange={e=>setData({...data, fieldOfStudy: e.target.value})} placeholder="e.g. Computer Science" className="w-full border p-3 rounded-xl bg-gray-50" /></div>
              </div>
           )}

           {step === 3 && (
              <div className="space-y-4">
                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Work Experience</h2>
                 <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <input type="checkbox" checked={data.isFresher} onChange={e=>setData({...data, isFresher: e.target.checked})} className="w-5 h-5" />
                    <span className="font-medium text-blue-900">Are you a fresher?</span>
                 </div>
                 {!data.isFresher && (
                   <>
                     <div><label className="block text-sm font-medium mb-1">Total Years of Exp</label><input type="text" value={data.totalExp} onChange={e=>setData({...data, totalExp: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50" /></div>
                     <div><label className="block text-sm font-medium mb-1">Current/Last Monthly Salary</label><input type="text" value={data.currentSalary} onChange={e=>setData({...data, currentSalary: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50" /></div>
                   </>
                 )}
                 <div><label className="block text-sm font-medium mb-1">Expected Salary</label><input type="text" value={data.expectedSalary} onChange={e=>setData({...data, expectedSalary: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50" /></div>
                 <div><label className="block text-sm font-medium mb-1">Preferred Work Type</label><input type="text" value={data.preferredWorkType} onChange={e=>setData({...data, preferredWorkType: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50" /></div>
              </div>
           )}

           {step === 4 && (
              <div className="space-y-4">
                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills & Certs</h2>
                 <div><label className="block text-sm font-medium mb-1">Skills (comma separated)</label><input type="text" value={data.skills} onChange={e=>setData({...data, skills: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50" /></div>
                 <div><label className="block text-sm font-medium mb-1">Certifications</label><input type="text" value={data.certifications} onChange={e=>setData({...data, certifications: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50" /></div>
              </div>
           )}

           {step === 5 && (
              <div className="space-y-4 text-center">
                 <h2 className="text-2xl font-bold text-gray-900 mb-6">CV Upload</h2>
                 <div className="border-2 border-dashed border-gray-300 p-12 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer">
                    <p className="font-bold text-gray-500 mb-2">Drag & Drop CV Here</p>
                    <p className="text-sm text-gray-400">PDF, DOCX up to 5MB</p>
                 </div>
                 <p className="text-sm mt-4 text-blue-600 font-medium">Or skip to build CV with AI later</p>
              </div>
           )}

           {step === 6 && (
              <div className="space-y-4 text-center">
                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Photo</h2>
                 <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-4xl text-gray-400 border-4 border-white shadow-xl relative cursor-pointer">
                    <Camera size={32} />
                 </div>
              </div>
           )}

           {step === 7 && (
              <div className="space-y-4">
                 <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Preferences</h2>
                 <div><label className="block text-sm font-medium mb-1">Job Type Seeking</label><input type="text" value={data.jobTypeSeeking} onChange={e=>setData({...data, jobTypeSeeking: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50" /></div>
                 <div><label className="block text-sm font-medium mb-1">Preferred Environment</label><input type="text" value={data.preferredWorkEnv} onChange={e=>setData({...data, preferredWorkEnv: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50" /></div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Notice Period</label>
                    <select value={data.noticePeriod} onChange={e=>setData({...data, noticePeriod: e.target.value})} className="w-full border p-3 rounded-xl bg-gray-50">
                       <option>Immediate</option><option>15 Days</option><option>30 Days</option>
                    </select>
                 </div>
              </div>
           )}

        </div>

        <div className="pt-4 flex justify-between gap-4">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate('/seeker/dashboard')} className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-bold bg-white hover:bg-gray-50 shadow-sm transition-colors">
            {step === 1 ? 'Cancel' : 'Back'}
          </button>
          
          {step < 7 ? (
            <button onClick={() => handleSave(false)} disabled={isSaving} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md transition-all disabled:opacity-70">
              Next Step
            </button>
          ) : (
            <button onClick={() => handleSave(true)} disabled={isSaving} className="flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-md hover:-translate-y-0.5 disabled:opacity-70 transition-all">
              <CheckCircle2 size={20} /> Complete Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeekerProfile;
