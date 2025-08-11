import { ButtonComponent } from '@shared/components/buttons';
import { ImputCheckbox, ImputTextField } from '@shared/components/imputs';
import { useState } from 'react';
import { Edit, FileText, Link, Play, Plus, Save, X } from 'react-feather';
import { useFieldArray, useFormContext } from 'react-hook-form';

export default function StepLessons() {
  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue,
    trigger,
    clearErrors,
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'lessons' });
  const modules = watch('modules') as Array<{ title: string; description: string; isPublished: boolean }>;

  const [selectedModuleIndex, setSelectedModuleIndex] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [editingLessonIndex, setEditingLessonIndex] = useState<number | null>(null);
  const [originalLessonValues, setOriginalLessonValues] = useState<any>(null);

  const selectedModuleLessons = fields.filter((_, index) => {
    const lesson = watch(`lessons.${index}`);
    return lesson?.moduleIndex === selectedModuleIndex;
  });

  const handleSelectModule = (moduleIndex: number) => {
    setSelectedModuleIndex(moduleIndex);
    setCurrentView('list');
  };

  const handleAddLesson = () => {
    if (selectedModuleIndex === null) return;
    append({
      title: '',
      subtitle: '',
      content: '',
      duration: 0,
      type: 'Video',
      moduleIndex: selectedModuleIndex,
      isPreview: false,
      isPublished: true,
    });
    setEditingLessonIndex(fields.length);
    setOriginalLessonValues(null);
    setCurrentView('form');
  };

  const handleEditLesson = (lessonIndex: number) => {
    const currentValues = {
      title: watch(`lessons.${lessonIndex}.title`),
      subtitle: watch(`lessons.${lessonIndex}.subtitle`),
      content: watch(`lessons.${lessonIndex}.content`),
      duration: watch(`lessons.${lessonIndex}.duration`),
      type: watch(`lessons.${lessonIndex}.type`),
      isPreview: watch(`lessons.${lessonIndex}.isPreview`),
      isPublished: watch(`lessons.${lessonIndex}.isPublished`),
    };
    setOriginalLessonValues(currentValues);
    setEditingLessonIndex(lessonIndex);
    setCurrentView('form');
  };

  const handleSaveLesson = async () => {
    if (editingLessonIndex === null) return;

    const isValid = await trigger([`lessons.${editingLessonIndex}.title`, `lessons.${editingLessonIndex}.content`]);

    if (!isValid) {
      return;
    }

    setEditingLessonIndex(null);
    setOriginalLessonValues(null);
    setCurrentView('list');
  };

  const handleCancelEdit = () => {
    if (editingLessonIndex !== null) {
      if (editingLessonIndex === fields.length - 1 && originalLessonValues === null) {
        remove(editingLessonIndex);
      } else if (originalLessonValues) {
        setValue(`lessons.${editingLessonIndex}.title`, originalLessonValues.title);
        setValue(`lessons.${editingLessonIndex}.subtitle`, originalLessonValues.subtitle);
        setValue(`lessons.${editingLessonIndex}.content`, originalLessonValues.content);
        setValue(`lessons.${editingLessonIndex}.duration`, originalLessonValues.duration);
        setValue(`lessons.${editingLessonIndex}.type`, originalLessonValues.type);
        setValue(`lessons.${editingLessonIndex}.isPreview`, originalLessonValues.isPreview);
        setValue(`lessons.${editingLessonIndex}.isPublished`, originalLessonValues.isPublished);
      }
    }
    setEditingLessonIndex(null);
    setOriginalLessonValues(null);
    setCurrentView('list');
  };

  const handleDeleteLesson = (lessonIndex: number) => {
    remove(lessonIndex);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return <Play size={20} className="text-gray-600" />;
      case 'PDF':
        return <FileText size={20} className="text-red-600" />;
      case 'Text':
        return <FileText size={20} className="text-blue-600" />;
      case 'Link':
        return <Link size={20} className="text-green-600" />;
      default:
        return <Play size={20} className="text-gray-600" />;
    }
  };

  return (
    <section className="h-full flex flex-col gap-3 px-4">
      <div className="flex flex-col mb-3 text-center">
        <h3 className="font-semibold text-2xl">Manage lessons</h3>
        <span className="text-gray-500 text-sm">Add detailed content to each module</span>
      </div>

      {currentView === 'list' ? (
        <div className="flex-1 flex gap-6 overflow-hidden">
          <div className="w-[20rem] flex-shrink-0">
            <div className="bg-white rounded-lg border p-4 h-full">
              <h4 className="font-semibold text-lg mb-4">Modules</h4>

              {modules.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <p className="text-sm">No modules created</p>
                  <p className="text-xs mt-1">Go back to the previous step to create modules</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-96 pb-7 pr-2 overflow-y-auto">
                  {modules.map((module, index) => {
                    const moduleLessonsCount = fields.filter((_, lessonIndex) => {
                      const lesson = watch(`lessons.${lessonIndex}`);
                      return lesson?.moduleIndex === index;
                    }).length;

                    return (
                      <div
                        key={index}
                        onClick={() => handleSelectModule(index)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          selectedModuleIndex === index
                            ? 'border-primary bg-primary/10 text-primary shadow-lg'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-sm text-gray-900 truncate">
                              {module.title || `Module ${index + 1}`}
                            </h5>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">{moduleLessonsCount} lessons</span>
                              {module.isPublished ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                  Published
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Draft</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {selectedModuleIndex === null ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Play size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium">Select a module</p>
                  <p className="text-sm mt-1">Choose a module from the left to view and manage its lessons</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-lg">
                      Lessons of "{modules[selectedModuleIndex]?.title || `Module ${selectedModuleIndex + 1}`}"
                    </h4>
                    <p className="text-sm text-primary">{selectedModuleLessons.length} lessons in this module</p>
                  </div>
                  <ButtonComponent onClick={handleAddLesson} title="New lesson" icon={<Plus />} variant="primary" />
                </div>

                {selectedModuleLessons.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Play size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-sm mt-1 text-gray-500">No lessons yet</p>
                      <p className="text-lg font-medium">Click the button below to add your first lesson</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto">
                    <div className="space-y-3">
                      {selectedModuleLessons.map((lesson, lessonIndex) => {
                        const actualIndex = fields.findIndex(f => f.id === lesson.id);
                        const lessonData = watch(`lessons.${actualIndex}`);

                        return (
                          <div
                            key={lesson.id}
                            className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow"
                          >
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                {getLessonIcon(lessonData?.type || 'Video')}
                              </div>
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-medium text-gray-900">{lessonData?.title || 'No title'}</h5>
                                {lessonData?.isPublished ? (
                                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    Published
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    Draft
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm text-primary">{lessonData?.type || 'Video'}</span>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-500">{lessonData?.duration || 0} min</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEditLesson(actualIndex)}
                                className="p-2 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteLesson(actualIndex)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white rounded-lg border p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-semibold text-xl">
                {editingLessonIndex !== null && editingLessonIndex < fields.length - 1 ? 'Edit lesson' : 'New lesson'}
              </h4>
              <button
                onClick={handleCancelEdit}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {editingLessonIndex !== null && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <ImputTextField
                    label="Lesson title"
                    name={`lessons.${editingLessonIndex}.title`}
                    register={register}
                    rules={{ required: 'The title is required' }}
                    errors={errors}
                    placeholder="Lesson title"
                    clearErrors={clearErrors}
                  />
                  <ImputTextField
                    label="Subtitle (optional)"
                    name={`lessons.${editingLessonIndex}.subtitle`}
                    register={register}
                    errors={errors}
                    placeholder="Subtitle optional"
                    clearErrors={clearErrors}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lesson type</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...register(`lessons.${editingLessonIndex}.type`)}
                    >
                      <option value="Video">Video</option>
                      <option value="PDF">PDF</option>
                      <option value="Text">Texto</option>
                      <option value="Link">Enlace</option>
                    </select>
                  </div>
                  <ImputTextField
                    label="Duration (minutes)"
                    name={`lessons.${editingLessonIndex}.duration`}
                    register={register}
                    rules={{ valueAsNumber: true }}
                    errors={errors}
                    type="number"
                    placeholder="0"
                    clearErrors={clearErrors}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <ImputTextField
                    label="URL of the content"
                    name={`lessons.${editingLessonIndex}.content`}
                    register={register}
                    rules={{ required: 'Content URL is required' }}
                    errors={errors}
                    placeholder="https://..."
                    clearErrors={clearErrors}
                    required
                  />
                  <ImputCheckbox
                    label="Published"
                    name={`lessons.${editingLessonIndex}.isPublished`}
                    register={register}
                    errors={errors}
                    description="Make this lesson visible to students"
                    defaultChecked={originalLessonValues ? originalLessonValues.isPublished : true}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <ButtonComponent onClick={handleCancelEdit} title="Cancel" variant="secondary" />
                  <ButtonComponent onClick={handleSaveLesson} title="Save lesson" icon={<Save />} variant="primary" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
