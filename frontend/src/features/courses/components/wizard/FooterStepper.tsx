import { ButtonComponent } from '@shared/components/buttons';
import { ArrowLeft, ArrowRight, Save } from 'react-feather';
import { useFormContext } from 'react-hook-form';

interface FooterStepperProps {
  onNext: () => void;
  onBack: () => void;
  step: number;
  onSubmit: () => void;
}

export default function FooterStepper({ onNext, onBack, step, onSubmit }: FooterStepperProps) {
  const { trigger } = useFormContext();

  const handleNext = async () => {
    const ok = await trigger(['name', 'description']);
    if (ok) onNext();
  };
  return (
    <div
      className={`flex items-center ${
        step !== 1 ? 'justify-between' : 'justify-end'
      } p-5 border-t border-gray-200 sticky bottom-0 bg-white z-50 w-full`}
    >
      {step !== 1 && (
        <ButtonComponent title="Back" variant="secondary" size="md" icon={<ArrowLeft />} onClick={onBack} />
      )}
      <ButtonComponent
        title={step === 4 ? 'Save' : 'Next'}
        variant="primary"
        size="md"
        icon={step === 4 ? <Save /> : <ArrowRight />}
        onClick={step === 4 ? onSubmit : handleNext}
        positionIcon="right"
        type={step === 4 ? 'submit' : 'button'}
      />
    </div>
  );
}
