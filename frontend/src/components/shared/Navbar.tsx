"use client"

import { useState, useEffect } from "react"
import { Button } from "./Button"
import { ThemeToggle } from "./ThemeToggle"
import { Menu, X } from "lucide-react"
import { Link } from "react-router-dom"

const navItems = [
  { label: "Caracteristicas", href: "#caracteristicas" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Contacto", href: "#contacto" },
  { label: "Unete", href: "/form" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg"
          : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="text-xl font-bold text-foreground tracking-tight hover:scale-105 transition-transform duration-300 gradient-text"
          >
            Thinkel
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-12">
            {navItems.map((item, index) =>
              item.href.startsWith("#") ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110 relative group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-110 relative group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
                </Link>
              )
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link to="/form">
              <Button
                size="sm"
                className="text-sm hover:scale-105 transition-all duration-300 glow-accent"
              >
                Comenzar
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:scale-110 transition-transform duration-300"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile panel */}
      {isOpen && (
        <div className="md:hidden border-t border-border/50 glass animate-fade-in-down">
          <div className="px-6 py-6 space-y-6">
            <div className="flex flex-col gap-4">
              {navItems.map((item, index) =>
                item.href.startsWith("#") ? (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
                  </a>
                ) : (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 relative group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-300" />
                  </Link>
                )
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2">
                <span className="text-sm text-muted-foreground">Tema</span>
                <ThemeToggle />
              </div>
              <Link to="/form">
                <Button className="w-full hover:scale-105 transition-all duration-300 glow-accent">
                  Comenzar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}