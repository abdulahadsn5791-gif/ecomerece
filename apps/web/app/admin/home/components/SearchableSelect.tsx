import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (term: string) => void;
  options: { id: string; label: string }[];
  selectPlaceholder: string;
  searchPlaceholder: string;
  darkMode: boolean;
  inputCls: string;
}

export const SearchableSelect = ({
  value,
  onChange,
  onSearch,
  options,
  selectPlaceholder,
  searchPlaceholder,
  darkMode,
  inputCls,
}: SearchableSelectProps) => {
  const [term, setTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => onSearch(term.trim()), 300);
    return () => clearTimeout(timer);
  }, [term, onSearch]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search
          className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-neutral-500' : 'text-neutral-400'}`}
        />
        <input
          placeholder={searchPlaceholder}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className={`${inputCls} pl-10`}
        />
      </div>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={inputCls}>
        <option value="">{selectPlaceholder}</option>
        {value && !options.some((o) => o.id === value) && <option value={value}>{value}</option>}
        {options.length === 0 ? (
          term.trim() ? (
            <option value="" disabled>
              No matches
            </option>
          ) : null
        ) : (
          options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))
        )}
      </select>
    </div>
  );
};
