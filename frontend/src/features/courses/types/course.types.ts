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
}

export interface UpdateCourseRequest {
  name?: string;
  description?: string;
  isPublished?: boolean;
  imageUrl?: string;
  resources?: CourseResource[];
  modules?: CourseModule[];
  lessons?: CourseLesson[];
}

export type CourseResource = { name: string; type: 'pdf' | 'url' | 'zip'; url: string; isPublished: boolean };
export type CourseModule = { title: string; description?: string; isPublished: boolean };
export type CourseLesson = { title: string; content?: string; moduleIndex: number; isPublished: boolean };

export type CourseForm = {
  name: string;
  description: string;
  imageUrl?: string;
  isPublished: boolean;
  resources: CourseResource[];
  modules: CourseModule[];
  lessons: CourseLesson[];
  dateCreated?: Date;
};
