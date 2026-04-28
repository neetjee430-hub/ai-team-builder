import { useState, useEffect } from 'react';
import { Download, RefreshCw, ChevronDown, UserSquare2, DollarSign, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateTeamBlueprint } from '../services/geminiOrchestrator';
import { businessCategories } from '../data/constants';

const TeamBlueprint = () => {
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [blueprintData, setBlueprintData] = useState<any>(null);
  const [businessData, setBusinessData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const localData = localStorage.getItem('businessData');
    if (localData) {
      setBusinessData(JSON.parse(localData));
    }
    
    const savedBlueprint = localStorage.getItem('teamBlueprint');
    if (savedBlueprint) {
      setBlueprintData(JSON.parse(savedBlueprint));
    } else if (localData) {
      handleRegenerate(JSON.parse(localData));
    }
  }, []);

  const handleDownload = () => {
    const printContent = document.getElementById('blueprint-content');
    if (!printContent) return;
    const originalBody = document.body.innerHTML;
    
    const printStyles = `
      <style>
        body { font-family: Arial, sans-serif; color: #000; padding: 20px;}
        .no-print { display: none !important; }
        .role-card { border: 1px solid #ccc; margin: 10px; padding: 15px; }
        h1 { color: #1E3A8A; }
        @media print { body { margin: 0; } }
      </style>
    `;
    
    document.body.innerHTML = printStyles + printContent.innerHTML;
    window.print();
    document.body.innerHTML = originalBody;
    window.location.reload();
  };

  const handleShare = () => {
    if (!blueprintData) return;
    const rolesText = blueprintData.roles.map((r: any) => `${r.count} ${r.title}`).join(', ');
    const text = `Check out my Team Blueprint from HireGuru AI!\nWe need: ${rolesText}.`;
    navigator.clipboard.writeText(text);
    alert("Blueprint copied to clipboard!");
  };

  const handlePostJob = (role: any) => {
    const newJob = {
      id: Date.now().toString(),
      roleTitle: role.title,
      department: "General",
      openings: role.count,
      salaryMin: parseInt(role.salary.match(/\d+/)?.[0] || "10") * 1000,
      salaryMax: (parseInt(role.salary.match(/\d+/)?.[0] || "10") + 5) * 1000,
      skillsRequired: [role.reqs],
      experienceRequired: "1-2 years",
      isActive: true,
      createdAt: new Date().toISOString(),
      source: 'blueprint'
    };
    
    const existing = JSON.parse(localStorage.getItem('jobRoles') || '[]');
    existing.unshift(newJob);
    localStorage.setItem('jobRoles', JSON.stringify(existing));
    
    navigate('/dashboard/roles', {
      state: { newJobCreated: true, jobTitle: role.title }
    });
  };

  const handleRegenerate = async (data = businessData) => {
    if (!data) return;
    setIsRegenerating(true);
    try {
      const generated = await generateTeamBlueprint(data);
      if (generated) {
        setBlueprintData(generated);
        localStorage.setItem('teamBlueprint', JSON.stringify(generated));
      }
    } catch (e) {
      console.error(e);
      alert("Failed to generate. Please try again.");
    } finally {
      setIsRegenerating(false);
    }
  };

  const roles = blueprintData?.roles || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border shadow-sm gap-4">
        <div>
          <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-md uppercase">
             {businessData?.categoryIds?.[0] ? (businessCategories.find(c => c.id === businessData.categoryIds[0])?.name || businessData.categoryIds[0]) : 'BUSINESS'}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">AI Team Blueprint</h1>
          <p className="text-gray-500 mt-1">
             {businessData?.calculatedArea ? `Based on ${businessData.calculatedArea} sq.ft space.` : ''} {blueprintData?.estimatedMonthlyBudgetStr ? `Est. Budget: ${blueprintData.estimatedMonthlyBudgetStr}` : ''}
          </p>
          {blueprintData?.budgetStatus && (
            <span className={`inline-block mt-2 text-xs font-bold px-2 py-1 rounded-md ${blueprintData.budgetStatus.includes('Within') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {blueprintData.budgetStatus}
            </span>
          )}
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={handleShare} className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium border hover:bg-gray-100 transition-colors flex items-center gap-2">
             <Share2 size={16} /> Share
          </button>
          <button onClick={handleRegenerate} disabled={isRegenerating} className="bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium border hover:bg-gray-100 transition-colors flex items-center gap-2">
             <RefreshCw size={16} className={isRegenerating ? "animate-spin" : ""} /> {isRegenerating ? 'Regenerating...' : 'Regenerate'}
          </button>
          <button onClick={handleDownload} className="bg-blue-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center gap-2">
             <Download size={16} /> Download
          </button>
        </div>
      </div>

      <div id="blueprint-content" className="bg-white p-8 rounded-xl shadow-sm border overflow-x-auto">
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

            <div className="flex justify-center flex-wrap gap-4 w-[90%] md:w-[80%]">
               {roles.length === 0 && isRegenerating && (
                 <div className="text-gray-500 font-medium py-8 animate-pulse text-center w-full">
                    AI is designing your perfect team structure based on Indian market data...
                 </div>
               )}
               {roles.map((role: any) => (
                 <div key={role.id} className="bg-white border-2 border-gray-200 min-w-[30%] max-w-[350px] flex-1 rounded-xl shadow-sm overflow-hidden flex flex-col relative group transition-all hover:border-amber-400">
                    <div className="p-4 flex-1">
                       <h3 className="font-bold text-gray-900 border-b pb-2 mb-3 leading-tight">{role.title}</h3>
                       <p className="text-sm font-medium text-gray-700 flex items-center gap-1.5"><UserSquare2 size={16}/> {role.count} Person</p>
                       <p className="text-sm font-medium text-gray-700 mt-1 flex items-center gap-1.5"><DollarSign size={16}/> {role.salary}</p>
                       <p className="text-xs font-bold mt-3 inline-block px-2 py-1 bg-gray-100 rounded text-gray-600">{role.priority}</p>
                    </div>
                    {expandedRole === role.id && (
                       <div className="p-4 bg-gray-50 border-t text-sm text-gray-600 leading-relaxed">
                          <p className="mb-3"><strong>Req:</strong> {role.reqs}</p>
                          <button 
                            className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold text-xs hover:bg-blue-700 transition shadow-sm"
                            onClick={() => handlePostJob(role)}
                          >
                            Post Job Now ✨
                          </button>
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
