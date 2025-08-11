import useAuth from '@hooks/useAuth';
import { useMemo } from 'react';

import { CourseFilterType } from '../components/CourseFilterButtons';
import { Course } from '../types';

export function useCourseFilters(courses: Course[], activeFilter: CourseFilterType) {
  const { authenticatedUser } = useAuth();
  const userRole = authenticatedUser?.role;
  const userId = authenticatedUser?.id;

  const filteredCourses = useMemo(() => {
    if (!courses || courses.length === 0) return [];

    switch (activeFilter) {
      case 'all':
        // Para usuarios normales, solo mostrar cursos publicados
        if (userRole === 'user') {
          return courses.filter(course => course.isPublished);
        }
        // Para admin/editor, mostrar todos los cursos
        return courses;

      case 'my-courses':
        // Cursos donde el usuario está inscrito
        return courses.filter(course => course.enrollments?.some(enrollment => enrollment.userId === userId));

      case 'published':
        // Solo cursos publicados (disponible para admin/editor)
        return courses.filter(course => course.isPublished);

      case 'draft':
        // Solo cursos en borrador (disponible para admin/editor)
        return courses.filter(course => !course.isPublished);

      default:
        return courses;
    }
  }, [courses, activeFilter, userRole, userId]);

  return filteredCourses;
}
