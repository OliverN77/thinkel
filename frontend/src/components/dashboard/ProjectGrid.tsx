"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getMyPosts, deletePost } from "../../services/post.service"
import { Edit, Trash2, Eye } from "lucide-react"
import type { Post } from "../../services/post.service"

interface Props {
  isDark: boolean
}

export function ProjectGrid({ isDark }: Props) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getMyPosts({ limit: 5 })
        setPosts(response.data)
      } catch (error) {
        console.error('Error al cargar publicaciones:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${title}"?`)) return

    try {
      await deletePost(id)
      setPosts(posts.filter(p => p._id !== id))
      alert('Publicación eliminada correctamente')
    } catch (error) {
      console.error('Error al eliminar:', error)
      alert('Error al eliminar la publicación')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className={`rounded-xl p-4 backdrop-blur-sm border transition-colors duration-300 ${
        isDark ? "bg-gray-800/60 border-gray-700" : "bg-white/80 border-gray-200"
      }`}>
        <h2 className={`font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          Mis Publicaciones
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-300 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-xl p-4 backdrop-blur-sm border transition-colors duration-300 ${
      isDark 
        ? "bg-gray-800/60 border-gray-700" 
        : "bg-white/80 border-gray-200"
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
          Mis Publicaciones ({posts.length})
        </h2>
        <button 
          onClick={() => navigate('/blog/create')}
          className={`text-sm px-3 py-1 rounded-full border transition-all hover:scale-105 ${
            isDark 
              ? "bg-blue-500 text-white border-blue-500" 
              : "bg-blue-600 text-white border-blue-600"
          }`}
        >
          Nueva publicación
        </button>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {posts.length === 0 ? (
          <div className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            <p>No tienes publicaciones aún</p>
            <button 
              onClick={() => navigate('/blog/create')}
              className="mt-2 text-blue-600 hover:underline"
            >
              Crear tu primera publicación
            </button>
          </div>
        ) : (
          posts.map((p) => (
            <div
              key={p._id}
              className={`p-3 rounded-lg transition-all ${
                isDark 
                  ? "bg-gray-700/50 hover:bg-gray-700/70" 
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className={`font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>
                    {p.title}
                  </div>
                  <div className={`text-sm truncate ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {p.description}
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className={isDark ? "text-gray-500" : "text-gray-400"}>
                      {formatDate(p.createdAt)}
                    </span>
                    <span className={isDark ? "text-gray-500" : "text-gray-400"}>
                      ❤️ {p.likes} · 💬 {p.comments}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/blog/${p.slug}`)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? "hover:bg-gray-600 text-gray-400 hover:text-white" 
                        : "hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                    }`}
                    title="Ver publicación"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() => navigate(`/blog/edit/${p._id}`)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? "hover:bg-blue-600 text-gray-400 hover:text-white" 
                        : "hover:bg-blue-100 text-gray-600 hover:text-blue-600"
                    }`}
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id, p.title)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDark 
                        ? "hover:bg-red-600 text-gray-400 hover:text-white" 
                        : "hover:bg-red-100 text-gray-600 hover:text-red-600"
                    }`}
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
