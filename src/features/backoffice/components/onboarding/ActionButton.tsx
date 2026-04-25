import React from 'react';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled: boolean;
  variant?: 'primary' | 'success' | 'danger';
}

export default function ActionButton({ icon, label, onClick, disabled, variant = 'primary' }: ActionButtonProps) {
  const variants = {
    primary: 'bg-brand hover:bg-brand-hover text-white shadow-lg shadow-brand/25',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25',
    danger: 'bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {icon}
      {label}
    </button>
  );
}
