import { Routes, Route } from "react-router-dom"
import { Navbar } from "./components/shared/Navbar"
import { Hero } from "./components/landing/Hero"
import { Features } from "./components/landing/Features"
import { HowItWorks } from "./components/landing/HowItWorks"
import { CTA } from "./components/landing/CTA"
import { Testimonials } from "./components/landing/Testimonials"
import { Contact } from "./components/landing/Contact"
import { Footer } from "./components/landing/Footer"
import FormPage from "./pages/Form"
import Dashboard from "./pages/Dashboard"
import { Blog } from "./pages/Blog"
import { BlogPostPage } from "./pages/BlogPostPage"
import { CreatePost } from "./pages/CreatePost"
import { EditPost } from "./pages/EditPost"
import Favorites from "./pages/Favorites"
import Saved from "./pages/Saved"
import Profile from "./pages/Profile"

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Landing y páginas principales - sin sidebar */}
      <Route path="/" element={<Home />} />
      <Route path="/form" element={<FormPage />} />
      
      {/* Dashboard - SIN Layout, ya tiene su propia BlogSidebar */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Blog routes */}
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPostPage />} />
      <Route path="/blog/create" element={<CreatePost />} />
      <Route path="/blog/edit/:id" element={<EditPost />} />
      
      {/* Favorites and Saved */}
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/saved" element={<Saved />} />
      
      {/* Profile */}
      <Route path="/profile/:username" element={<Profile />} />
    </Routes>
  )
}