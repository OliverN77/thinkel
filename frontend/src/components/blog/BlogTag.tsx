import React from 'react';
import { Tag, X } from 'lucide-react';

interface BlogTagProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  onRemove?: () => void;
  showIcon?: boolean;
  removable?: boolean;
  active?: boolean;
}

export const BlogTag: React.FC<BlogTagProps> = ({
  label,
  variant = 'default',
  size = 'md',
  onClick,
  onRemove,
  showIcon = true,
  removable = false,
  active = false,
}) => {
  const baseClasses = 'inline-flex items-center gap-1 font-medium rounded-full transition-all duration-200';
  
  const variantClasses = {
    default: active 
      ? 'bg-blue-600 text-white' 
      : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    primary: active
      ? 'bg-blue-700 text-white'
      : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    success: active
      ? 'bg-green-700 text-white'
      : 'bg-green-100 text-green-700 hover:bg-green-200',
    warning: active
      ? 'bg-yellow-700 text-white'
      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
    danger: active
      ? 'bg-red-700 text-white'
      : 'bg-red-100 text-red-700 hover:bg-red-200',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <span
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={handleClick}
    >
      {showIcon && <Tag size={iconSizes[size]} />}
      <span>{label}</span>
      {removable && onRemove && (
        <button
          onClick={handleRemove}
          className="hover:opacity-70 transition-opacity"
          aria-label={`Eliminar ${label}`}
        >
          <X size={iconSizes[size]} />
        </button>
      )}
    </span>
  );
};