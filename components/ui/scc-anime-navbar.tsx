"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Home, Users, Calendar, Image, Briefcase, Megaphone, Phone, Info, Sun, Moon } from "lucide-react"
import { AnimeNavBar } from "@/components/ui/anime-navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const sccNavItems = [
  {
    name: "Home",
    url: "/",
    icon: Home,
  },
  {
    name: "About",
    url: "/about",
    icon: Info,
  },
  {
    name: "Team",
    url: "/team",
    icon: Users,
  },
  {
    name: "Events",
    url: "/events",
    icon: Calendar,
  },
  {
    name: "Gallery",
    url: "/gallery",
    icon: Image,
  },
  {
    name: "Projects",
    url: "/projects",
    icon: Briefcase,
  },
  {
    name: "Announcements",
    url: "/announcements",
    icon: Megaphone,
  },
  {
    name: "Contact",
    url: "/contact",
    icon: Phone,
  },
]

export function SCCAnimeNavBar() {
  const [theme, setTheme] = useState("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      // Get saved theme from localStorage
      const savedTheme = localStorage.getItem("theme") || "dark"
      setTheme(savedTheme)
      document.documentElement.classList.remove("dark", "light")
      document.documentElement.classList.add(savedTheme)
    }
  }, [mounted])

  const toggleTheme = () => {
    console.log('Theme toggle clicked, current theme:', theme)
    const newTheme = theme === "dark" ? "light" : "dark"
    console.log('Setting new theme to:', newTheme)
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.remove("dark", "light")
    document.documentElement.classList.add(newTheme)
    console.log('Theme classes updated, document classList:', document.documentElement.classList.toString())
  }

  if (!mounted) return null

  return (
    <>
      <AnimeNavBar items={sccNavItems} defaultActive="Home" />
      
      {/* Theme Toggle and Admin Button */}
      <div className="fixed top-6 right-6 flex items-center gap-3 z-[10000]">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="bg-background/80 border border-border backdrop-blur-lg hover:bg-background/90 transition-colors relative"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        <Link href="/admin">
          <Button variant="outline" size="sm" className="bg-background/80 border border-border backdrop-blur-lg hover:bg-background/90 hover-scale relative">
            Admin
          </Button>
        </Link>
      </div>
    </>
  )
}
