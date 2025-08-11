import { Book } from 'react-feather';

import { CourseModule } from '../types/course.types';
import EmptyState from './EmptyState';
import LessonCard from './LessonCard';

interface ModuleCardProps {
  module: CourseModule;
  moduleIndex: number;
  canSeePublished: boolean;
}

export default function ModuleCard({ module, moduleIndex, canSeePublished }: ModuleCardProps) {
  return (
    <div className="space-y-4">
      {/* Module Title */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Module {module.position || moduleIndex + 1}: {module.title}
        </h2>
        {canSeePublished && (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              module.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {module.isPublished ? 'Published' : 'Draft'}
          </span>
        )}
      </div>

      {/* Module Description */}
      {module.description && <p className="text-sm text-gray-600 mb-4">{module.description}</p>}

      {/* Lessons */}
      {module.lessons && module.lessons.length > 0 ? (
        <div className="grid gap-3">
          {module.lessons.map((lesson, lessonIndex) => (
            <LessonCard key={lessonIndex} lesson={lesson} canSeePublished={canSeePublished} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Book className="mx-auto h-12 w-12 text-gray-400" />}
          title="No lessons in this module yet"
          description="This module doesn't have any lessons yet."
          className="text-center py-8"
        />
      )}
    </div>
  );
}
