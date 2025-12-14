"use client"

import { motion } from "framer-motion"
import type { User } from "../../types"

interface Props {
  user: User
  isDark: boolean
}

export function WelcomeHeader({ user, isDark }: Props) {
  const getAvatarUrl = () => {
    if (!user.avatar) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`
    }
    return user.avatar.startsWith('http') ? user.avatar : `https://thinkel.onrender.com${user.avatar}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4"
    >
      <img
        src={getAvatarUrl()}
        alt={user.name}
        className={`w-14 h-14 rounded-full border-2 object-cover ${isDark ? "border-blue-400" : "border-blue-600"}`}
      />
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
          Hola, {user.name} 👋
        </h1>
        <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          Aquí tienes un resumen de tu actividad.
        </p>
      </div>
    </motion.div>
  )
}
