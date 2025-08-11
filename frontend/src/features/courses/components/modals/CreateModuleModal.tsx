import { ButtonComponent } from '@shared/components/buttons';
import { ImputCheckbox, ImputTextField } from '@shared/components/imputs';
import { useEffect } from 'react';
import { Save, X } from 'react-feather';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';

import courseModuleService, { CreateCourseModuleRequest } from '../../services/courseModule.api';

interface CreateModuleModalProps {
  isOpen: boolean;
  courseId: string;
  onClose: () => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
}

interface ModuleFormData {
  title: string;
  description: string;
  isPublished: boolean;
}

export default function CreateModuleModal({
  isOpen,
  courseId,
  onClose,
  showSuccess,
  showError,
}: CreateModuleModalProps) {
  const queryClient = useQueryClient();

  const methods = useForm<ModuleFormData>({
    defaultValues: {
      title: '',
      description: '',
      isPublished: false,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  const createModuleMutation = useMutation(
    (data: CreateCourseModuleRequest) => courseModuleService.create(courseId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['course', courseId]);
        showSuccess('Module Created', 'The module has been created successfully.');
        handleClose();
      },
      onError: (error: any) => {
        console.error('Error creating module:', error);
        showError('Creation Failed', 'There was an error creating the module. Please try again.');
      },
    },
  );

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (formData: ModuleFormData) => {
    const createData: CreateCourseModuleRequest = {
      title: formData.title,
      description: formData.description && formData.description.trim() !== '' ? formData.description : undefined,
      isPublished: formData.isPublished,
    };

    createModuleMutation.mutate(createData);
  };

  useEffect(() => {
    if (isOpen) {
      reset({
        title: '',
        description: '',
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
              <h2 className="text-xl font-semibold text-gray-900">Create New Module</h2>
              <button
                type="button"
                onClick={handleClose}
                disabled={createModuleMutation.isLoading}
                className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <ImputTextField
                  label="Module Title"
                  name="title"
                  register={register}
                  rules={{ required: 'Module title is required' }}
                  errors={errors}
                  placeholder="Enter module title"
                  className="input w-full"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    {...register('description')}
                    placeholder="Enter module description (optional)"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    rows={4}
                  />
                  {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                </div>

                <ImputCheckbox
                  label="Published"
                  name="isPublished"
                  register={register}
                  errors={errors}
                  description="Check to make this module visible to students"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <ButtonComponent
                title="Cancel"
                variant="secondary"
                onClick={handleClose}
                disabled={createModuleMutation.isLoading}
              />
              <ButtonComponent
                title={createModuleMutation.isLoading ? 'Creating...' : 'Create Module'}
                variant="primary"
                type="submit"
                disabled={createModuleMutation.isLoading}
                icon={createModuleMutation.isLoading ? undefined : <Save size={16} />}
                positionIcon="left"
              />
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
