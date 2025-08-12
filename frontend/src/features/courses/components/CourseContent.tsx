import { ButtonComponent } from '@shared/components/buttons';
import { ConfirmationModal } from '@shared/components/modals';
import { useState } from 'react';
import { Book, Loader, Plus } from 'react-feather';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';

import courseService from '../services/course.api';
import courseLessonService from '../services/courseLesson.api';
import courseModuleService from '../services/courseModule.api';
import { Course, CourseAnalytics, Enrollment, UpdateCourseRequest } from '../types/course.types';
import EmptyState from './EmptyState';
import CreateLessonModal from './modals/CreateLessonModal';
import CreateModuleModal from './modals/CreateModuleModal';
import EditLessonModal from './modals/EditLessonModal';
import EditModuleModal from './modals/EditModuleModal';
import ModuleCard from './ModuleCard';

interface CourseContentProps {
  course: Course;
  enrollments: Enrollment[];
  analytics: CourseAnalytics | null;
  canSeePublished: boolean;
  canEditContent?: boolean;
  activeTab: string;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
}

interface CourseFormData {
  name: string;
  description: string;
  isPublished: string;
  imageUrl?: string | null;
}

export default function CourseContent({
  course,
  enrollments,
  analytics,
  canSeePublished,
  canEditContent = false,
  activeTab,
  showSuccess,
  showError,
}: CourseContentProps) {
  const queryClient = useQueryClient();

  const [isEditModuleModalOpen, setIsEditModuleModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<any>(null);

  const [isEditLessonModalOpen, setIsEditLessonModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');

  const [isCreateModuleModalOpen, setIsCreateModuleModalOpen] = useState(false);
  const [isCreateLessonModalOpen, setIsCreateLessonModalOpen] = useState(false);
  const [createLessonModuleId, setCreateLessonModuleId] = useState<string>('');

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'course' | 'module' | 'lesson';
    item: any;
    title: string;
    message: string;
  }>({ isOpen: false, type: 'course', item: null, title: '', message: '' });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CourseFormData>({
    defaultValues: {
      name: course.name,
      description: course.description,
      isPublished: course.isPublished ? 'true' : 'false',
      imageUrl: course.imageUrl || '',
    },
  });

  const updateCourseMutation = useMutation(
    (updateData: UpdateCourseRequest) => courseService.update(course.id, updateData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['course', course.id]);
        queryClient.invalidateQueries(['courses']);
        showSuccess('Course Updated', 'The course has been updated successfully.');
        reset(undefined, { keepValues: true });
      },
      onError: error => {
        console.error('Error updating course:', error);
        showError('Update Failed', 'There was an error updating the course. Please try again.');
      },
    },
  );

  const deleteCourseMutation = useMutation((id: string) => courseService.delete(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['courses']);
      showSuccess('Course Deleted', 'The course has been deleted successfully.');
      setTimeout(() => {
        window.location.href = '/courses';
      }, 1500);
    },
    onError: error => {
      console.error('Error deleting course:', error);
      showError('Delete Failed', 'There was an error deleting the course. Please try again.');
    },
  });

  const deleteModuleMutation = useMutation(
    ({ courseId, moduleId }: { courseId: string; moduleId: string }) => courseModuleService.delete(courseId, moduleId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['course', course.id]);
        showSuccess('Module Deleted', 'The module has been deleted successfully.');
        setDeleteConfirmation({ isOpen: false, type: 'course', item: null, title: '', message: '' });
      },
      onError: error => {
        console.error('Error deleting module:', error);
        showError('Delete Failed', 'There was an error deleting the module. Please try again.');
      },
    },
  );

  const deleteLessonMutation = useMutation(
    ({ courseId, moduleId, lessonId }: { courseId: string; moduleId: string; lessonId: string }) =>
      courseLessonService.delete(courseId, moduleId, lessonId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['course', course.id]);
        showSuccess('Lesson Deleted', 'The lesson has been deleted successfully.');
        setDeleteConfirmation({ isOpen: false, type: 'course', item: null, title: '', message: '' });
      },
      onError: error => {
        console.error('Error deleting lesson:', error);
        showError('Delete Failed', 'There was an error deleting the lesson. Please try again.');
      },
    },
  );

  const onSubmit = (formData: CourseFormData) => {
    const processedData: UpdateCourseRequest = {
      name: formData.name,
      description: formData.description,
      isPublished: formData.isPublished === 'true',
      imageUrl: formData.imageUrl && formData.imageUrl.trim() !== '' ? formData.imageUrl : null,
    };
    updateCourseMutation.mutate(processedData);
  };

  const handleDeleteCourse = () => {
    setDeleteConfirmation({
      isOpen: true,
      type: 'course',
      item: course,
      title: 'Delete Course',
      message: `Are you sure you want to delete "${course.name}"? This action cannot be undone and will permanently remove all modules, lessons, and associated data.`,
    });
  };

  const handleEditModule = (module: any) => {
    setSelectedModule(module);
    setIsEditModuleModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModuleModalOpen(false);
    setSelectedModule(null);
  };

  const handleEditLesson = (lesson: any, moduleId: string) => {
    setSelectedLesson(lesson);
    setSelectedModuleId(moduleId);
    setIsEditLessonModalOpen(true);
  };

  const handleCloseEditLessonModal = () => {
    setIsEditLessonModalOpen(false);
    setSelectedLesson(null);
    setSelectedModuleId('');
  };

  const handleAddModule = () => {
    setIsCreateModuleModalOpen(true);
  };

  const handleCloseCreateModuleModal = () => {
    setIsCreateModuleModalOpen(false);
  };

  const handleAddLesson = (moduleId: string) => {
    setCreateLessonModuleId(moduleId);
    setIsCreateLessonModalOpen(true);
  };

  const handleCloseCreateLessonModal = () => {
    setIsCreateLessonModalOpen(false);
    setCreateLessonModuleId('');
  };

  const handleDeleteModule = (module: any) => {
    setDeleteConfirmation({
      isOpen: true,
      type: 'module',
      item: module,
      title: 'Delete Module',
      message: `Are you sure you want to delete "${module.title}"? This action cannot be undone and will permanently remove all lessons within this module.`,
    });
  };

  const handleDeleteLesson = (lesson: any) => {
    setDeleteConfirmation({
      isOpen: true,
      type: 'lesson',
      item: lesson,
      title: 'Delete Lesson',
      message: `Are you sure you want to delete "${lesson.title}"? This action cannot be undone.`,
    });
  };

  const handleConfirmDelete = () => {
    const { type, item } = deleteConfirmation;

    switch (type) {
      case 'course':
        deleteCourseMutation.mutate(item.id);
        break;
      case 'module':
        deleteModuleMutation.mutate({ courseId: course.id, moduleId: item.id });
        break;
      case 'lesson':
        const moduleId = course.modules?.find(m => m.lessons?.some(l => l.id === item.id))?.id;
        if (moduleId) {
          deleteLessonMutation.mutate({
            courseId: course.id,
            moduleId,
            lessonId: item.id,
          });
        }
        break;
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation({ isOpen: false, type: 'course', item: null, title: '', message: '' });
  };

  const renderContent = () => {
    return (
      <div className="space-y-8 bg-white p-6 rounded-b-md shadow-md">
        {/* Add Module Button */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Course Modules</h2>
          {canSeePublished && (
            <ButtonComponent
              title="Add Module"
              icon={<Plus size={16} />}
              variant="primary"
              onClick={handleAddModule}
              className="flex items-center gap-2"
            />
          )}
        </div>

        {!course.modules || course.modules.length === 0 ? (
          <EmptyState
            icon={<Book className="mx-auto h-12 w-12 text-gray-400" />}
            title="No modules yet"
            description="This course doesn't have any modules yet. Click 'Add Module' to get started."
          />
        ) : (
          course.modules.map((module, moduleIndex) => (
            <ModuleCard
              key={moduleIndex}
              module={module}
              moduleIndex={moduleIndex}
              canSeePublished={canSeePublished}
              onEditModule={handleEditModule}
              onEditLesson={handleEditLesson}
              onDeleteModule={handleDeleteModule}
              onDeleteLesson={handleDeleteLesson}
              onAddLesson={handleAddLesson}
            />
          ))
        )}
      </div>
    );
  };

  const renderMembers = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enrolled Users</h3>
          {enrollments.length > 0 ? (
            <div className="space-y-3">
              {enrollments.map((enrollment, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {enrollment?.user?.firstName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{enrollment?.user?.firstName || 'Unknown User'}</p>
                    <p className="text-xs text-gray-500">
                      Enrolled: {new Date(enrollment?.dateEnrolled || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<Book className="mx-auto h-8 w-8 text-gray-400" />}
              title="No users enrolled"
              description="No users have enrolled in this course yet."
              className="text-center py-6"
            />
          )}
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
                <input
                  {...register('name', {
                    required: 'Course name is required',
                    minLength: { value: 3, message: 'Course name must be at least 3 characters' },
                  })}
                  type="text"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  {...register('description', {
                    required: 'Course description is required',
                    minLength: { value: 10, message: 'Description must be at least 10 characters' },
                  })}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Image URL</label>
                <input
                  {...register('imageUrl', {
                    validate: value => {
                      if (!value || value.trim() === '') return true; // Campo opcional
                      return /^https?:\/\/.+/.test(value) || 'Please enter a valid URL';
                    },
                  })}
                  type="url"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="https://example.com/image.jpg"
                />
                {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Status</h3>
            <div className="flex-1 flex flex-col">
              <div className="flex-1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Publication Status</label>
                  <select
                    {...register('isPublished')}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="false">Draft</option>
                    <option value="true">Published</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Choose whether this course is visible to students and available for enrollment.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-end">
                  <ButtonComponent
                    title={updateCourseMutation.isLoading ? 'Saving...' : 'Save Changes'}
                    variant="primary"
                    size="md"
                    icon={updateCourseMutation.isLoading ? <Loader /> : null}
                    onClick={handleSubmit(onSubmit)}
                    disabled={!isDirty || updateCourseMutation.isLoading}
                    positionIcon="right"
                    type="submit"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-red-200 p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-4">Danger Zone</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">Delete Course</h4>
                <p className="text-sm text-gray-600">
                  Permanently delete this course and all its content. This action cannot be undone.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={handleDeleteCourse}
              >
                Delete Course
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  };

  const renderAnalytics = () => {
    return (
      <div className="space-y-6">
        {analytics ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Enrollments</h3>
              <p className="text-2xl font-bold text-gray-900">{analytics?.totalEnrollments}</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
              <p className="text-2xl font-bold text-gray-900">{analytics?.completionRate}%</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
              <p className="text-2xl font-bold text-gray-900">{analytics?.averageRating}/5</p>
            </div>
          </div>
        ) : (
          <EmptyState
            icon={<Book className="mx-auto h-12 w-12 text-gray-400" />}
            title="No analytics available"
            description="Analytics data is not available for this course yet."
          />
        )}
      </div>
    );
  };

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return renderContent();
      case 'members':
        return renderMembers();
      case 'settings':
        return renderSettings();
      case 'analytics':
        return renderAnalytics();
      default:
        return renderContent();
    }
  };

  return (
    <>
      {renderTabContent()}

      {/* Modal de edición de módulos */}
      <EditModuleModal
        isOpen={isEditModuleModalOpen}
        courseId={course.id}
        module={selectedModule}
        onClose={handleCloseEditModal}
        showSuccess={showSuccess}
        showError={showError}
      />

      {/* Modal de edición de lecciones */}
      <EditLessonModal
        isOpen={isEditLessonModalOpen}
        courseId={course.id}
        moduleId={selectedModuleId}
        lesson={selectedLesson}
        onClose={handleCloseEditLessonModal}
        showSuccess={showSuccess}
        showError={showError}
      />

      {/* Modal de confirmación de eliminación */}
      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title={deleteConfirmation.title}
        message={deleteConfirmation.message}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteCourseMutation.isLoading || deleteModuleMutation.isLoading || deleteLessonMutation.isLoading}
      />

      {/* Create Module Modal */}
      <CreateModuleModal
        isOpen={isCreateModuleModalOpen}
        onClose={handleCloseCreateModuleModal}
        courseId={course.id}
        showSuccess={showSuccess}
        showError={showError}
      />

      {/* Create Lesson Modal */}
      <CreateLessonModal
        isOpen={isCreateLessonModalOpen}
        onClose={handleCloseCreateLessonModal}
        courseId={course.id}
        moduleId={createLessonModuleId}
        showSuccess={showSuccess}
        showError={showError}
      />

      {/* Edit Lesson Modal */}
      <EditLessonModal
        isOpen={isEditLessonModalOpen}
        onClose={handleCloseEditLessonModal}
        courseId={course.id}
        moduleId={selectedModuleId}
        lesson={selectedLesson}
        showSuccess={showSuccess}
        showError={showError}
      />
    </>
  );
}
