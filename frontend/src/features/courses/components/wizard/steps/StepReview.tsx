import { ButtonComponent } from '@shared/components/buttons';
import { useFormContext } from 'react-hook-form';

export default function StepReview({ onBack, onFinish }: { onBack: () => void; onFinish: () => void }) {
  const { getValues } = useFormContext();
  const v = getValues();
  return (
    <section>
      <h3 className="font-semibold mb-3">Review</h3>
      <pre className="p-3 bg-gray-50 border rounded text-sm overflow-auto">{JSON.stringify(v, null, 2)}</pre>
      <div className="mt-6 flex justify-between">
        <ButtonComponent variant="secondary" onClick={onBack} title="Back" />
        <ButtonComponent onClick={onFinish} title="Finish" />
      </div>
    </section>
  );
}
