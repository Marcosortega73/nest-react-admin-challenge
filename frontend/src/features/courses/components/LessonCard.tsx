import { getLessonIcon, openLessonContent } from '@shared/utils/lessonIconUtils';
import { Edit3, Trash2 } from 'react-feather';

import { CourseLesson } from '../types/course.types';

interface LessonCardProps {
  lesson: CourseLesson;
  canSeePublished: boolean;
  onEditLesson?: (lesson: CourseLesson) => void;
  onDeleteLesson?: (lesson: CourseLesson) => void;
}

export default function LessonCard({ lesson, canSeePublished, onEditLesson, onDeleteLesson }: LessonCardProps) {
  const handleClick = () => {
    openLessonContent(lesson.contentUrl || lesson.html || '', lesson.title);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEditLesson) {
      onEditLesson(lesson);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleteLesson) {
      onDeleteLesson(lesson);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-3">
        <div
          className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer"
          onClick={handleClick}
        >
          {getLessonIcon(lesson.type)}
        </div>
        <div className="flex-1 min-w-0 cursor-pointer" onClick={handleClick}>
          <h3 className="text-base font-medium text-gray-900">{lesson?.title}</h3>
          <p className="text-sm text-gray-500">Lesson {lesson?.position}</p>
        </div>
        <div className="flex items-center space-x-2">
          {canSeePublished && (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                lesson?.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {lesson?.isPublished ? 'Published' : 'Draft'}
            </span>
          )}
          {onEditLesson && canSeePublished && (
            <button
              onClick={handleEditClick}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Edit lesson"
            >
              <Edit3 size={16} />
            </button>
          )}
          {onDeleteLesson && canSeePublished && (
            <button
              onClick={handleDeleteClick}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="Delete lesson"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
