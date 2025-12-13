import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { BlogSidebar } from "../components/blog/BlogSidebar"
import { BlogFeed } from "../components/blog/BlogFeed"
import { getPosts, toggleLike, toggleBookmark } from "../services/post.service"
import { User, Edit } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import { SettingsModal } from "../components/dashboard/SettingsModal"

export default function Profile() {
  const { username } = useParams<{ username: string }>()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [profileUser, setProfileUser] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDark, setIsDark] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    followers: 0,
    following: 0
  })

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
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem('userId')
        
        // Obtener todos los posts del usuario
        const response = await getPosts()
        const userPosts = response.data.filter(post => 
          post.author.username === username
        )

        if (userPosts.length > 0) {
          // Usar datos del primer post como perfil
          const author = userPosts[0].author
          setProfileUser({
            name: author.name,
            username: author.username,
            avatar: author.avatar?.startsWith('http') 
              ? author.avatar 
              : `http://localhost:5000${author.avatar}`,
            bio: author.bio || 'Sin biografía disponible',
          })

          // Calcular estadísticas
          const totalLikes = userPosts.reduce((sum, post) => sum + post.likes, 0)
          setStats({
            totalPosts: userPosts.length,
            totalLikes,
            followers: 0, // Por ahora estático
            following: 0
          })

          // Transformar posts para el feed
          const transformedPosts = userPosts.map(post => ({
            id: post._id,
            title: post.title,
            content: post.description,
            date: post.createdAt,
            tags: post.tags,
            author: {
              name: author.name,
              username: author.username,
              avatar: author.avatar?.startsWith('http') 
                ? author.avatar 
                : `http://localhost:5000${author.avatar}`,
            },
            thumbnail: post.thumbnail,
            slug: post.slug,
            likes: post.likes,
            comments: post.comments,
            bookmarked: userId ? post.bookmarkedBy.includes(userId) : false,
            liked: userId ? post.likedBy.includes(userId) : false,
          }))
          setPosts(transformedPosts)
        } else {
          // Usuario no encontrado o sin posts
          setProfileUser({
            name: username,
            username: username,
            avatar: `https://ui-avatars.com/api/?name=${username}&background=random`,
            bio: 'Usuario sin publicaciones aún',
          })
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [username])

  const handleLike = async (postId: string) => {
    try {
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId
            ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
            : post
        )
      )
      await toggleLike(postId)
    } catch (err) {
      console.error('Error al dar like:', err)
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

  const isOwnProfile = currentUser?.email?.split('@')[0] === username

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <BlogSidebar />
        <main className="flex-1">
          <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
            <div className="max-w-2xl mx-auto px-4 py-8">
              <div className="animate-pulse space-y-4">
                <div className="h-32 bg-gray-300 rounded-xl"></div>
                <div className="h-64 bg-gray-300 rounded-xl"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!profileUser) {
    return (
      <div className="flex min-h-screen">
        <BlogSidebar />
        <main className="flex-1">
          <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"} flex items-center justify-center`}>
            <div className="text-center">
              <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                Usuario no encontrado
              </h2>
              <button 
                onClick={() => navigate('/blog')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Volver al Blog
              </button>
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
            {/* Header del perfil */}
            <div className={`border-b ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}>
              {/* Banner */}
              <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              
              {/* Info del usuario */}
              <div className="px-4 pb-4">
                <div className="flex justify-between items-start -mt-16 mb-4">
                  <img
                    src={profileUser.avatar}
                    alt={profileUser.name}
                    className="w-32 h-32 rounded-full border-4 object-cover"
                    style={{ borderColor: isDark ? '#1f2937' : '#fff' }}
                  />
                  
                  {isOwnProfile && (
                    <button
                      onClick={() => setShowSettings(true)}
                      className="mt-16 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Edit size={16} />
                      Editar perfil
                    </button>
                  )}
                </div>

                <div>
                  <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                    {profileUser.name}
                  </h1>
                  <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
                    @{profileUser.username}
                  </p>
                  
                  <p className={`mt-3 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    {profileUser.bio}
                  </p>

                  {/* Estadísticas */}
                  <div className="flex gap-6 mt-4">
                    <div>
                      <span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                        {stats.totalPosts}
                      </span>
                      <span className={`ml-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Publicaciones
                      </span>
                    </div>
                    <div>
                      <span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                        {stats.totalLikes}
                      </span>
                      <span className={`ml-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        Me gusta
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className={`border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
              <div className="flex">
                <button className={`flex-1 py-4 font-semibold border-b-2 border-blue-600 ${isDark ? "text-white" : "text-gray-900"}`}>
                  Publicaciones
                </button>
              </div>
            </div>

            {/* Posts del usuario */}
            {posts.length === 0 ? (
              <div className={`text-center py-16 px-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                <User size={64} className="mx-auto mb-4 opacity-30" />
                <h2 className="text-xl font-semibold mb-2">No hay publicaciones aún</h2>
                <p>Este usuario no ha publicado nada todavía</p>
              </div>
            ) : (
              <BlogFeed posts={posts} onLike={handleLike} onBookmark={handleBookmark} />
            )}
          </div>
        </div>
      </main>

      {/* Modal de configuración (solo para perfil propio) */}
      {isOwnProfile && showSettings && currentUser && (
        <SettingsModal 
          onClose={() => setShowSettings(false)} 
          open={true} 
          user={currentUser}
        />
      )}
    </div>
  )
}
