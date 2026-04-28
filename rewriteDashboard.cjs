const fs = require('fs');

const layoutContent = `import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Users, Briefcase, UserCheck, Video, FileText, BarChart, Settings, Bell, User, MessageCircle, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const DashboardLayout = () => {
  const location = useLocation();
  const [userName, setUserName] = useState('Amit');
  const [businessName, setBusinessName] = useState('My Business');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/dashboard/roles', label: 'My Jobs', icon: <Briefcase className="w-5 h-5" /> },
    { path: '/dashboard/candidates', label: 'Candidates', icon: <UserCheck className="w-5 h-5" /> },
    { path: '/dashboard/interviews', label: 'AI Interviews', icon: <Video className="w-5 h-5" /> },
    { path: '/dashboard/blueprint', label: 'Team Blueprint', icon: <Users className="w-5 h-5" /> },
    { path: '/dashboard/analytics', label: 'Analytics', icon: <BarChart className="w-5 h-5" /> },
    { path: '/dashboard/billing', label: 'Billing', icon: <CreditCard className="w-5 h-5" /> },
    { path: '/dashboard/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { path: '/dashboard/support', label: 'Support', icon: <MessageCircle className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar */}
      <aside className={\`\${collapsed ? 'w-20' : 'w-72'} bg-[#1E293B] text-gray-300 flex flex-col hidden md:flex transition-all duration-300 relative shadow-xl z-20\`}>
        <button 
           onClick={() => setCollapsed(!collapsed)}
           className="absolute -right-3 top-6 bg-[#4F46E5] text-white rounded-full p-1 shadow-lg hover:bg-[#6366f1] transition-colors"
        >
           {collapsed ? <ChevronRight size={16}/> : <ChevronLeft size={16}/>}
        </button>
        
        <div className={\`p-6 border-b border-gray-800 \${collapsed ? 'flex justify-center px-0' : ''}\`}>
          {!collapsed ? (
            <div>
               <h1 className="text-2xl font-bold text-white flex items-center gap-2">HireIQ <span className="text-xs font-normal px-2 py-0.5 bg-gray-800 rounded-full border border-gray-700">INDIA</span></h1>
               <p className="text-xs text-amber-500 font-bold mt-1 uppercase tracking-widest">{businessName}</p>
            </div>
          ) : (
             <h1 className="text-xl font-bold text-white">HIQ</h1>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto py-6 custom-scrollbar">
          <ul className="space-y-2 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={\`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all \${
                      isActive 
                        ? 'bg-[#4F46E5] text-white shadow-md' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }\`}
                  >
                    <div className={\`\${isActive ? 'text-white' : 'text-gray-400'}\`}>
                      {item.icon}
                    </div>
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        
        {!collapsed && (
          <div className="p-4 m-4 bg-gray-800/50 border border-gray-700 rounded-xl">
             <div className="text-xs text-gray-400 font-bold mb-2 uppercase tracking-wide">Storage Quota</div>
             <div className="w-full bg-gray-900 rounded-full h-1.5 mb-1">
                <div className="bg-[#4F46E5] h-1.5 rounded-full" style={{width: '45%'}}></div>
             </div>
             <p className="text-[10px] text-gray-500">45 AI Interviews Left</p>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8 z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold text-gray-900">
                {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
             </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-bold border border-amber-200 shadow-sm">
               ⚡ Active Plan: Starter
            </div>
            
            <button onClick={() => setShowNotifications(!showNotifications)} className="text-gray-500 hover:text-[#4F46E5] relative transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-right hidden md:block">
                 <p className="text-sm font-bold text-gray-900">{userName}</p>
                 <p className="text-xs text-gray-500">Business Owner</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md border-2 border-white">
                {userName.substring(0, 1).toUpperCase()}
              </div>
            </button>
          </div>

          {/* Modals/Dropdowns */}
          {showNotifications && (
             <div className="absolute top-20 right-20 w-80 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-50 p-0 overflow-hidden transform origin-top-right transition-all">
                <div className="bg-gray-50 p-4 border-b border-gray-100 flex justify-between items-center">
                   <h3 className="font-bold text-gray-900">Notifications</h3>
                   <span className="bg-[#4F46E5] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">2 New</span>
                </div>
                <div className="text-sm text-gray-700 max-h-80 overflow-y-auto">
                   <div className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-0.5">✅</div>
                      <div>
                         <p className="font-medium text-gray-900">Priya Sharma completed her AI interview!</p>
                         <p className="text-xs text-gray-500 mt-1">Score: 88/100 • 2m ago</p>
                      </div>
                   </div>
                   <div className="p-4 hover:bg-gray-50 cursor-pointer flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">💼</div>
                      <div>
                         <p className="font-medium text-gray-900">Your new role 'Senior Stylist' is live.</p>
                         <p className="text-xs text-gray-500 mt-1">1 hr ago</p>
                      </div>
                   </div>
                </div>
                <div className="p-3 bg-gray-50 border-t border-gray-100 text-center text-xs font-bold text-[#4F46E5] cursor-pointer hover:bg-gray-100">
                   Mark all as read
                </div>
             </div>
          )}

          {showProfile && (
             <div className="absolute top-20 right-8 w-56 bg-white border border-gray-100 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-50 p-2 transform origin-top-right transition-all">
                <div className="p-3 border-b border-gray-100 mb-2">
                   <h3 className="font-bold text-gray-900">{userName}</h3>
                   <p className="text-xs text-gray-500">{businessName}</p>
                </div>
                <div className="text-sm font-medium text-gray-700 space-y-1">
                   <Link to="/dashboard/settings" className="w-full text-left p-3 hover:bg-gray-50 hover:text-[#4F46E5] rounded-xl flex items-center gap-3 transition-colors"><User size={16}/> Profile & Settings</Link>
                   <Link to="/dashboard/billing" className="w-full text-left p-3 hover:bg-gray-50 hover:text-[#4F46E5] rounded-xl flex items-center gap-3 transition-colors"><CreditCard size={16}/> Subscription</Link>
                   <div className="h-px bg-gray-100 my-2 w-full"></div>
                   <Link to="/" className="w-full text-left p-3 hover:bg-red-50 hover:text-red-600 rounded-xl text-gray-600 flex items-center gap-3 transition-colors">Sign Out</Link>
                </div>
             </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
`;

const homeContent = `import { useState, useEffect } from 'react';
import { Briefcase, Users, Video, Star, MoreHorizontal, ArrowRight, TrendingUp, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, trend, iconColor, bgColor }: any) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="text-gray-500 font-medium text-sm">{title}</div>
        <div className={\`p-2 rounded-xl \${bgColor} \${iconColor}\`}>
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
`;

fs.writeFileSync('src/pages/DashboardLayout.tsx', layoutContent);
fs.writeFileSync('src/pages/DashboardHome.tsx', homeContent);
console.log("Updated DashboardLayout.tsx and DashboardHome.tsx");
