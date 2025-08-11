import User from '@models/user/User';

export interface Course {
  id: string;
  name: string;
  description: string;
  dateCreated: Date;
  isPublished: boolean;
  imageUrl?: string;
  resources: CourseResource[];
  modules: CourseModule[];
  lessons: CourseLesson[];
  enrollments: Enrollment[];
  analytics: CourseAnalytics;
}

export interface CourseAnalytics {
  totalEnrollments: number;
  completionRate: number;
  averageRating: number;
}

export interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  user: User;
  dateEnrolled: Date;
}

export type FindCoursesParams = Partial<Pick<Course, 'name' | 'description'>>;

export interface CreateCourseRequest {
  name: string;
  description: string;
  isPublished: boolean;
  imageUrl?: string;
  resources: CourseResource[];
  modules: CourseModule[];
  lessons: CourseLesson[];
  enrollments: Enrollment[];
  analytics: CourseAnalytics;
}

export interface UpdateCourseRequest {
  name?: string;
  description?: string;
  isPublished?: boolean;
  imageUrl?: string;
  resources?: CourseResource[];
  modules?: CourseModule[];
  lessons?: CourseLesson[];
  enrollments?: Enrollment[];
  analytics?: CourseAnalytics;
}

export type CourseResource = { name: string; type: 'pdf' | 'url' | 'zip'; url: string; isPublished: boolean };

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  position: number;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  lessons: CourseLesson[];
}

export interface CourseLesson {
  id: string;
  title: string;
  subtitle?: string;
  position: number;
  type: 'VIDEO' | 'PDF' | 'TEXT' | 'LINK';
  contentUrl?: string;
  html?: string;
  durationSec?: number;
  isPreview: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CourseForm = {
  name: string;
  description: string;
  imageUrl?: string;
  isPublished: boolean;
  resources: CourseResource[];
  modules: CourseModule[];
  lessons: CourseLesson[];
  enrollments: Enrollment[];
  analytics: CourseAnalytics;
  dateCreated?: Date;
};
