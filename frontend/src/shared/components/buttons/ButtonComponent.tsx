// src/ui/ButtonComponent.tsx
import React from 'react';

import { VARIANT_CLASSES } from './variants';

type Variant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'light' | 'dark' | 'default';

type IconPosition = 'left' | 'right';

interface ButtonComponentProps {
  title: string;
  icon?: React.ReactNode;
  positionIcon?: IconPosition;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: Variant;
  type?: 'button' | 'submit' | 'reset';
  size?: 'sm' | 'md' | 'lg';
}

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

const SIZE_CLASS: Record<NonNullable<ButtonComponentProps['size']>, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
};

export function ButtonComponent({
  title,
  icon,
  positionIcon = 'left',
  onClick,
  disabled = false,
  className = '',
  variant = 'primary',
  type = 'button',
  size = 'md',
}: ButtonComponentProps) {
  const iconLeft = positionIcon === 'left' && icon ? <span className="mr-2 inline-flex">{icon}</span> : null;

  const iconRight = positionIcon === 'right' && icon ? <span className="ml-2 inline-flex">{icon}</span> : null;

  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={cn(
        'btn_custom',
        VARIANT_CLASSES[variant],
        SIZE_CLASS[size],
        className,
        'cursor-pointer flex items-center rounded-md duration-100',
      )}
    >
      {iconLeft}
      <span className="font-semibold">{title}</span>
      {iconRight}
    </button>
  );
}
