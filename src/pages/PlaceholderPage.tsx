import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PlaceholderPage = ({ title }: { title: string }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border max-w-md w-full">
         <div className="text-4xl mb-4">🚧</div>
         <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
         <p className="text-gray-500 mb-8">This feature is coming soon! Our engineers are working hard on it.</p>
         <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-6 py-2 rounded-xl transition-colors">
            <ArrowLeft size={18} /> Go Back
         </button>
      </div>
    </div>
  );
};
