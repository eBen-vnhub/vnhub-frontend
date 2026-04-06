import type { ButtonHTMLAttributes, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-gradient-to-r from-brand-hover to-brand text-white hover:from-brand-active hover:to-brand-hover hover:shadow-xl hover:shadow-brand/30 active:scale-[0.98]',
  outline: 'border border-border-subtle text-main hover:bg-gray-50 active:bg-gray-100',
  ghost: 'text-muted hover:text-main hover:bg-gray-50',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-6 py-3.5 text-base sm:py-4',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={isLoading || disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {isLoading ? <LoadingSpinner size="sm" className="text-current" /> : children}
    </button>
  );
}
