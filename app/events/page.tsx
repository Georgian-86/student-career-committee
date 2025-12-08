"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Filter } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedCard } from "@/components/animated-card"
import { fetchEvents } from "@/lib/supabase/database"

interface Event {
  id: string
  title: string
  date: string
  location: string
  description: string
  image_url?: string
  category?: string
  is_live?: boolean
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'previous'>('all')
  const router = useRouter()

  // Separate events into upcoming and previous
  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date())
  const previousEvents = events.filter(event => new Date(event.date) < new Date())
  
  // Sort upcoming events: live events first, then by date
  const sortedUpcomingEvents = [...upcomingEvents].sort((a, b) => {
    if (a.is_live && !b.is_live) return -1
    if (!a.is_live && b.is_live) return 1
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  // Get filtered events based on filter state
  const getFilteredEvents = () => {
    switch (filter) {
      case 'upcoming':
        return sortedUpcomingEvents
      case 'previous':
        return previousEvents
      default:
        return events
    }
  }

  const filteredEvents = getFilteredEvents()

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      try {
        const data = await fetchEvents()
        setEvents(data || [])
      } catch (error) {
        console.error('Error loading events:', error)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }
    loadEvents()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-accent" />
          <p className="mt-4 text-muted">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-indigo-900/20 dark:from-purple-900/40 dark:via-pink-900/40 dark:to-indigo-900/40">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23A855F7' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-indigo-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16 relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-indigo-500 rounded-full animate-pulse"></div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent animate-gradient bg-300">
              SCC Events
            </h1>
            <div className="h-1 w-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full animate-pulse"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join us for transformative experiences! Discover workshops, talks, and networking opportunities that will shape your career journey and unlock your potential.
            </p>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500/20 rounded-full animate-bounce delay-300"></div>
            <div className="absolute -top-8 -right-8 w-6 h-6 bg-indigo-500/20 rounded-full animate-bounce delay-500"></div>
            <div className="absolute -bottom-4 left-8 w-4 h-4 bg-pink-500/20 rounded-full animate-bounce delay-700"></div>
          </div>
        </ScrollReveal>

        {/* Filter Toggle */}
        <ScrollReveal delay={100}>
          <div className="flex justify-center mb-12">
            <div className="inline-flex items-center gap-2 p-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-purple-200 dark:border-purple-700/30">
              <Filter className="w-4 h-4 text-purple-600 dark:text-purple-400 ml-2" />
              <div className="flex gap-1">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    filter === 'all'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  All Events
                </button>
                <button
                  onClick={() => setFilter('upcoming')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    filter === 'upcoming'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setFilter('previous')}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    filter === 'previous'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                  }`}
                >
                  Previous
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Events Display */}
        <ScrollReveal delay={200}>
          {filteredEvents.length > 0 ? (
            <div>
              {/* Section Headers */}
              {filter === 'all' && upcomingEvents.length > 0 && (
                <div className="mb-16">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="relative">
                      <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                      <div className="absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Our Upcoming Events
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-green-500/50 to-transparent"></div>
                    <div className="flex gap-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                      <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse delay-200"></span>
                      <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-400"></span>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedUpcomingEvents.map((event, idx) => (
                      <AnimatedCard
                        key={event.id}
                        delay={idx * 100}
                        className="glass overflow-hidden rounded-3xl group h-full flex flex-col shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md relative ring-2 ring-green-500/20 hover:ring-green-500/40"
                        variant="glow"
                      >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                        
                        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30">
                          <img
                            src={event.image_url || "/placeholder.svg?height=300&width=400&query=event"}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <div className="absolute top-4 right-4">
                            <div className="px-4 py-2 bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-sm text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2 border border-white/20 hover:scale-105 transition-transform duration-200">
                              <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span>
                              {event.is_live ? 'Live Now' : 'Upcoming'}
                            </div>
                          </div>
                        </div>
                        <div className="p-7 flex flex-col flex-grow">
                          <h3 className="text-2xl font-bold mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 line-clamp-2 leading-tight">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 flex-grow leading-relaxed text-lg">
                            {event.description}
                          </p>

                          <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                              <span className="font-medium">{event.location}</span>
                            </div>
                          </div>

                          <Button 
                            onClick={() => router.push(`/events/${event.id}`)}
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn" 
                            size="lg"
                          >
                            <span className="group-hover/btn:translate-x-1 transition-transform duration-300">Learn More</span>
                          </Button>
                        </div>
                      </AnimatedCard>
                    ))}
                  </div>
                </div>
              )}

              {(filter === 'all' && previousEvents.length > 0) || filter === 'previous' ? (
                <div>
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {filter === 'previous' ? 'Previous Events' : 'Our Previous Events'}
                    </h2>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent"></div>
                    <div className="flex gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                      <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-200"></span>
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-400"></span>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {(filter === 'previous' ? previousEvents : previousEvents).map((event, idx) => (
                      <AnimatedCard
                        key={event.id}
                        delay={idx * 100}
                        className="glass overflow-hidden rounded-3xl group h-full flex flex-col shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md opacity-90 hover:opacity-100 relative"
                        variant="glow"
                      >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                        
                        <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-100 to-indigo-100 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-indigo-900/30">
                          <img
                            src={event.image_url || "/placeholder.svg?height=300&width=400&query=event"}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <div className="absolute top-4 right-4">
                            <div className="px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-purple-600 dark:text-purple-400 text-sm font-bold rounded-full shadow-lg border border-purple-200 dark:border-purple-700/30 hover:scale-105 transition-transform duration-200">
                              {event.category || 'Event'}
                            </div>
                          </div>
                        </div>
                        <div className="p-7 flex flex-col flex-grow">
                          <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300 line-clamp-2 leading-tight">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 flex-grow leading-relaxed text-lg">
                            {event.description}
                          </p>

                          <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                                <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="font-medium">{event.location}</span>
                            </div>
                          </div>

                          <Button 
                            onClick={() => router.push(`/events/${event.id}`)}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn" 
                            size="lg"
                          >
                            <span className="group-hover/btn:translate-x-1 transition-transform duration-300">Learn More</span>
                          </Button>
                        </div>
                      </AnimatedCard>
                    ))}
                  </div>
                </div>
              ) : null}

              {filter === 'upcoming' && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sortedUpcomingEvents.map((event, idx) => (
                    <AnimatedCard
                      key={event.id}
                      delay={idx * 100}
                      className="glass overflow-hidden rounded-3xl group h-full flex flex-col shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md relative ring-2 ring-green-500/20 hover:ring-green-500/40"
                      variant="glow"
                    >
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                      
                      <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30">
                        <img
                          src={event.image_url || "/placeholder.svg?height=300&width=400&query=event"}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="absolute top-4 right-4">
                          <div className="px-4 py-2 bg-gradient-to-r from-green-500/90 to-emerald-500/90 backdrop-blur-sm text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2 border border-white/20 hover:scale-105 transition-transform duration-200">
                            <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></span>
                            {event.is_live ? 'Live Now' : 'Upcoming'}
                          </div>
                        </div>
                      </div>
                      <div className="p-7 flex flex-col flex-grow">
                        <h3 className="text-2xl font-bold mb-4 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 line-clamp-2 leading-tight">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 flex-grow leading-relaxed text-lg">
                          {event.description}
                        </p>

                        <div className="space-y-4 mb-6">
                          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                              <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="font-medium">{new Date(event.date).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                              <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <span className="font-medium">{event.location}</span>
                          </div>
                        </div>

                        <Button 
                          onClick={() => router.push(`/events/${event.id}`)}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn" 
                          size="lg"
                        >
                          <span className="group-hover/btn:translate-x-1 transition-transform duration-300">Learn More</span>
                        </Button>
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Empty States */
            <div className="text-center py-32 relative">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 bg-gradient-to-br from-purple-200/20 to-pink-200/20 dark:from-purple-900/20 dark:to-pink-900/20 rounded-full blur-3xl animate-pulse"></div>
              </div>
              
              <div className="relative z-10 max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-8 relative group">
                  <Calendar className="w-12 h-12 text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                  {/* Floating Elements */}
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500/30 rounded-full animate-bounce"></div>
                  <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-500/30 rounded-full animate-bounce delay-300"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {filter === 'upcoming' ? 'No Upcoming Events' : filter === 'previous' ? 'No Previous Events' : 'No Events Yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                  {filter === 'upcoming' 
                    ? 'No upcoming events scheduled at the moment. Check back soon for exciting opportunities!'
                    : filter === 'previous'
                    ? 'No previous events to display. Our upcoming events will be shown here!'
                    : 'Get ready for amazing experiences! We\'re planning exciting events, workshops, and networking opportunities that you won\'t want to miss.'
                  }
                </p>
                <div className="flex justify-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-200"></span>
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse delay-400"></span>
                </div>
              </div>
            </div>
          )}
        </ScrollReveal>
      </div>
    </div>
  )
}
