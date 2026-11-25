import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantMap: Record<ButtonVariant, string> = {
  primary: 'bg-[#2563EB] text-white border border-transparent hover:bg-[#1D4ED8]',
  secondary: 'bg-[#111827] text-white border border-transparent hover:bg-[#1F2937]',
  outline: 'bg-white text-[#1F2937] border border-[#E5E7EB] hover:bg-[#F9FAFB]',
  ghost: 'bg-transparent text-[#374151] border border-transparent hover:bg-[#F3F4F6]',
  danger: 'bg-[#DC2626] text-white border border-transparent hover:bg-[#B91C1C]',
  success: 'bg-[#16A34A] text-white border border-transparent hover:bg-[#15803D]',
};

const sizeMap: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-[13px]',
  md: 'h-10 px-4.5 text-[14px]',
  lg: 'h-12 px-6 text-[15px]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  leftIcon,
  rightIcon,
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-1.5 rounded-[8px] font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantMap[variant]} ${sizeMap[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
      <span>{children}</span>
      {!loading && rightIcon}
    </button>
  );
};

