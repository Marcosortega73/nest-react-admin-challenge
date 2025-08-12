import { useCallback, useEffect, useState } from 'react';
import { Search, X } from 'react-feather';

import { FindCoursesParams } from '../types';

interface CourseFiltersComponentProps {
  filters: FindCoursesParams;
  setFilters: (filters: FindCoursesParams) => void;
}

export function CourseFiltersComponent({ filters, setFilters }: CourseFiltersComponentProps) {
  const [searchValue, setSearchValue] = useState(filters.search || '');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setFilters({ search: searchValue.trim() || undefined });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchValue, setFilters]);

  const handleClearSearch = useCallback(() => {
    setSearchValue('');
    setFilters({ search: undefined });
  }, [setFilters]);

  return (
    <div className="col-span-6 md:w-1/3">
      <div className="relative max-w-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-all duration-200 shadow-sm hover:shadow-md"
          placeholder="Buscar cursos..."
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
        {searchValue && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
              onClick={handleClearSearch}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
