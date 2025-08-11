export interface CreateCourseResourceDto {
  name: string;
  type: 'pdf' | 'url' | 'zip';
  url: string;
  isPublished?: boolean;
}

export interface CreateCourseModuleDto {
  title: string;
  description?: string;
  isPublished?: boolean;
}

export interface CreateCourseLessonDto {
  title: string;
  content?: string;
  moduleIndex: number;
  isPublished?: boolean;
}

export default interface CreateCourseRequest {
  name: string;
  description?: string;
  imageUrl?: string;
  isPublished?: boolean;
  resources?: CreateCourseResourceDto[];
  modules?: CreateCourseModuleDto[];
  lessons?: CreateCourseLessonDto[];
}
