import apiService from '@services/ApiService';

export interface CreateEnrollmentRequest {
  userId: string;
  courseId: string;
  source?: 'SELF' | 'ADMIN' | 'EDITOR';
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  source: 'SELF' | 'ADMIN' | 'EDITOR';
  enrollmentDate: string;
}

class EnrollmentService {
  async enroll(createEnrollmentRequest: CreateEnrollmentRequest): Promise<Enrollment> {
    const response = await apiService.post<Enrollment>('/api/enrollments', createEnrollmentRequest);
    return response.data;
  }

  async unenroll(enrollmentId: string): Promise<void> {
    await apiService.delete(`/api/enrollments/${enrollmentId}`);
  }

  async findAll(): Promise<Enrollment[]> {
    const response = await apiService.get<Enrollment[]>('/api/enrollments');
    return response.data;
  }

  async findOne(id: string): Promise<Enrollment> {
    const response = await apiService.get<Enrollment>(`/api/enrollments/${id}`);
    return response.data;
  }
}

const enrollmentService = new EnrollmentService();
export default enrollmentService;
