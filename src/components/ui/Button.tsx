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
  primary: 'bg-[#1c5b48] text-white border border-transparent hover:bg-[#15463a]',
  secondary: 'bg-[#141312] text-white border border-transparent hover:bg-[#2A302C]',
  outline: 'bg-[#efebe1] text-[#141312] border border-[#ded8ca] hover:bg-[#e5dfd2] hover:border-[#c2baa8]',
  ghost: 'bg-transparent text-[#4c4842] border border-transparent hover:bg-[#e5dfd2]/75',
  danger: 'bg-[#a5331f] text-white border border-transparent hover:bg-[#991B1B]',
  success: 'bg-[#1c5b48] text-white border border-transparent hover:bg-[#15463a]',
};

const sizeMap: Record<ButtonSize, string> = {
  sm: 'h-8 px-3.5 text-[12.5px] rounded-full gap-1.5',
  md: 'h-9 px-4 text-[13.5px] rounded-full gap-2',
  lg: 'h-11 px-5 text-[14.5px] rounded-full gap-2',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => (
  <button
    disabled={disabled || loading}
    className={`inline-flex items-center justify-center font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ${
      variantMap[variant]
    } ${sizeMap[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    {...props}
  >
    {loading ? <Loader2 className="h-4 w-4 animate-spin shrink-0" /> : leftIcon}
    {children}
    {!loading && rightIcon}
  </button>
);
