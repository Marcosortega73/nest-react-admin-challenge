import { ButtonComponent } from '@shared/components/buttons';
import { useFormContext } from 'react-hook-form';

export default function StepInfo({ onNext }: { onNext: () => void }) {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext();

  const handleNext = async () => {
    const ok = await trigger(['name', 'description']);
    if (ok) onNext();
  };

  return (
    <section className="grid grid-cols-12 gap-6">
      <div className="col-span-8">
        <label className="block mb-1">Course name *</label>
        <input className="input w-full" {...register('name', { required: 'Required', maxLength: 80 })} />
        {errors.name && <p className="text-red-600 text-sm mt-1">{String(errors.name.message)}</p>}

        <label className="block mt-4 mb-1">Description *</label>
        <textarea className="input w-full" rows={4} {...register('description', { required: 'Required' })} />
        {errors.description && <p className="text-red-600 text-sm mt-1">{String(errors.description.message)}</p>}

        <label className="block mt-4 mb-1">Cover image URL (optional)</label>
        <input className="input w-full" placeholder="https://..." {...register('imageUrl')} />

        <div className="mt-6 flex justify-end">
          <ButtonComponent variant="primary" onClick={handleNext} title="Next →" />
        </div>
      </div>
      <aside className="col-span-4">
        <div className="border rounded p-4 text-center text-gray-500">Preview</div>
      </aside>
    </section>
  );
}
