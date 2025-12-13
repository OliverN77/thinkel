import React, { useState, useRef, useEffect } from 'react';
import { 
  Save, 
  Eye, 
  Image as ImageIcon, 
  Tag as TagIcon, 
  X,
  Bold,
  Italic,
  List,
  Code,
  Link as LinkIcon,
  Heading,
  Quote
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  initialThumbnail?: string;
  initialDescription?: string;
  onSave?: (data: BlogPostData) => void;
  onCancel?: () => void;
}

export interface BlogPostData {
  title: string;
  content: string;
  tags: string[];
  thumbnail?: string;
  description: string;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({
  initialTitle = '',
  initialContent = '',
  initialTags = [],
  initialThumbnail = '',
  initialDescription = '',
  onSave,
  onCancel,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [thumbnail, setThumbnail] = useState(initialThumbnail);
  const [tagInput, setTagInput] = useState('');
  const [description, setDescription] = useState(initialDescription);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  // Funciones de formato Markdown
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = 
      content.substring(0, start) +
      before + selectedText + after +
      content.substring(end);

    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('El título y el contenido son obligatorios');
      return;
    }

    setIsSaving(true);
    
    const postData: BlogPostData = {
      title: title.trim(),
      content: content.trim(),
      tags,
      thumbnail: thumbnail.trim() || undefined,
      description: description.trim(),
    };

    try {
      await onSave?.(postData);
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error al guardar el artículo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`max-w-5xl mx-auto rounded-xl shadow-lg ${
      isDark ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Barra de herramientas */}
      <div className={`border-b p-4 ${
        isDark ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Botones de formato */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => insertMarkdown('## ', '\n')}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Título"
            >
              <Heading size={20} />
            </button>
            <button
              onClick={() => insertMarkdown('**', '**')}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Negrita"
            >
              <Bold size={20} />
            </button>
            <button
              onClick={() => insertMarkdown('*', '*')}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Cursiva"
            >
              <Italic size={20} />
            </button>
            <button
              onClick={() => insertMarkdown('`', '`')}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Código"
            >
              <Code size={20} />
            </button>
            <button
              onClick={() => insertMarkdown('[', '](url)')}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Enlace"
            >
              <LinkIcon size={20} />
            </button>
            <button
              onClick={() => insertMarkdown('- ', '\n')}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Lista"
            >
              <List size={20} />
            </button>
            <button
              onClick={() => insertMarkdown('> ', '\n')}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'hover:bg-gray-700 text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Cita"
            >
              <Quote size={20} />
            </button>
          </div>

          {/* Acciones principales */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                showPreview
                  ? isDark
                    ? 'bg-blue-900 text-blue-300'
                    : 'bg-blue-100 text-blue-700'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye size={18} />
              {showPreview ? 'Editor' : 'Vista previa'}
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Cancelar
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Save size={18} />
              {isSaving ? 'Guardando...' : 'Publicar'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!showPreview ? (
          <>
            {/* Título */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título del artículo"
              className={`w-full text-4xl font-bold mb-4 outline-none border-none focus:ring-0 ${
                isDark 
                  ? 'bg-gray-800 text-white placeholder-gray-500' 
                  : 'bg-white text-gray-900 placeholder-gray-400'
              }`}
            />

            {/* Descripción */}
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descripción del artículo..."
              rows={2}
              className={`w-full mb-4 outline-none border-none focus:ring-0 resize-none ${
                isDark 
                  ? 'bg-gray-800 text-gray-300 placeholder-gray-500' 
                  : 'bg-white text-gray-600 placeholder-gray-400'
              }`}
            />

            {/* Imagen destacada */}
            <div className="mb-4">
              <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <ImageIcon size={16} />
                Imagen destacada (opcional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="URL de la imagen o sube un archivo"
                  className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
                <label className={`px-4 py-2 rounded-lg cursor-pointer transition-colors flex items-center gap-2 ${
                  isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}>
                  <ImageIcon size={18} />
                  Subir
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt="Preview"
                  className="mt-2 rounded-lg max-h-48 object-cover"
                />
              )}
            </div>

            {/* Tags */}
            <div className="mb-6">
              <label className={`flex items-center gap-2 text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <TagIcon size={16} />
                Etiquetas
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Agregar etiqueta..."
                  className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                />
                <button
                  onClick={addTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Agregar
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full ${
                      isDark
                        ? 'bg-blue-900 text-blue-300'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className={isDark ? 'hover:text-blue-100' : 'hover:text-blue-900'}
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Editor de contenido */}
            <div className={`border rounded-lg ${
              isDark ? 'border-gray-700' : 'border-gray-300'
            }`}>
              <div className={`px-4 py-2 border-b ${
                isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'
              }`}>
                <span className={`text-sm font-medium ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Contenido (Markdown)
                </span>
              </div>
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribe tu artículo en Markdown...&#10;&#10;## Ejemplo de título&#10;&#10;Este es un párrafo con **texto en negrita** y *cursiva*.&#10;&#10;- Lista item 1&#10;- Lista item 2&#10;&#10;```javascript&#10;console.log('Código de ejemplo');&#10;```"
                className={`w-full h-96 p-4 outline-none resize-none font-mono text-sm ${
                  isDark
                    ? 'bg-gray-800 text-gray-300 placeholder-gray-500'
                    : 'bg-white text-gray-900 placeholder-gray-400'
                }`}
              />
            </div>
          </>
        ) : (
          <>
            {/* Vista previa */}
            <div className={`prose prose-lg max-w-none ${
              isDark ? 'prose-invert' : ''
            }`}>
              <h1 className={`text-4xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {title || 'Sin título'}
              </h1>
              {description && (
                <p className={`text-xl mb-6 ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {description}
                </p>
              )}
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt="Preview"
                  className="rounded-lg mb-6 w-full"
                />
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        isDark
                          ? 'bg-blue-900 text-blue-300'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content || '*Escribe algo para ver la vista previa...*'}
              </ReactMarkdown>
            </div>
          </>
        )}
      </div>
    </div>
  );
};