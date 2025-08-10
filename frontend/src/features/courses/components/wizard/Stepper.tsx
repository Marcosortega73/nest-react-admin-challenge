import React from 'react';

type Props = { steps: string[]; current: number };
export function Stepper({ steps, current }: Props) {
  return (
    <ol className="flex gap-4 items-center">
      {steps.map((s, i) => {
        const step = i + 1;
        const isActive = step === current;
        const done = step < current;
        return (
          <li key={s} className="flex items-center gap-2">
            <span
              className={`w-7 h-7 rounded-full text-sm flex items-center justify-center
               ${done ? 'bg-green-500 text-white' : isActive ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              {step}
            </span>
            <span className={`${isActive ? 'font-semibold' : 'text-gray-600'}`}>{s}</span>
          </li>
        );
      })}
    </ol>
  );
}
