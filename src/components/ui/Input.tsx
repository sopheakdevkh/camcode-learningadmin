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
          <label htmlFor={inputId} className="block text-[13px] font-medium text-[#1F2937] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full h-[42px] px-3 rounded-[8px] border bg-white text-[14px] text-[#1F2937] placeholder:text-[#9CA3AF] outline-none transition-colors ${
            error
              ? 'border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20'
              : 'border-[#E5E7EB] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-[12px] text-[#DC2626]">{error}</p>}
        {!error && helperText && <p className="mt-1 text-[12px] text-[#6B7280]">{helperText}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';

