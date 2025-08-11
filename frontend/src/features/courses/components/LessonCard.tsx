import { getLessonIcon, openLessonContent } from '@shared/utils/lessonIconUtils';

import { CourseLesson } from '../types/course.types';

interface LessonCardProps {
  lesson: CourseLesson;
  canSeePublished: boolean;
}

export default function LessonCard({ lesson, canSeePublished }: LessonCardProps) {
  const handleClick = () => {
    openLessonContent(lesson.contentUrl || lesson.html || '', lesson.title);
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          {getLessonIcon(lesson.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-medium text-gray-900">{lesson?.title}</h3>
          <p className="text-sm text-gray-500">Lesson {lesson?.position}</p>
        </div>
        {canSeePublished && (
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              lesson?.isPreview ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {lesson?.isPreview ? 'Preview' : 'Premium'}
          </span>
        )}
      </div>
    </div>
  );
}
