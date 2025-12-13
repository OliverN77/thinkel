"use client"

import { Button } from "../shared/Button"
import { ArrowRight, Sparkles } from "lucide-react"
import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import gsap from "gsap"
import { Link } from "react-router-dom"

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    const blobs = document.querySelectorAll(".floating-blob")
    blobs.forEach((blob, index) => {
      gsap.to(blob, {
        y: "random(-50, 50)",
        x: "random(-30, 30)",
        duration: "random(3, 5)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.5,
      })
    })
  }, [])

  return (
    <motion.section ref={sectionRef} className="relative pt-40 pb-24 px-6 lg:px-8 overflow-hidden" style={{ opacity }}>
      <div className="absolute inset-0 -z-10">
        <div className="floating-blob absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="floating-blob absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="floating-blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <motion.div className="container mx-auto" style={{ y }}>
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border text-sm text-muted-foreground mb-12 glass"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
            Nuevas Características disponibles! Echa un vistazo a lo ultimo.
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight text-balance"
          >
            Ideas que estudian{" "}
            <motion.span
              className="gradient-text animate-gradient-x bg-[length:200%_auto]"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              contigo
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            El espacio donde la inteligencia artificial y el aprendizaje se unen para potenciar tu conocimiento.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/form">
                <Button size="lg" className="text-base px-8 group glow-accent hover:shadow-2xl">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.8,
                },
              },
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-3xl mx-auto pt-12 border-t border-border/50"
          >
            {[
              { value: "20+", label: "Days Saved" },
              { value: "98%", label: "Faster Deploy" },
              { value: "300%", label: "SEO Boost" },
              { value: "6x", label: "Performance" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, scale: 0.8 },
                  visible: { opacity: 1, scale: 1 },
                }}
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.3 }}
                className="cursor-default"
              >
                <div className="text-3xl font-bold text-foreground mb-1 gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  )
}
