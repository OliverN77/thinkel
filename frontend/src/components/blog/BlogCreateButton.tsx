import React from 'react';
import { Link } from 'react-router-dom';
import { PenSquare, Plus } from 'lucide-react';

interface BlogCreateButtonProps {
  variant?: 'floating' | 'inline' | 'header';
  label?: string;
  to?: string;
}

export const BlogCreateButton: React.FC<BlogCreateButtonProps> = ({
  variant = 'floating',
  label = 'Crear artículo',
  to = '/blog/create',
}) => {
  if (variant === 'floating') {
    return (
      <Link
        to={to}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-50 group"
        title={label}
      >
        <div className="flex items-center gap-2">
          <PenSquare size={24} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-medium">
            {label}
          </span>
        </div>
      </Link>
    );
  }

  if (variant === 'header') {
    return (
      <Link
        to={to}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-semibold"
      >
        <Plus size={20} />
        {label}
      </Link>
    );
  }

  // variant === 'inline'
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
    >
      <PenSquare size={18} />
      {label}
    </Link>
  );
};