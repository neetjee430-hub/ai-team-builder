const fs = require('fs');

const content = `import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, CheckCircle2, Video, GraduationCap, Target, Sparkles, MapPin } from 'lucide-react';

const mockJobs = [
  { id: 1, business: 'TechCorp India', role: 'Frontend Developer', loc: 'Pune, MH', sal: '₹40,000 – ₹60,000/month', match: 94, tags: ['React', 'TypeScript'] },
  { id: 2, business: 'Global Retail Solutions', role: 'Store Manager', loc: 'Mumbai, MH', sal: '₹35,000 – ₹45,000/month', match: 88, tags: ['Management', 'Sales'] },
  { id: 3, business: 'Creative Studio', role: 'Graphic Designer', loc: 'Remote', sal: '₹25,000 – ₹40,000/month', match: 82, tags: ['Figma', 'Photoshop'] }
];

const SeekerDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Rahul');
  const [seekerCity, setSeekerCity] = useState('Pune');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName.split(' ')[0]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-gray-900">
      <header className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white p-6 md:p-10 rounded-b-[40px] shadow-[0_10px_30px_rgba(79,70,229,0.2)] mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="max-w-4xl mx-auto relative z-10">
            <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-bold tracking-wide">HireIQ <span className="font-normal text-sm opacity-80 border border-white/30 px-2 py-0.5 rounded-full ml-1 text-xs">INDIA</span></h1>
            <div 
                onClick={() => navigate('/seeker/profile')}
                className="w-10 h-10 bg-amber-500 text-[#0F172A] rounded-full flex items-center justify-center font-bold shadow-md cursor-pointer hover:bg-amber-400 transition-colors border-2 border-white"
            >
                {userName.substring(0, 1).toUpperCase()}
            </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Good morning, {userName}! 🚀</h2>
            <p className="text-indigo-100 flex items-center gap-2">Ready to get hired today?</p>
        </div>
      </header>

      <div className="px-4 space-y-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-[#1E293B] text-white p-6 rounded-3xl shadow-lg border border-gray-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
                <div className="relative z-10">
                    <h3 className="font-bold text-xl mb-2 flex items-center gap-2"><Target className="text-amber-400"/> You match 12 jobs!</h3>
                    <p className="text-gray-400 text-sm mb-6 max-w-md">Companies are actively looking for skills like yours. Apply now before positions fill up.</p>
                    <button onClick={() => window.scrollTo({top: 800, behavior: 'smooth'})} className="bg-amber-500 text-black px-6 py-2.5 rounded-xl font-bold hover:bg-amber-400 transition-all shadow-lg flex items-center gap-2">
                        View All Matches →
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="relative w-24 h-24 mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-gray-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                        <path className="text-[#4F46E5]" strokeDasharray="60, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-gray-900">60%</span>
                    </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Profile Complete</h3>
                <p className="text-xs text-gray-500 mb-4">Complete for 3x visibility</p>
                <Link to="/seeker/profile" className="text-sm font-bold text-[#4F46E5] hover:underline">Complete Profile</Link>
            </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-3xl shadow-sm border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex gap-4 items-start md:items-center">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-blue-100">
                    <Video className="text-[#4F46E5] w-6 h-6"/>
                </div>
                <div>
                   <h3 className="font-bold text-gray-900 text-lg">Unlock Full Matching</h3>
                   <p className="text-gray-600 text-sm mt-1">Complete your AI Interview to get ranked for top jobs instantly.</p>
                </div>
            </div>
            <Link to="/interview/setup" className="w-full md:w-auto text-center px-6 py-3 bg-[#4F46E5] text-white font-bold rounded-xl hover:bg-[#6366f1] transition-colors shadow-md whitespace-nowrap">
                Start AI Interview 🎙️
            </Link>
        </div>

        <section>
           <h3 className="font-bold text-2xl mb-6 text-gray-900 flex items-center gap-2"><Sparkles className="text-amber-500"/> Recommended Jobs</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {mockJobs.map(job => (
               <div key={job.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col hover:shadow-lg transition-all group">
                  <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-gray-50 text-gray-700 rounded-2xl group-hover:bg-[#4F46E5] group-hover:text-white transition-colors">
                          <Briefcase className="w-6 h-6" />
                      </div>
                      <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                          {job.match}% Match
                      </div>
                  </div>
                  <h4 className="font-bold text-xl text-gray-900 mb-1">{job.role}</h4>
                  <p className="text-sm font-medium text-gray-500 mb-4">{job.business}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                      <span className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-600 border border-gray-100">
                          <MapPin w={12}/> {job.loc}
                      </span>
                      <span className="bg-gray-50 px-2.5 py-1 rounded-lg text-xs font-medium text-gray-600 border border-gray-100">
                          {job.sal}
                      </span>
                  </div>

                  <div className="flex gap-2 mt-auto">
                      {job.tags.map(t => <span key={t} className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md text-[10px] font-bold uppercase">{t}</span>)}
                  </div>
                  
                  <Link 
                    to={\`/apply/\${job.id}\`} 
                    className="w-full mt-6 bg-gray-900 text-white font-bold py-3.5 rounded-xl hover:bg-[#4F46E5] transition-colors flex items-center justify-center gap-2 text-center"
                  >
                     Apply Now →
                  </Link>
               </div>
             ))}
           </div>
        </section>
      </div>

      <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-2 pb-4 z-40 md:hidden shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <button className="flex flex-col items-center text-[#4F46E5] p-2"><HomeIcon/><span className="text-[10px] font-bold mt-1">Home</span></button>
        <button className="flex flex-col items-center text-gray-400 hover:text-[#4F46E5] p-2"><BriefcaseIcon/><span className="text-[10px] font-medium mt-1">Jobs</span></button>
        <button className="flex flex-col items-center text-gray-400 hover:text-[#4F46E5] p-2 relative">
            <VideoIcon/>
            <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full border border-white"></span>
            <span className="text-[10px] font-medium mt-1">Interview</span>
        </button>
        <button onClick={() => navigate('/seeker/profile')} className="flex flex-col items-center text-gray-400 hover:text-[#4F46E5] p-2">
            <UserIcon/>
            <span className="text-[10px] font-medium mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
};

const HomeIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
const BriefcaseIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
const VideoIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
const UserIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>

export default SeekerDashboard;
`;

fs.writeFileSync('src/pages/SeekerDashboard.tsx', content);
console.log("Updated SeekerDashboard.tsx");
