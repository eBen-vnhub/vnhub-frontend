import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  isFocused?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, isFocused, className = '', ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className={`absolute inset-y-0 start-0 ps-3 sm:ps-4 flex items-center pointer-events-none transition-all duration-300 ${isFocused ? 'text-brand' : 'text-hint'}`}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full ${icon ? 'ps-10 sm:ps-12' : 'ps-3 sm:ps-4'} pe-3 sm:pe-4 py-3 sm:py-3.5 bg-gray-50 border ${error ? 'border-error/50 focus:border-error' : 'border-border-subtle focus:border-brand'} rounded-xl text-main placeholder-hint focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all duration-300 text-sm sm:text-base ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-xs sm:text-sm text-error flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-error rounded-full" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
