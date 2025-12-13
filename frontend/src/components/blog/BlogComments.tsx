import React, { useState } from 'react';
import { MessageCircle, Send, Reply, ThumbsUp, User, Calendar } from 'lucide-react';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  date: string;
  likes: number;
  replies?: Comment[];
}

interface BlogCommentsProps {
  postId: string;
  comments: Comment[];
  onAddComment?: (content: string, parentId?: string) => void;
  onLikeComment?: (commentId: string) => void;
  isDark?: boolean;
}

export const BlogComments: React.FC<BlogCommentsProps> = ({
  comments,
  onAddComment,
  onLikeComment,
  isDark = false,
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Hoy';
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && onAddComment) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const handleSubmitReply = (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (replyContent.trim() && onAddComment) {
      onAddComment(replyContent, parentId);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const sortedComments = [...comments].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const CommentItem: React.FC<{ comment: Comment; isReply?: boolean }> = ({ 
    comment, 
    isReply = false 
  }) => (
    <div className={`${isReply ? 'ml-12' : ''} mb-4`}>
      <div className={`${
        isDark
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      } rounded-lg p-4 border shadow-sm`}>
        {/* Autor y fecha */}
        <div className="flex items-start gap-3 mb-3">
          {comment.author.avatar ? (
            <img
              src={comment.author.avatar}
              alt={`Avatar de ${comment.author.name}`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className={`${
              isDark
                ? 'bg-gray-700'
                : 'bg-gray-300'
            } w-10 h-10 rounded-full flex items-center justify-center`}>
              <User size={20} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`${
                isDark ? 'text-white' : 'text-gray-900'
              } font-semibold`}>
                {comment.author.name}
              </span>
              <span className={`${
                isDark ? 'text-gray-500' : 'text-gray-500'
              } text-xs flex items-center gap-1`}>
                <Calendar size={12} />
                {formatDate(comment.date)}
              </span>
            </div>
            <p className={`${
              isDark ? 'text-gray-300' : 'text-gray-700'
            } text-sm leading-relaxed`}>
              {comment.content}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center gap-4 ml-13">
          <button
            onClick={() => onLikeComment?.(comment.id)}
            className={`${
              isDark
                ? 'text-gray-400 hover:text-blue-400'
                : 'text-gray-600 hover:text-blue-600'
            } flex items-center gap-1 text-sm transition-colors`}
          >
            <ThumbsUp size={16} />
            <span>{comment.likes > 0 ? comment.likes : 'Me gusta'}</span>
          </button>
          {!isReply && (
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className={`${
                isDark
                  ? 'text-gray-400 hover:text-blue-400'
                  : 'text-gray-600 hover:text-blue-600'
              } flex items-center gap-1 text-sm transition-colors`}
            >
              <Reply size={16} />
              <span>Responder</span>
            </button>
          )}
        </div>

        {/* Formulario de respuesta */}
        {replyingTo === comment.id && (
          <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className={`${
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500'
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500'
                } flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent text-sm`}
              />
              <button
                type="submit"
                disabled={!replyContent.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Respuestas */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`${
      isDark
        ? 'bg-gray-800 border-gray-700'
        : 'bg-gray-50 border-gray-200'
    } rounded-xl p-6 border`}>
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <h3 className={`${
          isDark ? 'text-white' : 'text-gray-900'
        } text-2xl font-bold flex items-center gap-2`}>
          <MessageCircle size={24} className={isDark ? 'text-blue-400' : 'text-blue-600'} />
          Comentarios ({comments.length})
        </h3>

        {/* Ordenar */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
          className={`${
            isDark
              ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500'
              : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500'
          } px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:border-transparent`}
        >
          <option value="newest">Más recientes</option>
          <option value="oldest">Más antiguos</option>
        </select>
      </div>

      {/* Formulario de nuevo comentario */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className={`${
          isDark
            ? 'bg-gray-700 border-gray-600'
            : 'bg-white border-gray-300'
        } rounded-lg border p-4`}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escribe tu comentario..."
            rows={3}
            className={`${
              isDark
                ? 'text-white placeholder-gray-400'
                : 'text-gray-700 placeholder-gray-500'
            } w-full resize-none focus:outline-none bg-transparent`}
          />
          <div className={`${
            isDark ? 'border-gray-600' : 'border-gray-200'
          } flex justify-end pt-3 border-t`}>
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={16} />
              Publicar comentario
            </button>
          </div>
        </div>
      </form>

      {/* Lista de comentarios */}
      {sortedComments.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle size={48} className={`${
            isDark ? 'text-gray-600' : 'text-gray-300'
          } mx-auto mb-3`} />
          <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
            Sé el primero en comentar este artículo
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};