"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Linkedin, ExternalLink, Trophy, Star, Calendar, Building, Award, TrendingUp } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedCard } from "@/components/animated-card"
import { fetchAchievers, type Achiever } from "@/lib/supabase/database"

export default function Achievers() {
  const [achievers, setAchievers] = useState<Achiever[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadAchievers = async () => {
      setLoading(true)
      try {
        const data = await fetchAchievers()
        setAchievers(data || [])
      } catch (error) {
        console.error('Error loading achievers:', error)
        setAchievers([])
      } finally {
        setLoading(false)
      }
    }
    loadAchievers()
  }, [])

  const categories = ["all", ...Array.from(new Set(achievers.map((a: Achiever) => a.category)))]
  
  const filteredAchievers = achievers.filter((achiever: Achiever) => {
    const matchesFilter = filter === "all" || achiever.category === filter
    const matchesSearch = achiever.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achiever.achievement_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (achiever.institution && achiever.institution.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const featuredAchievers = filteredAchievers.filter((a: Achiever) => a.featured)
  const regularAchievers = filteredAchievers.filter((a: Achiever) => !a.featured)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-accent" />
          <p className="mt-4 text-muted">Loading achievers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-900/20 to-yellow-900/20 dark:from-amber-900/40 dark:via-orange-900/40 dark:to-yellow-900/40">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F59E0B' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-yellow-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <ScrollReveal>
          <div className="text-center mb-16 relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-amber-500 to-yellow-500 rounded-full animate-pulse"></div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent animate-gradient bg-300">
              Hall of Achievers
            </h1>
            <div className="h-1 w-24 mx-auto mb-6 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full animate-pulse"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Celebrating excellence and innovation! Meet the brilliant minds who have made remarkable contributions in academics, technology, cultural activities, and leadership.
              Explore their inspiring journey of success and achievement.
            </p>
            
            <div className="flex justify-center gap-4 mb-8">
              <Trophy className="w-8 h-8 text-amber-500 animate-bounce" />
              <Award className="w-8 h-8 text-amber-500 animate-bounce delay-200" />
              <Star className="w-8 h-8 text-amber-500 animate-bounce delay-400" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-amber-500/20 rounded-full animate-bounce delay-300"></div>
            <div className="absolute -top-8 -right-8 w-6 h-6 bg-yellow-500/20 rounded-full animate-bounce delay-500"></div>
            <div className="absolute -bottom-4 left-8 w-4 h-4 bg-orange-500/20 rounded-full animate-bounce delay-700"></div>
          </div>
        </ScrollReveal>

        {/* Statistics Dashboard */}
        <ScrollReveal delay={100}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 text-center border border-amber-200 dark:border-amber-700/30">
              <Trophy className="w-8 h-8 mx-auto mb-3 text-amber-500" />
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                {achievers.length}+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Achievers</div>
            </div>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 text-center border border-amber-200 dark:border-amber-700/30">
              <Award className="w-8 h-8 mx-auto mb-3 text-orange-500" />
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                {categories.length - 1}+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Categories</div>
            </div>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 text-center border border-amber-200 dark:border-amber-700/30">
              <Building className="w-8 h-8 mx-auto mb-3 text-yellow-500" />
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                {new Set(achievers.map((a: Achiever) => a.institution).filter(Boolean)).size}+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Institutions</div>
            </div>
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 text-center border border-amber-200 dark:border-amber-700/30">
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-amber-500" />
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {achievers.filter((a: Achiever) => new Date(a.achievement_date).getFullYear() === new Date().getFullYear()).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">This Year</div>
            </div>
          </div>
        </ScrollReveal>

        {/* Search and Filter */}
        <ScrollReveal delay={200}>
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search achievers, achievements, or institutions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-amber-200 dark:border-amber-700/30 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-300"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat: string) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 hover:scale-105 relative overflow-hidden group ${
                    filter === cat
                      ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg'
                      : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-amber-200 dark:border-amber-700/30 hover:bg-amber-50 dark:hover:bg-amber-900/30'
                  }`}
                >
                  {filter === cat && (
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-yellow-600 opacity-100"></div>
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {filter === cat && (
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    )}
                    {cat === "all" ? "All Categories" : cat}
                  </span>
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Featured Achievers */}
        {featuredAchievers.length > 0 && (
          <ScrollReveal delay={300}>
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-12">
                <div className="relative">
                  <div className="w-4 h-4 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-4 h-4 bg-amber-500 rounded-full animate-ping"></div>
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  Featured Achievers
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-500/50 to-transparent"></div>
                <div className="flex gap-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-200"></span>
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-400"></span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredAchievers.map((achiever: Achiever, index: number) => (
                  <AnimatedCard key={achiever.id} delay={index * 100} className="group">
                    <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-3xl">
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                      
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                      
                      <div className="p-8 relative">
                        <div className="flex items-start gap-6">
                          <div className="relative group/avatar">
                            {achiever.image_url ? (
                              <div className="relative">
                                <img
                                  src={achiever.image_url}
                                  alt={achiever.name}
                                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/20 shadow-xl group-hover/avatar:scale-110 transition-transform duration-500"
                                />
                                {/* Glow Effect */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 opacity-0 group-hover/avatar:opacity-20 blur-xl transition-opacity duration-300"></div>
                              </div>
                            ) : (
                              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shadow-xl group-hover/avatar:scale-110 transition-transform duration-500">
                                {achiever.name.split(' ').map((n: string) => n[0]).join('')}
                              </div>
                            )}
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                              <Star className="w-3 h-3 text-white" />
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                              {achiever.name}
                            </h3>
                            
                            <h4 className="text-lg font-bold text-amber-600 dark:text-amber-400 mb-3 line-clamp-2">
                              {achiever.achievement_title}
                            </h4>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              <div className="px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-full border border-amber-200 dark:border-amber-700/30">
                                <span className="text-amber-700 dark:text-amber-300 text-xs font-bold">
                                  {achiever.category}
                                </span>
                              </div>
                              {achiever.year && (
                                <div className="px-3 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 rounded-full border border-orange-200 dark:border-orange-700/30">
                                  <span className="text-orange-700 dark:text-orange-300 text-xs font-bold">
                                    {achiever.year}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {achiever.institution && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 mb-3">
                                <Building className="w-4 h-4" />
                                <span>{achiever.institution}</span>
                              </div>
                            )}
                            
                            {achiever.description && (
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                                {achiever.description}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(achiever.achievement_date).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}</span>
                            </div>
                            
                            {achiever.tags && achiever.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-4">
                                {achiever.tags.slice(0, 3).map((tag: string, i: number) => (
                                  <span key={i} className="px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-xs rounded-full">
                                    {tag}
                                  </span>
                                ))}
                                {achiever.tags.length > 3 && (
                                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                                    +{achiever.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            <div className="flex gap-3">
                              {achiever.linkedin_url && (
                                <a
                                  href={achiever.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full hover:from-amber-100 hover:to-yellow-100 dark:hover:from-amber-900/30 dark:hover:to-yellow-900/30 transition-all duration-300 hover:scale-110 group/link"
                                >
                                  <Linkedin className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover/link:text-amber-600 dark:group-hover/link:text-amber-400 transition-colors duration-300" />
                                </a>
                              )}
                              {achiever.portfolio_url && (
                                <a
                                  href={achiever.portfolio_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full hover:from-amber-100 hover:to-yellow-100 dark:hover:from-amber-900/30 dark:hover:to-yellow-900/30 transition-all duration-300 hover:scale-110 group/link"
                                >
                                  <ExternalLink className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover/link:text-amber-600 dark:group-hover/link:text-amber-400 transition-colors duration-300" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Regular Achievers */}
        {regularAchievers.length > 0 && (
          <ScrollReveal delay={400}>
            <div>
              <div className="flex items-center gap-4 mb-12">
                <div className="w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                  All Achievers
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-amber-500/50 to-transparent"></div>
                <div className="flex gap-2">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                  <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-200"></span>
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-400"></span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {regularAchievers.map((achiever: Achiever, index: number) => (
                  <AnimatedCard key={achiever.id} delay={index * 50} className="group">
                    <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl">
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          {achiever.image_url ? (
                            <img
                              src={achiever.image_url}
                              alt={achiever.name}
                              className="w-16 h-16 rounded-xl object-cover ring-2 ring-white/20 shadow-md group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-lg font-bold shadow-md">
                              {achiever.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors duration-300">
                              {achiever.name}
                            </h3>
                            <h4 className="text-sm font-semibold text-amber-600 dark:text-amber-400 truncate">
                              {achiever.achievement_title}
                            </h4>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(achiever.achievement_date).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short' 
                          })}</span>
                          {achiever.institution && (
                            <>
                              <span>•</span>
                              <span className="truncate">{achiever.institution}</span>
                            </>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full font-medium">
                            {achiever.category}
                          </span>
                          {achiever.year && (
                            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs rounded-full font-medium">
                              {achiever.year}
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  </AnimatedCard>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Empty State */}
        {filteredAchievers.length === 0 && (
          <div className="text-center py-32 relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-amber-200/20 to-yellow-200/20 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            <div className="relative z-10 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-8 relative group">
                <Trophy className="w-12 h-12 text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300" />
                {/* Floating Elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-amber-500/30 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-yellow-500/30 rounded-full animate-bounce delay-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                No Achievers Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                Start celebrating excellence! Add achievers in the admin dashboard to showcase outstanding accomplishments and inspire others.
              </p>
              <div className="flex justify-center gap-2">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-200"></span>
                <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-400"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
