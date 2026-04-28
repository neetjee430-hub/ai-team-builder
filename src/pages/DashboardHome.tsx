import { useState, useEffect } from 'react';
import { Users, Briefcase, UserPlus, Video, Star, ListTodo } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Generate activity feed from localStorage data
    const localJobRoles = JSON.parse(localStorage.getItem('jobRoles') || '[]');
    let localCandidates = [];
    try {
        localCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    } catch (e) {
        // Handle case where candidates might not be an array
        localCandidates = [];
    }

    let allActivities: any[] = [];

    localJobRoles.forEach((job: any) => {
      allActivities.push({
        id: `job_${job.id}`,
        type: 'job_created',
        icon: '💼',
        iconClass: 'bg-blue-100 text-blue-700',
        title: `New job role created: ${job.roleTitle}`,
        time: new Date(job.createdAt || Date.now() - 86400000).getTime(), // fake time if missing
        timeText: 'Recently',
        link: '/dashboard/roles'
      });
    });

    if (Array.isArray(localCandidates)) {
        localCandidates.forEach((cand: any) => {
            allActivities.push({
                id: `cand_${cand.id}`,
                type: 'candidate_applied',
                icon: '👤',
                iconClass: 'bg-green-100 text-green-700',
                title: `${cand.name} applied for a role`,
                time: new Date(Date.now() - 3600000).getTime(),
                timeText: 'Recently',
                link: `/dashboard/candidate/${cand.id}`
            });
            
            // Check if scorecard exists for interview completion
            const scorecard = localStorage.getItem(`interview_scorecard_${cand.id}`);
            if (scorecard) {
               allActivities.push({
                id: `interview_${cand.id}`,
                type: 'interview_completed',
                icon: '✅',
                iconClass: 'bg-green-100 text-green-700',
                title: `${cand.name} completed AI interview`,
                time: new Date().getTime(),
                timeText: 'Just now',
                link: `/dashboard/candidate/${cand.id}`
               });
            }
        });
    }

    if (localStorage.getItem('businessData')) {
         allActivities.push({
            id: 'blueprint_created',
            type: 'blueprint',
            icon: '🧠',
            iconClass: 'bg-purple-100 text-purple-700',
            title: 'Team Blueprint generated',
            time: new Date(Date.now() - 86400000 * 2).getTime(),
            timeText: 'A few days ago',
            link: '/dashboard/blueprint'
         });
    }

    // Sort by most recent
    allActivities.sort((a, b) => b.time - a.time);
    setActivities(allActivities.slice(0, 5)); // Keep top 5

  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('dash_welcome')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title={t('dash_blueprint')} 
          value="Ready ✅" 
          icon={<Users className="w-6 h-6" />}
          actionText={t('dash_view_blueprint')}
          actionLink="/dashboard/blueprint"
        />
        <StatCard 
          title={t('dash_active_roles')} 
          value="3 Openings" 
          icon={<Briefcase className="w-6 h-6" />}
          actionText="Manage Roles →"
          actionLink="/dashboard/roles"
        />
        <StatCard 
          title={t('dash_candidates')} 
          value="24" 
          subtitle="+12% from last week"
          icon={<UserPlus className="w-6 h-6" />}
          actionText="View All Candidates →"
          actionLink="/dashboard/candidates"
        />
        <StatCard 
          title={t('dash_interviews')} 
          value="18" 
          icon={<Video className="w-6 h-6" />}
          actionText="View Results →"
          actionLink="/dashboard/interviews"
        />
        <StatCard 
          title={t('dash_top_candidate')} 
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
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t('dash_recent')}</h2>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((act) => (
              <div key={act.id} onClick={() => navigate(act.link)} className="flex gap-4 items-start p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <div className={`${act.iconClass} p-2 rounded-full mt-1`}>{act.icon}</div>
                <div>
                  <p className="text-gray-800 font-medium">{act.title}</p>
                  <p className="text-sm text-gray-500">{act.timeText}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity yet.</p>
            <button onClick={() => navigate('/dashboard/roles')} className="mt-2 text-blue-600 hover:underline">Post your first job to get started! →</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
