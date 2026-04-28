import React from 'react';
import { useState } from 'react';
import { Search, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
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
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const filteredCategories = businessCategories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) || 
    cat.hindi.includes(search) ||
    cat.group.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
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

  const isGroupExpanded = (group: string) => {
      if (search) return true; // Always expand if searching
      return expandedGroup === group;
  }

  // Generate unique groups
  const groups = Array.from(new Set(filteredCategories.map(c => c.group)));

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

      <div className="space-y-3 max-h-96 overflow-y-auto p-1 scrollbar-thin">
        {groups.map(group => {
            const children = filteredCategories.filter(c => c.group === group);
            if (children.length === 0) return null;
            
            // For the main icon of the group, pick the first child's icon
            const groupIcon = children[0]?.icon || '🏢';
            const isActive = children.some(c => selectedIds.includes(c.id));

            return (
                <div key={group} className="border border-gray-200 rounded-xl overflow-hidden bg-white hover:border-blue-300 transition-colors">
                    <button 
                      className={`w-full p-4 flex items-center justify-between transition-colors ${isGroupExpanded(group) ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                      onClick={() => setExpandedGroup(expandedGroup === group && !search ? null : group)}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{groupIcon}</span>
                            <span className="font-bold text-gray-800 tracking-wide text-sm">{group}</span>
                            {isActive && <div className="w-2 h-2 bg-amber-500 rounded-full"></div>}
                        </div>
                        {isGroupExpanded(group) ? <ChevronDown className="text-gray-400 w-5 h-5"/> : <ChevronRight className="text-gray-400 w-5 h-5"/>}
                    </button>

                    {isGroupExpanded(group) && (
                        <div className="p-4 pt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 bg-white border-t border-gray-100">
                            {children.map(cat => {
                                const isSelected = selectedIds.includes(cat.id);
                                const displayName = seekerMode ? cat.name.replace('Salon / Parlour', 'Salon Work').replace('Gym / Fitness Centre', 'Gym / Fitness Work').replace('School', 'Teaching / School Work') : cat.name;
                                const displayHindi = seekerMode ? cat.hindi.replace('पार्लर', 'पार्लर का काम') : cat.hindi;
                                
                                return (
                                    <div 
                                        key={cat.id} 
                                        onClick={(e) => handleSelect(cat.id, e)}
                                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3
                                        ${isSelected 
                                            ? 'border-amber-500 bg-amber-50 shadow-sm' 
                                            : 'border-gray-100 bg-white hover:border-amber-300'}`}
                                    >
                                        <div className="relative shrink-0">
                                            <span className="text-2xl">{cat.icon}</span>
                                            {isSelected && <div className="absolute -top-1 -right-2 text-amber-500 bg-white rounded-full"><CheckCircle2 fill="currentColor" className="text-white w-4 h-4"/></div>}
                                        </div>
                                        <div className="text-left flex-1">
                                            <div className="font-bold text-sm text-gray-900 leading-tight">{displayName}</div>
                                            <div className="text-xs text-gray-500 mt-0.5">{displayHindi}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            );
        })}

        {filteredCategories.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
                <p>No exact matches found.</p>
                <button 
                  onClick={() => handleSelect('other', {} as React.MouseEvent)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm"
                >
                  Select "Other"
                </button>
            </div>
        )}
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
