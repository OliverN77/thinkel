import React from 'react'

export function useInView<T extends Element = Element>(options?: IntersectionObserverInit & { once?: boolean }) {
  const ref = React.createRef<T>()
  const [inView, setInView] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true)
            if (options?.once && observer) observer.unobserve(entry.target)
          } else if (!options?.once) {
            setInView(false)
          }
        })
      },
      { threshold: options?.threshold ?? 0.12, root: options?.root ?? null, rootMargin: options?.rootMargin ?? "0px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref.current, options?.threshold, options?.root, options?.rootMargin, options?.once])

  return [ref, inView] as const
}