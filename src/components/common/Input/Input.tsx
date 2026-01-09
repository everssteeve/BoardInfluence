import { InputProps } from '@/types/ui/components';
import clsx from 'clsx';

export function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  error,
  required = false,
  disabled = false,
  className,
}: InputProps) {
  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block mb-2 text-sm font-semibold text-text-medium uppercase tracking-wide">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={clsx('input', {
          'border-danger focus:border-danger': error,
        })}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}
