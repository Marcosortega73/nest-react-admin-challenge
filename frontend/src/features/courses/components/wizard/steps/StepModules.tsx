import { ButtonComponent } from '@shared/components/buttons';
import { Plus } from 'react-feather';
import { useFieldArray, useFormContext } from 'react-hook-form';

export default function StepModules({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const {
    control,
    register,
    formState: { errors },
    trigger,
  } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: 'modules' });

  const handleNext = async () => {
    const ok = await trigger(['modules']);
    if (ok) onNext();
  };

  return (
    <section>
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">Modules</h3>
        <ButtonComponent onClick={() => append({ title: '', description: '' })} title="Add module" icon={<Plus />} />
      </div>

      {fields.length === 0 && <p className="text-gray-500">No modules yet.</p>}

      <div className="space-y-4">
        {fields.map((f, idx) => (
          <div key={f.id} className="border rounded p-3">
            <label className="block mb-1">Title *</label>
            <input className="input w-full" {...register(`modules.${idx}.title` as const, { required: 'Required' })} />
            {errors.modules?.[idx]?.title && (
              <p className="text-red-600 text-sm mt-1">{String((errors.modules as any)[idx]?.title?.message)}</p>
            )}

            <label className="block mt-3 mb-1">Description</label>
            <input className="input w-full" {...register(`modules.${idx}.description` as const)} />

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
