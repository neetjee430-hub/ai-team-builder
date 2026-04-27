import { useState } from 'react';
import { Search, Filter, UserCircle, CheckCircle2, XCircle, HelpCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockCandidates = [
  { id: 1, name: 'Priya Sharma', score: 84, recommendation: 'hire', appliedFor: 'Senior Stylist', date: '2 hrs ago' },
  { id: 2, name: 'Rahul Verma', score: 62, recommendation: 'maybe', appliedFor: 'Receptionist', date: '1 day ago' },
  { id: 3, name: 'Neha Gupta', score: 45, recommendation: 'dont_hire', appliedFor: 'Hair Stylist', date: '2 days ago' },
];

const CandidateList = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Candidates</h1>
          <p className="text-gray-500 mt-1">Review AI scorecards and interview results.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
             <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg outline-none" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCandidates.map(candidate => (
          <div key={candidate.id} className="bg-white p-6 border rounded-xl shadow-sm">
             <div className="flex items-center gap-4 mb-4">
                <UserCircle className="w-12 h-12 text-blue-600" />
                <div>
                   <h3 className="font-bold text-lg">{candidate.name}</h3>
                   <p className="text-sm text-gray-500">{candidate.appliedFor}</p>
                </div>
             </div>
             <div className="mb-4">Score: {candidate.score}</div>
             <Link to={`/dashboard/candidate/${candidate.id}`} className="text-blue-600 font-medium hover:underline">View Report</Link>
          </div>
        ))}
      </div>
    </div>
  );
};
export default CandidateList;
