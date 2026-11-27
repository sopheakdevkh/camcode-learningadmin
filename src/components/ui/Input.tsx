import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, id, className = '', ...props }, ref) => {
    const generated = React.useId();
    const inputId = id ?? generated;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-[13px] font-medium text-[#141312] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full h-10 px-3.5 rounded-xl border bg-[#efebe1] text-[14px] text-[#141312] placeholder:text-[#6e6a62] outline-none transition-colors ${
            error
              ? 'border-[#a5331f] focus:border-[#a5331f] focus:ring-2 focus:ring-[#a5331f]/20'
              : 'border-[#ded8ca] hover:border-[#c2baa8] focus:border-[#1c5b48] focus:ring-2 focus:ring-[#1c5b48]/20'
          } disabled:bg-[#e5dfd2] disabled:cursor-not-allowed ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-[12px] text-[#a5331f]">{error}</p>}
        {!error && helperText && <p className="mt-1 text-[12px] text-[#6e6a62]">{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
