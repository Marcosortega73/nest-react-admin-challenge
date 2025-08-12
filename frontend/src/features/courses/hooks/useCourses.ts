import courseService from '@features/courses/services/course.api';
import CourseQuery from '@models/course/CourseQuery';
import { stableKeyQuery } from '@shared/utils/queryKey.utilities';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { Course, FindCoursesParams } from '../types';

export function useCourses(filters: FindCoursesParams) {
  const cleaned = useMemo<CourseQuery>(
    () => ({
      search: filters.search?.trim() || undefined,
      filter: filters.filter,
    }),
    [filters.search, filters.filter],
  );

  return useQuery<Course[], Error>(['courses', stableKeyQuery(cleaned)], () => courseService.findAll(cleaned), {
    keepPreviousData: true,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    select: data => data.sort((a, b) => a.name.localeCompare(b.name)),
  });
}
