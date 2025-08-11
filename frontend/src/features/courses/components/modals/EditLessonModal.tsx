import { ButtonComponent } from '@shared/components/buttons';
import { ImputCheckbox, ImputTextField } from '@shared/components/imputs';
import { SelectField } from '@shared/components/selects';
import { LessonType } from '@shared/utils/lessonIconUtils';
import { useEffect } from 'react';
import { Save, X } from 'react-feather';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';

import courseLessonService, { UpdateCourseLessonRequest } from '../../services/courseLesson.api';

interface EditLessonModalProps {
  isOpen: boolean;
  courseId: string;
  moduleId: string;
  lesson: {
    id: string;
    title: string;
    description?: string;
    type: LessonType;
    contentUrl: string;
    isPublished: boolean;
  } | null;
  onClose: () => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
}

interface LessonFormData {
  title: string;
  description: string;
  type: LessonType;
  contentUrl: string;
  isPublished: boolean;
}

const typeOptions = [
  { value: 'VIDEO', label: 'Video' },
  { value: 'PDF', label: 'PDF Document' },
  { value: 'TEXT', label: 'Text Content' },
  { value: 'LINK', label: 'External Link' },
];

export default function EditLessonModal({
  isOpen,
  courseId,
  moduleId,
  lesson,
  onClose,
  showSuccess,
  showError,
}: EditLessonModalProps) {
  const queryClient = useQueryClient();

  const methods = useForm<LessonFormData>({
    defaultValues: {
      title: '',
      description: '',
      type: 'VIDEO',
      contentUrl: '',
      isPublished: true,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = methods;

  // Cargar datos de la lección cuando se abre el modal
  useEffect(() => {
    if (isOpen && lesson) {
      reset({
        title: lesson.title,
        description: lesson.description || '',
        type: lesson.type,
        contentUrl: lesson.contentUrl,
        isPublished: lesson.isPublished,
      });
    }
  }, [isOpen, lesson, reset]);

  // Mutation para actualizar la lección
  const updateLessonMutation = useMutation(
    (updateData: UpdateCourseLessonRequest) => courseLessonService.update(courseId, moduleId, lesson!.id, updateData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['course', courseId]);
        showSuccess('Lesson Updated', 'The lesson has been updated successfully.');
        onClose();
      },
      onError: error => {
        console.error('Error updating lesson:', error);
        showError('Update Failed', 'There was an error updating the lesson. Please try again.');
      },
    },
  );

  const onSubmit = (formData: LessonFormData) => {
    const updateData: UpdateCourseLessonRequest = {
      title: formData.title,
      description: formData.description && formData.description.trim() !== '' ? formData.description : undefined,
      type: formData.type,
      contentUrl: formData.contentUrl,
      isPublished: formData.isPublished,
    };

    updateLessonMutation.mutate(updateData);
  };

  const handleClose = () => {
    reset();
    clearErrors();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        {/* Overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleClose} />

        {/* Modal */}
        <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-lg w-full">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Header */}
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Edit Lesson</h3>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Form Content */}
                <div className="space-y-6">
                  <ImputTextField
                    label="Lesson Title"
                    name="title"
                    register={register}
                    rules={{
                      required: 'Title is required',
                      minLength: { value: 3, message: 'Title must be at least 3 characters' },
                    }}
                    errors={errors}
                    type="text"
                    placeholder="Enter lesson title"
                    className="input w-full"
                    clearErrors={clearErrors}
                    required
                  />

                  <ImputTextField
                    label="Lesson Description (optional)"
                    name="description"
                    register={register}
                    errors={errors}
                    type="text"
                    placeholder="Enter lesson description"
                    className="input w-full"
                    multiline
                    rows={3}
                    clearErrors={clearErrors}
                  />

                  <SelectField
                    label="Content Type"
                    name="type"
                    register={register}
                    rules={{ required: 'Content type is required' }}
                    errors={errors}
                    options={typeOptions}
                    placeholder="Select content type"
                    className="select w-full"
                    required
                  />

                  <ImputTextField
                    label="Content URL"
                    name="contentUrl"
                    register={register}
                    rules={{
                      required: 'Content URL is required',
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'Please enter a valid URL starting with http:// or https://',
                      },
                    }}
                    errors={errors}
                    type="url"
                    placeholder="https://example.com/content"
                    className="input w-full"
                    clearErrors={clearErrors}
                    required
                  />

                  <ImputCheckbox
                    label="Published"
                    name="isPublished"
                    register={register}
                    errors={errors}
                    description="Make this lesson visible to students"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <ButtonComponent
                  type="submit"
                  title={updateLessonMutation.isLoading ? 'Saving...' : 'Save Changes'}
                  icon={<Save />}
                  variant="primary"
                  size="md"
                  disabled={updateLessonMutation.isLoading}
                  className="w-full sm:ml-3 sm:w-auto"
                />
                <ButtonComponent
                  type="button"
                  onClick={handleClose}
                  title="Cancel"
                  icon={<X />}
                  variant="secondary"
                  size="md"
                  className="mt-3 w-full sm:mt-0 sm:w-auto"
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
