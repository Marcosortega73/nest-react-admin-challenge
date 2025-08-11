import { ButtonComponent } from '@shared/components/buttons';
import React from 'react';

interface HeaderStepperProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export default function HeaderStepper({ onSubmit, onCancel }: HeaderStepperProps) {
  return (
    <div className="flex justify-between items-center border-b border-gray-200 p-3 ">
      <div>
        <h1 className="font-semibold text-2xl">Course Wizard</h1>
        <p className="text-gray-500 text-xs">Fill the form to create a new course</p>
      </div>
      <div className="flex gap-3 items-center">
        <ButtonComponent title="Cancel" variant="secondary" size="md" onClick={onCancel} />
        <ButtonComponent title="Save" variant="primary" size="md" onClick={onSubmit} type="submit" />
      </div>
    </div>
  );
}
