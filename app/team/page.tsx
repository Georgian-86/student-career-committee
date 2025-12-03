"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Linkedin, Mail } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedCard } from "@/components/animated-card"
import { fetchTeamMembers } from "@/lib/supabase/database"
import { useSearchParams } from "next/navigation"

interface TeamMember {
  id: string
  name: string
  role: string
  department: string
  image_url?: string
  linkedin?: string
  email?: string
  description?: string
}

function TeamPageContent() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const searchParams = useSearchParams()
  
  // Get filter from URL params
  useEffect(() => {
    const structureFilter = searchParams.get('structure')
    if (structureFilter) {
      setFilter(structureFilter)
    }
  }, [searchParams])

  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true)
      const data = await fetchTeamMembers()
      setMembers(data)
      setLoading(false)
    }
    loadMembers()
  }, [])

  const departments = ["all", ...Array.from(new Set(members.map(m => m.department)))]

  const filteredMembers = filter === "all" 
    ? members 
    : members.filter(member => member.department === filter)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-pink-900/10 to-blue-900/10">
      <div className="container mx-auto px-4 py-12">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Meet Our Team
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              The passionate individuals driving innovation and excellence in our Student Career Committee
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {departments.map((dept) => (
            <Button
              key={dept}
              variant={filter === dept ? "default" : "outline"}
              onClick={() => setFilter(dept)}
              className="capitalize"
            >
              {dept === "all" ? "All Departments" : dept}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMembers.map((member, index) => (
            <AnimatedCard
              key={member.id}
              delay={index * 0.1}
              className="group"
            >
              <div className="p-6">
                <div className="flex flex-col items-center text-center">
                  {member.image_url ? (
                    <img
                      src={member.image_url}
                      alt={member.name}
                      className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all duration-300"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold mb-4">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-purple-400 transition-colors">
                    {member.name}
                  </h3>
                  
                  <p className="text-purple-600 dark:text-purple-400 font-medium mb-1">
                    {member.role}
                  </p>
                  
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {member.department}
                  </p>
                  
                  {member.description && (
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                      {member.description}
                    </p>
                  )}
                  
                  <div className="flex gap-3">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                      >
                        <Linkedin className="w-4 h-4 text-accent hover:scale-110 transition-transform" />
                      </a>
                    )}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                      >
                        <Mail className="w-4 h-4 text-accent hover:scale-110 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">
              {filter === "all" 
                ? "No team members to display. Add them in the admin dashboard."
                : `No team members found for ${filter}. Try a different filter.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Team() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    }>
      <TeamPageContent />
    </Suspense>
  )
}
