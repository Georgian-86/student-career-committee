"use client"

import { useState, useEffect } from "react"
import { Calendar } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedCard } from "@/components/animated-card"
import { Card } from "@/components/ui/card"
import { fetchAnnouncements } from "@/lib/supabase/database"

interface Announcement {
  id: string
  title: string
  content: string
  category: string
  date: string
  image_url?: string
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadAnnouncements = async () => {
      setLoading(true)
      const data = await fetchAnnouncements()
      setAnnouncements(data)
      setLoading(false)
    }
    loadAnnouncements()
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
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-orange-900/20">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              SCC Announcements
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Stay updated with the latest news, opportunities, and important updates from the Student Career Committee
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-6">
          {announcements.map((announcement, idx) => (
            <AnimatedCard
              key={announcement.id}
              delay={idx * 100}
              className="glass overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md"
              variant="glow"
            >
              <div className="p-6">
                <div className="flex gap-6">
                  {announcement.image_url && (
                    <div className="flex-shrink-0">
                      <img
                        src={announcement.image_url}
                        alt={announcement.title}
                        className="h-32 w-32 object-cover rounded-xl shadow-md"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {announcement.title}
                        </h3>
                        <div className="inline-block px-3 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full font-medium mb-4">
                          {announcement.category}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {announcement.content}
                    </p>

                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">
                        {new Date(announcement.date).toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No Announcements Yet</h3>
              <p className="text-gray-600 dark:text-gray-300">No announcements to display. Check back soon for the latest news and updates!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
