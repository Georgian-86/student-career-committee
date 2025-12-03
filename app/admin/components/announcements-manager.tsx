"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { fileToBase64 } from "@/lib/storage"
import { 
  fetchAnnouncements, 
  createAnnouncement, 
  updateAnnouncement, 
  deleteAnnouncement,
  type Announcement 
} from "@/lib/supabase/database"
import { supabase } from "@/lib/supabase/client"

export default function AnnouncementsManager() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Opportunity",
    image_file: null as File | null,
  })

  useEffect(() => {
    const loadAnnouncements = async () => {
      setLoading(true)
      const data = await fetchAnnouncements()
      setAnnouncements(data)
      setLoading(false)
    }
    loadAnnouncements()
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
    const filePath = `announcements/${fileName}`

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
      content: "",
      category: "Opportunity",
      image_file: null,
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.content) {
      alert("Please fill all required fields")
      return
    }

    try {
      let imageUrl = null
      if (formData.image_file) {
        imageUrl = await uploadImage()
      } else if (editingId) {
        const existingAnnouncement = announcements.find(a => a.id === editingId)
        imageUrl = existingAnnouncement?.image_url || null
      }

      const announcementData = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        date: new Date().toLocaleDateString(),
        ...(imageUrl && { image_url: imageUrl }),
      }

      if (editingId) {
        await updateAnnouncement(editingId, announcementData)
      } else {
        await createAnnouncement(announcementData)
      }

      const data = await fetchAnnouncements()
      setAnnouncements(data)
      resetForm()
    } catch (error) {
      console.error('Error saving announcement:', error)
      alert('Error saving announcement. Please check console for details.')
    }
  }

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      image_file: null,
    })
    setEditingId(announcement.id)
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return

    try {
      const announcementToDelete = announcements.find(a => a.id === id)
      
      if (announcementToDelete?.image_url) {
        const filePath = announcementToDelete.image_url.split('/').pop()
        if (filePath) {
          const { error: deleteError } = await supabase.storage
            .from('images')
            .remove([`announcements/${filePath}`])
          
          if (deleteError) console.error('Error deleting image:', deleteError)
        }
      }

      await deleteAnnouncement(id)
      const data = await fetchAnnouncements()
      setAnnouncements(data)
    } catch (error) {
      console.error('Error deleting announcement:', error)
      alert('Error deleting announcement. Please check console for details.')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading announcements...</div>
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
        {isAdding ? "Cancel" : "Create Announcement"}
      </Button>

      {isAdding && (
        <Card className="glass p-6">
          <h3 className="text-lg font-bold mb-4">{editingId ? "Edit" : "Create New"} Announcement</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Opportunity</option>
              <option>Event</option>
              <option>Program</option>
              <option>Tip</option>
              <option>Story</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Content *"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {formData.image_file && (
              <div>
                <p className="text-sm text-muted mb-2">Image selected: {formData.image_file.name}</p>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave}>{editingId ? "Update" : "Save"} Announcement</Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className="glass p-4 hover:neon-glow transition-all">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex gap-4">
                  {announcement.image_url && (
                    <img
                      src={announcement.image_url}
                      alt={announcement.title}
                      className="h-20 w-20 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-bold">{announcement.title}</h4>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                        {announcement.category}
                      </span>
                      <span className="text-xs text-muted">{new Date(announcement.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-muted mt-2 line-clamp-1">{announcement.content}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(announcement)}
                  className="p-2 hover:bg-primary/20 rounded transition-colors"
                >
                  <span className="text-lg">✏️</span>
                </button>
                <button
                  onClick={() => handleDelete(announcement.id)}
                  className="p-2 hover:bg-red-500/20 rounded transition-colors"
                >
                  <span className="text-lg">🗑️</span>
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {announcements.length === 0 && !isAdding && (
        <Card className="glass p-8 text-center">
          <p className="text-muted">No announcements yet. Create one to get started.</p>
        </Card>
      )}
    </div>
  )
}
