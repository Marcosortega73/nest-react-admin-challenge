import React from 'react';

import { COURSE_WIZARD_STEPS, StepDef } from './stepper.config';

type StepperProps = { current: number };
export function Stepper({ current }: StepperProps) {
  const steps: StepDef[] = COURSE_WIZARD_STEPS;
  return (
    <ol className="flex gap-7 justify-center p-3 items-center w-full">
      {steps.map((s, i) => {
        const step = i + 1;
        const isActive = step === current;
        const done = step < current;
        return (
          <React.Fragment key={s.name + step}>
            <li key={s.name + step} className="flex items-center gap-2 ">
              <span
                className={`w-10 h-10 rounded-full text-sm flex items-center justify-center
                ${done ? 'bg-green-500 text-white' : isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <s.icon size={20} />
              </span>
              <div className="flex flex-col">
                <span className={`${isActive ? 'font-semibold' : 'text-gray-600'}`}>{s.name}</span>
                <span className={`text-xs ${isActive ? 'font-semibold' : 'text-gray-400'}`}>{s.subTitle}</span>
              </div>
            </li>
            {step < steps.length ? <li className="w-[100px] h-0.5 bg-gray-300"></li> : null}
          </React.Fragment>
        );
      })}
    </ol>
  );
}
