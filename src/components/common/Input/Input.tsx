import { InputProps } from '@/types/ui/components';
import clsx from 'clsx';
import { forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    placeholder,
    value,
    onChange,
    type = 'text',
    error,
    required = false,
    disabled = false,
    className,
    icon,
    autoFocus = false,
    ...rest
  },
  ref
) {
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block mb-2 text-sm font-semibold text-text-medium uppercase tracking-wide">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-medium">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          className={clsx('input', {
            'border-danger focus:border-danger': error,
            'pl-10': icon,
          })}
          {...rest}
        />
      </div>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
});
