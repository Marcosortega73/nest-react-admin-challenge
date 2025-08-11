import Layout from '@components/layout';
import { CourseCardsContainer, HeaderPageCourse } from '@features/courses/components';
import useAuth from '@hooks/useAuth';
import { ButtonComponent } from '@shared/components/buttons';
import { useState } from 'react';
import { Loader, Plus } from 'react-feather';
import { useNavigate } from 'react-router-dom';

import CourseFilterButtons, { CourseFilterType } from '../components/CourseFilterButtons';
import { CourseFiltersComponent } from '../components/CourseFiltersComponent';
import { useCourses } from '../hooks/useCourses';
export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<CourseFilterType>('all');

  const {
    data: courses = [],
    isLoading,
    error: fetchError,
  } = useCourses({
    search: searchQuery,
    filter: activeFilter,
  });

  // Ya no necesitamos filtrar localmente, el backend devuelve los cursos filtrados
  const filteredCourses = courses;

  const { authenticatedUser } = useAuth();
  const navigate = useNavigate();

  const handleAddCourse = () => {
    navigate('/courses/new');
  };

  const handleFilterChange = (filter: CourseFilterType) => {
    setActiveFilter(filter);
  };

  return (
    <Layout>
      <HeaderPageCourse
        title="Courses"
        isUser={authenticatedUser.role === 'user'}
        buttonNew={
          <ButtonComponent
            title="Add Course"
            icon={<Plus />}
            onClick={handleAddCourse}
            variant="primary"
            positionIcon="left"
            size="md"
          />
        }
      />
      {fetchError && (
        <div className="text-red-600 p-3 border rounded bg-red-50 mb-3">
          {(fetchError as any)?.message ?? 'Error loading courses'}
        </div>
      )}

      {isLoading && (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <Loader className="animate-spin mx-auto mb-4" size={48} />
            <p className="text-gray-600">Cargando cursos...</p>
          </div>
        </div>
      )}

      {!isLoading && !fetchError && (
        <>
          <div className="flex items-center gap-4 w-full mb-6">
            <CourseFilterButtons activeFilter={activeFilter} onFilterChange={handleFilterChange} />
            <CourseFiltersComponent
              filters={{ search: searchQuery }}
              setFilters={filters => setSearchQuery(filters.search || '')}
            />
          </div>
          <div className="mb-6 shadow-md rounded-lg overflow-hidden min-h-full border-t border-gray-100">
            <CourseCardsContainer data={filteredCourses} isLoading={isLoading} />
          </div>
        </>
      )}
    </Layout>
  );
}
