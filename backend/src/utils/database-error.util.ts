import { QueryFailedError } from 'typeorm';

export function isUniqueViolation(error: any): boolean {
  return (
    error instanceof QueryFailedError && error.driverError?.code === '23505'
  );
}

export function getUniqueViolationMessage(error: any): string {
  if (!isUniqueViolation(error)) {
    return 'Database constraint violation';
  }

  const detail = error.driverError?.detail || '';

  if (detail.includes('uq_module_course_position')) {
    return 'A module with this position already exists in the course';
  }

  if (detail.includes('uq_lesson_module_position')) {
    return 'A lesson with this position already exists in the module';
  }

  return 'Position already exists';
}
