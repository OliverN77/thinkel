import React from "react"
import { useInView } from "../../lib/useInView"

export function AnimateOnView({
  children,
  className = "",
  activeClass = "animate-fade-in-up opacity-100 translate-y-0",
  inactiveClass = "opacity-0 translate-y-6",
  threshold = 0.12,
  once = true,
}: {
  children: React.ReactNode
  className?: string
  activeClass?: string
  inactiveClass?: string
  threshold?: number
  once?: boolean
}) {
  const [ref, inView] = useInView<HTMLElement>({ threshold, once })
  return (
    <div ref={ref as any} className={`${className} ${inView ? activeClass : inactiveClass}`}>
      {children}
    </div>
  )
}