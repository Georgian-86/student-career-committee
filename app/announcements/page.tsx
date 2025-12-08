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
      try {
        const data = await fetchAnnouncements()
        console.log('Announcements data:', data)
        setAnnouncements(data || [])
      } catch (error) {
        console.error('Error loading announcements:', error)
        setAnnouncements([])
      } finally {
        setLoading(false)
      }
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
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 via-red-900/20 to-amber-900/20 dark:from-orange-900/40 dark:via-red-900/40 dark:to-amber-900/40">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F97316' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16 relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-orange-500 to-amber-500 rounded-full animate-pulse"></div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-orange-600 via-red-600 to-amber-600 bg-clip-text text-transparent animate-gradient bg-300">
              SCC Announcements
            </h1>
            <div className="h-1 w-24 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-pulse"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Stay connected with our vibrant community! Get the latest news, exciting opportunities, and important updates that shape your journey with the Student Career Committee.
            </p>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-500/20 rounded-full animate-bounce delay-300"></div>
            <div className="absolute -top-8 -right-8 w-6 h-6 bg-amber-500/20 rounded-full animate-bounce delay-500"></div>
            <div className="absolute -bottom-4 left-8 w-4 h-4 bg-red-500/20 rounded-full animate-bounce delay-700"></div>
          </div>
        </ScrollReveal>

        <div className="space-y-8">
          {announcements.map((announcement, idx) => (
            <AnimatedCard
              key={announcement.id}
              delay={idx * 100}
              className="glass overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md relative group"
              variant="glow"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              
              <div className="p-8">
                <div className="flex gap-8">
                  {announcement.image_url && (
                    <div className="flex-shrink-0 relative group/img">
                      <img
                        src={announcement.image_url}
                        alt={announcement.title}
                        className="h-36 w-36 object-cover rounded-2xl shadow-lg group-hover/img:scale-105 transition-transform duration-500"
                      />
                      {/* Image Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 to-transparent rounded-2xl opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  )}
                  <div className="flex-1 relative">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-4 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300 leading-tight">
                          {announcement.title}
                        </h3>
                        <div className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-700 dark:text-orange-300 rounded-full font-medium border border-orange-200 dark:border-orange-700/30 hover:scale-105 transition-transform duration-200">
                          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                          {announcement.category}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 leading-relaxed text-lg">
                      {announcement.content}
                    </p>

                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                        <Calendar className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">
                          {new Date(announcement.date).toLocaleDateString('en-US', { 
                            weekday: 'short',
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse"></span>
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse delay-200"></span>
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse delay-400"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="text-center py-32 relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-orange-200/20 to-amber-200/20 dark:from-orange-900/20 dark:to-amber-900/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            <div className="relative z-10 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-8 relative group">
                <svg className="w-12 h-12 text-orange-500 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                {/* Floating Elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500/30 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-amber-500/30 rounded-full animate-bounce delay-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                No Announcements Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                Stay tuned for exciting updates! We're preparing important announcements and opportunities that you won't want to miss.
              </p>
              <div className="flex justify-center gap-2">
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse delay-200"></span>
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse delay-400"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
