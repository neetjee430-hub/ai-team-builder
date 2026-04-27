import { useState } from 'react';
import { Video, Star, Clock, Filter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const mockInterviews = [
  { id: 1, name: 'Priya Sharma', role: 'Senior Stylist', date: 'Today, 10:30 AM', duration: '12m', score: 84, status: 'completed' },
  { id: 2, name: 'Rahul Verma', role: 'Receptionist', date: 'Yesterday, 2:15 PM', duration: '9m', score: 62, status: 'completed' },
  { id: 3, name: 'Amit Singh', role: 'Hair Stylist', date: 'Yesterday, 11:00 AM', duration: '10m', score: 75, status: 'completed' },
];

const InterviewsTracker = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Completed Interviews</h1>
          <p className="text-gray-500 mt-1">Review AI interview recordings and detailed transcripts.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 border-b text-sm font-semibold">
                <th className="p-4">Candidate</th>
                <th className="p-4">Role</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Duration</th>
                <th className="p-4">AI Score</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-800">
              {mockInterviews.map((interview) => (
                <tr key={interview.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium">{interview.name}</td>
                  <td className="p-4 text-gray-600">{interview.role}</td>
                  <td className="p-4 text-gray-500 text-sm">
                     <span className="flex items-center gap-1"><Clock size={14}/> {interview.date}</span>
                  </td>
                  <td className="p-4 text-gray-600">{interview.duration}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 font-bold">
                       <Star size={16} className={interview.score >= 75 ? 'text-green-500' : 'text-amber-500'} />
                       {interview.score}/100
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Link to={`/dashboard/candidate/${interview.id}`} className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                      <Eye size={16} /> View Results
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InterviewsTracker;
