"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    number: "01",
    title: "Crea tu cuenta",
    description: "Regístrate en Thinkel y personaliza tu perfil según tus intereses académicos.",
  },
  {
    number: "02",
    title: "Explora y aprende",
    description: "Descubre artículos impulsados por IA que se adaptan a tu nivel y área de estudio.",
  },
  {
    number: "03",
    title: "Comparte tu conocimiento",
    description: "Publica tus ideas, conecta con otros estudiantes y deja que la IA potencie tu aprendizaje.",
  },
]

export function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    stepsRef.current.forEach((step, index) => {
      gsap.fromTo(
        step,
        {
          opacity: 0,
          y: 100,
          scale: 0.8,
          rotateX: -45,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: step,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
            toggleActions: "play none none reverse",
          },
          delay: index * 0.2,
        },
      )

      const number = step.querySelector(".step-number")
      if (number) {
        gsap.fromTo(
          number,
          { scale: 0, rotation: -180 },
          {
            scale: 1,
            rotation: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: step,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }
    })
  }, [])

  return (
    <section id="como-funciona" className="py-24 px-6 lg:px-8 bg-muted/30" ref={sectionRef}>
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-20" data-aos="zoom-in">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">Comienza en minutos</h2>
          <p className="text-lg text-muted-foreground">Completa tus tareas en tres simples pasos.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) stepsRef.current[index] = el
              }}
              className="text-center perspective-1000"
            >
              <div className="step-number text-5xl font-bold text-primary/20 mb-6">{step.number}</div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
