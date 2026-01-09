import { CardProps } from '@/types/ui/components';
import clsx from 'clsx';

export function Card({
  children,
  onClick,
  isSelected = false,
  isHoverable = false,
  className,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'card relative transition-all duration-300',
        {
          'cursor-pointer': onClick || isHoverable,
          'hover:translate-x-1 hover:shadow-xl': isHoverable,
          'border-l-4 border-l-success bg-success/5': isSelected,
        },
        className
      )}
    >
      {children}
    </div>
  );
}
