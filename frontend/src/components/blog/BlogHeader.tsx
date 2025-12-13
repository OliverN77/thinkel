import React from 'react';
import { BookOpen, Sparkles } from 'lucide-react';

interface BlogHeaderProps {
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  totalPosts?: number;
}

export const BlogHeader: React.FC<BlogHeaderProps> = ({
  title = 'Blog de Thinkel',
  subtitle = 'Descubre artículos, tutoriales y recursos sobre desarrollo web, programación y tecnología.',
  showStats = true,
  totalPosts = 0,
}) => {
  return (
    <header className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4 rounded-2xl shadow-xl overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* Contenido */}
      <div className="relative max-w-4xl mx-auto text-center space-y-6">
        {/* Icono decorativo */}
        <div className="flex justify-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 inline-block">
            <BookOpen size={48} className="text-white" />
          </div>
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          {title}
        </h1>

        {/* Subtítulo */}
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
          {subtitle}
        </p>

        {/* Estadísticas */}
        {showStats && totalPosts > 0 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Sparkles size={20} className="text-yellow-300" />
            <span className="text-sm md:text-base font-medium">
              {totalPosts} {totalPosts === 1 ? 'artículo publicado' : 'artículos publicados'}
            </span>
          </div>
        )}

        {/* Línea decorativa */}
        <div className="flex justify-center pt-6">
          <div className="w-24 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </header>
  );
};