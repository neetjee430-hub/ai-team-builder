import { Users, Briefcase, UserPlus, Video, Star, ListTodo } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, subtitle, icon, actionText, actionLink }: any) => {
  const navigate = useNavigate();
  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border flex flex-col cursor-pointer"
      onClick={() => navigate(actionLink)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="mb-4">
        <h4 className="text-3xl font-bold text-gray-900">{value}</h4>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      <div className="mt-auto">
        <button className="text-blue-600 text-sm font-medium hover:underline">{actionText}</button>
      </div>
    </div>
  );
}

const DashboardHome = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Team Blueprint Status" 
          value="Ready ✅" 
          icon={<Users className="w-6 h-6" />}
          actionText="View Blueprint →"
          actionLink="/dashboard/blueprint"
        />
        <StatCard 
          title="Active Roles" 
          value="3 Openings" 
          icon={<Briefcase className="w-6 h-6" />}
          actionText="Manage Roles →"
          actionLink="/dashboard/roles"
        />
        <StatCard 
          title="Candidates This Week" 
          value="24" 
          subtitle="+12% from last week"
          icon={<UserPlus className="w-6 h-6" />}
          actionText="View All Candidates →"
          actionLink="/dashboard/candidates"
        />
        <StatCard 
          title="Interviews Completed" 
          value="18" 
          icon={<Video className="w-6 h-6" />}
          actionText="View Results →"
          actionLink="/dashboard/interviews"
        />
        <StatCard 
          title="Top Candidate" 
          value="Priya S." 
          subtitle="Senior Stylist — 84/100 ⭐"
          icon={<Star className="w-6 h-6" />}
          actionText="View Profile →"
          actionLink="/dashboard/candidate/1"
        />
        <div className="bg-white rounded-xl shadow-sm p-6 border flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
               <ListTodo className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-700">Pending Actions</h3>
          </div>
          <ul className="space-y-3 mt-2 flex-1">
            <li className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-blue-600" onClick={() => navigate('/dashboard/candidates')}><span className="w-2 h-2 rounded-full bg-red-400"></span> Review 3 candidate scorecards</li>
            <li className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-blue-600" onClick={() => navigate('/dashboard/interviews')}><span className="w-2 h-2 rounded-full bg-yellow-400"></span> Confirm interview slot</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          <div onClick={() => navigate('/dashboard/candidate/2')} className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
            <div className="bg-green-100 text-green-700 p-2 rounded-full mt-1">✅</div>
            <div>
              <p className="text-gray-800 font-medium">Ravi Kumar completed AI interview for Senior Stylist</p>
              <p className="text-sm text-gray-500">Score: 76/100 • 2 hours ago</p>
            </div>
          </div>
          <div onClick={() => navigate('/dashboard/candidate/3')} className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
            <div className="bg-blue-100 text-blue-700 p-2 rounded-full mt-1">📄</div>
            <div>
              <p className="text-gray-800 font-medium">Neha Sharma uploaded certificates</p>
              <p className="text-sm text-gray-500">Pending review • 5 hours ago</p>
            </div>
          </div>
          <div onClick={() => navigate('/dashboard/candidate/1')} className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
            <div className="bg-amber-100 text-amber-700 p-2 rounded-full mt-1">🤖</div>
            <div>
              <p className="text-gray-800 font-medium">AI recommended: HIRE for Receptionist role — Anjali Verma</p>
              <p className="text-sm text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
