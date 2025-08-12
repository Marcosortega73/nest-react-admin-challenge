import React, { forwardRef } from 'react';

import { ButtonSize, ButtonVariant } from './buttons-types';
import { BADGE_COLORS, ICON_BUTTON_SIZE_CLASSES, SHAPE_CLASSES, VARIANT_CLASSES } from './variants';

type IconButtonShape = 'square' | 'rounded' | 'circle';

interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  shape?: IconButtonShape;
  loading?: boolean;
  tooltip?: string;
  badge?: boolean | number;
  badgeColor?: 'primary' | 'danger' | 'success' | 'warning';
  className?: string;
  ref?: React.Ref<HTMLButtonElement>;
}

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

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

export const IconButtonComponent = forwardRef<HTMLButtonElement, IconButtonProps>(
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
    const sizeConfig = ICON_BUTTON_SIZE_CLASSES[size];

    const buttonClasses = cn(
      'relative inline-flex items-center justify-center',
      'font-medium focus:outline-none focus:ring-2 focus:ring-offset-2',
      'focus:ring-[var(--brand-primary)] disabled:cursor-not-allowed',
      'transform active:scale-95 transition-transform duration-75',
      VARIANT_CLASSES[variant].replace(/\s+/g, ' ').trim(),

      sizeConfig.button,
      SHAPE_CLASSES[shape],

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
