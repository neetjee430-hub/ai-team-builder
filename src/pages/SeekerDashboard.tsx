import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, CheckCircle2, Video, GraduationCap } from 'lucide-react';

const mockJobs = [
  { id: 1, business: 'Bright Future Academy', role: 'Maths Teacher (Classes 8-10)', loc: 'Vijay Nagar, Indore', sal: '₹18,000 – ₹25,000/month', exp: '1+ years', icon: <GraduationCap /> },
  { id: 2, business: 'Salon in Indore', role: 'Senior Stylist Needed', loc: 'Palasia, Indore', sal: '₹15,000 – ₹20,000/month', exp: '2+ years', icon: <Briefcase /> },
  { id: 3, business: 'Gym in Pune', role: 'Fitness Trainer', loc: 'Koregaon Park, Pune', sal: '₹20,000 – ₹30,000/month', exp: '1+ years', icon: <Briefcase /> }
];

const SeekerDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Amit');
  const [seekerCity, setSeekerCity] = useState('Indore');

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
    const locData = JSON.parse(localStorage.getItem('locData') || '{}');
    if (locData.city) {
      setSeekerCity(locData.city);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-blue-900 text-white p-6 rounded-b-[40px] shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">HireGuru AI</h1>
          <div 
            onClick={() => navigate('/seeker/profile')}
            className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center font-bold shadow-md cursor-pointer hover:bg-amber-400 transition-colors"
          >
            {userName.substring(0, 2).toUpperCase()}
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2">Welcome, {userName.split(' ')[0]}! 👋</h2>
        <p className="text-blue-100 mb-4">Here are jobs near you in {seekerCity}</p>
      </header>

      <div className="px-4 space-y-8 max-w-4xl mx-auto">
        <section>
          <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">
            <h3 className="font-bold text-lg">Your Profile Completeness</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-amber-500 h-2.5 rounded-full w-[40%]"></div>
            </div>
            <ul className="space-y-3 text-sm text-gray-700 mt-4">
               <li className="flex gap-2 items-center"><CheckCircle2 className="text-green-500 w-5 h-5"/> Basic details filled</li>
               <li className="flex gap-2 items-center cursor-pointer hover:text-amber-600" onClick={() => navigate('/seeker/profile')}><div className="w-5 h-5 border-2 rounded-full border-gray-400"></div> Add your photo (+15%)</li>
               <li className="flex gap-2 items-center cursor-pointer hover:text-amber-600" onClick={() => navigate('/interview/practice')}><div className="w-5 h-5 border-2 rounded-full border-gray-400"></div> Complete Practice AI Interview (+25%)</li>
            </ul>
            <Link to="/seeker/profile" className="inline-block px-6 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-bold text-sm mt-4 hover:bg-blue-100 transition-colors border border-blue-200">
               Complete Full Profile &rarr;
            </Link>
          </div>
        </section>

        <section>
           <h3 className="font-bold text-xl mb-4 text-gray-900">Jobs Matching Your Skills</h3>
           <p className="text-sm text-gray-500 mb-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
             Note: As per your previous selection (e.g., Teaching), we've filtered relevant roles for you from employers on our platform.
           </p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {mockJobs.map(job => (
               <div key={job.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                  <div className="flex gap-3 mb-4 items-start">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                      {job.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 leading-tight">{job.role}</h4>
                      <p className="text-sm text-gray-500 mt-1">{job.business} • {job.loc}</p>
                    </div>
                  </div>
                  <div className="space-y-2 mb-6 text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border">
                    <p><strong>Salary:</strong> {job.sal}</p>
                    <p><strong>Experience:</strong> {job.exp}</p>
                  </div>
                  <Link 
                    to={`/apply/${job.id}`} 
                    className="w-full mt-auto bg-amber-500 text-white font-bold py-3.5 rounded-xl hover:bg-amber-600 transition-colors shadow-md flex items-center justify-center gap-2 text-center"
                  >
                     <Video size={18} /> Apply & Start AI Interview →
                  </Link>
               </div>
             ))}
           </div>
        </section>
      </div>
    </div>
  );
};
export default SeekerDashboard;
