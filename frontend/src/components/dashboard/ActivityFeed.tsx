import { useState, useEffect } from "react"
import { getMyPosts } from "../../services/post.service"
import { useNavigate } from "react-router-dom"
import type { Post } from "../../services/post.service"

interface Props {
  isDark: boolean
}

export function ActivityFeed({ isDark }: Props) {
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const response = await getMyPosts({ limit: 5 })
        setRecentPosts(response.data)
      } catch (error) {
        console.error('Error al cargar actividad:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentActivity()
  }, [])

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMinutes = Math.floor(diffInMs / 60000)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`
    if (diffInHours < 24) return `Hace ${diffInHours} h`
    return `Hace ${diffInDays} días`
  }

  if (loading) {
    return (
      <div className={`rounded-xl p-4 backdrop-blur-sm border transition-colors duration-300 ${
        isDark ? "bg-gray-800/60 border-gray-700" : "bg-white/80 border-gray-200"
      }`}>
        <h2 className={`font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
          Actividad reciente
        </h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 bg-gray-300 rounded-lg"></div>
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
      <h2 className={`font-semibold mb-3 ${isDark ? "text-white" : "text-gray-900"}`}>
        Actividad reciente
      </h2>
      
      {recentPosts.length === 0 ? (
        <div className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          <p className="text-sm">No hay actividad reciente</p>
          <button 
            onClick={() => navigate('/blog/create')}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Crea tu primera publicación
          </button>
        </div>
      ) : (
        <div className={`space-y-3 border-l-2 pl-4 max-h-96 overflow-y-auto ${isDark ? "border-gray-600" : "border-gray-300"}`}>
          {recentPosts.map((post) => (
            <div
              key={post._id}
              className={`relative before:absolute before:w-3 before:h-3 before:rounded-full before:-left-[29px] before:top-1 cursor-pointer hover:opacity-80 transition-opacity ${
                isDark ? "before:bg-blue-400" : "before:bg-blue-600"
              }`}
              onClick={() => navigate(`/blog/${post.slug}`)}
            >
              <p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                Publicaste: "{post.title}"
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                  {getTimeAgo(post.createdAt)}
                </span>
                <span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  · ❤️ {post.likes} · 💬 {post.comments}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}