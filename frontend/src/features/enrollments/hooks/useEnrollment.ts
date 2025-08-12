import useAuth from '@hooks/useAuth';
import { useMutation, useQueryClient } from 'react-query';

import enrollmentService, { CreateEnrollmentRequest } from '../services/enrollment.api';

export function useEnrollment() {
  const { authenticatedUser } = useAuth();
  const queryClient = useQueryClient();

  const enrollMutation = useMutation(
    (courseId: string) => {
      const enrollmentData: CreateEnrollmentRequest = {
        userId: authenticatedUser?.id!,
        courseId,
        source: 'SELF',
      };
      return enrollmentService.enroll(enrollmentData);
    },
    {
      onSuccess: () => {
        // Invalidate course data to refresh enrollment status
        queryClient.invalidateQueries(['course']);
        // Invalidate courses list to update cards with new enrollment data
        queryClient.invalidateQueries(['courses']);
        // Also invalidate course counts to update badges
        queryClient.invalidateQueries(['course-counts']);
      },
    },
  );

  const unenrollMutation = useMutation((enrollmentId: string) => enrollmentService.unenroll(enrollmentId), {
    onSuccess: () => {
      // Invalidate course data to refresh enrollment status
      queryClient.invalidateQueries(['course']);
      // Invalidate courses list to update cards with new enrollment data
      queryClient.invalidateQueries(['courses']);
      // Also invalidate course counts to update badges
      queryClient.invalidateQueries(['course-counts']);
    },
  });

  return {
    enroll: enrollMutation.mutate,
    unenroll: unenrollMutation.mutate,
    isEnrolling: enrollMutation.isLoading,
    isUnenrolling: unenrollMutation.isLoading,
    enrollError: enrollMutation.error,
    unenrollError: unenrollMutation.error,
  };
}

// Helper function to check if user is enrolled in a course
export function useIsUserEnrolled(courseEnrollments: any[], userId?: string) {
  if (!userId || !courseEnrollments) return false;

  return courseEnrollments.some(enrollment => enrollment.userId === userId && enrollment.status === 'ACTIVE');
}

// Helper function to get user's enrollment in a course
export function useUserEnrollment(courseEnrollments: any[], userId?: string) {
  if (!userId || !courseEnrollments) return null;

  return courseEnrollments.find(enrollment => enrollment.userId === userId && enrollment.status === 'ACTIVE') || null;
}
