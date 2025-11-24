"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { loadData } from "@/lib/storage"

interface Announcement {
  id: string
  title: string
  content: string
  category: string
  date: string
  image?: string
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = loadData<Announcement[]>("sccAnnouncements", [])
    setAnnouncements(saved)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-accent" />
          <p className="mt-4 text-muted">Loading announcements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-balance">Announcements</h1>
        <p className="text-xl text-muted mb-12">Stay updated with latest news and opportunities</p>

        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="glass p-6 hover:neon-glow transition-all">
              <div className="flex gap-4">
                {announcement.image && (
                  <img
                    src={announcement.image || "/placeholder.svg"}
                    alt={announcement.title}
                    className="h-32 w-32 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold mb-1">{announcement.title}</h3>
                      <div className="inline-block px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                        {announcement.category}
                      </div>
                    </div>
                  </div>

                  <p className="text-muted mb-3">{announcement.content}</p>

                  <div className="flex items-center gap-2 text-sm text-muted">
                    <Calendar className="w-4 h-4" />
                    {new Date(announcement.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">No announcements to display. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
