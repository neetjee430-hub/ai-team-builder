import { useState } from 'react';
import { Download, RefreshCw, ChevronDown, UserSquare2, DollarSign } from 'lucide-react';

const TeamBlueprint = () => {
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleDownload = () => {
    alert("Downloading Team Blueprint as PDF...");
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      alert("Blueprint regenerated successfully based on latest data.");
    }, 1500);
  };

  const roles = [
    {
       id: 1,
       title: 'Senior Hair Stylist',
       count: 2,
       priority: 'HIRE FIRST 🔴',
       salary: '₹12k - ₹18k',
       reqs: 'Min 2 years, Hair cutting, coloring, styling',
    },
    {
       id: 2,
       title: 'Receptionist',
       count: 1,
       priority: 'HIRE SOON 🟡',
       salary: '₹10k - ₹15k',
       reqs: 'Good communication, Ms-Office, polite',
    },
    {
       id: 3,
       title: 'Junior Stylist',
       count: 1,
       priority: 'HIRE LATER 🟢',
       salary: '₹8k - ₹12k',
       reqs: 'Fresher or 6 months experience, eager to learn',
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md">SALON</span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">AI Team Blueprint</h1>
          <p className="text-gray-500 mt-1">Based on a 400 sq.ft size and given budget.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleRegenerate} disabled={isRegenerating} className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium border hover:bg-gray-100 transition-colors flex items-center gap-2">
             <RefreshCw size={16} className={isRegenerating ? "animate-spin" : ""} /> {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
          <button onClick={handleDownload} className="bg-blue-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center gap-2">
             <Download size={16} /> Download
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border overflow-x-auto">
         <div className="flex flex-col items-center min-w-[600px]">
            <div className="bg-blue-900 text-white px-8 py-3 rounded-lg font-bold shadow-md z-10 w-64 text-center">
               Business Owner / Manager
            </div>
            
            <div className="w-px h-8 bg-gray-300"></div>
            
            <div className="w-[80%] border-t-2 border-gray-300 relative h-8">
               <div className="absolute top-0 left-0 w-px h-8 bg-gray-300"></div>
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-8 bg-gray-300"></div>
               <div className="absolute top-0 right-0 w-px h-8 bg-gray-300"></div>
            </div>

            <div className="flex justify-between w-[90%] md:w-[80%]">
               {roles.map(role => (
                 <div key={role.id} className="bg-white border-2 border-gray-200 w-[30%] rounded-xl shadow-sm overflow-hidden flex flex-col relative group transition-all hover:border-amber-400">
                    <div className="p-4 flex-1">
                       <h3 className="font-bold text-gray-900 border-b pb-2 mb-3 leading-tight">{role.title}</h3>
                       <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><UserSquare2 size={16}/> {role.count} Person</p>
                       <p className="text-sm font-medium text-gray-700 mt-1 flex items-center gap-1.5"><DollarSign size={16}/> {role.salary}</p>
                       <p className="text-xs font-bold mt-3 inline-block px-2 py-1 bg-gray-100 rounded text-gray-600">{role.priority}</p>
                    </div>
                    {expandedRole === role.id && (
                       <div className="p-4 bg-gray-50 border-t text-sm text-gray-600 leading-relaxed">
                          <p><strong>Req:</strong> {role.reqs}</p>
                       </div>
                    )}
                    <button 
                      onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
                      className="w-full bg-gray-50 hover:bg-gray-100 text-gray-500 py-1.5 border-t text-xs font-semibold flex items-center justify-center gap-1"
                    >
                      {expandedRole === role.id ? 'Hide' : 'View'} <ChevronDown size={14} className={expandedRole === role.id ? 'rotate-180' : ''}/>
                    </button>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
         <h3 className="font-bold text-blue-900 mb-2">Team Cost Summary</h3>
         <p className="text-blue-800 text-sm">Total Recommended Staff: <b>4</b></p>
         <p className="text-blue-800 text-sm">Estimated Monthly Budget: <b>₹30,000 - ₹45,000</b></p>
         <div className="mt-4 inline-block bg-green-100 text-green-800 px-3 py-1.5 rounded-lg text-sm font-bold">✅ Within your stated budget</div>
      </div>
    </div>
  );
};

export default TeamBlueprint;
