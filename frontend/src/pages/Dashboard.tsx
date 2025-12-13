"use client"

import { useAuth } from "../hooks/useAuth"
import { WelcomeHeader } from "../components/dashboard/WelcomeHeader"
import { StatsCards } from "../components/dashboard/StatsCards"
import { ProjectGrid } from "../components/dashboard/ProjectGrid"
import { ActivityFeed } from "../components/dashboard/ActivityFeed"
import { ProfileSection } from "../components/dashboard/ProfileSection"
import { BlogSidebar } from "../components/blog/BlogSidebar"
import { Navigate } from "react-router-dom"
import { useState, useEffect } from "react"

export default function Dashboard() {
  const { user, loading } = useAuth()
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    return () => observer.disconnect()
  }, [])

  if (loading) return <div className="grid place-items-center h-screen" style={{ backgroundColor: '#152040', color: 'white' }}>Cargando...</div>
  if (!user) return <Navigate to="/form" replace />

  return (
    <div className="flex min-h-screen">
      {/* Sidebar de navegación */}
      <BlogSidebar />

      {/* Contenido principal del Dashboard - SIN la sidebar interna */}
      <main className="flex-1">
        <div className={`min-h-screen relative overflow-hidden ${isDark ? "bg-[#152040]" : "bg-gradient-to-br from-blue-50 via-white to-gray-50"}`}>
          <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
            <WelcomeHeader user={user} isDark={isDark} />
            <StatsCards isDark={isDark} />
            <div className="grid md:grid-cols-2 gap-8">
              <ProjectGrid isDark={isDark} />
              <ActivityFeed isDark={isDark} />
            </div>
            <ProfileSection user={user} isDark={isDark} />
          </div>
        </div>
      </main>
    </div>
  )
}