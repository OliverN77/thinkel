"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../shared/Button"
import { Input } from "../shared/Input"
import { Textarea } from "../shared/Textarea"
import { sendContactMessage } from "../../services/contact.service"

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    try {
      await sendContactMessage(formData)
      setSuccess(true)
      setFormData({ name: "", email: "", message: "" })
      
      // Ocultar mensaje de éxito después de 5 segundos
      setTimeout(() => setSuccess(false), 5000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al enviar el mensaje. Por favor, intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <section id="contacto" className="py-24 px-6 lg:px-8 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 gradient-text">
            Conéctate con nosotros
          </h2>
          <p className="text-lg text-muted-foreground">
            ¿Tienes dudas, sugerencias o quieres colaborar con Thinkel?
            Escríbenos y te responderemos lo antes posible.
          </p>
        </div>

        {/* Formulario centrado */}
        <div className="max-w-2xl mx-auto">
          {/* Mensaje de éxito */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">
                ✅ ¡Mensaje enviado exitosamente! Te responderemos pronto.
              </p>
            </div>
          )}

          {/* Mensaje de error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium">❌ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 space-y-6 glow hover:glow-accent transition-all duration-500">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-foreground mb-2">
                Nombre
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                className="bg-background/50 border-primary/20 focus:border-primary focus:ring-primary/50 transition-all"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                Correo electrónico
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="tucorreo@ejemplo.com"
                className="bg-background/50 border-primary/20 focus:border-primary focus:ring-primary/50 transition-all"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-foreground mb-2">
                Mensaje
              </label>
              <Textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Cuéntanos cómo podemos ayudarte o qué te gustaría ver en Thinkel..."
                rows={6}
                className="bg-background/50 border-primary/20 focus:border-primary focus:ring-primary/50 transition-all resize-none"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-primary via-accent to-secondary bg-[length:200%_100%] hover:bg-right transition-all duration-700 text-primary-foreground font-bold py-6 shadow-xl hover:shadow-2xl hover:shadow-accent/50 hover:scale-[1.03] active:scale-[0.98] transform-gpu disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Enviando..." : "Enviar mensaje"}
                {!loading && (
                  <svg
                    className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                )}
              </span>

              {/* Efecto de brillo animado */}
              {!loading && (
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
