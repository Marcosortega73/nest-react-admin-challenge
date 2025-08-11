import { ButtonComponent } from '@shared/components/buttons';
import { ArrowLeft } from 'react-feather';
import { useNavigate } from 'react-router-dom';

import { Course } from '../types/course.types';

interface CourseHeaderProps {
  course: Course;
}

export default function CourseHeader({ course }: CourseHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200 mb-6">
      <div className="py-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 ">
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
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <ButtonComponent
              onClick={() => navigate('/courses')}
              variant="secondary"
              size="md"
              title="Back"
              icon={<ArrowLeft className="w-4 h-4 mr-1" />}
            />
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
}
