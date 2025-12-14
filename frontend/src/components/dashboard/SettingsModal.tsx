"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import type { FormEvent } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { User } from "../../types"
import { X, UserIcon, Mail, Lock, Upload } from "lucide-react"

interface Props {
  open: boolean
  onClose: () => void
  user: User
}

export function SettingsModal({ open, onClose, user }: Props) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState(user.bio || "")
  const [preview, setPreview] = useState(
    user.avatar 
      ? (user.avatar.startsWith('http') 
          ? user.avatar 
          : `https://thinkel.onrender.com${user.avatar}`)
      : `https://ui-avatars.com/api/?name=${user.name}&background=random`,
  )
  const [isDark, setIsDark] = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }
    
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    
    return () => observer.disconnect()
  }, [])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const form = new FormData()
    form.append("name", name)
    form.append("email", email)
    form.append("bio", bio)
    if (password) form.append("password", password)
    if (fileRef.current?.files?.[0]) form.append("avatar", fileRef.current.files[0])

    try {      
      alert("Perfil actualizado correctamente")
      onClose()
      
      // Emitir evento personalizado para que otros componentes se actualicen
      window.dispatchEvent(new Event('profile-updated'))
    } catch (err: any) {
      console.error('Error al actualizar:', err)
      alert(err.response?.data?.message || "Error al actualizar el perfil")
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center p-4"
          style={{ 
            content: '',
            position: 'relative',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100dvw',
            height: '100dvh'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className={`rounded-2xl shadow-2xl w-full max-w-md border transition-colors duration-300 ${
              isDark 
                ? "bg-[#011140]/95 border-gray-700" 
                : "bg-white/95 border-gray-300"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="flex justify-between items-center">
                <h2 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                  Ajustes de perfil
                </h2>
                <button 
                  type="button" 
                  onClick={onClose} 
                  className={`hover:opacity-70 transition-opacity ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col items-center gap-3">
                <img
                  src={preview || "/placeholder.svg"}
                  alt={name || "Avatar"}
                  className={`w-24 h-24 rounded-full object-cover border-2 ${
                    isDark ? "border-blue-400" : "border-blue-600"
                  }`}
                />
                <label className={`flex items-center gap-2 text-sm cursor-pointer hover:opacity-80 transition-opacity ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}>
                  <Upload className="w-4 h-4" />
                  Cambiar foto
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
              </div>

              <div>
                <label className={`block text-sm mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Nombre
                </label>
                <div className="relative">
                  <UserIcon
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border outline-none transition-colors ${
                      isDark 
                        ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-400" 
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Correo
                </label>
                <div className="relative">
                  <Mail
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border outline-none transition-colors ${
                      isDark 
                        ? "bg-gray-800/50 border-gray-600 text-white focus:border-blue-400" 
                        : "bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Biografía
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Cuéntanos sobre ti..."
                  rows={3}
                  maxLength={500}
                  className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors resize-none ${
                    isDark 
                      ? "bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-400" 
                      : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                  }`}
                />
                <p className={`text-xs mt-1 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}>
                  {bio.length}/500 caracteres
                </p>
              </div>

              <div>
                <label className={`block text-sm mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  Nueva contraseña (opcional)
                </label>
                <div className="relative">
                  <Lock
                    className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Dejar vacío para mantener la actual"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border outline-none transition-colors ${
                      isDark 
                        ? "bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-400" 
                        : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500"
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 ${
                  isDark 
                    ? "bg-blue-500 hover:bg-blue-600 text-white" 
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Guardar cambios
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
