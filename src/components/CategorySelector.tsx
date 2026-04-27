import { useState } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import { businessCategories } from '../data/constants';

interface CategorySelectorProps {
  selectedIds: string[];
  maxSelect?: number;
  onSelectionChange: (ids: string[]) => void;
  seekerMode?: boolean;
}

export const CategorySelector = ({ selectedIds, maxSelect = 1, onSelectionChange, seekerMode = false }: CategorySelectorProps) => {
  const [search, setSearch] = useState('');
  const [otherText, setOtherText] = useState('');

  const filteredCategories = businessCategories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) || 
    cat.hindi.includes(search)
  );

  // If searching and no results (except maybe other), show other
  const displayCategories = filteredCategories.length > 0 
    ? filteredCategories 
    : [businessCategories.find(c => c.id === 'other')!];

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(v => v !== id));
    } else {
      if (maxSelect === 1) {
        onSelectionChange([id]);
      } else {
        if (selectedIds.length < maxSelect) {
          onSelectionChange([...selectedIds, id]);
        }
      }
    }
  };

  return (
    <div className="w-full">
      <div className="relative mb-4">
         <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
         <input 
           type="text" 
           value={search}
           onChange={(e) => setSearch(e.target.value)}
           placeholder="Search business type... e.g. 'school', 'salon'" 
           className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
         />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-1 scrollbar-thin">
        {displayCategories.map(cat => {
           const isSelected = selectedIds.includes(cat.id);
           // Simple rephrase for job seeker
           const displayName = seekerMode ? cat.name.replace('Salon / Parlour', 'Salon Work').replace('Gym / Fitness Centre', 'Gym / Fitness Work').replace('School', 'Teaching / School Work') : cat.name;
           const displayHindi = seekerMode ? cat.hindi.replace('पार्लर', 'पार्लर का काम') : cat.hindi;
           
           return (
             <div 
               key={cat.id} 
               onClick={() => handleSelect(cat.id)}
               className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-2
                 ${isSelected 
                    ? 'border-amber-500 bg-amber-50 shadow-md transform -translate-y-1' 
                    : 'border-gray-100 bg-white hover:border-amber-500 hover:shadow-md hover:-translate-y-1'}`}
             >
               <div className="relative">
                 <span className="text-3xl">{cat.icon}</span>
                 {isSelected && <div className="absolute -top-2 -right-4 text-amber-500"><CheckCircle2 fill="white" size={20}/></div>}
               </div>
               <div>
                  <div className="font-bold text-sm text-gray-900 leading-tight">{displayName}</div>
                  <div className="text-xs text-gray-500 mt-1">{displayHindi}</div>
               </div>
             </div>
           );
        })}
      </div>

      {selectedIds.includes('other') && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border">
           <label className="block text-sm font-medium mb-1 text-gray-700">Please specify <span className="text-gray-400">(अपना बिज़नेस टाइप लिखें...)</span></label>
           <input 
             maxLength={100}
             value={otherText}
             onChange={(e) => setOtherText(e.target.value)}
             placeholder="e.g., 'Astrology Centre', 'Tailoring Shop'"
             className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-amber-500"
           />
           <p className="text-xs text-gray-500 mt-2">Don't worry — our AI understands all types of businesses!</p>
        </div>
      )}
    </div>
  );
};
