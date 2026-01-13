import { ReactNode } from 'react';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'date' | 'url';
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  autoFocus?: boolean;
  [key: string]: any;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'large';
}

export interface BadgeProps extends BaseComponentProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export interface CardProps extends BaseComponentProps {
  onClick?: () => void;
  isSelected?: boolean;
  isHoverable?: boolean;
}
