"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"
import { loadData } from "@/lib/storage"

interface Project {
  id: string
  title: string
  description: string
  technologies: string
  github: string
  demo: string
  image?: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    const saved = loadData<Project[]>("sccProjects", [])
    setProjects(saved)
  }, [])

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-balance">Projects</h1>
        <p className="text-xl text-muted mb-12">Innovative projects built by our community</p>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="glass p-6 hover:neon-glow transition-all">
              {project.image && (
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="h-40 w-full object-cover rounded-lg mb-4"
                />
              )}
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-muted mb-4">{project.description}</p>

              {project.technologies && (
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.split(",").map((tech, i) => (
                      <span key={i} className="px-2 py-1 text-xs bg-primary/20 text-primary rounded">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </Button>
                  </a>
                )}
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noopener noreferrer">
                    <Button size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Demo
                    </Button>
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <Card className="glass p-8 text-center">
            <p className="text-muted">No projects added yet. Check back soon!</p>
          </Card>
        )}
      </div>
    </div>
  )
}
