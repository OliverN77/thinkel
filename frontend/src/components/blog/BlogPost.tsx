import React from 'react';
import { Calendar, Clock, User, Tag, ArrowLeft, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogPostProps {
  id: string;
  title: string;
  content: string;
  date: string;
  readTime?: number;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  thumbnail?: string;
  slug: string;
  isDark?: boolean;
}

export const BlogPost: React.FC<BlogPostProps> = ({
  title,
  content,
  date,
  readTime,
  tags,
  author,
  thumbnail,
  isDark = false,
}) => {
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href);
      alert('URL copiada al portapapeles');
    }
  };

  return (
    <article className="max-w-4xl mx-auto">
      {/* Botón de regreso */}
      <div className="mb-6">
        <Link
          to="/blog"
          className={`inline-flex items-center gap-2 transition-colors ${
            isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
          }`}
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Volver al blog</span>
        </Link>
      </div>

      {/* Cabecera del artículo */}
      <header className="mb-8">
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full ${
                  isDark ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                }`}
              >
                <Tag size={14} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Título */}
        <h1 className={`text-4xl md:text-5xl font-bold mb-6 leading-tight ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          {title}
        </h1>

        {/* Meta información */}
        <div className={`flex flex-wrap items-center gap-4 pb-6 border-b ${
          isDark ? 'text-gray-400 border-gray-700' : 'text-gray-600 border-gray-200'
        }`}>
          {/* Autor */}
          <div className="flex items-center gap-2">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isDark ? 'bg-gray-700' : 'bg-gray-300'
              }`}>
                <User size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
              </div>
            )}
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{author.name}</span>
          </div>

          {/* Fecha */}
          <div className="flex items-center gap-1">
            <Calendar size={16} />
            <time dateTime={date}>{formatDate(date)}</time>
          </div>

          {/* Tiempo de lectura */}
          {readTime && (
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{readTime} min de lectura</span>
            </div>
          )}

          {/* Botón compartir */}
          <button
            onClick={handleShare}
            className={`ml-auto flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <Share2 size={16} />
            <span className="hidden sm:inline">Compartir</span>
          </button>
        </div>
      </header>

      {/* Imagen destacada */}
      {thumbnail && (
        <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Contenido del artículo */}
      <div className={`prose prose-lg max-w-none mb-12 break-words overflow-wrap-anywhere ${
        isDark ? 'prose-invert' : 'prose-blue'
      }`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ children }) => (
              <h2 className={`text-3xl font-bold mt-8 mb-4 break-words ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className={`text-2xl font-bold mt-6 mb-3 break-words ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className={`leading-relaxed mb-4 break-words overflow-wrap-anywhere ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>{children}</p>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className={`underline ${
                  isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                }`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            code: ({ children }) => (
              <code className={`px-2 py-1 rounded text-sm font-mono ${
                isDark ? 'bg-gray-800 text-red-400' : 'bg-gray-100 text-red-600'
              }`}>
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre className={`p-4 rounded-lg overflow-x-auto my-6 break-words whitespace-pre-wrap ${
                isDark ? 'bg-gray-950 text-gray-100' : 'bg-gray-900 text-gray-100'
              }`}>
                {children}
              </pre>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside space-y-2 mb-4 break-words">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-2 mb-4 break-words">
                {children}
              </ol>
            ),
            blockquote: ({ children }) => (
              <blockquote className={`border-l-4 border-blue-500 pl-4 italic my-6 break-words ${
                isDark ? 'text-gray-400' : 'text-gray-700'
              }`}>
                {children}
              </blockquote>
            ),
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="rounded-lg shadow-md my-6 w-full"
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Información del autor */}
      {author.bio && (
        <div className={`rounded-xl p-6 border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}>
          <h3 className={`text-lg font-bold mb-3 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Sobre el autor
          </h3>
          <div className="flex items-start gap-4">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-16 h-16 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDark ? 'bg-gray-700' : 'bg-gray-300'
              }`}>
                <User size={24} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
              </div>
            )}
            <div>
              <h4 className={`font-bold mb-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>{author.name}</h4>
              <p className={`text-sm leading-relaxed ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {author.bio}
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};