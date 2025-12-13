"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, User, ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { ThemeToggle } from "../components/shared/ThemeToggle"
import { registerUser, loginUser } from "../services/auth.service"
import { useNavigate } from "react-router-dom"

export default function MinimalForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [isDark, setIsDark] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode = document.documentElement.classList.contains("dark")
      setIsDark(isDarkMode)
    }
    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true })
    return () => observer.disconnect()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        const res = await loginUser({ email, password })
        console.log('Login exitoso ✅', res.data)
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userId', res.data.user.id)
        alert('Inicio de sesión exitoso')
        navigate('/Blog')
      } else {
        const res = await registerUser({ name, email, password })
        console.log('Registrado ✅', res.data)
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('userId', res.data.user.id)
        alert('Usuario creado exitosamente')
        // Redirigir al login después de registrarse
        setIsLogin(true)
        setEmail("")
        setPassword("")
        setName("")
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message ||
        (isLogin ? 'Error al iniciar sesión' : 'Error al registrar')
      alert(errorMsg)
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const particles = Array.from({ length: 20 })

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? "bg-primary/10" : "bg-white"}`}>
      {/* Partículas */}
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-1 h-1 rounded-full opacity-40 ${isDark ? "bg-white" : "bg-gray-900"}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Back Button */}
      <motion.button
        onClick={() => window.history.back()}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="absolute top-6 left-6 z-20 p-2 rounded-full transition-colors"
        style={{
          backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        }}
      >
        <ArrowLeft className={`w-5 h-5 ${isDark ? "text-white" : "text-gray-900"}`} />
      </motion.button>

      {/* Toggle de tema */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      {/* Formulario */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-sm mx-auto flex flex-col justify-center h-screen px-6"
      >
        <motion.h1
          className={`text-4xl font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isLogin ? "Bienvenido de vuelta." : "Crear cuenta."}
        </motion.h1>
        <motion.p
          className={`text-sm mb-10 ${isDark ? "text-white/60" : "text-gray-600"}`}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isLogin ? "Inicia sesión para continuar." : "Vamos a empezar."}
        </motion.p>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? "login" : "signup"}
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
          >
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative"
              >
                <User className={`absolute left-0 top-2 w-5 h-5 ${isDark ? "text-white/40" : "text-gray-400"}`} />
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-8 pb-2 bg-transparent border-b placeholder-white/40 focus:outline-none transition-colors ${isDark
                      ? "border-white/20 text-white placeholder-white/40 focus:border-white"
                      : "border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-900"
                    }`}
                  required
                />
              </motion.div>
            )}

            <div className="relative">
              <Mail className={`absolute left-0 top-2 w-5 h-5 ${isDark ? "text-white/40" : "text-gray-400"}`} />
              <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-8 pb-2 bg-transparent border-b focus:outline-none transition-colors ${isDark
                    ? "border-white/20 text-white placeholder-white/40 focus:border-white"
                    : "border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-900"
                  }`}
                required
              />
            </div>

            <div className="relative">
              <Lock className={`absolute left-0 top-2 w-5 h-5 ${isDark ? "text-white/40" : "text-gray-400"}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-8 pr-10 pb-2 bg-transparent border-b focus:outline-none transition-colors ${isDark
                    ? "border-white/20 text-white placeholder-white/40 focus:border-white"
                    : "border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-900"
                  }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-0 top-2 ${isDark ? "text-white/40 hover:text-white/60" : "text-gray-400 hover:text-gray-600"} transition-colors`}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full mt-4 font-medium py-3 rounded-full flex items-center justify-center gap-2 ${isDark
                  ? "bg-white text-gray-900"
                  : "bg-black text-white"
                }`}
            >
              {loading ? (
                <div className={`w-5 h-5 border-2 border-t-transparent rounded-full animate-spin ${isDark ? "border-primary" : "border-white"
                  }`} />
              ) : (
                <>
                  {isLogin ? "Iniciar sesión" : "Crear cuenta"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.form>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setEmail("")
              setPassword("")
              setName("")
            }}
            className={`text-sm transition-colors ${isDark
                ? "text-white/60 hover:text-white"
                : "text-gray-600 hover:text-gray-900"
              }`}
          >
            {isLogin ? "¿No tienes cuenta? Crear una." : "¿Ya tienes cuenta? Inicia sesión."}
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}