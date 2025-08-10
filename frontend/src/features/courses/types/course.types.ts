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
