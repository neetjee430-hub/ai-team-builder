import { useState, useEffect } from 'react';
import { Plus, Users, QrCode, Edit3, X, Download, UserCheck, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActiveRoles = () => {
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [hiredData, setHiredData] = useState<Record<string, string>>({});

  // New role form state
  const [newRole, setNewRole] = useState({ title: '', dept: '', openings: '1', min: '', max: '', exp: '0-1 yr (Fresher)' });

  const [roles, setRoles] = useState([
    { id: 1, title: 'Senior Hair Stylist', dept: 'Salon', candidates: 12, interviews: 5, status: 'open' },
    { id: 2, title: 'Receptionist', dept: 'Front Desk', candidates: 45, interviews: 12, status: 'open' },
  ]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('hiredData') || '{}');
    setHiredData(data);
  }, []);

  const handleCreateRole = () => {
    if (!newRole.title || !newRole.dept) return;
    const roleId = roles.length + 1;
    setRoles([...roles, {
       id: roleId,
       title: newRole.title,
       dept: newRole.dept,
       candidates: 0,
       interviews: 0,
       status: 'open'
    }]);
    setIsAddModalOpen(false);
    setNewRole({ title: '', dept: '', openings: '1', min: '', max: '', exp: '0-1 yr (Fresher)' });
  };

  const handleRemoveHired = (roleId: number) => {
    const newData = { ...hiredData };
    delete newData[`role_${roleId}`];
    setHiredData(newData);
    localStorage.setItem('hiredData', JSON.stringify(newData));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Active Job Roles</h1>
          <p className="text-gray-500 mt-1">Manage positions and share hiring links.</p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-900 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium hover:bg-blue-800 transition-colors">
          <Plus size={20} /> Add New Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(role => {
          const hiredCandidate = hiredData[`role_${role.id}`];
          return (
          <div key={role.id} className="bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md mb-2 inline-block">{role.dept}</span>
                <h3 className="text-xl font-bold text-gray-900">{role.title}</h3>
              </div>
              {hiredCandidate ? (
                <div className="bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold">FILLED</div>
              ) : (
                <div className="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-bold">OPEN</div>
              )}
            </div>
            
            {hiredCandidate ? (
              <div className="p-6 flex-1 flex flex-col gap-4">
                 <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                    <p className="text-green-800 text-sm font-semibold flex items-center gap-2"><UserCheck size={18}/> Hired Candidate</p>
                    <p className="text-xl font-bold text-green-900 mt-1">{hiredCandidate}</p>
                 </div>
                 <div className="mt-auto pt-4 flex gap-3">
                   <button onClick={() => navigate('/dashboard/candidates')} className="flex-1 py-2 rounded-lg bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 text-sm">Review Others</button>
                   <button onClick={() => handleRemoveHired(role.id)} className="flex-1 py-2 rounded-lg border border-red-200 text-red-600 font-bold hover:bg-red-50 text-sm flex items-center justify-center gap-1"><RefreshCw size={14}/> Change</button>
                 </div>
              </div>
            ) : (
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <p className="text-gray-500 text-sm">Applied</p>
                    <p className="text-xl font-bold text-gray-900">{role.candidates}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <p className="text-gray-500 text-sm">Interviewed</p>
                    <p className="text-xl font-bold text-gray-900">{role.interviews}</p>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 border-t grid grid-cols-3 divide-x text-center">
                  <button onClick={() => navigate('/dashboard/candidates')} className="text-blue-600 hover:text-blue-800 py-2 flex flex-col items-center justify-center gap-1 text-sm font-medium">
                    <Users size={18} /> Candidates
                  </button>
                  <button onClick={() => setIsQrModalOpen(true)} className="text-gray-600 hover:text-gray-800 py-2 flex flex-col items-center justify-center gap-1 text-sm font-medium">
                    <QrCode size={18} /> Share QR
                  </button>
                  <button onClick={() => setIsEditModalOpen(true)} className="text-gray-600 hover:text-gray-800 py-2 flex flex-col items-center justify-center gap-1 text-sm font-medium">
                    <Edit3 size={18} /> Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        )})}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl w-full max-w-lg p-6">
             <div className="flex justify-between items-center border-b pb-4 mb-4">
               <h2 className="text-xl font-bold">Add New Role</h2>
               <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-800"><X/></button>
             </div>
             <div className="space-y-4">
                <div><label className="block text-sm font-medium mb-1">Role Title</label><input type="text" value={newRole.title} onChange={e => setNewRole({...newRole, title: e.target.value})} className="w-full border p-3 rounded-xl" placeholder="e.g. Makeup Artist" /></div>
                <div><label className="block text-sm font-medium mb-1">Department</label><input type="text" value={newRole.dept} onChange={e => setNewRole({...newRole, dept: e.target.value})} className="w-full border p-3 rounded-xl" placeholder="e.g. Beauty" /></div>
                <div><label className="block text-sm font-medium mb-1">Number of Openings</label><input type="number" value={newRole.openings} onChange={e => setNewRole({...newRole, openings: e.target.value})} className="w-full border p-3 rounded-xl" placeholder="2" /></div>
             </div>
             <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-xl border font-bold">Cancel</button>
                <button onClick={handleCreateRole} className="px-5 py-2.5 rounded-xl bg-blue-900 text-white font-bold">Create Role</button>
             </div>
           </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl w-full max-w-lg p-6">
             <div className="flex justify-between items-center border-b pb-4 mb-4">
               <h2 className="text-xl font-bold">Edit Role</h2>
               <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-800"><X/></button>
             </div>
             <p className="text-gray-500 mb-6 font-medium text-center">Edit form goes here...</p>
             <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setIsEditModalOpen(false)} className="px-5 py-2.5 bg-blue-900 text-white rounded-xl font-bold w-full">Save Changes</button>
             </div>
           </div>
        </div>
      )}

      {isQrModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl w-full max-w-sm p-8 text-center">
             <div className="flex justify-end"><button onClick={() => setIsQrModalOpen(false)} className="text-gray-500 hover:text-gray-800"><X/></button></div>
             <h2 className="text-xl font-bold text-gray-900 mb-2">Scan to Apply</h2>
             <p className="text-sm text-gray-500 mb-6">Print this QR code and put it on your reception desk. Walk-in candidates can scan it and apply directly!</p>
             <div className="bg-gray-100 w-48 h-48 mx-auto rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
                <span className="text-gray-400 font-bold">QR CODE</span>
             </div>
             <button onClick={() => setIsQrModalOpen(false)} className="mt-6 w-full py-3 bg-blue-50 text-blue-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">
               <Download size={18} /> Download Poster
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ActiveRoles;
