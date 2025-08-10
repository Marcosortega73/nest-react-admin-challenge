import { ButtonComponent } from '@shared/components/buttons';
import { Plus } from 'react-feather';
import { useFieldArray, useFormContext } from 'react-hook-form';

export default function StepLessons({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const {
    control,
    register,
    watch,
    formState: { errors },
    trigger,
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'lessons' });
  const modules = watch('modules') as Array<{ title: string }>;

  const handleNext = async () => {
    const ok = await trigger(['lessons']);
    if (ok) onNext();
  };

  return (
    <section>
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">Lessons</h3>
        <ButtonComponent
          onClick={() => append({ title: '', content: '', moduleIndex: 0 })}
          title="Add lesson"
          icon={<Plus />}
          variant="primary"
        />
      </div>

      {fields.length === 0 && <p className="text-gray-500">No lessons yet.</p>}

      <div className="space-y-4">
        {fields.map((f, idx) => (
          <div key={f.id} className="border rounded p-3">
            <label className="block mb-1">Title *</label>
            <input className="input w-full" {...register(`lessons.${idx}.title` as const, { required: 'Required' })} />
            {errors.lessons?.[idx]?.title && (
              <p className="text-red-600 text-sm mt-1">{String((errors.lessons as any)[idx]?.title?.message)}</p>
            )}

            <label className="block mt-3 mb-1">Module *</label>
            <select
              className="input w-full"
              {...register(`lessons.${idx}.moduleIndex` as const, { valueAsNumber: true })}
            >
              {modules?.map((m, i) => (
                <option key={i} value={i}>
                  {m.title || `Module ${i + 1}`}
                </option>
              ))}
            </select>

            <label className="block mt-3 mb-1">Content</label>
            <textarea className="input w-full" rows={3} {...register(`lessons.${idx}.content` as const)} />

            <div className="flex justify-end mt-2">
              <button type="button" className="text-red-600" onClick={() => remove(idx)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <ButtonComponent variant="secondary" onClick={onBack} title="Back" />
        <ButtonComponent onClick={handleNext} title="Next" />
      </div>
    </section>
  );
}
