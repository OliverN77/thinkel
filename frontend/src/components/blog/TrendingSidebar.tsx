import React, { useState, useEffect } from 'react';
import { TrendingUp, Hash, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrendingTopic {
  id: string;
  tag: string;
  postsCount: number;
  trend: 'up' | 'down' | 'stable';
}

interface RecentPost {
  id: string;
  title: string;
  author: string;
  date: string;
  slug: string;
}

export const TrendingSidebar: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  // Detectar tema
  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Datos de ejemplo - reemplazar con API
  const trendingTopics: TrendingTopic[] = [
    { id: '1', tag: 'React', postsCount: 24, trend: 'up' },
    { id: '2', tag: 'TypeScript', postsCount: 18, trend: 'up' },
    { id: '3', tag: 'Node.js', postsCount: 15, trend: 'stable' },
    { id: '4', tag: 'Tailwind', postsCount: 12, trend: 'up' },
    { id: '5', tag: 'API', postsCount: 9, trend: 'down' },
  ];

  const recentPosts: RecentPost[] = [
    {
      id: '1',
      title: 'Novedades de React 19',
      author: 'María García',
      date: '2h',
      slug: 'react-19-novedades',
    },
    {
      id: '2',
      title: 'Optimización de rendimiento',
      author: 'Carlos López',
      date: '4h',
      slug: 'optimizacion-rendimiento',
    },
    {
      id: '3',
      title: 'Diseño responsive avanzado',
      author: 'Ana Martínez',
      date: '6h',
      slug: 'diseno-responsive',
    },
  ];

  return (
    <div className="space-y-4 sticky top-4">
      {/* Trending Topics */}
      <div className={`rounded-xl p-4 ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          <TrendingUp size={20} className="text-blue-600" />
          Temas Trending
        </h2>

        <div className="space-y-3">
          {trendingTopics.map((topic) => (
            <Link
              key={topic.id}
              to={`/blog?tag=${topic.tag}`}
              className={`block p-3 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
                  <span className={`font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {topic.tag}
                  </span>
                </div>
                <span className={`text-xs ${
                  topic.trend === 'up' 
                    ? 'text-green-600' 
                    : topic.trend === 'down' 
                    ? 'text-red-600' 
                    : isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {topic.trend === 'up' ? '↑' : topic.trend === 'down' ? '↓' : '—'}
                </span>
              </div>
              <p className={`text-sm mt-1 ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {topic.postsCount} publicaciones
              </p>
            </Link>
          ))}
        </div>

        <Link
          to="/blog/trending"
          className={`mt-3 block text-center text-sm font-medium py-2 rounded-lg transition-colors ${
            isDark 
              ? 'text-blue-400 hover:bg-gray-700' 
              : 'text-blue-600 hover:bg-gray-50'
          }`}
        >
          Ver todos los trending
        </Link>
      </div>

      {/* Publicaciones Recientes */}
      <div className={`rounded-xl p-4 ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      }`}>
        <h2 className={`text-lg font-bold mb-4 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Publicaciones Recientes
        </h2>

        <div className="space-y-4">
          {recentPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className={`block p-3 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <h3 className={`font-semibold text-sm line-clamp-2 mb-1 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {post.title}
              </h3>
              <p className={`text-xs ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {post.author} • {post.date}
              </p>
            </Link>
          ))}
        </div>

        <Link
          to="/blog/recent"
          className={`mt-3 flex items-center justify-center gap-1 text-sm font-medium py-2 rounded-lg transition-colors ${
            isDark 
              ? 'text-blue-400 hover:bg-gray-700' 
              : 'text-blue-600 hover:bg-gray-50'
          }`}>
          Ver más
          <ChevronRight size={16} />
        </Link>
      </div>

      {/* Footer */}
      <div className={`rounded-xl p-4 text-xs ${
        isDark ? 'bg-gray-800 border border-gray-700 text-gray-400' : 'bg-white border border-gray-200 text-gray-600'
      }`}>
        <div className="flex flex-wrap gap-2 justify-center">
          <a href="/about" className="hover:underline">Sobre nosotros</a>
          <span>•</span>
          <a href="/terms" className="hover:underline">Términos</a>
          <span>•</span>
          <a href="/privacy" className="hover:underline">Privacidad</a>
        </div>
        <p className="text-center mt-2">© 2025 Thinkel</p>
      </div>
    </div>
  );
};
