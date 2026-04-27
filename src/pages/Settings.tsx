import { useState } from 'react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Business Profile');
  const tabs = ['Business Profile', 'Interview Settings', 'Notifications', 'Subscription'];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-500">Manage your business profile and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-2">
          {tabs.map((tab) => (
             <div 
               key={tab} 
               onClick={() => setActiveTab(tab)}
               className={`p-3 rounded-lg font-medium cursor-pointer ${activeTab === tab ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
             >
               {tab}
             </div>
          ))}
        </div>
        
        <div className="md:col-span-3 bg-white p-6 rounded-xl border shadow-sm space-y-6">
           <h2 className="text-xl font-bold border-b pb-4">{activeTab}</h2>
           
           {activeTab === 'Business Profile' && (
             <>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium mb-1">Business Name</label>
                   <input type="text" defaultValue="Glamour Salon" className="w-full border p-2 rounded-lg" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-1">Business Type</label>
                   <select className="w-full border p-2 rounded-lg bg-gray-50">
                     <option>Salon</option>
                     <option>Gym</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-1">Owner Name</label>
                   <input type="text" defaultValue="Amit Kumar" className="w-full border p-2 rounded-lg" />
                 </div>
                 <div>
                   <label className="block text-sm font-medium mb-1">Mobile Number</label>
                   <input type="tel" defaultValue="+91 9876543210" className="w-full border p-2 rounded-lg" />
                 </div>
               </div>

               <div className="pt-4 flex justify-end">
                 <button className="bg-blue-900 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-800">Save Changes</button>
               </div>
             </>
           )}

           {activeTab === 'Interview Settings' && (
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-xl">
                   <div>
                      <h4 className="font-bold text-gray-900">AI Roleplay Enabled</h4>
                      <p className="text-sm text-gray-500">Test candidates with real-world scenarios</p>
                   </div>
                   <input type="checkbox" defaultChecked className="w-5 h-5 accent-amber-500" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-xl">
                   <div>
                      <h4 className="font-bold text-gray-900">Strict Micro-Expression Tracking</h4>
                      <p className="text-sm text-gray-500">Detect nervousness and truthfulness</p>
                   </div>
                   <input type="checkbox" defaultChecked className="w-5 h-5 accent-amber-500" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-xl">
                   <div>
                      <h4 className="font-bold text-gray-900">Auto-Reject Below 50%</h4>
                      <p className="text-sm text-gray-500">Filter out highly unqualified candidates</p>
                   </div>
                   <input type="checkbox" className="w-5 h-5 accent-amber-500" />
                </div>
             </div>
           )}

           {activeTab === 'Notifications' && (
             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-xl">
                   <div>
                      <h4 className="font-bold text-gray-900">WhatsApp Alerts</h4>
                      <p className="text-sm text-gray-500">Get notified when a skilled candidate applies</p>
                   </div>
                   <input type="checkbox" defaultChecked className="w-5 h-5 accent-green-500" />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-xl">
                   <div>
                      <h4 className="font-bold text-gray-900">Email Reports</h4>
                      <p className="text-sm text-gray-500">Weekly hiring summary and AI insights</p>
                   </div>
                   <input type="checkbox" className="w-5 h-5 accent-blue-500" />
                </div>
             </div>
           )}

           {activeTab === 'Subscription' && (
             <div className="space-y-4 text-center py-6 border rounded-xl border-amber-200 bg-amber-50">
                <div className="text-amber-500 text-4xl mb-2">⭐</div>
                <h3 className="font-bold text-xl text-gray-900">Free Tier Active</h3>
                <p className="text-gray-600 mb-6">You have 12 free AI interviews remaining this month.</p>
                <button className="bg-amber-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-amber-600">Upgrade to Pro</button>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
