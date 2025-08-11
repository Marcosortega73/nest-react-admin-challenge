import { ButtonComponent } from '@shared/components/buttons';
import { ImputCheckbox, ImputTextField } from '@shared/components/imputs';
import { SelectField } from '@shared/components/selects';
import { LessonType } from '@shared/utils/lessonIconUtils';
import { useEffect } from 'react';
import { Save, X } from 'react-feather';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';

import courseLessonService, { CreateCourseLessonRequest } from '../../services/courseLesson.api';

interface CreateLessonModalProps {
  isOpen: boolean;
  courseId: string;
  moduleId: string;
  onClose: () => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
}

interface LessonFormData {
  title: string;
  description: string;
  type: LessonType;
  contentUrl: string;
  html: string;
  isPublished: boolean;
}

const typeOptions = [
  { value: 'VIDEO', label: 'Video' },
  { value: 'PDF', label: 'PDF Document' },
  { value: 'TEXT', label: 'Text Content' },
  { value: 'LINK', label: 'External Link' },
];

export default function CreateLessonModal({
  isOpen,
  courseId,
  moduleId,
  onClose,
  showSuccess,
  showError,
}: CreateLessonModalProps) {
  const queryClient = useQueryClient();

  const methods = useForm<LessonFormData>({
    defaultValues: {
      title: '',
      description: '',
      type: 'VIDEO',
      contentUrl: '',
      html: '',
      isPublished: false,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = methods;
  const selectedType = watch('type') as LessonType | undefined;

  const createLessonMutation = useMutation(
    (data: CreateCourseLessonRequest) => courseLessonService.create(courseId, moduleId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['course', courseId]);
        showSuccess('Lesson Created', 'The lesson has been created successfully.');
        handleClose();
      },
      onError: (error: any) => {
        console.error('Error creating lesson:', error);
        showError('Creation Failed', 'There was an error creating the lesson. Please try again.');
      },
    },
  );

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (formData: LessonFormData) => {
    const createData: CreateCourseLessonRequest = {
      title: formData.title,
      description: formData.description && formData.description.trim() !== '' ? formData.description : undefined,
      type: formData.type,
      isPublished: formData.isPublished,
    };

    // Add content field based on lesson type
    if (formData.type === 'TEXT') {
      createData.html = formData.html;
    } else {
      createData.contentUrl = formData.contentUrl;
    }

    createLessonMutation.mutate(createData);
  };

  useEffect(() => {
    if (isOpen) {
      reset({
        title: '',
        description: '',
        type: 'VIDEO',
        contentUrl: '',
        html: '',
        isPublished: false,
      });
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-auto max-h-[90vh] overflow-y-auto">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create New Lesson</h2>
              <button
                type="button"
                onClick={handleClose}
                disabled={createLessonMutation.isLoading}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <ImputTextField
                  label="Lesson Title"
                  name="title"
                  register={register}
                  rules={{ required: 'Lesson title is required' }}
                  errors={errors}
                  placeholder="Enter lesson title"
                  className="input w-full"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    {...register('description')}
                    placeholder="Enter lesson description (optional)"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows={3}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                </div>

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

                {/* Conditional content field based on lesson type */}
                {selectedType === 'TEXT' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">HTML Content</label>
                    <textarea
                      {...register('html', {
                        required: selectedType === 'TEXT' ? 'HTML content is required for text lessons' : false,
                      })}
                      placeholder="Enter HTML content for the lesson"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      rows={6}
                    />
                    {errors.html && <p className="mt-1 text-sm text-red-600">{errors.html.message}</p>}
                  </div>
                ) : (
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
                    placeholder="https://example.com/content"
                    className="input w-full"
                    required
                  />
                )}

                <ImputCheckbox
                  label="Published"
                  name="isPublished"
                  register={register}
                  errors={errors}
                  description="Check to make this lesson visible to students"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <ButtonComponent
                title="Cancel"
                variant="secondary"
                onClick={handleClose}
                disabled={createLessonMutation.isLoading}
              />
              <ButtonComponent
                title={createLessonMutation.isLoading ? 'Creating...' : 'Create Lesson'}
                variant="primary"
                type="submit"
                disabled={createLessonMutation.isLoading}
                icon={createLessonMutation.isLoading ? undefined : <Save size={16} />}
                positionIcon="left"
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
