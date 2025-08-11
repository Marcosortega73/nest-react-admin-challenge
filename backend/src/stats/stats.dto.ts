export interface StatsResponseDto {
  numberOfUsers: number;
  numberOfCourses: number;
  numberOfEnrollments: number;
  numberOfPublishedCourses: number;
  myCoursesNumberOfEnrollments?: number;
}
