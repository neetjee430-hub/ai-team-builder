import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CategorySelector } from '../components/CategorySelector';
import { MapPin } from 'lucide-react';
import { topCities, indianStates } from '../data/constants';
import { SearchableSelect } from '../components/SearchableSelect';

const steps = [
  { id: 1, title: 'Business Details' },
  { id: 2, title: 'Location & Size' },
  { id: 3, title: 'Budget' },
  { id: 4, title: 'Hiring Urgency' },
  { id: 5, title: 'Preferences' }
];

const BudgetCards = [
  { id: 1, range: '₹10k – ₹20k', desc: '👤 Solo / 1-2 Staff' },
  { id: 2, range: '₹20k – ₹40k', desc: '👥 Small Team (2-3 Staff)' },
  { id: 3, range: '₹40k – ₹60k', desc: '👨‍👩‍👧 Growing Team (3-5 Staff)' },
  { id: 4, range: '₹60k – ₹80k', desc: '🏢 Established Team (5-7 Staff)' },
  { id: 5, range: '₹80k – ₹1L', desc: '🏬 Medium Business (7-10 Staff)' },
  { id: 6, range: '₹1L – ₹1.5L', desc: '🏭 Scaling Business' },
  { id: 7, range: '₹1.5L – ₹2L', desc: '🏗️ Large Operation' },
  { id: 8, range: '₹2L – ₹3L', desc: '🏛️ Big Business' },
];

const OnboardingWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  // Step 1
  const [categories, setCategories] = useState<string[]>([]);
  const [businessDescription, setBusinessDescription] = useState('');

  // Step 2
  const [isDetectingLoc, setIsDetectingLoc] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [locData, setLocData] = useState({ area: '', city: '', state: '', pin: '' });
  const [size, setSize] = useState({ length: '', width: '', height: '' });
  const [staff, setStaff] = useState({ current: '', target: '' });
  
  // Step 3
  const [budget, setBudget] = useState<number | null>(null);

  // Step 4
  const [urgencyText, setUrgencyText] = useState('');

  // Step 5
  const [comms, setComms] = useState({ whatsapp: true, email: false });
  const [whatsappNum, setWhatsappNum] = useState("9876543210");
  const [emailAddress, setEmailAddress] = useState("");
  const [commError, setCommError] = useState("");

  const handleDetectLocation = () => {
    setIsDetectingLoc(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            const address = data.address;
            
            setIsDetectingLoc(false);
            setLocationDetected(true);
            
            // Map OSN to fields
            setLocData({ 
              area: address.suburb || address.neighbourhood || address.road || '', 
              city: address.city || address.town || address.county || '', 
              state: address.state || '', 
              pin: address.postcode || '' 
            });
          } catch (e) {
             fallbackLocation();
          }
        },
        () => { fallbackLocation(); }
      );
    } else {
       fallbackLocation();
    }
  };

  const fallbackLocation = () => {
    setTimeout(() => {
      setIsDetectingLoc(false);
      setLocationDetected(true);
      setLocData({ area: 'Vijay Nagar', city: 'Indore', state: 'Madhya Pradesh', pin: '452010' });
    }, 1000);
  };

  const calculateArea = () => {
    if (size.length && size.width) {
      return parseInt(size.length) * parseInt(size.width);
    }
    return 0;
  };
  const area = calculateArea();

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-6 sm:py-12 px-4 overflow-y-auto">
      <div className="w-full max-w-3xl mb-8">
        <div className="flex justify-between items-center mb-2 px-2">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                currentStep >= step.id ? 'bg-blue-900 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                {step.id}
              </div>
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-300 rounded-full w-full">
           <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} />
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl relative min-h-[500px] flex flex-col border">
         <div className="p-8 flex-grow">
            <h2 className="text-3xl font-bold mb-6 text-blue-900">{steps[currentStep - 1].title}</h2>

            {currentStep === 1 && (
              <div className="space-y-6">
                 <div className="space-y-2">
                     <p className="text-gray-900 font-bold">1. Select your business type</p>
                     <p className="text-gray-500 text-sm">Choose the category that best matches your business.</p>
                     <CategorySelector selectedIds={categories} maxSelect={1} onSelectionChange={setCategories} />
                 </div>
                 <div className="space-y-2 pt-6 border-t border-gray-100">
                     <p className="text-gray-900 font-bold">2. Tell us exactly what your business does...</p>
                     <p className="text-gray-500 text-sm">Example: "We are a premium bridal makeup studio focusing on traditional Indian weddings, usually handling 5-6 weddings a week."</p>
                     <textarea 
                        value={businessDescription}
                        onChange={e => setBusinessDescription(e.target.value)}
                        placeholder="Write a little about your daily business..."
                        className="w-full p-4 border-2 border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] text-sm"
                     />
                 </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                 <div className="space-y-4 bg-gray-50 p-6 rounded-xl border">
                    <button 
                      onClick={handleDetectLocation}
                      disabled={isDetectingLoc}
                      className="w-full border-2 border-blue-500 text-blue-700 bg-blue-50 rounded-xl p-4 font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors"
                    >
                      <MapPin /> {isDetectingLoc ? 'Detecting location...' : (locationDetected ? '📍 Location Detected ✓ (Click to change)' : '📍 Use My Current Location')}
                    </button>
                    
                    <div className="flex items-center gap-4 my-4">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <div className="text-gray-400 font-bold">OR</div>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <input value={locData.area} onChange={e=>setLocData({...locData, area:e.target.value})} placeholder="Shop/Area/Locality" className="p-3 border rounded-xl" />
                       <div className="relative z-50">
                          <SearchableSelect options={topCities} value={locData.city} onChange={val => setLocData({...locData, city: val})} placeholder="Search City..." />
                       </div>
                       <select value={locData.state} onChange={e=>setLocData({...locData, state:e.target.value})} className="p-3 border rounded-xl bg-white">
                         <option value="">Select State</option>
                         {indianStates.map(state => <option key={state} value={state}>{state}</option>)}
                       </select>
                       <input value={locData.pin} onChange={e=>setLocData({...locData, pin:e.target.value})} maxLength={6} placeholder="PIN Code" className="p-3 border rounded-xl" />
                    </div>
                 </div>

                 <div className="space-y-4 border-t pt-8">
                    <h3 className="font-bold text-gray-900">What is the size of your business space?</h3>
                    <p className="text-gray-500 text-sm">This helps our AI understand your capacity and recommend staff.</p>
                    <div className="grid grid-cols-3 gap-4">
                       <div><label className="block text-xs font-bold mb-1">Length (feet)</label><input type="number" value={size.length} onChange={e=>setSize({...size, length:e.target.value})} placeholder="20" className="w-full p-3 border rounded-xl" /></div>
                       <div><label className="block text-xs font-bold mb-1">Width (feet)</label><input type="number" value={size.width} onChange={e=>setSize({...size, width:e.target.value})} placeholder="15" className="w-full p-3 border rounded-xl" /></div>
                       <div><label className="block text-xs font-bold mb-1 text-gray-400">Height (Optional)</label><input type="number" value={size.height} onChange={e=>setSize({...size, height:e.target.value})} placeholder="10" className="w-full p-3 border rounded-xl text-gray-400" /></div>
                    </div>
                    {area > 0 && (
                      <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-200 mt-4 space-y-2">
                        <div className="font-bold">📐 Total Floor Area: {area} sq ft</div>
                        {area < 200 && <div>🟡 Small space — Recommended for 2-3 staff</div>}
                        {area >= 200 && area <= 500 && <div>🟢 Medium space — Recommended for 4-6 staff</div>}
                        {area > 500 && <div>🟢 Large space — Recommended for 7+ staff</div>}
                      </div>
                    )}
                 </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                 <div>
                    <h3 className="font-bold text-gray-900 mb-1">Total monthly budget for staff salaries?</h3>
                    <p className="text-gray-500 text-sm mb-4">Select the total amount for ALL staff combined.</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                       {BudgetCards.map(b => (
                         <div 
                           key={b.id} 
                           onClick={() => setBudget(b.id)}
                           className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex justify-between items-center ${budget === b.id ? 'border-amber-500 bg-amber-500 text-white shadow' : 'bg-white hover:bg-blue-50 border-gray-200'}`}
                         >
                            <div>
                               <div className="font-bold">{b.range}</div>
                               <div className={`text-xs mt-1 ${budget === b.id ? 'text-amber-100' : 'text-gray-500'}`}>{b.desc}</div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h3 className="font-bold text-gray-900 mb-1">When do you need your staff?</h3>
                <div className="bg-yellow-50 p-4 border border-yellow-200 rounded-xl text-yellow-800 text-sm flex gap-3">
                   <div className="text-xl">💡</div>
                   <div>
                     <strong>Example:</strong> "I need a receptionist urgently within 3-4 days because my current one is leaving. Other staff can wait a month."
                   </div>
                </div>
                <div className="flex flex-wrap gap-2">
                   {['🔴 Immediately (1-3 days)', '🟡 This Week (4-7 days)', '🟠 This Month', '🟢 Within 3 Months'].map(chip => (
                     <button key={chip} onClick={() => setUrgencyText(prev => prev ? prev + ' ' + chip : chip)} className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 border rounded-full text-sm font-medium">
                        {chip}
                     </button>
                   ))}
                </div>
                <textarea 
                  value={urgencyText}
                  onChange={(e) => setUrgencyText(e.target.value)}
                  maxLength={300}
                  className="w-full h-32 p-4 border rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Describe your urgency in your own words..."
                />
                <div className="text-right text-xs text-gray-500">{urgencyText.length} / 300 characters</div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                 <div>
                    <h3 className="font-bold text-gray-900 mb-1">How should we keep you updated? ℹ️</h3>
                    <p className="text-gray-500 text-sm mb-6">We'll send alerts for new applicants and interviews.</p>
                    
                    <div className="space-y-4">
                       {commError && <div className="p-3 bg-red-100 text-red-700 text-sm rounded-xl font-bold border border-red-300">{commError}</div>}
                       <div className={`p-5 border-2 rounded-xl transition-colors ${comms.whatsapp ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
                          <div className="flex justify-between items-center mb-4">
                            <div>
                               <div className="font-bold text-gray-900">WhatsApp Updates</div>
                               <div className="text-xs text-gray-500">Get instant candidate alerts via WhatsApp</div>
                            </div>
                            <button onClick={() => { setComms({...comms, whatsapp: !comms.whatsapp}); setCommError(''); }} className={`w-12 h-6 rounded-full relative transition-colors ${comms.whatsapp ? 'bg-green-500' : 'bg-gray-300'}`}>
                               <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${comms.whatsapp ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                          </div>
                          {comms.whatsapp && (
                            <div>
                               <input type="tel" value={whatsappNum} onChange={e => {setWhatsappNum(e.target.value); setCommError('');}} placeholder="Enter WhatsApp Number" className={`w-full p-3 border rounded-xl ${commError.includes('WhatsApp') ? 'border-red-500' : ''}`} />
                               <p className="text-xs text-green-700 mt-2">✅ We'll never spam. Only hiring updates.</p>
                            </div>
                          )}
                       </div>

                       <div className={`p-5 border-2 rounded-xl transition-colors ${comms.email ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}>
                          <div className="flex justify-between items-center mb-4">
                            <div>
                               <div className="font-bold text-gray-900">Email Updates</div>
                               <div className="text-xs text-gray-500">Receive detailed reports in your email</div>
                            </div>
                            <button onClick={() => { setComms({...comms, email: !comms.email}); setCommError(''); }} className={`w-12 h-6 rounded-full relative transition-colors ${comms.email ? 'bg-orange-500' : 'bg-gray-300'}`}>
                               <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${comms.email ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                          </div>
                          {comms.email && (
                            <div>
                               <input type="email" value={emailAddress} onChange={e => {setEmailAddress(e.target.value); setCommError('');}} placeholder="yourname@email.com" className={`w-full p-3 border rounded-xl ${commError.includes('email') ? 'border-red-500' : ''}`} />
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
            )}
         </div>

         <div className="p-6 bg-gray-50 border-t rounded-b-2xl flex justify-between items-center mt-auto">
          <button 
            onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)} 
            disabled={currentStep === 1}
            className={`px-6 py-2.5 rounded-lg font-bold ${currentStep === 1 ? 'opacity-50 text-gray-400' : 'text-blue-900 bg-white border hover:bg-gray-100'}`}
          >
             Back
          </button>
          <button 
            onClick={() => {
               if (currentStep < 5) {
                  setCurrentStep(currentStep + 1);
               } else {
                  if (!comms.whatsapp && !comms.email) {
                     setCommError("Please select at least one updates option.");
                     return;
                  }
                  if (comms.whatsapp && !whatsappNum.trim()) {
                     setCommError("Please enter your WhatsApp number.");
                     return;
                  }
                  if (comms.email && !emailAddress.trim()) {
                      setCommError("Please enter your email address.");
                      return;
                  }
                  
                  // Save all data to local storage for the blueprint building
                  localStorage.setItem('businessData', JSON.stringify({
                      categoryIds: categories,
                      description: businessDescription,
                      location: locData,
                      size,
                      calculatedArea: area,
                      budgetRangeId: budget,
                      urgencyText,
                      communications: comms,
                  }));

                  navigate('/dashboard');
               }
            }}
            className={`px-8 py-2.5 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 ${currentStep === 5 ? 'bg-green-600' : 'bg-blue-900'}`}
          >
            {currentStep === 5 ? 'Build Team Blueprint 🚀' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingWizard;
