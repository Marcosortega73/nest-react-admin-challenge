import { ButtonComponent } from '@shared/components/buttons';
import { ImputCheckbox, ImputTextField } from '@shared/components/imputs';
import { useEffect } from 'react';
import { Save, X } from 'react-feather';
import { FormProvider, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from 'react-query';

import courseModuleService, { UpdateCourseModuleRequest } from '../../services/courseModule.api';

interface EditModuleModalProps {
  isOpen: boolean;
  courseId: string;
  module: {
    id: string;
    title: string;
    description?: string;
    isPublished: boolean;
  } | null;
  onClose: () => void;
  showSuccess: (title: string, message?: string) => void;
  showError: (title: string, message?: string) => void;
}

interface ModuleFormData {
  title: string;
  description: string;
  isPublished: boolean;
}

export default function EditModuleModal({
  isOpen,
  courseId,
  module,
  onClose,
  showSuccess,
  showError,
}: EditModuleModalProps) {
  const queryClient = useQueryClient();

  const methods = useForm<ModuleFormData>({
    defaultValues: {
      title: '',
      description: '',
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

  // Cargar datos del módulo cuando se abre el modal
  useEffect(() => {
    if (isOpen && module) {
      reset({
        title: module.title,
        description: module.description || '',
        isPublished: module.isPublished,
      });
    }
  }, [isOpen, module, reset]);

  // Mutation para actualizar el módulo
  const updateModuleMutation = useMutation(
    (updateData: UpdateCourseModuleRequest) => courseModuleService.update(courseId, module!.id, updateData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['course', courseId]);
        showSuccess('Module Updated', 'The module has been updated successfully.');
        onClose();
      },
      onError: error => {
        showError('Error updating module');
      },
    },
  );

  const onSubmit = (formData: ModuleFormData) => {
    const updateData: UpdateCourseModuleRequest = {
      title: formData.title,
      description: formData.description && formData.description.trim() !== '' ? formData.description : undefined,
      isPublished: formData.isPublished,
    };

    updateModuleMutation.mutate(updateData);
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
                  <h3 className="text-lg font-semibold text-gray-900">Edit Module</h3>
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
                    label="Module Title"
                    name="title"
                    register={register}
                    rules={{
                      required: 'Title is required',
                      minLength: { value: 3, message: 'Title must be at least 3 characters' },
                    }}
                    errors={errors}
                    type="text"
                    placeholder="Enter module title"
                    className="input w-full"
                    clearErrors={clearErrors}
                    required
                  />

                  <ImputTextField
                    label="Module Description (optional)"
                    name="description"
                    register={register}
                    errors={errors}
                    type="text"
                    placeholder="Enter module description"
                    className="input w-full"
                    multiline
                    rows={4}
                    clearErrors={clearErrors}
                  />

                  <ImputCheckbox
                    label="Published"
                    name="isPublished"
                    register={register}
                    errors={errors}
                    description="Make this module visible to students"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <ButtonComponent
                  type="submit"
                  title={updateModuleMutation.isLoading ? 'Saving...' : 'Save Changes'}
                  icon={<Save />}
                  variant="primary"
                  size="md"
                  disabled={updateModuleMutation.isLoading}
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
