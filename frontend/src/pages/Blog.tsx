import React, { useState, useEffect } from 'react';
import { BlogFeed } from '../components/blog/BlogFeed';
import { TrendingSidebar } from '../components/blog/TrendingSidebar';
import { BlogCreateButton } from '../components/blog/BlogCreateButton';
import { Layout } from '../components/blog/Layout';
import { isAuthenticated } from '../services/auth.service';
import { Navbar } from '../components/shared/Navbar';
import { Sparkles, Home } from 'lucide-react';
import { getPosts, toggleLike, toggleBookmark } from '../services/post.service';
import type { Post } from '../services/post.service';

// Datos de ejemplo para fallback
const mockPosts = [
  {
    id: '1',
    title: 'Introducción a React y TypeScript',
    content: 'Aprende los fundamentos de React con TypeScript para crear aplicaciones web modernas y type-safe.',
    date: '2025-12-11T10:30:00',
    tags: ['React', 'TypeScript', 'Tutorial'],
    author: {
      name: 'Oliver García',
      username: 'oliverdev',
      avatar: '/avatars/oliver.jpg',
    },
    thumbnail: '/blog/react-typescript.jpg',
    slug: 'introduccion-react-typescript',
    likes: 45,
    comments: 12,
    bookmarked: false,
    liked: false,
  },
  {
    id: '2',
    title: 'Mejores prácticas en desarrollo web',
    content: 'Descubre las técnicas y patrones más efectivos para construir aplicaciones web escalables y mantenibles.',
    date: '2025-12-11T08:15:00',
    tags: ['Web Development', 'Best Practices'],
    author: {
      name: 'Ana Martínez',
      username: 'anamartinez',
      avatar: '/avatars/ana.jpg',
    },
    thumbnail: '/blog/best-practices.jpg',
    slug: 'mejores-practicas-desarrollo-web',
    likes: 67,
    comments: 23,
    bookmarked: true,
    liked: false,
  },
  {
    id: '3',
    title: 'Guía completa de Tailwind CSS',
    content: 'Todo lo que necesitas saber sobre Tailwind CSS para diseñar interfaces modernas y responsivas.',
    date: '2025-12-10T16:45:00',
    tags: ['CSS', 'Tailwind', 'Design'],
    author: {
      name: 'Carlos López',
      username: 'carloslopez',
      avatar: '/avatars/carlos.jpg',
    },
    thumbnail: '/blog/tailwind.jpg',
    slug: 'guia-completa-tailwind-css',
    likes: 89,
    comments: 31,
    bookmarked: false,
    liked: true,
  },
  {
    id: '4',
    title: 'Node.js y Express: API REST desde cero',
    content: 'Construye tu primera API REST profesional usando Node.js y Express con autenticación JWT.',
    date: '2025-12-10T11:20:00',
    tags: ['Node.js', 'Express', 'API', 'Backend'],
    author: {
      name: 'María Rodríguez',
      username: 'mariarodriguez',
      avatar: '/avatars/maria.jpg',
    },
    slug: 'nodejs-express-api-rest',
    likes: 52,
    comments: 18,
    bookmarked: false,
    liked: false,
  },
  {
    id: '5',
    title: 'Testing en React: Jest y React Testing Library',
    content: 'Aprende a escribir tests efectivos para tus componentes de React y asegurar la calidad del código.',
    date: '2025-12-09T14:30:00',
    tags: ['React', 'Testing', 'Jest'],
    author: {
      name: 'Oliver García',
      username: 'oliverdev',
      avatar: '/avatars/oliver.jpg',
    },
    thumbnail: '/blog/testing-react.jpg',
    slug: 'testing-react-jest',
    likes: 34,
    comments: 9,
    bookmarked: true,
    liked: true,
  },
  {
    id: '6',
    title: 'Git y GitHub para principiantes',
    content: 'Domina el control de versiones con Git y aprende a colaborar en proyectos usando GitHub.',
    date: '2025-12-09T09:00:00',
    tags: ['Git', 'GitHub', 'Version Control'],
    author: {
      name: 'Ana Martínez',
      username: 'anamartinez',
      avatar: '/avatars/ana.jpg',
    },
    thumbnail: '/blog/git-github.jpg',
    slug: 'git-github-principiantes',
    likes: 78,
    comments: 15,
    bookmarked: false,
    liked: false,
  },
];

// Transformar Post de la API al formato del feed
const transformPost = (post: Post, userId?: string) => ({
  id: post._id,
  title: post.title,
  content: post.description, // Usar description como preview
  date: post.createdAt,
  tags: post.tags,
  author: {
    name: post.author.name,
    username: post.author.username,
    avatar: post.author.avatar 
      ? (post.author.avatar.startsWith('http') 
          ? post.author.avatar 
          : `http://localhost:5000${post.author.avatar}`)
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=random`,
  },
  thumbnail: post.thumbnail,
  slug: post.slug,
  likes: post.likes,
  comments: post.comments,
  bookmarked: userId ? post.bookmarkedBy.includes(userId) : false,
  liked: userId ? post.likedBy.includes(userId) : false,
});

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const authenticated = isAuthenticated();

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

  // Cargar posts desde la API
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPosts({ sort: '-createdAt', limit: 50 });
        
        // Obtener userId si está autenticado
        const userId = authenticated ? localStorage.getItem('userId') || undefined : undefined;
        
        // Transformar posts al formato del feed
        const transformedPosts = response.data.map(post => transformPost(post, userId));
        setPosts(transformedPosts);
      } catch (err) {
        console.error('Error al cargar posts:', err);
        setError('Error al cargar los artículos');
        // Usar mockPosts como fallback
        setPosts(mockPosts);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [authenticated]);

  const handleLike = async (postId: string) => {
    if (!authenticated) {
      alert('Debes iniciar sesión para dar like');
      return;
    }

    try {
      // Actualizar optimistamente en la UI
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
            : post
        )
      );

      // Llamar a la API
      await toggleLike(postId);
    } catch (err) {
      console.error('Error al dar like:', err);
      // Revertir cambio en caso de error
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, liked: !post.liked, likes: post.liked ? post.likes + 1 : post.likes - 1 }
            : post
        )
      );
    }
  };

  const handleBookmark = async (postId: string) => {
    if (!authenticated) {
      alert('Debes iniciar sesión para guardar posts');
      return;
    }

    try {
      // Actualizar optimistamente en la UI
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post
        )
      );

      // Llamar a la API
      await toggleBookmark(postId);
    } catch (err) {
      console.error('Error al guardar:', err);
      // Revertir cambio en caso de error
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post
        )
      );
    }
  };

  return (
    <Layout showSidebar={authenticated}>
      <div className={`flex min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {/* Mostrar Navbar solo si NO está autenticado */}
        {!authenticated && <Navbar />}
        
        {/* Contenedor principal tipo Twitter */}
        <div className="flex-1 flex justify-center">
          <div className="flex w-full max-w-7xl">
            {/* Columna central - Feed */}
            <main className={`flex-1 min-w-0 border-x ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              {/* Header del feed */}
              <div className={`sticky top-0 z-10 backdrop-blur-md ${
                isDark ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
              } border-b`}>
                <div className="px-4 py-3">
                  <div className="flex items-center gap-6">
                    <button className={`flex items-center gap-2 font-bold pb-3 border-b-4 border-blue-600 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      <Home size={20} />
                      Para ti
                    </button>
                    <button className={`flex items-center gap-2 font-bold pb-3 border-b-4 border-transparent ${
                      isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-900'
                    }`}>
                      <Sparkles size={20} />
                      Siguiendo
                    </button>
                  </div>
                </div>
              </div>

              {/* Feed de posts */}
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      Cargando artículos...
                    </p>
                  </div>
                </div>
              ) : error ? (
                <div className={`border-b p-6 text-center ${
                  isDark 
                    ? 'bg-red-900/20 border-red-800' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <p className={`font-medium ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                    {error}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Reintentar
                  </button>
                </div>
              ) : (
                <BlogFeed posts={posts} onLike={handleLike} onBookmark={handleBookmark} />
              )}
            </main>

            {/* Columna derecha - Trending */}
            <aside className="hidden xl:block w-80 px-4 py-4">
              <TrendingSidebar />
            </aside>
          </div>
        </div>

        {/* Botón flotante solo si está autenticado */}
        {authenticated && <BlogCreateButton variant="floating" />}
      </div>
    </Layout>
  );
};
