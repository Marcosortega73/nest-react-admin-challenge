import useAuth from '@hooks/useAuth';
import { ButtonComponent } from '@shared/components/buttons';
import { useToast } from '@shared/hooks/useToast';
import { ArrowLeft } from 'react-feather';
import { useNavigate } from 'react-router-dom';

import EnrollmentButton from '../../enrollments/components/EnrollmentButton';
import { useEnrollment, useIsUserEnrolled, useUserEnrollment } from '../../enrollments/hooks/useEnrollment';
import { Course } from '../types/course.types';

interface CourseHeaderProps {
  course: Course;
  onEnrollmentSuccess?: () => void;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({ course, onEnrollmentSuccess }) => {
  const navigate = useNavigate();
  const { authenticatedUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const { enroll, unenroll, enrollError, unenrollError, isEnrolling, isUnenrolling } = useEnrollment();

  // Check if user is enrolled and get enrollment details
  const isUserEnrolled = useIsUserEnrolled(course.enrollments || [], authenticatedUser?.id);
  const userEnrollment = useUserEnrollment(course.enrollments || [], authenticatedUser?.id);

  // Only show enrollment button for regular users on published courses who are not enrolled
  const showEnrollmentButton =
    authenticatedUser?.role === 'user' && course.isPublished && course.modules?.length > 0 && !isUserEnrolled;

  // Show enrolled badge for enrolled users
  const showEnrolledBadge = authenticatedUser?.role === 'user' && course.isPublished && isUserEnrolled;

  const handleEnroll = async () => {
    try {
      await enroll(course.id);
      showSuccess('¡Inscripción exitosa!', `Te has inscrito correctamente en el curso "${course.name}"`);
      onEnrollmentSuccess?.();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      showError('Error de inscripción', 'No se pudo completar la inscripción. Por favor, intenta nuevamente.');
    }
  };

  const handleUnenroll = async () => {
    if (!userEnrollment?.id) return;

    try {
      await unenroll(userEnrollment.id);
      showSuccess('Desinscripción exitosa', `Te has desinscrito del curso "${course.name}"`);
      onEnrollmentSuccess?.();
    } catch (error) {
      console.error('Error unenrolling from course:', error);
      showError('Error de desinscripción', 'No se pudo completar la desinscripción. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 mb-6 px-6 py-3 rounded-md shadow-md">
      <div className="">
        <div className="flex items-center justify-between mb-4">
          <ButtonComponent
            onClick={() => navigate('/courses')}
            variant="secondary"
            size="sm"
            title="Back"
            icon={<ArrowLeft className="w-4 h-4 mr-1" />}
          />
          {showEnrollmentButton && (
            <EnrollmentButton
              isEnrolled={isUserEnrolled}
              isEnrolling={isEnrolling}
              isUnenrolling={isUnenrolling}
              onEnroll={handleEnroll}
              onUnenroll={handleUnenroll}
            />
          )}
          {showEnrolledBadge && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ✓ Inscripto
              </span>
              <button
                onClick={handleUnenroll}
                disabled={isUnenrolling}
                className="text-sm text-gray-500 hover:text-red-600 underline disabled:opacity-50"
              >
                {isUnenrolling ? 'Desinscribiendo...' : 'Desinscribirse'}
              </button>
            </div>
          )}
        </div>

        {/* Error messages */}
        {(enrollError || unenrollError) && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">
              {enrollError ? 'Error al inscribirse al curso' : 'Error al desinscribirse del curso'}
            </p>
          </div>
        )}

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900">{course.name}</h3>
            <p className="mt-2 text-sm text-gray-600">{course.description}</p>
            <div className="mt-4 flex items-center space-x-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {course.isPublished ? 'Published' : 'Draft'}
              </span>
              <span className="text-sm text-gray-500">
                {course.modules?.length || 0} modules • {course.lessons?.length || 0} lessons
              </span>
              {course.enrollments && (
                <span className="text-sm text-gray-500">{course.enrollments.length} estudiantes inscritos</span>
              )}
            </div>
          </div>
          {course.imageUrl && (
            <div className="ml-6 flex-shrink-0">
              <img className="h-20 w-20 rounded-lg object-cover" src={course.imageUrl} alt={course.name} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
