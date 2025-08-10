import courseService from '@features/courses/services/course.api';
import { stableKeyQuery } from '@shared/utils/queryKey.utilities';
import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { Course, FindCoursesParams } from '../types';

export function useCourses(filters: FindCoursesParams) {
  const cleaned = useMemo<FindCoursesParams>(
    () => ({
      name: filters.name?.trim() || undefined,
      description: filters.description?.trim() || undefined,
    }),
    [filters.name, filters.description],
  );

  return useQuery<Course[], Error>(['courses', stableKeyQuery(cleaned)], () => courseService.findAll(cleaned), {
    keepPreviousData: true,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    select: data => data.sort((a, b) => a.name.localeCompare(b.name)),
  });
}
