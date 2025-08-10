import { FindCoursesParams } from '../types';

interface CourseFiltersComponentProps {
  filters: FindCoursesParams;
  setFilters: (filters: FindCoursesParams) => void;
}

export function CourseFiltersComponent({ filters, setFilters }: CourseFiltersComponentProps) {
  return (
    <div className="table-filter">
      <div className="flex flex-row gap-5">
        <input
          type="text"
          className="input w-1/2"
          placeholder="Name"
          value={filters.name || ''}
          onChange={e => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          type="text"
          className="input w-1/2"
          placeholder="Description"
          value={filters.description || ''}
          onChange={e => setFilters({ ...filters, description: e.target.value })}
        />
      </div>
    </div>
  );
}
