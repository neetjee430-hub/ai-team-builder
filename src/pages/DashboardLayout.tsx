import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Users, Briefcase, UserCheck, Video, FileText, BarChart, Settings, Bell, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';

const DashboardLayout = () => {
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();
  const [userName, setUserName] = useState('Amit');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/dashboard/blueprint', label: 'My Team Blueprint', icon: <Users className="w-5 h-5" /> },
    { path: '/dashboard/roles', label: 'Active Job Roles', icon: <Briefcase className="w-5 h-5" /> },
    { path: '/dashboard/candidates', label: 'Candidates', icon: <UserCheck className="w-5 h-5" /> },
    { path: '/dashboard/interviews', label: 'Interviews', icon: <Video className="w-5 h-5" /> },
    { path: '/dashboard/documents', label: 'Documents', icon: <FileText className="w-5 h-5" /> },
    { path: '/dashboard/reports', label: 'Reports', icon: <BarChart className="w-5 h-5" /> },
    { path: '/dashboard/settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col hidden md:flex">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-900">HireGuru AI</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.path 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b h-16 flex items-center justify-between px-6 relative">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Good Morning, {userName.split(' ')[0]}! 👋</h2>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleLanguage} className="text-sm font-medium bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200">
              {language === 'en' ? 'EN / हिंदी' : 'हिंदी / EN'}
            </button>
            <button onClick={() => setShowNotifications(!showNotifications)} className="text-gray-500 hover:text-gray-700 relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button onClick={() => setShowProfile(!showProfile)} className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
              {userName.substring(0, 2).toUpperCase()}
            </button>
          </div>

          {/* Modals/Dropdowns */}
          {showNotifications && (
             <div className="absolute top-16 right-16 w-80 bg-white border rounded-xl shadow-xl z-50 p-4">
                <h3 className="font-bold text-gray-900 border-b pb-2 mb-2">Notifications</h3>
                <div className="text-sm text-gray-700 space-y-2">
                   <div className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer">Priya Sharma completed her AI interview!</div>
                   <div className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer">Your new role 'Senior Stylist' is live.</div>
                </div>
             </div>
          )}

          {showProfile && (
             <div className="absolute top-16 right-6 w-48 bg-white border rounded-xl shadow-xl z-50 p-4">
                <h3 className="font-bold text-gray-900 border-b pb-2 mb-2">{userName}</h3>
                <div className="text-sm text-gray-700 space-y-2 flex flex-col items-start mt-2">
                   <Link to="/dashboard/settings" className="w-full text-left p-2 hover:bg-gray-50 rounded-lg flex items-center gap-2"><User size={16}/> Profile</Link>
                   <Link to="/" className="w-full text-left p-2 hover:bg-gray-50 rounded-lg text-red-600 font-medium">Log out</Link>
                </div>
             </div>
          )}
        </header>
        <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
