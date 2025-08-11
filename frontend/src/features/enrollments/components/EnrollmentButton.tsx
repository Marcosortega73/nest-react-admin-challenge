import { ButtonComponent } from '@shared/components/buttons';
import { Check, UserPlus, X } from 'react-feather';

interface EnrollmentButtonProps {
  isEnrolled: boolean;
  isEnrolling: boolean;
  isUnenrolling: boolean;
  onEnroll: () => void;
  onUnenroll: () => void;
  disabled?: boolean;
}

export default function EnrollmentButton({
  isEnrolled,
  isEnrolling,
  isUnenrolling,
  onEnroll,
  onUnenroll,
  disabled = false,
}: EnrollmentButtonProps) {
  const isLoading = isEnrolling || isUnenrolling;

  if (isEnrolled) {
    return (
      <div className="flex items-center space-x-3">
        <div className="flex items-center text-green-600">
          <Check className="w-5 h-5 mr-2" />
          <span className="font-medium">Inscrito</span>
        </div>
        <ButtonComponent
          onClick={onUnenroll}
          variant="secondary"
          size="sm"
          title={isUnenrolling ? 'Desinscribiendo...' : 'Desinscribirse'}
          icon={<X className="w-4 h-4" />}
          disabled={disabled || isLoading}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        />
      </div>
    );
  }

  return (
    <ButtonComponent
      onClick={onEnroll}
      variant="primary"
      size="md"
      title={isEnrolling ? 'Inscribiendo...' : 'Inscribirse al curso'}
      icon={<UserPlus className="w-5 h-5" />}
      disabled={disabled || isLoading}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
    />
  );
}
