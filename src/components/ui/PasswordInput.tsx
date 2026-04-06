import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import Input from './Input';

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
}

export default function PasswordInput({
  label,
  value,
  onChange,
  placeholder = '••••••••',
  autoComplete = 'current-password',
  required = false,
  error,
  disabled = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      <div className="relative">
        <Input
          label={label}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          error={error}
          disabled={disabled}
          isFocused={isFocused}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          icon={<Lock className="h-4 w-4 sm:h-5 sm:w-5" />}
          className="pe-10 sm:pe-12"
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowPassword(!showPassword)}
          className="absolute bottom-3 sm:bottom-3.5 end-0 pe-3 sm:pe-4 flex items-center text-hint hover:text-brand transition-colors"
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
