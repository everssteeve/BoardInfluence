import { BadgeProps } from '@/types/ui/components';
import clsx from 'clsx';

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-white/10 text-text-light border-border',
    primary: 'bg-primary/20 text-primary border-primary',
    secondary: 'bg-secondary/20 text-secondary border-secondary',
    success: 'bg-success/20 text-success border-success',
    warning: 'bg-accent/20 text-accent border-accent',
    danger: 'bg-danger/20 text-danger border-danger',
    info: 'bg-secondary/20 text-secondary border-secondary',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-semibold font-mono rounded-full border',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}
