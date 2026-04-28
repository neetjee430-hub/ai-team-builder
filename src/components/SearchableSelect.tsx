import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Plus } from 'lucide-react';

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange, placeholder = 'Select...' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(search.toLowerCase())
  );

  const exactMatch = options.find(opt => opt.toLowerCase() === search.toLowerCase());

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border p-3 rounded-xl bg-gray-50 flex justify-between items-center cursor-pointer"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <ChevronDown size={18} className="text-gray-500" />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-xl shadow-lg max-h-60 flex flex-col">
          <div className="p-2 border-b flex items-center gap-2 bg-gray-50">
             <Search size={16} className="text-gray-400" />
             <input 
               type="text" 
               className="w-full bg-transparent outline-none text-sm" 
               placeholder="Search or enter city name..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               onKeyDown={(e) => {
                 if (e.key === 'Enter' && search) {
                    e.preventDefault();
                    if (exactMatch) onChange(exactMatch);
                    else onChange(search);
                    setIsOpen(false);
                    setSearch('');
                 }
               }}
               autoFocus
             />
          </div>
          <div className="overflow-y-auto flex-1 h-48">
            {search && !exactMatch && (
               <div 
                 className="p-3 text-sm cursor-pointer bg-green-50 hover:bg-green-100 text-green-700 font-bold flex items-center gap-2 border-b"
                 onClick={() => {
                   onChange(search);
                   setIsOpen(false);
                   setSearch('');
                 }}
               >
                 <Plus size={16} /> Click to Add "{search}"
               </div>
            )}
            {filteredOptions.length > 0 ? (
              filteredOptions.map(opt => (
                <div 
                  key={opt} 
                  className={`p-3 text-sm cursor-pointer hover:bg-blue-50 ${value === opt ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setSearch('');
                  }}
                >
                  {opt}
                </div>
              ))
            ) : (
              !search && <div className="p-3 text-sm text-gray-500 text-center">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
