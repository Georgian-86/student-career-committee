"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedCard } from "@/components/animated-card"
import { loadData } from "@/lib/storage"

interface Event {
  id: string
  title: string
  date: string
  location: string
  description: string
  image?: string
  category: string
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const saved = loadData<Event[]>("sccEvents", [])
    setEvents(saved)
    setLoading(false)
  }, [])

  const categories = ["all", "Talk", "Workshop", "Hackathon", "Panel"]
  const filteredEvents = filter === "all" ? events : events.filter((e) => e.category === filter)

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
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <h1 className="text-5xl font-bold mb-4 text-balance">Events</h1>
          <p className="text-xl text-muted mb-12">Explore upcoming events and opportunities</p>
        </ScrollReveal>

        <div className="flex flex-wrap gap-2 mb-8 animate-slide-in-up animation-delay-1000">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={filter === cat ? "default" : "outline"}
              onClick={() => setFilter(cat)}
              size="sm"
              className="hover-scale"
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, idx) => (
            <AnimatedCard
              key={event.id}
              delay={idx * 100}
              className="glass overflow-hidden rounded-lg group h-full flex flex-col"
              variant="glow"
            >
              <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                <img
                  src={event.image || "/placeholder.svg?height=300&width=400&query=event"}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="inline-block mb-3 px-2 py-1 text-xs bg-primary/20 text-primary rounded-full w-fit">
                  {event.category}
                </div>
                <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {event.title}
                </h3>
                <p className="text-sm text-muted mb-4 line-clamp-2">{event.description}</p>

                <div className="space-y-2 mb-4 mt-auto">
                  <div className="flex items-center gap-2 text-sm text-muted group-hover:text-foreground transition-colors">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted group-hover:text-foreground transition-colors">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                </div>

                <Button className="w-full hover:neon-glow" size="sm">
                  Learn More
                </Button>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">No events in this category. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
