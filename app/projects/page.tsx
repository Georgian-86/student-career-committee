"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Github, ExternalLink } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedCard } from "@/components/animated-card"
import { fetchProjects } from "@/lib/supabase/database"

interface Project {
  id: string
  title: string
  description: string
  technologies: string[] | string
  github_url?: string
  project_url?: string
  demo?: string
  image_url?: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true)
      try {
        const data = await fetchProjects()
        setProjects(data || [])
      } catch (error) {
        console.error('Error loading projects:', error)
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-accent" />
          <p className="mt-4 text-muted">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-green-900/20 to-teal-900/20 dark:from-emerald-900/40 dark:via-green-900/40 dark:to-teal-900/40">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310B981' fill-opacity='0.05'%3E%3Cpolygon points='30 30 35 35 30 40 25 35'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-teal-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16 relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent animate-gradient bg-300">
              SCC Projects
            </h1>
            <div className="h-1 w-24 mx-auto mb-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover the cutting-edge innovations and technical masterpieces crafted by our brilliant student community. Each project represents creativity, dedication, and the pursuit of excellence.
            </p>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-emerald-500/20 rounded-full animate-bounce delay-300"></div>
            <div className="absolute -top-8 -right-8 w-6 h-6 bg-teal-500/20 rounded-full animate-bounce delay-500"></div>
            <div className="absolute -bottom-4 left-8 w-4 h-4 bg-green-500/20 rounded-full animate-bounce delay-700"></div>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects?.map((project, idx) => (
            <AnimatedCard
              key={project.id}
              delay={idx * 100}
              className="glass overflow-hidden rounded-3xl group h-full flex flex-col shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md relative"
              variant="glow"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              
              {project.image_url && (
                <div className="aspect-video overflow-hidden bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 dark:from-emerald-900/30 dark:via-green-900/30 dark:to-teal-900/30 relative">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    Live Project
                  </div>
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow relative">
                <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3 flex-grow leading-relaxed">
                  {project.description}
                </p>

                {project.technologies && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></span>
                      Tech Stack
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(project.technologies) 
                        ? project.technologies.map((tech, i) => (
                            <span key={i} className="px-3 py-1 text-xs bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 rounded-full font-medium border border-emerald-200 dark:border-emerald-700/30 hover:scale-105 transition-transform duration-200">
                              {tech.trim()}
                            </span>
                          ))
                        : project.technologies.split(",").map((tech, i) => (
                            <span key={i} className="px-3 py-1 text-xs bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 text-emerald-700 dark:text-emerald-300 rounded-full font-medium border border-emerald-200 dark:border-emerald-700/30 hover:scale-105 transition-transform duration-200">
                              {tech.trim()}
                            </span>
                          ))
                      }
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-auto">
                  {project.github_url && (
                    <a 
                      href={project.github_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 group/btn"
                    >
                      <Button variant="outline" className="w-full border-emerald-200 dark:border-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <Github className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform duration-300" />
                        Code
                      </Button>
                    </a>
                  )}
                  {(project.demo || project.project_url) && (
                    <a 
                      href={project.demo || project.project_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 group/btn"
                    >
                      <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <ExternalLink className="w-4 h-4 mr-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        Demo
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            </AnimatedCard>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-32 relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-teal-200/20 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            <div className="relative z-10 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-8 relative group">
                <svg className="w-12 h-12 text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                {/* Floating Elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-emerald-500/30 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-teal-500/30 rounded-full animate-bounce delay-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                No Projects Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                Get ready to be inspired! Our talented students are working on amazing innovations. Check back soon to discover groundbreaking projects!
              </p>
              <div className="flex justify-center gap-2">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse delay-200"></span>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse delay-400"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
