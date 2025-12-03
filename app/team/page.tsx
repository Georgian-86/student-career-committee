"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30 dark:from-slate-900 dark:via-purple-900/20 dark:to-pink-900/20">
      <div className="px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Meet Our Team
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The passionate individuals driving innovation and excellence in our Student Career Committee. 
              Each member brings unique expertise and dedication to empower the next generation of tech leaders.
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {departments.map((dept) => (
            <Button
              key={dept}
              variant={filter === dept ? "default" : "outline"}
              onClick={() => setFilter(dept)}
              className="px-6 py-2 rounded-full capitalize text-sm font-medium transition-all duration-300 hover:scale-105"
            >
              {dept === "all" ? "All Departments" : dept}
            </Button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredMembers.map((member, index) => (
            <AnimatedCard
              key={member.id}
              delay={index * 0.1}
              className="group"
            >
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="p-8 relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6">
                      {member.image_url ? (
                        <img
                          src={member.image_url}
                          alt={member.name}
                          className="w-32 h-32 rounded-full object-cover ring-4 ring-white/20 shadow-xl group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      {member.name}
                    </h3>
                    
                    <p className="text-purple-600 dark:text-purple-400 font-semibold mb-2 text-sm">
                      {member.role}
                    </p>
                    
                    <div className="flex items-center justify-center mb-4">
                      <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                        <p className="text-purple-700 dark:text-purple-300 text-xs font-medium">
                          {member.department}
                        </p>
                      </div>
                    </div>
                    
                    {member.description && (
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3 leading-relaxed">
                        {member.description}
                      </p>
                    )}
                    
                    <div className="flex gap-3">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-300 hover:scale-110 group"
                        >
                          <Linkedin className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-300 hover:scale-110 group"
                        >
                          <Mail className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </AnimatedCard>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {filter === "all" ? "No Team Members Yet" : "No Members in This Department"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {filter === "all" 
                  ? "Add team members in the admin dashboard to showcase your amazing team."
                  : `No team members found for ${filter}. Try selecting "All Departments" or add members to this department.`
                }
              </p>
            </div>
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
