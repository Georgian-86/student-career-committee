"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { fileToBase64 } from "@/lib/storage"
import { 
  fetchProjects, 
  createProject, 
  updateProject, 
  deleteProject,
  type Project 
} from "@/lib/supabase/database"
import { supabase } from "@/lib/supabase/client"

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    github: "",
    demo: "",
    image_file: null as File | null,
  })

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true)
      const data = await fetchProjects()
      setProjects(data)
      setLoading(false)
    }
    loadProjects()
  }, [])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, image_file: file }))
    }
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!formData.image_file) return null

    const fileExt = formData.image_file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `projects/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, formData.image_file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      technologies: "",
      github: "",
      demo: "",
      image_file: null,
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      alert("Please fill all required fields")
      return
    }

    try {
      let imageUrl = null
      if (formData.image_file) {
        imageUrl = await uploadImage()
      } else if (editingId) {
        const existingProject = projects.find(p => p.id === editingId)
        imageUrl = existingProject?.image_url || null
      }

      const projectData = {
        title: formData.title,
        description: formData.description,
        technologies: formData.technologies,
        github: formData.github,
        demo: formData.demo,
        ...(imageUrl && { image_url: imageUrl }),
      }

      if (editingId) {
        await updateProject(editingId, projectData)
      } else {
        await createProject(projectData)
      }

      const data = await fetchProjects()
      setProjects(data)
      resetForm()
    } catch (error) {
      console.error('Error saving project:', error)
      alert('Error saving project. Please check console for details.')
    }
  }

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      github: project.github,
      demo: project.demo,
      image_file: null,
    })
    setEditingId(project.id)
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const projectToDelete = projects.find(p => p.id === id)
      
      if (projectToDelete?.image_url) {
        const filePath = projectToDelete.image_url.split('/').pop()
        if (filePath) {
          const { error: deleteError } = await supabase.storage
            .from('images')
            .remove([`projects/${filePath}`])
          
          if (deleteError) console.error('Error deleting image:', deleteError)
        }
      }

      await deleteProject(id)
      const data = await fetchProjects()
      setProjects(data)
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Error deleting project. Please check console for details.')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading projects...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Projects Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Showcase student projects and technical innovations</p>
        </div>
        <Button
          onClick={() => {
            setIsAdding(!isAdding)
            if (isAdding) resetForm()
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <span className="text-lg">➕</span>
          {isAdding ? "Cancel" : "Add Project"}
        </Button>
      </div>

      {isAdding && (
        <Card className="glass p-6 shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{editingId ? "Edit Project" : "Add New Project"}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Project Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all duration-200 md:col-span-2"
              required
            />
            <textarea
              placeholder="Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all duration-200 md:col-span-2 resize-none"
              required
            />
            <input
              type="text"
              placeholder="Technologies (comma-separated)"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all duration-200"
            />
            <input
              type="url"
              placeholder="GitHub Link"
              value={formData.github}
              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
              className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all duration-200"
            />
            <input
              type="url"
              placeholder="Demo Link"
              value={formData.demo}
              onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
              className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all duration-200"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm transition-all duration-200 md:col-span-2"
            />
            {formData.image_file && (
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-green-700 dark:text-green-300">Image selected: {formData.image_file.name}</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300">
              {editingId ? "Update Project" : "Add Project"}
            </Button>
            <Button variant="outline" onClick={resetForm} className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="glass p-4">
            {project.image_url && (
              <img
                src={project.image_url}
                alt={project.title}
                className="h-40 w-full object-cover rounded-lg mb-3"
              />
            )}
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-bold">{project.title}</h4>
                <p className="text-sm text-muted mt-2">{project.description}</p>
                {project.technologies && typeof project.technologies === 'string' && (
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
