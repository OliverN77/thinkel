import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import "./index.css"
// @ts-ignore: no type declarations for 'aos'
import AOS from "aos"
import "aos/dist/aos.css"

AOS.init({
  duration: 800,
  easing: "ease-out-cubic",
  once: false,
  mirror: true,
  offset: 100,
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
