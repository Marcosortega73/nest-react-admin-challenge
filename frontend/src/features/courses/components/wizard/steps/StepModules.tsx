import { ButtonComponent } from '@shared/components/buttons';
import { ImputCheckbox, ImputTextField } from '@shared/components/imputs';
import { useState } from 'react';
import { Edit3, Plus, Save, Trash2, X } from 'react-feather';
import { useFieldArray, useFormContext } from 'react-hook-form';

export default function StepModules() {
  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue,
    trigger,
    clearErrors,
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'modules' });
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [originalValues, setOriginalValues] = useState<any>(null);

  const handleAddModule = () => {
    append({ title: '', description: '', isPublished: true });
    setEditingIndex(fields.length);
    setOriginalValues(null);
    setCurrentView('form');
  };

  const handleEditModule = (index: number) => {
    const currentValues = {
      title: watch(`modules.${index}.title`),
      description: watch(`modules.${index}.description`),
      isPublished: watch(`modules.${index}.isPublished`),
    };
    setOriginalValues(currentValues);
    setEditingIndex(index);
    setCurrentView('form');
  };

  const handleSaveModule = async () => {
    if (editingIndex === null) return;

    const isValid = await trigger(`modules.${editingIndex}.title`);

    if (!isValid) {
      return;
    }

    setEditingIndex(null);
    setOriginalValues(null);
    setCurrentView('list');
  };

  const handleCancelEdit = () => {
    if (editingIndex !== null) {
      if (editingIndex === fields.length - 1 && originalValues === null) {
        remove(editingIndex);
      } else if (originalValues) {
        setValue(`modules.${editingIndex}.title`, originalValues.title);
        setValue(`modules.${editingIndex}.description`, originalValues.description);
        setValue(`modules.${editingIndex}.isPublished`, originalValues.isPublished);
      }
    }
    setEditingIndex(null);
    setOriginalValues(null);
    setCurrentView('list');
  };

  return (
    <section className="h-full flex flex-col gap-3 px-[15rem]">
      <div className="flex flex-col mb-3 text-center">
        <h3 className="font-semibold text-2xl">Modules</h3>
        <span className="text-gray-500 text-sm">Organize your content into thematic modules</span>
      </div>

      {currentView === 'list' ? (
        <>
          {fields.length === 0 ? (
            <div className="flex items-center justify-center">
              <div className="border rounded p-6 flex flex-col items-center justify-center gap-4 shadow-md w-1/2 mx-auto">
                <Plus size={48} color="gray" />
                <div className="flex flex-col gap-2 text-center">
                  <span className="text-gray-700 text-lg font-semibold">No modules yet</span>
                  <span className="text-gray-500 text-sm">Click the button below to add your first module</span>
                </div>
                <ButtonComponent
                  onClick={handleAddModule}
                  title="Add your first module"
                  icon={<Plus />}
                  variant="primary"
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-4 min-h-0">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">Modules ({fields.length})</span>
                </div>
                <ButtonComponent
                  onClick={handleAddModule}
                  title="Agregar módulo"
                  icon={<Plus />}
                  variant="primary"
                  size="sm"
                />
              </div>

              <div className="flex-1 overflow-y-auto px-4">
                <div className="space-y-3 pb-4">
                  {fields.map((field, idx) => {
                    const moduleTitle = watch(`modules.${idx}.title`) || `Module ${idx + 1}`;
                    const moduleDescription = watch(`modules.${idx}.description`) || '';
                    const isPublished = watch(`modules.${idx}.isPublished`);

                    return (
                      <div
                        key={field.id}
                        className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {isPublished ? (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                                  Published
                                </span>
                              ) : (
                                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                                  Draft
                                </span>
                              )}
                              <span className="text-gray-500 text-sm">0 lecciones</span>
                            </div>
                            <h4 className="font-semibold text-lg text-gray-900 mb-1">{moduleTitle}</h4>
                            <p className="text-gray-600 text-sm">{moduleDescription}</p>
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            <button
                              type="button"
                              onClick={() => handleEditModule(idx)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Edit module"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => remove(idx)}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete module"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col pb-2">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="p-2 text-gray-500 hover:text-gray-700 rounded transition-colors"
                title="Back to list"
              >
                <X size={20} />
              </button>
              <span className="font-semibold text-lg">
                {editingIndex !== null && editingIndex < fields.length - 1 ? 'Edit Module' : 'Add New Module'}
              </span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-2xl">
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="space-y-6">
                  {editingIndex !== null && (
                    <>
                      <ImputTextField
                        label="Module Title"
                        name={`modules.${editingIndex}.title`}
                        register={register}
                        rules={{ required: 'Title is required' }}
                        errors={errors}
                        type="text"
                        placeholder="Enter module title"
                        className="input w-full"
                        clearErrors={clearErrors}
                        required
                      />

                      <ImputTextField
                        label="Module Description (optional)"
                        name={`modules.${editingIndex}.description`}
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
                        name={`modules.${editingIndex}.isPublished`}
                        register={register}
                        errors={errors}
                        description="Make this module visible to students"
                        defaultChecked={originalValues ? originalValues.isPublished : true}
                      />

                      <div className="flex justify-end gap-3 pt-4">
                        <ButtonComponent onClick={handleCancelEdit} title="Cancel" icon={<X />} variant="secondary" />
                        <ButtonComponent
                          onClick={handleSaveModule}
                          title="Save Module"
                          icon={<Save />}
                          variant="primary"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
