"use client"

import { Star } from "lucide-react"
import { motion } from "framer-motion"

const testimonials = [
  {
    content:
      "Thinkel me ha ayudado a organizar mis ideas y escribir artículos con la ayuda de la IA. Ahora estudio y creo contenido más rápido y con mejor estructura.",
    rating: 5,
  },
  {
    content:
      "Gracias a Thinkel, puedo generar borradores de ensayos, mejorar mi redacción y descubrir nuevos enfoques para mis proyectos universitarios.",
    rating: 5,
  },
  {
    content:
      "Lo que más me gusta de Thinkel es que combina la creatividad humana con la inteligencia artificial. Es como tener un asistente académico que entiende lo que necesito.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section id="testimonios" className="py-24 px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20" data-aos="fade-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Amado por estudiantes y creadores
          </h2>
          <p className="text-lg text-muted-foreground">
            Únete a cientos de estudiantes que confían en Thinkel para aprender, compartir y crecer junto a la inteligencia artificial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, rotateY: -90 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{
                duration: 0.8,
                delay: index * 0.2,
                ease: "easeOut",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                transition: { duration: 0.3 },
              }}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="p-8 rounded-lg border border-border bg-card"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.2 + 0.3 }}
                className="flex gap-1 mb-6"
              >
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: index * 0.2 + 0.4 + i * 0.1,
                      type: "spring",
                    }}
                  >
                    <Star className="h-4 w-4 fill-accent text-accent" />
                  </motion.div>
                ))}
              </motion.div>

              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

  )
}
