import courseService from '@features/courses/services/course.api';
import { useQuery } from 'react-query';

export interface CourseCounts {
  all: number;
  myCourses: number;
  published: number;
  draft: number;
}

export function useCourseCounts() {
  return useQuery<CourseCounts, Error>(['course-counts'], () => courseService.getCounts(), {
    staleTime: 60_000, // Cache for 1 minute
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
}
