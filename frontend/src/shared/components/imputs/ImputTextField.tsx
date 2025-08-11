import { cn } from '@shared/utils';
import { FieldErrors, UseFormClearErrors, UseFormRegister } from 'react-hook-form';

interface ImputTextFieldProps {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  clearErrors?: UseFormClearErrors<any>;
  type?: string;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  rules?: any;
}

export function ImputTextField({
  label,
  name,
  register,
  errors,
  clearErrors,
  type = 'text',
  placeholder = '',
  className = '',
  multiline = false,
  rows = 1,
  required = false,
  rules,
}: ImputTextFieldProps) {
  // Función helper para acceder a errores anidados
  const getNestedError = (errors: any, path: string) => {
    return path.split('.').reduce((obj, key) => obj?.[key], errors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Limpiar el error del campo específico cuando el usuario empiece a escribir
    const fieldError = getNestedError(errors, name);
    if (fieldError && clearErrors) {
      clearErrors(name);
    }
    // Llamar al onChange del register si existe
    const { onChange } = register(name, rules);
    if (onChange) {
      onChange(e);
    }
  };

  const registrationProps = register(name, rules);

  return (
    <div className="grid items-center gap-2">
      <label className="text-sm text-gray-400 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {label}
      </label>
      {multiline ? (
        <textarea
          placeholder={placeholder}
          required={required}
          {...registrationProps}
          onChange={handleInputChange}
          className={cn(
            'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:ring-offset-1 focus:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          rows={rows}
        />
      ) : (
        <input
          placeholder={placeholder}
          required={required}
          type={type}
          {...registrationProps}
          onChange={handleInputChange}
          className={cn(
            'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 focus-visible:ring-offset-1 focus:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
        />
      )}
      {getNestedError(errors, name) && (
        <p className="text-red-600 text-sm mt-1">{String(getNestedError(errors, name)?.message)}</p>
      )}
    </div>
  );
}
