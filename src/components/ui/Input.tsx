import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftAddon, rightAddon, id, className = '', ...props }, ref) => {
    const generated = React.useId();
    const inputId = id ?? generated;

    const borderStyle = error
      ? 'border-[#a5331f] focus-within:border-[#a5331f] focus-within:ring-2 focus-within:ring-[#a5331f]/20'
      : 'border-[#ded8ca] hover:border-[#c2baa8] focus-within:border-[#1c5b48] focus-within:ring-2 focus-within:ring-[#1c5b48]/20';

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-[13px] font-medium text-[#141312] mb-1.5">
            {label}
          </label>
        )}
        <div
          className={`flex items-center h-10 rounded-[10px] border bg-[#efebe1] transition-colors ${borderStyle} ${
            props.disabled ? 'bg-[#e5dfd2] cursor-not-allowed' : ''
          }`}
        >
          {leftAddon && (
            <span className="pl-3.5 text-[#6e6a62] flex items-center shrink-0">{leftAddon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full h-full bg-transparent px-3.5 text-[14px] text-[#141312] placeholder:text-[#6e6a62]/65 outline-none disabled:cursor-not-allowed ${className}`}
            {...props}
          />
          {rightAddon && (
            <span className="pr-2.5 text-[#6e6a62] flex items-center shrink-0">{rightAddon}</span>
          )}
        </div>
        {error && <p className="mt-1 text-[12px] text-[#a5331f]">{error}</p>}
        {!error && helperText && <p className="mt-1 text-[12px] text-[#6e6a62]">{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
