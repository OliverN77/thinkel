import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getPosts, toggleLike, toggleBookmark } from "../services/post.service"
import { BlogSidebar } from "../components/blog/BlogSidebar"
import { BlogFeed } from "../components/blog/BlogFeed"
import { Heart } from "lucide-react"

export default function Favorites() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDark, setIsDark] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          navigate('/form')
          return
        }

        // Obtener todos los posts y filtrar los que el usuario ha dado like
        const response = await getPosts()
        const likedPosts = response.data.filter(post => 
          post.likedBy.includes(userId)
        ).map(post => ({
          id: post._id,
          title: post.title,
          content: post.description,
          date: post.createdAt,
          tags: post.tags,
          author: {
            name: post.author.name,
            username: post.author.username,
            avatar: post.author.avatar 
              ? (post.author.avatar.startsWith('http') 
                  ? post.author.avatar 
                  : `https://thinkel.onrender.com${post.author.avatar}`)
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.name)}&background=random`,
          },
          thumbnail: post.thumbnail,
          slug: post.slug,
          likes: post.likes,
          comments: post.comments,
          bookmarked: post.bookmarkedBy.includes(userId),
          liked: true, // Ya que estamos en favoritos, todos están likeados
        }))
        setPosts(likedPosts)
      } catch (error) {
        console.error('Error al cargar favoritos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [navigate])

  const handleLike = async (postId: string) => {
    try {
      // Actualizar optimistamente en la UI
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
            : post
        )
      )

      await toggleLike(postId)
      
      // Si quitó el like, remover de favoritos después de un delay
      setTimeout(() => {
        setPosts(prevPosts => prevPosts.filter(p => p.id !== postId || p.liked))
      }, 500)
    } catch (err) {
      console.error('Error al dar like:', err)
      // Revertir cambio
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, liked: !post.liked, likes: post.liked ? post.likes + 1 : post.likes - 1 }
            : post
        )
      )
    }
  }

  const handleBookmark = async (postId: string) => {
    try {
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post
        )
      )
      await toggleBookmark(postId)
    } catch (err) {
      console.error('Error al guardar:', err)
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, bookmarked: !post.bookmarked } : post
        )
      )
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <BlogSidebar />
        <main className="flex-1">
          <div className={`min-h-screen ${isDark ? "bg-[#152040]" : "bg-gradient-to-br from-blue-50 via-white to-gray-50"}`}>
            <div className="max-w-3xl mx-auto px-4 py-8">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-gray-300 rounded-xl"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <BlogSidebar />
      <main className="flex-1">
        <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
          <div className={`max-w-2xl mx-auto border-x ${isDark ? "border-gray-700" : "border-gray-200"}`}>
            {/* Header */}
            <div className={`sticky top-0 z-10 backdrop-blur-md border border-gray-300 border-b px-4 py-3 ${isDark ? "bg-gray-900/80 border-gray-700" : "bg-white/80 border-gray-200"}`}>
              <div className="flex items-center gap-3">
                <Heart size={24} className="text-red-500" fill="currentColor" />
                <div>
                  <h1 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    Mis Favoritos
                  </h1>
                  <p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    {posts.length} publicaciones
                  </p>
                </div>
              </div>
            </div>

            {/* Posts */}
            {posts.length === 0 ? (
              <div className={`text-center py-16 px-4 border border-gray-300 border-b ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                <Heart size={64} className="mx-auto mb-4 opacity-30" />
                <h2 className="text-xl font-semibold mb-2">No tienes favoritos aún</h2>
                <p className="mb-4">Dale like a las publicaciones que te gusten para verlas aquí</p>
                <button 
                  onClick={() => navigate('/blog')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Explorar Blog
                </button>
              </div>
            ) : (
              <BlogFeed posts={posts} onLike={handleLike} onBookmark={handleBookmark} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
