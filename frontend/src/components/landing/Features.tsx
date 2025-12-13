"use client"

import { Brain, PenTool, Users, Rocket, BookOpen, Search } from "lucide-react";
import { motion } from "framer-motion"

const features = [
  {
    icon: Brain,
    title: "Inteligencia Artificial Integrada",
    description:
      "Genera ideas, resúmenes y artículos con asistencia inteligente en tiempo real.",
    color: "text-yellow-500",
  },
  {
    icon: PenTool,
    title: "Editor Intuitivo",
    description:
      "Escribe y da formato a tus artículos fácilmente con una interfaz moderna y fluida.",
    color: "text-blue-500",
  },
  {
    icon: BookOpen,
    title: "Aprendizaje Colaborativo",
    description:
      "Explora publicaciones de otros estudiantes y aprende compartiendo conocimiento.",
    color: "text-purple-500",
  },
  {
    icon: Users,
    title: "Comunidad Estudiantil",
    description:
      "Conecta con otros estudiantes que comparten tus intereses académicos.",
    color: "text-green-500",
  },
  {
    icon: Search,
    title: "Búsqueda Inteligente",
    description:
      "Encuentra rápidamente artículos y temas relevantes con IA semántica.",
    color: "text-cyan-500",
  },
  {
    icon: Rocket,
    title: "Crea y Publica al Instante",
    description:
      "Publica tus artículos con un clic y compártelos con todo el mundo.",
    color: "text-pink-500",
  },
];


const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const itemVariants: any = {
  hidden: { opacity: 0, y: 50, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
}

export function Features() {
  return (
    <section id="caracteristicas" className="py-24 px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20" data-aos="fade-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Todo lo que necesitas</h2>
          <p className="text-lg text-muted-foreground">No hay excusas para no aprender.</p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                rotate: [0, -2, 2, 0],
                transition: { duration: 0.3 },
              }}
              className="text-center group cursor-default"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="relative w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-6 glass"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient-x bg-[length:200%_auto]" />
                <feature.icon className={`h-7 w-7 ${feature.color} relative z-10`} />
              </motion.div>
              <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
