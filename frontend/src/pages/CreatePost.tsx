import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogEditor } from '../components/blog/BlogEditor';
import type { BlogPostData } from '../components/blog/BlogEditor';
import { Layout } from '../components/blog/Layout';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { createPost } from '../services/post.service';

export const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);

  const handleSave = async (data: BlogPostData) => {
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

      // Llamar a la API para crear el post
      const newPost = await createPost({
        title: data.title,
        content: data.content,
        description: data.description,
        thumbnail: data.thumbnail || undefined,
        tags: data.tags || [],
      });
      
      console.log('Post creado:', newPost);
      
      setSuccess(true);

      // Mostrar mensaje de éxito y redirigir
      setTimeout(() => {
        navigate('/blog');
      }, 2000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar el artículo';
      setError(errorMessage);
      console.error('Error al crear post:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('¿Estás seguro de que quieres cancelar? Los cambios no guardados se perderán.')) {
      navigate('/blog');
    }
  };

  return (
    <Layout showSidebar={true}>
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate('/blog')}
              className=" ${isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'} inline-flex items-center gap-2 transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span>Volver al blog</span>
            </button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  Crear nuevo artículo
                </h1>
                <p className={` ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-2`}>
                  Comparte tus conocimientos con la comunidad
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
                ¡Artículo publicado exitosamente! Redirigiendo...
              </p>
            </div>
          )}

          {/* Editor */}
          <BlogEditor
            onSave={handleSave}
            onCancel={handleCancel}
          />

          {/* Indicador de guardado */}
          {isSaving && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-sm mx-4">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-900 font-medium text-lg">
                    Publicando artículo...
                  </p>
                  <p className="text-gray-600 text-sm mt-2">
                    Por favor espera un momento
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tips de escritura */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-3">
              💡 Tips para escribir un buen artículo:
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Usa títulos descriptivos y llamativos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Escribe una descripción clara de 1-2 líneas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Usa Markdown para formatear: **negrita**, *cursiva*, `código`</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Agrega etiquetas relevantes para mejor descubrimiento</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Incluye ejemplos de código cuando sea apropiado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Usa la vista previa para revisar antes de publicar</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
};