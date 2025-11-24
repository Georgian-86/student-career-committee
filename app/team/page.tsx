"use client"

import { useState, useEffect } from "react"
import { Linkedin, Mail } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedCard } from "@/components/animated-card"
import { loadData } from "@/lib/storage"

interface TeamMember {
  id: string
  name: string
  role: string
  department: string
  image?: string
  linkedin?: string
  email?: string
  description?: string
}

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = loadData<TeamMember[]>("sccTeamMembers", [])
    setMembers(saved)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-accent" />
          <p className="mt-4 text-muted">Loading team members...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <h1 className="text-5xl font-bold mb-4 text-balance">Meet Our Team</h1>
          <p className="text-xl text-muted mb-12">Dedicated individuals working to empower SCSE students</p>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, idx) => (
            <AnimatedCard
              key={member.id}
              delay={idx * 100}
              className="glass overflow-hidden rounded-lg group h-full"
              variant="glow"
            >
              <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                <img
                  src={member.image || "/placeholder.svg?height=400&width=400&query=team member"}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-sm text-primary font-semibold mb-2">{member.role}</p>
                <p className="text-xs text-muted mb-2">{member.department}</p>
                {member.description && <p className="text-xs text-muted mb-3 line-clamp-2">{member.description}</p>}

                <div className="flex gap-2">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
                      aria-label="LinkedIn profile"
                    >
                      <Linkedin className="w-4 h-4 text-primary hover:scale-110 transition-transform" />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="p-2 hover:bg-accent/20 rounded-lg transition-colors"
                      aria-label="Email"
                    >
                      <Mail className="w-4 h-4 text-accent hover:scale-110 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {members.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">No team members to display. Add them in the admin dashboard.</p>
          </div>
        )}
      </div>
    </div>
  )
}
