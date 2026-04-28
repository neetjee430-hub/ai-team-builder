import { useState, useEffect } from 'react';
import { Briefcase, Users, Video, Star, MoreHorizontal, ArrowRight, TrendingUp, Sparkles, UserCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, trend, iconColor, bgColor }: any) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="text-gray-500 font-medium text-sm">{title}</div>
        <div className={`p-2 rounded-xl ${bgColor} ${iconColor}`}>
          {icon}
        </div>
      </div>
      <div>
        <h4 className="text-4xl font-black text-gray-900">{value}</h4>
        {trend && (
           <p className="text-sm text-green-600 font-medium mt-2 flex items-center gap-1">
              <TrendingUp size={14} /> {trend}
           </p>
        )}
      </div>
    </div>
  );
}

const DashboardHome = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Amit');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) setUserName(storedName.split(' ')[0]);

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
         <div className="relative z-10 flex border-b border-indigo-400/30 pb-6 mb-6">
            <div className="flex-1">
               <h1 className="text-3xl font-bold mb-2">{greeting}, {userName}! 🌅</h1>
               <p className="text-indigo-100 text-lg">Your hiring process is currently 85% complete. Almost there!</p>
            </div>
            <div className="hidden md:flex items-center">
               <div className="w-20 h-20 relative">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                     <path className="text-indigo-900/40" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                     <path className="text-amber-400" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                  </svg>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-lg">85%</div>
               </div>
            </div>
         </div>
         
         <div className="flex flex-wrap gap-4 relative z-10">
            <button onClick={() => navigate('/dashboard/roles')} className="bg-white text-[#4F46E5] px-6 py-3 rounded-xl font-bold border-2 border-white hover:bg-gray-50 flex items-center gap-2 shadow-md transition-colors">
               + Post New Job
            </button>
            <button onClick={() => navigate('/dashboard/candidates')} className="bg-[#4F46E5]/40 text-white px-6 py-3 rounded-xl font-bold border border-indigo-300/30 hover:bg-[#4F46E5]/60 flex items-center gap-2 transition-colors">
               <Users size={18} /> View Candidates
            </button>
         </div>
      </div>

      {/* AI Insight Card */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
         <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
            <Sparkles className="text-amber-600 w-6 h-6" />
         </div>
         <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">AI Insight</h3>
            <p className="text-gray-700">You have <strong className="text-amber-600">8 unreviewed candidates</strong> for 'Delivery Executive'. Your top match scored 94%! Want to review them now?</p>
         </div>
         <button className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-colors whitespace-nowrap">
            Review Candidates →
         </button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard title="Jobs Posted" value="3" icon={<Briefcase />} bgColor="bg-blue-50" iconColor="text-blue-600" />
         <StatCard title="Total Applicants" value="48" icon={<Users />} trend="+12% this week" bgColor="bg-indigo-50" iconColor="text-[#4F46E5]" />
         <StatCard title="Interviews Done" value="24" icon={<Video />} bgColor="bg-amber-50" iconColor="text-amber-600" />
         <StatCard title="Shortlisted" value="7" icon={<Star />} bgColor="bg-green-50" iconColor="text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
         {/* Recent Activity */}
         <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
               <h3 className="font-bold text-lg text-gray-900">Recent Activity</h3>
               <button className="text-sm font-bold text-[#4F46E5] hover:underline">View All</button>
            </div>
            <div className="p-2 flex-1">
               <div className="space-y-1">
                  <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors group">
                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-1"><Star size={16} className="text-green-600"/></div>
                     <div className="flex-1">
                        <p className="text-gray-900 font-medium group-hover:text-[#4F46E5] transition-colors"><span className="font-bold">Priya S.</span> scored 88% on Store Manager interview.</p>
                        <p className="text-xs text-gray-500 mt-1">10 mins ago</p>
                     </div>
                     <button className="text-gray-400 group-hover:text-gray-600"><ArrowRight size={18}/></button>
                  </div>
                  <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors group">
                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-1"><Users size={16} className="text-blue-600"/></div>
                     <div className="flex-1">
                        <p className="text-gray-900 font-medium group-hover:text-[#4F46E5] transition-colors">New applicant for <span className="font-bold">Delivery Executive</span>.</p>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                     </div>
                     <button className="text-gray-400 group-hover:text-gray-600"><ArrowRight size={18}/></button>
                  </div>
                  <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-colors group">
                     <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center shrink-0 mt-1"><Briefcase size={16} className="text-purple-600"/></div>
                     <div className="flex-1">
                        <p className="text-gray-900 font-medium group-hover:text-[#4F46E5] transition-colors">Job post <span className="font-bold">Cashier</span> published successfully.</p>
                        <p className="text-xs text-gray-500 mt-1">Yesterday at 4:30 PM</p>
                     </div>
                     <button className="text-gray-400 group-hover:text-gray-600"><ArrowRight size={18}/></button>
                  </div>
               </div>
            </div>
         </div>

         {/* Today's Schedule Options */}
         <div className="bg-white rounded-3xl border border-gray-100 shadow-sm flex flex-col pt-6">
             <div className="px-6 mb-4 flex justify-between items-center">
                 <h3 className="font-bold text-lg text-gray-900">Today's Overview</h3>
             </div>
             
             <div className="px-6 pb-6 space-y-4">
                 <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex gap-4 items-center">
                     <div className="bg-white p-3 rounded-xl shadow-sm"><Video className="text-[#4F46E5]" size={20}/></div>
                     <div>
                         <p className="font-bold text-gray-900">3 AI Interviews</p>
                         <p className="text-xs text-gray-500 mt-0.5">Scheduled for today</p>
                     </div>
                 </div>
                 
                 <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex gap-4 items-center">
                     <div className="bg-white p-3 rounded-xl shadow-sm"><UserCheck className="text-green-600" size={20}/></div>
                     <div>
                         <p className="font-bold text-gray-900">1 Final Review</p>
                         <p className="text-xs text-gray-500 mt-0.5">Awaiting your decision</p>
                     </div>
                 </div>
                 
                 <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-4">
                     <div className="text-xl mt-0.5">⚠️</div>
                     <div>
                         <p className="font-bold text-red-900 text-sm">Urgent Alert</p>
                         <p className="text-xs text-red-700 mt-1 leading-snug">"Cashier" position has 0 applicants in 3 days. Boost visibility?</p>
                         <button className="mt-2 text-xs font-bold text-white bg-red-600 px-3 py-1.5 rounded-lg hover:bg-red-700">Boost Job</button>
                     </div>
                 </div>
             </div>
         </div>
      </div>

    </div>
  );
};

export default DashboardHome;
