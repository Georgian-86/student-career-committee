"use client"

import { type ReactNode, useEffect, useState } from "react"

interface ThemeProviderProps {
  children: ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "dark",
  enableSystem = true,
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState(defaultTheme)

  useEffect(() => {
    setMounted(true)

    // Get saved theme from localStorage
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else if (enableSystem) {
      // Detect system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const systemTheme = prefersDark ? "dark" : "light"
      setTheme(systemTheme)
      document.documentElement.classList.toggle("dark", prefersDark)
    } else {
      document.documentElement.classList.toggle("dark", defaultTheme === "dark")
    }
  }, [defaultTheme, enableSystem])

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  if (!mounted) return <>{children}</>

  return <>{children}</>
}
