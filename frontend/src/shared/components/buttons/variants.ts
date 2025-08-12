import { ButtonSize, ButtonVariant, IconButtonShape } from './buttons-types';

export const VARIANT_CLASSES: Record<ButtonVariant, string> = {
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
    bg-transparent text-gray-500
    hover:text-gray-700 hover:bg-gray-50 active:bg-gray-100
    disabled:text-gray-300
    transition-all duration-200
  `,
};

export const SIZE_CLASSES: Record<ButtonSize, string> = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2.5 text-base',
  xl: 'px-4 py-2.5 text-base',
};

export const ICON_BUTTON_SIZE_CLASSES: Record<ButtonSize, { button: string; icon: string }> = {
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

export const BADGE_COLORS: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--brand-primary)] text-[var(--brand-text-primary)]',
  secondary: 'bg-[var(--brand-secondary)] text-[var(--brand-text-secondary)]',
  danger: 'bg-red-500 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  info: 'bg-blue-500 text-white',
  ghost: 'bg-transparent text-gray-600 border border-transparent',
  outline: 'bg-transparent text-[var(--brand-primary)] border border-[var(--brand-border-primary)]',
  minimal: 'bg-transparent text-gray-500',
};

export const SHAPE_CLASSES: Record<IconButtonShape, string> = {
  square: 'rounded-none',
  rounded: 'rounded-md',
  circle: 'rounded-full',
};

export const BASE_CLASSES =
  'inline-flex items-center gap-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2';
