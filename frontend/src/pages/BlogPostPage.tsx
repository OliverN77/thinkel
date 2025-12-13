import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BlogPost } from '../components/blog/BlogPost';
import { BlogAuthor } from '../components/blog/BlogAuthor';
import { BlogComments } from '../components/blog/BlogComments';
import { Layout } from '../components/blog/Layout';
import { isAuthenticated } from '../services/auth.service';
import { getPostBySlug } from '../services/post.service';
import { getCommentsByPost, createComment as createCommentAPI, toggleLikeComment } from '../services/comment.service';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
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

  // Cargar el post desde la API
  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError('No se especificó un artículo');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Llamar a la API para obtener el post por slug
        const postData = await getPostBySlug(slug);
        
        // Transformar el post al formato esperado por el componente
        const getAuthorAvatar = () => {
          if (!postData.author.avatar) {
            return `https://ui-avatars.com/api/?name=${encodeURIComponent(postData.author.name)}&background=random`;
          }
          return postData.author.avatar.startsWith('http') 
            ? postData.author.avatar 
            : `http://localhost:5000${postData.author.avatar}`;
        };

        const transformedPost = {
          id: postData._id,
          title: postData.title,
          content: postData.content,
          date: postData.createdAt,
          readTime: Math.ceil(postData.content.split(' ').length / 200), // Calcular tiempo de lectura
          tags: postData.tags,
          author: {
            name: postData.author.name,
            avatar: getAuthorAvatar(),
            bio: postData.author.bio || 'Sin biografía disponible.',
            role: 'Autor',
            profileUrl: `/profile/${postData.author.username}`,
            socialLinks: {},
          },
          thumbnail: postData.thumbnail,
          slug: postData.slug,
        };

        setPost(transformedPost);

        // Cargar comentarios del post
        await loadComments(postData._id);
      } catch (err) {
        console.error('Error al cargar el post:', err);
        setError('No se pudo cargar el artículo. Puede que no exista o haya ocurrido un error.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Scroll automático a comentarios si la URL tiene #comments
  useEffect(() => {
    if (window.location.hash === '#comments') {
      setTimeout(() => {
        const commentsSection = document.getElementById('comments');
        if (commentsSection) {
          commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500); // Delay para asegurar que el contenido esté cargado
    }
  }, [post]);

  // Función para cargar comentarios
  const loadComments = async (postId: string) => {
    try {
      const response = await getCommentsByPost(postId);
      
      // Transformar comentarios al formato esperado por el componente
      const transformedComments = response.map((comment: any) => transformComment(comment));
      setComments(transformedComments);
    } catch (err) {
      console.error('Error al cargar comentarios:', err);
      setComments([]);
    }
  };

  // Función para transformar un comentario de API a formato del componente
  const transformComment = (comment: any): any => {
    const getAvatarUrl = () => {
      if (!comment.author.avatar) {
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author.name)}&background=random`;
      }
      return comment.author.avatar.startsWith('http') 
        ? comment.author.avatar 
        : `http://localhost:5000${comment.author.avatar}`;
    };

    return {
      id: comment._id,
      author: {
        name: comment.author.name,
        avatar: getAvatarUrl(),
      },
      content: comment.content,
      date: new Date(comment.createdAt).toISOString().split('T')[0],
      likes: comment.likes,
      replies: comment.replies ? comment.replies.map(transformComment) : [],
    };
  };

  // Handlers para comentarios
  const handleAddComment = async (content: string, parentId?: string) => {
    if (!post || !authenticated) {
      console.error('Usuario no autenticado o post no cargado');
      return;
    }

    try {
      // Crear comentario en la API
      const newCommentData = {
        postId: post.id,
        content,
        parentId: parentId || undefined,
      };

      const createdComment = await createCommentAPI(newCommentData);
      
      // Recargar comentarios para obtener la estructura actualizada
      await loadComments(post.id);
      
      console.log('Comentario creado exitosamente:', createdComment);
    } catch (err) {
      console.error('Error al crear comentario:', err);
      alert('No se pudo crear el comentario. Intenta nuevamente.');
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!authenticated) {
      console.error('Usuario no autenticado');
      return;
    }

    try {
      // Actualización optimista
      const updateLikes = (comments: any[]): any[] => {
        return comments.map(comment => {
          if (comment.id === commentId) {
            return { ...comment, likes: comment.likes + 1 };
          }
          // Buscar en replies anidadas
          if (comment.replies && comment.replies.length > 0) {
            return {
              ...comment,
              replies: updateLikes(comment.replies),
            };
          }
          return comment;
        });
      };

      setComments(updateLikes(comments));

      // Llamar a la API
      await toggleLikeComment(commentId);
      
      console.log('Like registrado en comentario:', commentId);
    } catch (err) {
      console.error('Error al dar like al comentario:', err);
      // Revertir cambio optimista recargando comentarios
      if (post) {
        await loadComments(post.id);
      }
    }
  };

  // Estados de carga y error
  if (isLoading) {
    return (
      <Layout showSidebar={authenticated}>
        <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Cargando artículo...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout showSidebar={authenticated}>
        <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <div className="text-center">
            <div className={`border rounded-lg p-8 max-w-md ${isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'}`}>
              <p className={`font-medium mb-4 ${isDark ? 'text-red-400' : 'text-red-600'}`}>{error || 'Artículo no encontrado'}</p>
              <button
                onClick={() => navigate('/blog')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Volver al blog
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={authenticated}>
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Artículo completo */}
          <BlogPost {...post} isDark={isDark} />

          {/* Espaciado */}
          <div className="mt-12 space-y-8">
            {/* Información del autor */}
            <BlogAuthor
              name={post.author.name}
              role={post.author.role}
              bio={post.author.bio}
              avatar={post.author.avatar}
              profileUrl={post.author.profileUrl}
              socialLinks={post.author.socialLinks}
              academicInfo={post.author.academicInfo}
              isDark={isDark}
            />

            {/* Sección de comentarios */}
            <div id="comments">
              <BlogComments
                postId={post.id}
                comments={comments}
                onAddComment={handleAddComment}
                onLikeComment={handleLikeComment}
                isDark={isDark}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
