import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Bookmark, Share2, User, MoreHorizontal } from 'lucide-react';
import { BlogTag } from './BlogTag';

interface FeedPost {
  id: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  thumbnail?: string;
  slug: string;
  likes: number;
  comments: number;
  bookmarked: boolean;
  liked: boolean;
}

interface BlogFeedProps {
  posts: FeedPost[];
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
}

export const BlogFeed: React.FC<BlogFeedProps> = ({ posts, onLike, onBookmark }) => {
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  const handleShare = async (post: FeedPost) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          url: `/blog/${post.slug}`,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/blog/${post.slug}`);
      alert('URL copiada al portapapeles');
    }
  };

  return (
    <div className="space-y-0">
      {posts.map((post) => (
        <article
          key={post.id}
          className={`border-b transition-colors ${
            isDark 
              ? 'border-gray-700 hover:bg-gray-800/50' 
              : 'border-gray-200 hover:bg-gray-50/50'
          }`}
        >
          <div className="p-4">
            {/* Header del post */}
            <div className="flex items-start gap-3 mb-3">
              {/* Avatar */}
              <Link to={`/profile/${post.author.username}`}>
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-10 h-10 rounded-full object-cover hover:opacity-90 transition-opacity"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-gray-700' : 'bg-gray-300'
                  }`}>
                    <User size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
                  </div>
                )}
              </Link>

              {/* Info del autor y contenido */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    to={`/profile/${post.author.username}`}
                    className={`font-bold hover:underline ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {post.author.name}
                  </Link>
                  <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                    @{post.author.username}
                  </span>
                  <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                    •
                  </span>
                  <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                    {formatDate(post.date)}
                  </span>
                </div>

                {/* Contenido del post */}
                <Link to={`/blog/${post.slug}`} className="block">
                  <h2 className={`font-bold text-lg mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {post.title}
                  </h2>
                  <p className={`text-sm mb-3 line-clamp-3 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {post.content}
                  </p>
                </Link>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag, index) => (
                      <BlogTag
                        key={index}
                        label={tag}
                        size="sm"
                        showIcon={false}
                      />
                    ))}
                  </div>
                )}

                {/* Imagen si existe */}
                {post.thumbnail && (
                  <Link to={`/blog/${post.slug}`} className="block mb-3">
                    <img
                      src={post.thumbnail}
                      alt={post.title}
                      className="w-full rounded-xl border object-cover max-h-96"
                      style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}
                    />
                  </Link>
                )}

                {/* Acciones */}
                <div className="flex items-center justify-between pt-2">
                  <Link
                    to={`/blog/${post.slug}#comments`}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors group ${
                      isDark 
                        ? 'hover:bg-blue-900/30' 
                        : 'hover:bg-blue-50'
                    }`}
                  >
                    <MessageCircle 
                      size={18} 
                      className={`transition-colors ${
                        isDark 
                          ? 'text-gray-500 group-hover:text-blue-400' 
                          : 'text-gray-600 group-hover:text-blue-600'
                      }`}
                    />
                    <span className={`text-sm ${
                      isDark 
                        ? 'text-gray-500 group-hover:text-blue-400' 
                        : 'text-gray-600 group-hover:text-blue-600'
                    }`}>
                      {post.comments}
                    </span>
                  </Link>

                  <button
                    onClick={() => onLike?.(post.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors group ${
                      isDark 
                        ? 'hover:bg-red-900/30' 
                        : 'hover:bg-red-50'
                    }`}
                  >
                    <Heart 
                      size={18} 
                      className={`transition-colors ${
                        post.liked 
                          ? 'fill-red-600 text-red-600' 
                          : isDark 
                          ? 'text-gray-500 group-hover:text-red-400' 
                          : 'text-gray-600 group-hover:text-red-600'
                      }`}
                    />
                    <span className={`text-sm ${
                      post.liked 
                        ? 'text-red-600' 
                        : isDark 
                        ? 'text-gray-500 group-hover:text-red-400' 
                        : 'text-gray-600 group-hover:text-red-600'
                    }`}>
                      {post.likes}
                    </span>
                  </button>

                  <button
                    onClick={() => onBookmark?.(post.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors group ${
                      isDark 
                        ? 'hover:bg-green-900/30' 
                        : 'hover:bg-green-50'
                    }`}
                  >
                    <Bookmark 
                      size={18} 
                      className={`transition-colors ${
                        post.bookmarked 
                          ? 'fill-green-600 text-green-600' 
                          : isDark 
                          ? 'text-gray-500 group-hover:text-green-400' 
                          : 'text-gray-600 group-hover:text-green-600'
                      }`}
                    />
                  </button>

                  <button
                    onClick={() => handleShare(post)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors group ${
                      isDark 
                        ? 'hover:bg-blue-900/30' 
                        : 'hover:bg-blue-50'
                    }`}
                  >
                    <Share2 
                      size={18} 
                      className={`transition-colors ${
                        isDark 
                          ? 'text-gray-500 group-hover:text-blue-400' 
                          : 'text-gray-600 group-hover:text-blue-600'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Menú de opciones */}
              <button
                className={`p-2 rounded-full transition-colors ${
                  isDark 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <MoreHorizontal 
                  size={18} 
                  className={isDark ? 'text-gray-500' : 'text-gray-600'} 
                />
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};
