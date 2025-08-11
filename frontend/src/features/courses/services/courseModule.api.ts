import apiService from '@services/ApiService';

export interface UpdateCourseModuleRequest {
  title?: string;
  description?: string;
  position?: number;
  isPublished?: boolean;
}

export interface CreateCourseModuleRequest {
  title: string;
  description?: string;
  position?: number;
  isPublished?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  description?: string;
  position: number;
  isPublished: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  courseId: string;
  lessons?: any[];
}

class CourseModuleService {
  /**
   * Actualizar un módulo específico
   */
  async update(courseId: string, moduleId: string, updateRequest: UpdateCourseModuleRequest): Promise<void> {
    await apiService.patch(`/api/course-modules/${moduleId}`, updateRequest);
  }

  /**
   * Eliminar un módulo específico
   */
  async delete(courseId: string, moduleId: string): Promise<void> {
    await apiService.delete(`/api/course-modules/${moduleId}`);
  }

  /**
   * Crear un nuevo módulo
   */
  async create(courseId: string, createRequest: CreateCourseModuleRequest): Promise<CourseModule> {
    const response = await apiService.post(`/api/course-modules/${courseId}/modules`, createRequest);
    return response.data;
  }

  /**
   * Obtener un módulo específico
   */
  async findOne(courseId: string, moduleId: string): Promise<CourseModule> {
    const response = await apiService.get(`/api/course-modules/${moduleId}`);
    return response.data;
  }

  /**
   * Publicar un módulo
   */
  async publish(courseId: string, moduleId: string): Promise<void> {
    await apiService.patch(`/api/course-modules/${moduleId}/publish`);
  }

  /**
   * Despublicar un módulo
   */
  async unpublish(courseId: string, moduleId: string): Promise<void> {
    await apiService.patch(`/api/course-modules/${moduleId}/unpublish`);
  }

  /**
   * Reordenar módulos
   */
  async reorder(courseId: string, moduleIds: string[]): Promise<void> {
    await apiService.patch(`/api/course-modules/reorder`, { moduleIds });
  }
}

const courseModuleService = new CourseModuleService();
export default courseModuleService;
