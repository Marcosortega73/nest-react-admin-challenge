import React, { forwardRef } from 'react';

// Tipos para las variantes del IconButton
type IconButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'
  | 'ghost'
  | 'outline'
  | 'minimal';

// Tipos para los tamaños
type IconButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Tipos para las formas
type IconButtonShape = 'square' | 'rounded' | 'circle';

// Props del componente
interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Icono a mostrar (React element) */
  icon: React.ReactNode;
  /** Variante visual del botón */
  variant?: IconButtonVariant;
  /** Tamaño del botón */
  size?: IconButtonSize;
  /** Forma del botón */
  shape?: IconButtonShape;
  /** Si está en estado de carga */
  loading?: boolean;
  /** Tooltip text */
  tooltip?: string;
  /** Si debe mostrar un indicador de notificación */
  badge?: boolean | number;
  /** Color del badge */
  badgeColor?: 'primary' | 'danger' | 'success' | 'warning';
  /** Clases CSS adicionales */
  className?: string;
  /** Ref forwarding */
  ref?: React.Ref<HTMLButtonElement>;
}

// Utility function para combinar clases
const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

// Mapeo de variantes a clases CSS
const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  primary: `
    bg-[var(--brand-primary)] text-[var(--brand-text-primary)]
    hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)]
    disabled:bg-gray-300 disabled:text-gray-500
    shadow-sm hover:shadow-md transition-all duration-200
  `,
  secondary: `
    bg-gray-100 text-gray-700 border border-gray-200
    hover:bg-gray-200 hover:border-gray-300 active:bg-gray-300
    disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-100
    transition-all duration-200
  `,
  danger: `
    bg-red-500 text-white
    hover:bg-red-600 active:bg-red-700
    disabled:bg-red-300 disabled:text-red-100
    shadow-sm hover:shadow-md transition-all duration-200
  `,
  success: `
    bg-green-500 text-white
    hover:bg-green-600 active:bg-green-700
    disabled:bg-green-300 disabled:text-green-100
    shadow-sm hover:shadow-md transition-all duration-200
  `,
  warning: `
    bg-yellow-500 text-white
    hover:bg-yellow-600 active:bg-yellow-700
    disabled:bg-yellow-300 disabled:text-yellow-100
    shadow-sm hover:shadow-md transition-all duration-200
  `,
  info: `
    bg-blue-500 text-white
    hover:bg-blue-600 active:bg-blue-700
    disabled:bg-blue-300 disabled:text-blue-100
    shadow-sm hover:shadow-md transition-all duration-200
  `,
  ghost: `
    bg-transparent text-gray-600 border border-transparent
    hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200
    disabled:text-gray-400 disabled:hover:bg-transparent
    transition-all duration-200
  `,
  outline: `
    bg-transparent text-[var(--brand-primary)] border border-[var(--brand-border-primary)]
    hover:bg-[var(--brand-primary)] hover:text-[var(--brand-text-primary)]
    active:bg-[var(--brand-primary-active)]
    disabled:text-gray-400 disabled:border-gray-200 disabled:hover:bg-transparent
    transition-all duration-200
  `,
  minimal: `
    bg-transparent text-gray-500 border-none
    hover:text-gray-700 hover:bg-gray-50 active:bg-gray-100
    disabled:text-gray-300 disabled:hover:bg-transparent
    transition-all duration-200
  `,
};

// Mapeo de tamaños a clases CSS
const SIZE_CLASSES: Record<IconButtonSize, { button: string; icon: string }> = {
  xs: {
    button: 'w-6 h-6 p-1',
    icon: 'w-3 h-3',
  },
  sm: {
    button: 'w-8 h-8 p-1.5',
    icon: 'w-4 h-4',
  },
  md: {
    button: 'w-10 h-10 p-2',
    icon: 'w-5 h-5',
  },
  lg: {
    button: 'w-12 h-12 p-2.5',
    icon: 'w-6 h-6',
  },
  xl: {
    button: 'w-14 h-14 p-3',
    icon: 'w-7 h-7',
  },
};

// Mapeo de formas a clases CSS
const SHAPE_CLASSES: Record<IconButtonShape, string> = {
  square: 'rounded-none',
  rounded: 'rounded-md',
  circle: 'rounded-full',
};

// Mapeo de colores de badge
const BADGE_COLORS: Record<NonNullable<IconButtonProps['badgeColor']>, string> = {
  primary: 'bg-[var(--brand-primary)] text-[var(--brand-text-primary)]',
  danger: 'bg-red-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
};

// Componente de loading spinner
const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={cn('animate-spin', className)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Componente principal
const IconButtonComponent = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      variant = 'primary',
      size = 'md',
      shape = 'rounded',
      loading = false,
      tooltip,
      badge,
      badgeColor = 'primary',
      className,
      disabled,
      onClick,
      ...props
    },
    ref,
  ) => {
    const sizeConfig = SIZE_CLASSES[size];

    const buttonClasses = cn(
      // Clases base
      'relative inline-flex items-center justify-center',
      'font-medium focus:outline-none focus:ring-2 focus:ring-offset-2',
      'focus:ring-[var(--brand-primary)] disabled:cursor-not-allowed',
      'transform active:scale-95 transition-transform duration-75',

      // Clases de variante
      VARIANT_CLASSES[variant].replace(/\s+/g, ' ').trim(),

      // Clases de tamaño
      sizeConfig.button,

      // Clases de forma
      SHAPE_CLASSES[shape],

      // Clases adicionales
      className,
    );

    const iconElement = loading ? (
      <LoadingSpinner className={sizeConfig.icon} />
    ) : (
      <span className={cn('inline-flex items-center justify-center', sizeConfig.icon)}>{icon}</span>
    );

    const badgeElement = badge && (
      <span
        className={cn(
          'absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1',
          'text-xs font-bold rounded-full flex items-center justify-center',
          'ring-2 ring-white',
          BADGE_COLORS[badgeColor],
        )}
      >
        {typeof badge === 'number' ? (badge > 99 ? '99+' : badge) : ''}
      </span>
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        onClick={onClick}
        title={tooltip}
        aria-label={tooltip}
        {...props}
      >
        {iconElement}
        {badgeElement}
      </button>
    );
  },
);

IconButtonComponent.displayName = 'IconButtonComponent';

export default IconButtonComponent;
export type { IconButtonProps, IconButtonShape, IconButtonSize, IconButtonVariant };
