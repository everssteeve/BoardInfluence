import clsx from 'clsx';
import { BaseComponentProps } from '@/types/ui/components';

interface AlertProps extends BaseComponentProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

export function Alert({
  children,
  variant = 'info',
  onClose,
  className,
}: AlertProps) {
  const variantClasses = {
    success: 'bg-success/15 border-success text-success',
    error: 'bg-danger/15 border-danger text-danger',
    warning: 'bg-accent/15 border-accent text-accent',
    info: 'bg-secondary/15 border-secondary text-secondary',
  };

  const icons = {
    success: '✓',
    error: '⚠',
    warning: '⚡',
    info: 'ℹ',
  };

  return (
    <div
      className={clsx(
        'flex items-center gap-3 p-4 rounded-lg border animate-slide-down',
        variantClasses[variant],
        className
      )}
    >
      <span className="text-xl">{icons[variant]}</span>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      )}
    </div>
  );
}
