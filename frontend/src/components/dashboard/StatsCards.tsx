"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { getUserStats } from "../../services/post.service"

interface Props {
  isDark: boolean
}

export function StatsCards({ isDark }: Props) {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalLikes: 0,
    totalComments: 0,
    savedPosts: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getUserStats()
        setStats(data)
      } catch (error) {
        console.error('Error al cargar estadísticas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statsArray = [
    { label: "Publicaciones", value: stats.totalPosts },
    { label: "Me gusta", value: stats.totalLikes },
    { label: "Comentarios", value: stats.totalComments },
    { label: "Guardados", value: stats.savedPosts },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`rounded-xl p-4 backdrop-blur-sm border animate-pulse ${
              isDark ? "bg-gray-800/60 border-gray-700" : "bg-white/80 border-gray-200"
            }`}
          >
            <div className="h-8 bg-gray-300 rounded w-12 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statsArray.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`rounded-xl p-4 backdrop-blur-sm border transition-colors duration-300 ${
            isDark 
              ? "bg-gray-800/60 border-gray-700 text-white" 
              : "bg-white/80 border-gray-200 text-gray-900"
          }`}
        >
          <div className="text-2xl font-bold">{s.value}</div>
          <div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
