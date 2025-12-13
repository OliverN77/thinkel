"use client"

import { useState } from "react"
import type { User } from "../../types"
import { SettingsModal } from "./SettingsModal"
import { motion } from "framer-motion"
import { Settings, LogOut } from "lucide-react"
import { ThemeToggle } from "../shared/ThemeToggle"
import { useNavigate } from "react-router-dom"

interface Props {
  user: User
  isDark: boolean
}

export function ProfileSection({ user, isDark }: Props) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
      localStorage.removeItem("token")
      navigate("/form")
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-xl p-5 backdrop-blur-sm border transition-colors duration-300 ${
          isDark 
            ? "bg-gray-800/60 border-gray-700" 
            : "bg-white/80 border-gray-200"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
              Mi perfil
            </h3>
            <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {user.email}
            </p>
          </div>
          <ThemeToggle />
        </div>
        
        <div className="flex gap-5">
          <button
            onClick={() => setOpen(true)}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:scale-105 border max-w-95 ${
              isDark 
                ? "bg-gray-700 text-white border-gray-600 hover:bg-gray-600" 
                : "bg-gray-100 text-gray-900 border-gray-300 hover:bg-gray-200"
            }`}
          >
            <Settings className="w-4 h-4" />
            Ajustes
          </button>
          
          <button
            onClick={handleLogout}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all hover:scale-105 border max-w-95 ${
              isDark 
                ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30" 
                : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
            }`}
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </motion.div>

      <SettingsModal open={open} onClose={() => setOpen(false)} user={user} />
    </>
  )
}
