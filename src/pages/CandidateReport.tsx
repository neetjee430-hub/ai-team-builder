import { useState } from 'react';
import { ArrowLeft, Phone, UserCircle, Star, BadgeCheck, FileText, Activity, TrendingDown, Target, BrainCircuit, ShieldAlert, AlertCircle, Mic, Play, MessageCircle, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';

const confidenceData = [
  { time: 'Q1', confidence: 85, point: 'Warmup' },
  { time: 'Q2', confidence: 82, point: 'Experience' },
  { time: 'Q3', confidence: 45, point: 'Counter-Question' },
  { time: 'Flash Test', confidence: 50, point: 'Stress Flash' },
  { time: 'Q5', confidence: 30, point: 'Timer Test' },
  { time: 'Roleplay', confidence: 75, point: 'Roleplay' },
  { time: 'Distraction', confidence: 72, point: 'Attention Check' },
  { time: 'End', confidence: 80, point: 'Closing' },
];

const CandidateReport = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [actionStatus, setActionStatus] = useState<'none' | 'hired' | 'rejected'>('none');

  const handleHire = () => {
    setActionStatus('hired');
    // Save to local storage for ActiveRoles page
    const hiredData = JSON.parse(localStorage.getItem('hiredData') || '{}');
    hiredData['role_1'] = 'Priya Sharma'; // hardcoded for demo
    localStorage.setItem('hiredData', JSON.stringify(hiredData));
    
    setTimeout(() => {
       navigate('/dashboard/roles');
    }, 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="mb-4">
        <Link to="/dashboard/candidates" className="text-blue-600 hover:underline flex items-center gap-2">
           <ArrowLeft size={16} /> Back to Candidates
        </Link>
      </div>

      {actionStatus === 'hired' && (
        <div className="bg-green-100 text-green-800 p-4 rounded-xl border border-green-200 font-bold text-center">
          ✅ Candidate marked as Hired!
        </div>
      )}
      {actionStatus === 'rejected' && (
        <div className="bg-red-100 text-red-800 p-4 rounded-xl border border-red-200 font-bold text-center">
          ❌ Candidate rejected. Rejection message sent.
        </div>
      )}

      {/* Header Profile Section */}
      <div className="bg-white p-8 rounded-2xl border shadow-sm flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-bl-full -z-10"></div>
         <div className="w-32 h-32 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 shadow-inner">
            <UserCircle size={80} />
         </div>
         <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Priya Sharma</h1>
            <p className="text-gray-500 mb-4">Applied for: Senior Hair Stylist</p>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg inline-flex items-center gap-2 font-bold mb-4 shadow-sm border border-green-200">
               <BadgeCheck size={20} /> AI FINAL RECOMMENDATION: HIRE
            </div>
            <p className="text-gray-700 max-w-2xl text-sm leading-relaxed border-l-4 border-blue-200 pl-4">
               "Strong practical knowledge. Shows excellent situational confidence during Roleplay. Struggles under artificial time-pressure but recovers remarkably fast. High professional integrity detected during consistency checks."
            </p>
         </div>
         <div className="shrink-0 flex flex-col items-center">
             <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                   <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#E5E7EB" strokeWidth="3" />
                   <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="78, 100" />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                   <span className="text-3xl font-black text-amber-500">78</span>
                   <span className="text-xs text-gray-500 font-bold uppercase">/ 100</span>
                </div>
             </div>
         </div>
      </div>

      {/* New: Top Action Buttons matching requirement */}
      <div className="flex flex-col md:flex-row gap-3 mt-6 mb-8 w-full">
        <button onClick={handleHire} className="flex-1 flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-sm transition">
          <BadgeCheck size={20} /> Hire Candidate
        </button>
        <button onClick={() => setActionStatus('rejected')} className="flex-1 flex justify-center items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-6 py-3 rounded-xl font-bold shadow-sm transition">
          <ShieldAlert size={20} /> Reject
        </button>
        <button onClick={() => window.open(`https://wa.me/919876543210`, '_blank')} className="flex-1 flex justify-center items-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] px-6 py-3 rounded-xl font-bold shadow-sm transition whitespace-nowrap">
          <MessageCircle size={20} /> WhatsApp Candidate
        </button>
      </div>

      {/* New: Visual Red/Green Flags */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm flex flex-col md:flex-row gap-6">
        <div className="flex-1 border border-green-200 bg-green-50 rounded-xl p-5">
           <h4 className="text-sm font-bold text-green-700 uppercase tracking-widest mb-3 flex items-center gap-2"><CheckCircle2 size={16} /> Green Flags</h4>
           <ul className="space-y-2 text-sm text-green-900 font-medium">
              <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div> 5+ years of verified salon experience</li>
              <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div> Friendly tone; high empathy scores</li>
              <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div> Willing to work weekends and holidays</li>
           </ul>
        </div>
        <div className="flex-1 border border-red-200 bg-red-50 rounded-xl p-5">
           <h4 className="text-sm font-bold text-red-700 uppercase tracking-widest mb-3 flex items-center gap-2"><AlertTriangle size={16} /> Red Flags</h4>
           <ul className="space-y-2 text-sm text-red-900 font-medium">
              <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div> Salary expectation slightly high (₹25k vs ₹20k budget)</li>
              <li className="flex gap-2 items-start"><div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div> Paused uncomfortably during chemical mixing question</li>
           </ul>
        </div>
      </div>

      {/* FEATURE: INTERVIEW PLAYBACK TIMELINE */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
         <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><Play className="text-amber-500 fill-current" /> AI Interview Playback</h3>
         <div className="bg-gray-900 rounded-xl p-6 text-white mb-6 relative overflow-hidden ring-1 ring-gray-800 shadow-xl">
            <div className="flex justify-between items-end mb-4">
               <div>
                  <div className="text-sm text-gray-400 font-bold tracking-widest uppercase mb-1">Recording</div>
                  <div className="text-2xl font-mono text-blue-300">12:45</div>
               </div>
               <button className="bg-amber-500 hover:bg-amber-400 text-black w-14 h-14 rounded-full flex items-center justify-center transition shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer">
                  <Play size={24} className="fill-current ml-1" />
               </button>
            </div>
            
            <div className="mt-8">
               <div className="text-xs text-gray-400 mb-2 font-bold uppercase tracking-wider flex items-center justify-between">
                 <span>Confidence Timeline</span>
                 <span className="text-yellow-400">⚠️ Drop at 06:30</span>
               </div>
               <div className="h-24 w-full bg-gray-800 rounded-xl relative flex items-end overflow-hidden p-1 gap-1">
                  {[90, 92, 85, 88, 70, 60, 55, 65, 80, 85, 90, 95, 96, 95, 92, 90].map((h, i) => (
                     <div key={i} className="flex-1 rounded-t-sm transition-all" style={{ height: `${h}%`, backgroundColor: h < 65 ? '#EAB308' : '#3B82F6' }}></div>
                  ))}
               </div>
               <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                  <span>00:00</span>
                  <span className="text-yellow-500 font-bold">06:30 (Timer Test)</span>
                  <span>12:45</span>
               </div>
            </div>
         </div>
         <div className="space-y-4">
            <h4 className="font-bold text-gray-900">Playback Highlights</h4>
            <div className="flex gap-4 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition">
               <div className="w-16 font-mono text-sm font-bold text-gray-500 shrink-0 mt-0.5">00:00</div>
               <div className="flex-1"><div className="font-medium text-gray-900">Intro & Background</div></div>
               <div className="flex items-center gap-2 shrink-0"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-sm font-bold">90% Conf.</span></div>
            </div>
            <div className="flex gap-4 p-4 border border-yellow-200 bg-yellow-50 rounded-xl cursor-pointer transition relative overflow-hidden">
               <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500"></div>
               <div className="w-16 font-mono text-sm font-bold text-yellow-700 shrink-0 mt-0.5">06:30</div>
               <div className="flex-1"><div className="font-medium text-yellow-900">Knowledge of chemicals (Timer Test)</div></div>
               <div className="flex items-center gap-2 shrink-0"><div className="w-2 h-2 rounded-full bg-yellow-500"></div><span className="text-sm font-bold text-yellow-700">60% Conf.</span></div>
            </div>
            <div className="flex gap-4 p-4 border rounded-xl hover:bg-gray-50 cursor-pointer transition">
               <div className="w-16 font-mono text-sm font-bold text-gray-500 shrink-0 mt-0.5">08:45</div>
               <div className="flex-1"><div className="font-medium text-gray-900">Roleplay: Angry customer</div></div>
               <div className="flex items-center gap-2 shrink-0"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-sm font-bold">85% Conf.</span></div>
            </div>
         </div>
      </div>

      {/* FEATURE 8: CONFIDENCE JOURNEY GRAPH */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
           <TrendingDown className="text-indigo-500"/> Confidence Journey Graph
        </h3>
        <p className="text-sm text-gray-500 mb-6">Real-time analysis of voice, micro-expressions, and eye-contact under stress.</p>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={confidenceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
              <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#111827' }}
              />
              <Line 
                type="monotone" 
                dataKey="confidence" 
                stroke="#3B82F6" 
                strokeWidth={4} 
                dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} 
                activeDot={{ r: 6, fill: '#3B82F6' }}
              />
              <ReferenceDot x="Q5" y={30} r={6} fill="#EF4444" stroke="#fff" strokeWidth={2} />
              <ReferenceDot x="Roleplay" y={75} r={6} fill="#10B981" stroke="#fff" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 bg-gray-50 p-4 border rounded-xl text-sm text-gray-700">
           <strong>⚡ AI Insight:</strong> Priya's confidence drops significantly under artificial time pressure (Timer Test) but she recovers remarkably well during the practical Roleplay phase. This indicates she may get flustered by tight deadlines, but excels in actual customer-facing crisis management.
        </div>
      </div>

      {/* New Detailed Scoring Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
             <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center justify-between">
                <span className="flex items-center gap-2"><Target className="text-red-500" size={18}/> Roleplay Score</span>
                <span className="text-xl font-bold">22/25</span>
             </h3>
             <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between items-center"><span>Real-time Response:</span> <span>Excellent</span></li>
                <li className="flex justify-between items-center"><span>Conflict Resolution:</span> <span>High</span></li>
                <li className="flex justify-between items-center"><span>Empathy Tone:</span> <span>Moderate</span></li>
             </ul>
             <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-red-500 h-1.5 rounded-full w-[88%]"></div></div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
             <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center justify-between">
                <span className="flex items-center gap-2"><AlertCircle className="text-orange-500" size={18}/> Pressure Confidence</span>
                <span className="text-xl font-bold">14/25</span>
             </h3>
             <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between items-center"><span>Handling Surprise Qs:</span> <span>Fair</span></li>
                <li className="flex justify-between items-center"><span>Under Timer:</span> <span className="text-red-500">Struggled</span></li>
                <li className="flex justify-between items-center"><span>Distraction Focus:</span> <span>Strong</span></li>
             </ul>
             <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-orange-500 h-1.5 rounded-full w-[56%]"></div></div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
             <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center justify-between">
                <span className="flex items-center gap-2"><Star className="text-amber-500" size={18}/> Consistency Score</span>
                <span className="text-xl font-bold">9/10</span>
             </h3>
             <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between items-center"><span>Experience Claims:</span> <span className="text-green-600">Verified</span></li>
                <li className="flex justify-between items-center"><span>Skill Continuity:</span> <span className="text-green-600">Matched</span></li>
                <li className="flex gap-1 items-center mt-2 text-xs text-gray-500 border-t pt-2"><ShieldAlert size={12}/> No major contradictions detected.</li>
             </ul>
             <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-amber-500 h-1.5 rounded-full w-[90%]"></div></div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
             <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center justify-between">
                <span className="flex items-center gap-2"><Mic className="text-purple-500" size={18}/> Voice Confidence</span>
                <span className="text-xl font-bold">12/15</span>
             </h3>
             <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between items-center"><span>Speaking Pace:</span> <span>Normal (130wpm)</span></li>
                <li className="flex justify-between items-center"><span>Tremors Detected:</span> <span>Low</span></li>
                <li className="flex justify-between items-center"><span>Filler Words:</span> <span>Moderate</span></li>
             </ul>
             <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-purple-500 h-1.5 rounded-full w-[80%]"></div></div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
             <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center justify-between">
                <span className="flex items-center gap-2"><BrainCircuit className="text-teal-500" size={18}/> Self-Awareness</span>
                <span className="text-xl font-bold">8/10</span>
             </h3>
             <p className="text-sm text-gray-600 mb-2">Candidate scored themselves 6/10 overall, aligning very closely with AI's baseline assessment. Shows humility and accurate reflection.</p>
             <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-teal-500 h-1.5 rounded-full w-[80%]"></div></div>
          </div>
          
          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
             <h3 className="font-bold text-gray-800 border-b pb-2 flex items-center justify-between">
                <span className="flex items-center gap-2"><Activity className="text-blue-500" size={18}/> Body Language</span>
                <span className="text-xl font-bold">16/20</span>
             </h3>
             <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex justify-between items-center"><span>Eye Contact Maintained:</span> <span>High</span></li>
                <li className="flex justify-between items-center"><span>Micro-Expressions:</span> <span>Calm baseline</span></li>
                <li className="flex justify-between items-center"><span>Posture:</span> <span>Slightly tense</span></li>
             </ul>
             <div className="w-full bg-gray-100 h-1.5 rounded-full"><div className="bg-blue-500 h-1.5 rounded-full w-[80%]"></div></div>
          </div>
      </div>

      <div className="sticky bottom-0 flex flex-nowrap md:justify-end gap-3 pt-6 pb-4 bg-gradient-to-t from-gray-50 via-gray-50/90 to-transparent z-10 -mx-6 px-6">
          <button onClick={() => setActionStatus('rejected')} className="flex-1 md:flex-none px-6 py-3 border border-red-200 bg-white text-red-600 rounded-xl hover:bg-red-50 font-bold transition-all shadow-sm flex items-center justify-center gap-2"><ShieldAlert size={18}/> Reject</button>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none px-6 py-3 bg-[#25D366]/10 text-[#25D366] rounded-xl hover:bg-[#25D366]/20 font-bold flex items-center justify-center gap-2 transition-all shadow-sm"><MessageCircle size={18}/> WhatsApp</a>
          <button onClick={handleHire} className="flex-1 md:flex-none px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-green-600/20"><BadgeCheck size={18}/> Mark as Hired</button>
      </div>

    </div>
  );
};

export default CandidateReport;
