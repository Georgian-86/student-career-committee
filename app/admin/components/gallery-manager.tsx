"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { loadData, saveData, fileToBase64 } from "@/lib/storage"

interface GalleryImage {
  id: string
  title: string
  image: string
  category: string
  description?: string
}

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    category: "Events",
    description: "",
  })

  useEffect(() => {
    const saved = loadData<GalleryImage[]>("sccGallery", [])
    setImages(saved)
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
      image: "",
      category: "Events",
      description: "",
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSave = () => {
    if (!formData.title || !formData.image) {
      alert("Please fill all required fields")
      return
    }

    let updated: GalleryImage[]

    if (editingId) {
      updated = images.map((i) => (i.id === editingId ? { ...i, ...formData } : i))
    } else {
      const newImage: GalleryImage = {
        id: Date.now().toString(),
        ...formData,
      }
      updated = [...images, newImage]
    }

    setImages(updated)
    saveData("sccGallery", updated)
    resetForm()
  }

  const handleEdit = (image: GalleryImage) => {
    setFormData({
      title: image.title,
      image: image.image,
      category: image.category,
      description: image.description || "",
    })
    setEditingId(image.id)
    setIsAdding(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this image?")) {
      const updated = images.filter((i) => i.id !== id)
      setImages(updated)
      saveData("sccGallery", updated)
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
        {isAdding ? "Cancel" : "Upload Photo"}
      </Button>

      {isAdding && (
        <Card className="glass p-6">
          <h3 className="text-lg font-bold mb-4">{editingId ? "Edit" : "Upload"} Gallery Photo</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Photo Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Events</option>
              <option>Hackathon</option>
              <option>Team</option>
              <option>Workshop</option>
              <option>Panel</option>
              <option>Projects</option>
            </select>
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {formData.image && (
              <div>
                <img
                  src={formData.image || "/placeholder.svg"}
                  alt="Preview"
                  className="h-40 w-40 object-cover rounded-lg"
                />
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave}>{editingId ? "Update" : "Save"} Photo</Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="glass p-0 overflow-hidden group relative">
            <div className="aspect-square overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 relative">
              <img
                src={image.image || "/placeholder.svg"}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(image)}
                  className="p-2 bg-primary/80 hover:bg-primary rounded transition-colors"
                >
                  <span className="text-lg text-white">✏️</span>
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="p-2 bg-red-500/80 hover:bg-red-600 rounded transition-colors"
                >
                  <span className="text-lg text-white">🗑️</span>
                </button>
              </div>
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold truncate">{image.title}</p>
              <p className="text-xs text-muted">{image.category}</p>
              {image.description && <p className="text-xs text-muted/70 line-clamp-1 mt-1">{image.description}</p>}
            </div>
          </Card>
        ))}
      </div>

      {images.length === 0 && !isAdding && (
        <Card className="glass p-8 text-center">
          <p className="text-muted">No photos yet. Upload one to get started.</p>
        </Card>
      )}
    </div>
  )
}
