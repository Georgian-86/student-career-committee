"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, Users, ArrowLeft, User, MessageSquare } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedCard } from "@/components/animated-card"
import { fetchEvents } from "@/lib/supabase/database"

interface Event {
  id: string
  title: string
  date: string
  location: string
  description: string
  category?: string
  image_url?: string
  attendees?: number
  outcome?: string
  guest_feedback?: string
  student_feedback?: string
  guests?: string[]
  is_live?: boolean
  gallery_images?: string[]
}

export default function EventDetail() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadEvent = async () => {
      setLoading(true)
      try {
        const events = await fetchEvents()
        const foundEvent = events.find(e => e.id === params.id)
        
        if (foundEvent) {
          console.log('Found event:', foundEvent)
          
          // Load additional data from localStorage if available
          let additionalData: any = {}
          if (typeof window !== 'undefined') {
            const eventExtraData = JSON.parse(localStorage.getItem('eventExtraData') || '{}')
            const eventId = Array.isArray(params.id) ? params.id[0] : params.id || ''
            additionalData = eventExtraData[eventId] || {}
          }
          
          console.log('Additional data from localStorage:', additionalData)
          
          // Merge the event data with additional data
          const mergedEvent = {
            ...foundEvent,
            ...additionalData
          }
          
          console.log('Merged event data:', mergedEvent)
          console.log('Gallery images:', mergedEvent.gallery_images)
          
          setEvent(mergedEvent)
        } else {
          setEvent(null)
        }
      } catch (error) {
        console.error('Error loading event:', error)
        setEvent(null)
      } finally {
        setLoading(false)
      }
    }
    loadEvent()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-accent" />
          <p className="mt-4 text-muted">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-muted mb-6">The event you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/events')}>
            Back to Events
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <ScrollReveal>
          <Button 
            variant="outline" 
            onClick={() => router.push('/events')}
            className="mb-8 flex items-center gap-2 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </Button>
        </ScrollReveal>

        {/* Event Header */}
        <ScrollReveal delay={100}>
          <div className="text-center mb-12">
            {event.image_url && (
              <div className="mb-8">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-64 object-cover rounded-2xl shadow-xl"
                />
              </div>
            )}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {event.title}
            </h1>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              {event.is_live && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full font-medium shadow-lg">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Live Event
                </span>
              )}
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                {event.category || 'Event'}
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium">
                <Calendar className="w-4 h-4" />
                {new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium">
                <MapPin className="w-4 h-4" />
                {event.location}
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Event Description */}
        <ScrollReveal delay={200}>
          <AnimatedCard className="mb-8" variant="glow">
            <Card className="glass p-8 shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
              <h2 className="text-2xl font-bold mb-4">About This Event</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </Card>
          </AnimatedCard>
        </ScrollReveal>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Attendees */}
          {event.attendees && (
            <ScrollReveal delay={300}>
              <AnimatedCard variant="glow">
                <Card className="glass p-6 shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-xl font-bold">Attendees</h3>
                  </div>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {event.attendees}+
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Students participated</p>
                </Card>
              </AnimatedCard>
            </ScrollReveal>
          )}

          {/* Guest Speakers */}
          {event.guests && event.guests.length > 0 && (
            <ScrollReveal delay={400}>
              <AnimatedCard variant="glow">
                <Card className="glass p-6 shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-xl font-bold">Guest Speakers</h3>
                  </div>
                  <div className="space-y-2">
                    {event.guests.map((guest, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">{guest}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </AnimatedCard>
            </ScrollReveal>
          )}
        </div>

        {/* Event Outcome */}
        {event.outcome && (
          <ScrollReveal delay={500}>
            <AnimatedCard className="mt-8" variant="glow">
              <Card className="glass p-8 shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-4">Event Outcome</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {event.outcome}
                </p>
              </Card>
            </AnimatedCard>
          </ScrollReveal>
        )}

        {/* Feedback Section */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Guest Feedback */}
          {event.guest_feedback && (
            <ScrollReveal delay={600}>
              <AnimatedCard variant="glow">
                <Card className="glass p-6 shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-xl font-bold">Guest Feedback</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {event.guest_feedback}
                  </p>
                </Card>
              </AnimatedCard>
            </ScrollReveal>
          )}

          {/* Student Feedback */}
          {event.student_feedback && (
            <ScrollReveal delay={700}>
              <AnimatedCard variant="glow">
                <Card className="glass p-6 shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                    <h3 className="text-xl font-bold">Student Feedback</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {event.student_feedback}
                  </p>
                </Card>
              </AnimatedCard>
            </ScrollReveal>
          )}
        </div>

        {/* Event Highlights Gallery - Moved to bottom */}
        {event?.gallery_images && Array.isArray(event.gallery_images) && event.gallery_images.length > 0 && (
          <ScrollReveal delay={800}>
            <div className="mt-12">
              <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Event Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {event.gallery_images.map((image, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                    onClick={() => {
                      // Simple image preview - you can enhance this with a modal
                      window.open(image, '_blank')
                    }}
                  >
                    <div className="aspect-square overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                      <img
                        src={image}
                        alt={`Event highlight ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-sm font-medium">
                          Click to view full size
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}
      </div>
    </div>
  )
}
