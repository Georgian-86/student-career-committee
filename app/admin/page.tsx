"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/AuthProvider"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import TeamManager from "./components/team-manager"
import EventsManager from "./components/events-manager"
import GalleryManager from "./components/gallery-manager"
import AnnouncementsManager from "./components/announcements-manager"
import MessagesManager from "./components/messages-manager"
import ProjectsManager from "./components/projects-manager"
import AboutManager from "./components/about-manager"

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("team")
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Handle redirects in useEffect to prevent render phase updates
  useEffect(() => {
    if (!loading && !user) {
      setIsRedirecting(true)
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-accent" />
        </div>
      </div>
    )
  }

  if (!user || isRedirecting) {
    return null
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/login")
  }

  const tabs = [
    { id: "team", label: "Team" },
    { id: "events", label: "Events" },
    { id: "projects", label: "Projects" },
    { id: "about", label: "About" },
    { id: "gallery", label: "Gallery" },
    { id: "announcements", label: "Announcements" },
    { id: "messages", label: "Messages" },
  ]

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-1">Admin Dashboard</h1>
            <p className="text-muted">Welcome, {user.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2 bg-transparent">
            <span className="text-lg">↪️</span>
            Logout
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id ? "text-primary border-b-2 border-primary" : "text-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === "team" && <TeamManager />}
          {activeTab === "events" && <EventsManager />}
          {activeTab === "projects" && <ProjectsManager />}
          {activeTab === "about" && <AboutManager />}
          {activeTab === "gallery" && <GalleryManager />}
          {activeTab === "announcements" && <AnnouncementsManager />}
          {activeTab === "messages" && <MessagesManager />}
        </div>
      </div>
    </div>
  )
}
