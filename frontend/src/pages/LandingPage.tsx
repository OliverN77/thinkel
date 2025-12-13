import { Navbar } from "../components/shared/Navbar"
import { Hero } from "../components/landing/Hero"
import { Features } from "../components/landing/Features"
import { HowItWorks } from "../components/landing/HowItWorks"
import { Testimonials } from "../components/landing/Testimonials"
import { CTA } from "../components/landing/CTA"
import { Contact } from "../components/landing/Contact"
import { Footer } from "../components/landing/Footer"

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}