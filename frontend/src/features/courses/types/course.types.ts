export interface Course {
  id: string;
  name: string;
  description: string;
  dateCreated: Date;
}

export type FindCoursesParams = Partial<Pick<Course, 'name' | 'description'>>;

export interface CreateCourseRequest {
  name: string;
  description: string;
}

export interface UpdateCourseRequest {
  name?: string;
  description?: string;
}

export type CourseResource = { name: string; type: 'pdf' | 'url' | 'zip'; url: string };
export type CourseModule = { title: string; description?: string };
export type CourseLesson = { title: string; content?: string; moduleIndex: number };

export type CourseForm = {
  name: string;
  description: string;
  imageUrl?: string;
  resources: CourseResource[];
  modules: CourseModule[];
  lessons: CourseLesson[];
};
