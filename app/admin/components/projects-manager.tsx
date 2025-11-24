"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { loadData, saveData, fileToBase64 } from "@/lib/storage"

interface Project {
  id: string
  title: string
  description: string
  technologies: string
  github: string
  demo: string
  image?: string
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    github: "",
    demo: "",
    image: "",
  })

  useEffect(() => {
    const saved = loadData<Project[]>("sccProjects", [])
    setProjects(saved)
  }, [])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const base64 = await fileToBase64(file)
      setFormData({ ...formData, image: base64 })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      technologies: "",
      github: "",
      demo: "",
      image: "",
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSave = () => {
    if (!formData.title || !formData.description) {
      alert("Please fill all required fields")
      return
    }

    let updated: Project[]

    if (editingId) {
      updated = projects.map((p) => (p.id === editingId ? { ...p, ...formData } : p))
    } else {
      const newProject: Project = {
        id: Date.now().toString(),
        ...formData,
      }
      updated = [...projects, newProject]
    }

    setProjects(updated)
    saveData("sccProjects", updated)
    resetForm()
  }

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      github: project.github,
      demo: project.demo,
      image: project.image || "",
    })
    setEditingId(project.id)
    setIsAdding(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const updated = projects.filter((p) => p.id !== id)
      setProjects(updated)
      saveData("sccProjects", updated)
    }
  }

  return (
    <div className="space-y-6">
      <Button
        onClick={() => {
          setIsAdding(!isAdding)
          if (isAdding) resetForm()
        }}
        className="flex items-center gap-2"
      >
        <span className="text-lg">➕</span>
        {isAdding ? "Cancel" : "Add Project"}
      </Button>

      {isAdding && (
        <Card className="glass p-6">
          <h3 className="text-lg font-bold mb-4">{editingId ? "Edit" : "Add"} Project</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Project Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary md:col-span-2"
            />
            <textarea
              placeholder="Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary md:col-span-2"
            />
            <input
              type="text"
              placeholder="Technologies (comma-separated)"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary md:col-span-2"
            />
            <input
              type="url"
              placeholder="GitHub Link"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="url"
              placeholder="Demo Link"
              value={formData.demo}
              onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary md:col-span-2"
            />
            {formData.image && (
              <div className="md:col-span-2">
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave}>{editingId ? "Update" : "Save"} Project</Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="glass p-4">
            {project.image && (
              <img
                src={project.image || "/placeholder.svg"}
                alt={project.title}
                className="h-40 w-full object-cover rounded-lg mb-3"
              />
            )}
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-bold">{project.title}</h4>
                <p className="text-sm text-muted mt-2">{project.description}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.technologies.split(",").map((tech, i) => (
                      <span key={i} className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 hover:bg-primary/20 rounded transition-colors"
                >
                  <span className="text-lg">✏️</span>
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 hover:bg-red-500/20 rounded transition-colors"
                >
                  <span className="text-lg">🗑️</span>
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {projects.length === 0 && !isAdding && (
        <Card className="glass p-8 text-center">
          <p className="text-muted">No projects yet. Add one to get started.</p>
        </Card>
      )}
    </div>
  )
}
