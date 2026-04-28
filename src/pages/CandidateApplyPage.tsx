import React from 'react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Network, Mic, Camera, Fingerprint, Star, AlertCircle } from 'lucide-react';

const jobsById: Record<string, any> = {
  "1": { 
    roleTitle: "Senior Hair Stylist", 
    department: "Salon", 
    skillsRequired: ["Hair coloring", "Styling", "Keratin treatments"], 
    expRequired: "2+ years", 
    salaryRange: "15000-20000" 
  },
  "2": { 
    roleTitle: "Receptionist", 
    department: "Front Desk", 
    skillsRequired: ["Communication", "Scheduling", "Customer Service"], 
    expRequired: "Fresher ok", 
    salaryRange: "12000-16000" 
  }
};

const CandidateApplyPage = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  
  const job = jobsById[jobId || "1"] || jobsById["1"];
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('');
  const [docSummary, setDocSummary] = useState('');
  
  const [skills, setSkills] = useState({ s1: false, s2: false, cert: false });
  const [showWarning, setShowWarning] = useState(false);

  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert("Please enter Name and Phone.");
      return;
    }

    const score = (skills.s1 ? 1 : 0) + (skills.s2 ? 1 : 0) + (skills.cert ? 1 : 0);
    if (score < 2) {
      setShowWarning(true);
    } else {
      const sessionId = Date.now().toString();
      const candidateInfo = { name, phone, yearsExperience: experience, docSummary };
      localStorage.setItem(`interview_session_${sessionId}`, JSON.stringify({ jobId: jobId || "1", candidateInfo }));
      window.scrollTo(0, 0);
      navigate(`/interview/${sessionId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
        <div className="bg-blue-900 p-6 text-white text-center">
          <h1 className="text-2xl font-bold mb-2">HireGuru AI</h1>
          <p className="text-blue-200">Applying for: {job.roleTitle} at Glamour Salon, Indore</p>
        </div>
        <div className="p-8 space-y-6 flex-grow">
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Enter your name" required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Mobile Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Enter mobile number" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Age</label>
                <input type="number" className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Age" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700">Experience (Years)</label>
                <input type="number" value={experience} onChange={e => setExperience(e.target.value)} className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Years" required />
              </div>
            </div>
            
            <div>
               <label className="block text-sm font-medium mb-1 text-gray-700">Certifications / Documents (Optional)</label>
               <textarea value={docSummary} onChange={e => setDocSummary(e.target.value)} rows={2} className="w-full border rounded-lg p-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Type certificate names (e.g., L'Oreal Color Expert)" />
               <p className="text-xs text-gray-500 mt-1">Our AI will use this info during the interview.</p>
            </div>
            
            <div className="pt-4 pb-2">
               <h3 className="font-bold text-gray-900 border-b pb-2 mb-3">Skills & Certifications Required</h3>
               <div className="space-y-3">
                 <label className="flex items-start gap-3 cursor-pointer">
                   <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300" checked={skills.s1} onChange={e => setSkills({...skills, s1: e.target.checked})} />
                   <span className="text-sm text-gray-700">I have practical experience in hair coloring and styling</span>
                 </label>
                 <label className="flex items-start gap-3 cursor-pointer">
                   <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300" checked={skills.s2} onChange={e => setSkills({...skills, s2: e.target.checked})} />
                   <span className="text-sm text-gray-700">I have worked with keratin treatments</span>
                 </label>
                 <label className="flex items-start gap-3 cursor-pointer">
                   <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300" checked={skills.cert} onChange={e => setSkills({...skills, cert: e.target.checked})} />
                   <span className="text-sm text-gray-700">I have a formal diploma/certification in cosmetology</span>
                 </label>
               </div>
               {showWarning && (
                 <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm flex items-start gap-2">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>Based on your selections, you do not meet the minimum required skills/certifications for this role. An AI interview cannot be scheduled.</span>
                 </div>
               )}
            </div>
          </form>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              <span>What happens next? 🤖</span>
            </h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li className="flex gap-2">✅ <span>You fill basic details (done)</span></li>
              <li className="flex gap-2">🎤 <span>Our AI will ask you questions by voice</span></li>
              <li className="flex gap-2">📹 <span>Turn slightly sideways so AI sees you</span></li>
              <li className="flex gap-2">🧠 <span>We analyze answers & confidence</span></li>
            </ul>
            <p className="mt-4 text-xs font-semibold text-blue-600">Takes only 8-12 minutes. Just be yourself!</p>
          </div>
        </div>
        <div className="p-6 bg-gray-100 border-t">
          <button 
            onClick={handleStart}
            className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-bold py-4 rounded-xl transition-colors shadow-md outline-none"
          >
            Start My AI Interview →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateApplyPage;
