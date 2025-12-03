"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fileToBase64 } from "@/lib/storage"
import { 
  fetchGalleryImages, 
  createGalleryImage, 
  updateGalleryImage, 
  deleteGalleryImage,
  type GalleryImage 
} from "@/lib/supabase/database"
import { supabase } from "@/lib/supabase/client"

export default function GalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    image_file: null as File | null,
    category: "Events",
    description: "",
  })

  const galleryCategories = ["Events", "Workshops", "Achievements", "Campus", "Team"]

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true)
      const data = await fetchGalleryImages()
      setImages(data)
      setLoading(false)
    }
    loadImages()
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
    const filePath = `gallery/${fileName}`

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
      image_file: null,
      category: "Events",
      description: "",
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.image_file) {
      alert("Please provide a title and select an image")
      return
    }

    try {
      const imageUrl = await uploadImage()

      const imageData = {
        title: formData.title,
        image_url: imageUrl!,
        category: formData.category,
        description: formData.description,
      }

      if (editingId) {
        await updateGalleryImage(editingId, imageData)
      } else {
        await createGalleryImage(imageData)
      }

      const data = await fetchGalleryImages()
      setImages(data)
      resetForm()
    } catch (error) {
      console.error('Error saving gallery image:', error)
      alert('Error saving gallery image. Please check console for details.')
    }
  }

  const handleEdit = (image: GalleryImage) => {
    setFormData({
      title: image.title,
      image_file: null,
      category: image.category,
      description: image.description || "",
    })
    setEditingId(image.id)
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const imageToDelete = images.find(i => i.id === id)
      
      if (imageToDelete?.image_url) {
        const filePath = imageToDelete.image_url.split('/').pop()
        if (filePath) {
          const { error: deleteError } = await supabase.storage
            .from('images')
            .remove([`gallery/${filePath}`])
          
          if (deleteError) console.error('Error deleting image:', deleteError)
        }
      }

      await deleteGalleryImage(id)
      const data = await fetchGalleryImages()
      setImages(data)
    } catch (error) {
      console.error('Error deleting gallery image:', error)
      alert('Error deleting gallery image. Please check console for details.')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading gallery images...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Gallery Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Manage and organize SCC event photos and gallery images</p>
        </div>
        <Button
          onClick={() => {
            setIsAdding(!isAdding)
            if (isAdding) resetForm()
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <span className="text-lg">➕</span>
          {isAdding ? "Cancel" : "Upload Photo"}
        </Button>
      </div>

      {isAdding && (
        <Card className="glass p-6 shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{editingId ? "Edit Photo" : "Upload Gallery Photo"}</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Photo Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
              required
            />
            <div>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {galleryCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-200 resize-none"
            />
            {formData.image_file && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-blue-700 dark:text-blue-300">Image selected: {formData.image_file.name}</p>
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transition-all duration-300">
              {editingId ? "Update Photo" : "Upload Photo"}
            </Button>
            <Button variant="outline" onClick={resetForm} className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <Card key={image.id} className="glass p-0 overflow-hidden group relative shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:-translate-y-1">
            <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 relative">
              <img
                src={image.image_url}
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
