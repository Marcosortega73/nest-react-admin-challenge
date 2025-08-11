import { cn } from '@shared/utils';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface ImputCheckboxProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  errors?: FieldErrors;
  className?: string;
  required?: boolean;
  rules?: any;
  description?: string;
  defaultChecked?: boolean;
}

export function ImputCheckbox({
  label,
  name,
  register,
  errors,
  className = '',
  required = false,
  rules,
  description,
  defaultChecked = false,
}: ImputCheckboxProps) {
  return (
    <div className="grid items-start gap-1">
      {/* Label principal como los otros inputs */}
      <label className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mt-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Checkbox con descripción */}
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          id={name}
          defaultChecked={defaultChecked}
          {...register(name, rules)}
          className={cn(
            'mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2 focus:ring-offset-0',
            className,
          )}
        />
        <div className="flex-1">
          {description && (
            <label htmlFor={name} className="text-sm text-gray-700 cursor-pointer leading-relaxed">
              {description}
            </label>
          )}
        </div>
      </div>

      {errors[name as string] && <p className="text-red-600 text-sm mt-1">{String(errors[name as string].message)}</p>}
    </div>
  );
}
