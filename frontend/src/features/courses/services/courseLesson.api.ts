import apiService from '@services/ApiService';
import { LessonType } from '@shared/utils/lessonIconUtils';

export interface CreateCourseLessonRequest {
  title: string;
  description?: string;
  type: LessonType;
  contentUrl?: string; // For VIDEO, PDF, LINK types
  html?: string; // For TEXT type
  isPublished?: boolean;
  position?: number;
}

export interface UpdateCourseLessonRequest {
  title?: string;
  description?: string;
  type?: LessonType;
  contentUrl?: string;
  isPublished?: boolean;
  position?: number;
}

export interface CourseLessonResponse {
  id: string;
  title: string;
  description?: string;
  type: LessonType;
  contentUrl: string;
  isPublished: boolean;
  position: number;
  moduleId: string;
  createdAt: string;
  updatedAt: string;
}

class CourseLessonService {
  private readonly baseUrl = '/api/course-lessons';

  async create(courseId: string, moduleId: string, data: CreateCourseLessonRequest): Promise<CourseLessonResponse> {
    const response = await apiService.post<CourseLessonResponse>(`${this.baseUrl}`, {
      ...data,
      courseId,
      moduleId,
    });
    return response.data;
  }

  async findOne(courseId: string, moduleId: string, lessonId: string): Promise<CourseLessonResponse> {
    const response = await apiService.get<CourseLessonResponse>(`${this.baseUrl}/${lessonId}`);
    return response.data;
  }

  async update(
    courseId: string,
    moduleId: string,
    lessonId: string,
    data: UpdateCourseLessonRequest,
  ): Promise<CourseLessonResponse> {
    const response = await apiService.patch<CourseLessonResponse>(`${this.baseUrl}/${lessonId}`, {
      ...data,
      courseId,
      moduleId,
    });
    return response.data;
  }

  async delete(courseId: string, moduleId: string, lessonId: string): Promise<void> {
    await apiService.delete(`${this.baseUrl}/${lessonId}`);
  }

  async reorder(
    courseId: string,
    moduleId: string,
    lessonId: string,
    newPosition: number,
  ): Promise<CourseLessonResponse> {
    const response = await apiService.patch<CourseLessonResponse>(`${this.baseUrl}/${lessonId}/reorder`, {
      courseId,
      moduleId,
      position: newPosition,
    });
    return response.data;
  }
}

const courseLessonService = new CourseLessonService();
export default courseLessonService;
