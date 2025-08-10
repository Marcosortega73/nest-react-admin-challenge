// src/ui/ButtonComponent.tsx
import React from 'react';

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

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-[var(--brand-primary-hover)] active:bg-[var(--brand-primary-active)] disabled:bg-primary-60 disabled:cursor-not-allowed',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-[var(--brand-secondary-hover)] active:bg-[var(--brand-secondary-active)] disabled:bg-secondary-60 disabled:cursor-not-allowed',
  danger:
    'bg-danger text-danger-foreground hover:bg-[var(--brand-danger-hover)] active:bg-[var(--brand-danger-active)] disabled:bg-danger-60 disabled:cursor-not-allowed',
  success:
    'bg-success text-success-foreground hover:bg-[var(--brand-success-hover)] active:bg-[var(--brand-success-active)] disabled:bg-success-60 disabled:cursor-not-allowed',
  warning:
    'bg-warning text-warning-foreground hover:bg-[var(--brand-warning-hover)] active:bg-[var(--brand-warning-active)] disabled:bg-warning-60 disabled:cursor-not-allowed',
  info: 'bg-info text-info-foreground hover:bg-[var(--brand-info-hover)] active:bg-[var(--brand-info-active)] disabled:bg-info-60 disabled:cursor-not-allowed',
  light:
    'bg-light text-light-foreground hover:bg-[var(--brand-light-hover)] active:bg-[var(--brand-light-active)] disabled:bg-light-60 disabled:cursor-not-allowed',
  dark: 'bg-dark text-dark-foreground hover:bg-[var(--brand-dark-hover)] active:bg-[var(--brand-dark-active)] disabled:bg-dark-60 disabled:cursor-not-allowed',
  default:
    'bg-default text-default-foreground hover:bg-[var(--brand-default-hover)] active:bg-[var(--brand-default-active)] disabled:bg-default-60 disabled:cursor-not-allowed',
};

const SIZE_CLASS: Record<NonNullable<ButtonComponentProps['size']>, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-3 text-base',
};

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  title,
  icon,
  positionIcon = 'left',
  onClick,
  disabled = false,
  className = '',
  variant = 'primary',
  type = 'button',
  size = 'md',
}) => {
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
        'btn_custom', // base con estados (hover/active/disabled) que ya definiste en CSS
        VARIANT_CLASS[variant], // mapea a .btn_custom_primary, etc.
        SIZE_CLASS[size], // paddings/tamaño
        className,
        'cursor-pointer flex items-center rounded-md duration-100',
      )}
    >
      {iconLeft}
      <span className="font-semibold">{title}</span>
      {iconRight}
    </button>
  );
};

export default ButtonComponent;
