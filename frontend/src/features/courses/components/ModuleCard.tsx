import { ButtonComponent, IconButtonComponent } from '@shared/components/buttons';
import { Book, Edit3, Plus, Trash2 } from 'react-feather';

import { CourseModule } from '../types/course.types';
import EmptyState from './EmptyState';
import LessonCard from './LessonCard';

interface ModuleCardProps {
  module: CourseModule;
  moduleIndex: number;
  canSeePublished: boolean;
  onEditModule?: (module: CourseModule) => void;
  onEditLesson?: (lesson: any, moduleId: string) => void;
  onDeleteModule?: (module: CourseModule) => void;
  onDeleteLesson?: (lesson: any) => void;
  onAddLesson?: (moduleId: string) => void;
}

export default function ModuleCard({
  module,
  moduleIndex,
  canSeePublished,
  onEditModule,
  onEditLesson,
  onDeleteModule,
  onDeleteLesson,
  onAddLesson,
}: ModuleCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Module {module.position || moduleIndex + 1}: {module.title}
        </h2>
        <div className="flex items-center gap-2">
          {canSeePublished && (
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                module.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {module.isPublished ? 'Published' : 'Draft'}
            </span>
          )}
          {onEditModule && canSeePublished && (
            <IconButtonComponent
              variant="minimal"
              onClick={() => onEditModule(module)}
              title="Edit module"
              icon={<Edit3 size={16} />}
            />
          )}
          {onDeleteModule && canSeePublished && (
            <IconButtonComponent
              variant="minimal"
              onClick={() => onDeleteModule(module)}
              title="Delete module"
              icon={<Trash2 size={16} />}
              size="sm"
              className="hover:text-red-600"
            />
          )}
        </div>
      </div>
      {module.description && <span className="text-sm text-gray-600 capitalize">{module.description}</span>}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium text-gray-800">Lessons</h3>
        {onAddLesson && canSeePublished && (
          <ButtonComponent
            variant="secondary"
            onClick={() => onAddLesson(module.id)}
            title="Add lesson"
            icon={<Plus size={16} />}
            size="sm"
          />
        )}
      </div>
      {module.lessons && module.lessons.length > 0 ? (
        <div className="grid gap-3">
          {module.lessons.map((lesson, lessonIndex) => (
            <LessonCard
              key={lessonIndex}
              lesson={lesson}
              canSeePublished={canSeePublished}
              onEditLesson={onEditLesson ? lesson => onEditLesson(lesson, module.id) : undefined}
              onDeleteLesson={onDeleteLesson ? lesson => onDeleteLesson(lesson) : undefined}
            />
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
