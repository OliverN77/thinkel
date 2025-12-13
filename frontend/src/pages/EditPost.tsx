import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlogEditor } from '../components/blog/BlogEditor';
import type { BlogPostData } from '../components/blog/BlogEditor';
import { Layout } from '../components/blog/Layout';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { getPostById, updatePost } from '../services/post.service';

export const EditPost: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [initialData, setInitialData] = useState<{
    title: string;
    content: string;
    tags: string[];
    thumbnail?: string;
    description: string;
  } | null>(null);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  // Cargar el post existente
  useEffect(() => {
    const loadPost = async () => {
      if (!id) {
        setError('ID de publicación no válido');
        setIsLoading(false);
        return;
      }

      try {
        const post = await getPostById(id);
        setInitialData({
          title: post.title,
          content: post.content,
          tags: post.tags,
          thumbnail: post.thumbnail,
          description: post.description,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar la publicación';
        setError(errorMessage);
        console.error('Error al cargar post:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [id]);

  const handleSave = async (data: BlogPostData) => {
    if (!id) return;

    setIsSaving(true);
    setError(null);

    try {
      // Validación adicional
      if (!data.title.trim()) {
        throw new Error('El título es obligatorio');
      }
      if (!data.content.trim()) {
        throw new Error('El contenido es obligatorio');
      }
      if (!data.description.trim()) {
        throw new Error('La descripción es obligatoria');
      }

      // Llamar a la API para actualizar el post
      await updatePost(id, {
        title: data.title,
        content: data.content,
        description: data.description,
        thumbnail: data.thumbnail || undefined,
        tags: data.tags || [],
      });
      
      setSuccess(true);

      // Mostrar mensaje de éxito y redirigir
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el artículo';
      setError(errorMessage);
      console.error('Error al actualizar post:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.')) {
      navigate('/dashboard');
    }
  };

  if (isLoading) {
    return (
      <Layout showSidebar={true}>
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Cargando publicación...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !initialData) {
    return (
      <Layout showSidebar={true}>
        <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
          <div className="text-center max-w-md mx-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <AlertCircle className="text-red-600 mx-auto mb-4" size={48} />
              <p className="text-red-800 font-medium mb-2">Error al cargar</p>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className={`${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} inline-flex items-center gap-2 transition-colors mb-4`}
            >
              <ArrowLeft size={20} />
              <span>Volver al Dashboard</span>
            </button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  Editar publicación
                </h1>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                  Actualiza tu contenido
                </p>
              </div>
            </div>
          </div>

          {/* Mensajes de error */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-800 font-medium">Error al guardar</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Mensaje de éxito */}
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                ¡Publicación actualizada exitosamente! Redirigiendo...
              </p>
            </div>
          )}

          {/* Editor con datos iniciales */}
          {initialData && (
            <BlogEditor
              initialTitle={initialData.title}
              initialContent={initialData.content}
              initialDescription={initialData.description}
              initialTags={initialData.tags}
              initialThumbnail={initialData.thumbnail}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}

          {/* Indicador de guardado */}
          {isSaving && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-sm mx-4">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-900 font-medium text-lg">
                    Actualizando publicación...
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    Por favor espera un momento
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
