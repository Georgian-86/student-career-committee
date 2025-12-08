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
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20 dark:from-indigo-900/40 dark:via-purple-900/40 dark:to-pink-900/40">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B5CF6' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-pink-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <ScrollReveal>
          <div className="text-center mb-16 relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient bg-300">
              Meet Our Team
            </h1>
            <div className="h-1 w-24 mx-auto mb-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The passionate individuals driving innovation and excellence in our Student Career Committee. 
              Each member brings unique expertise and dedication to empower the next generation of tech leaders.
            </p>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-indigo-500/20 rounded-full animate-bounce delay-300"></div>
            <div className="absolute -top-8 -right-8 w-6 h-6 bg-purple-500/20 rounded-full animate-bounce delay-500"></div>
            <div className="absolute -bottom-4 left-8 w-4 h-4 bg-pink-500/20 rounded-full animate-bounce delay-700"></div>
          </div>
        </ScrollReveal>

        {/* Enhanced Filter Buttons */}
        <ScrollReveal delay={100}>
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setFilter(dept)}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 relative overflow-hidden group ${
                  filter === dept
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-indigo-200 dark:border-indigo-700/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
                }`}
              >
                {filter === dept && (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-100"></div>
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {filter === dept && (
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  )}
                  {dept === "all" ? "All Departments" : dept}
                </span>
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </button>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredMembers.map((member, index) => (
            <AnimatedCard
              key={member.id}
              delay={index * 0.1}
              className="group"
            >
              <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl">
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                
                <div className="p-8 relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-6 group/avatar">
                      {member.image_url ? (
                        <div className="relative">
                          <img
                            src={member.image_url}
                            alt={member.name}
                            className="w-32 h-32 rounded-full object-cover ring-4 ring-white/20 shadow-xl group-hover/avatar:scale-110 transition-transform duration-500"
                          />
                          {/* Glow Effect */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover/avatar:opacity-20 blur-xl transition-opacity duration-300"></div>
                        </div>
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold shadow-xl group-hover/avatar:scale-110 transition-transform duration-500 relative overflow-hidden">
                          <span className="relative z-10">{member.name.split(' ').map(n => n[0]).join('')}</span>
                          {/* Animated Background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      )}
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg group-hover/avatar:scale-110 transition-transform duration-300">
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                      {member.name}
                    </h3>
                    
                    <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-2 text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {member.role}
                    </p>
                    
                    <div className="flex items-center justify-center mb-4">
                      <div className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full border border-indigo-200 dark:border-indigo-700/30 group-hover:scale-105 transition-transform duration-300">
                        <p className="text-indigo-700 dark:text-indigo-300 text-xs font-bold">
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
                          className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all duration-300 hover:scale-110 group/link"
                        >
                          <Linkedin className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-400 transition-colors duration-300" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="p-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 transition-all duration-300 hover:scale-110 group/link"
                        >
                          <Mail className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover/link:text-indigo-600 dark:group-hover/link:text-indigo-400 transition-colors duration-300" />
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
          <div className="text-center py-32 relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            <div className="relative z-10 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-8 relative group">
                <svg className="w-12 h-12 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {/* Floating Elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-indigo-500/30 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-500/30 rounded-full animate-bounce delay-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {filter === "all" ? "No Team Members Yet" : "No Members in This Department"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                {filter === "all" 
                  ? "Start building your dream team! Add team members in the admin dashboard to showcase your amazing talent."
                  : `No team members found for ${filter}. Try selecting "All Departments" or add members to this department.`
                }
              </p>
              <div className="flex justify-center gap-2">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></span>
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-400"></span>
              </div>
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
