"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { fileToBase64 } from "@/lib/storage"
import { 
  fetchAboutItems, 
  createAboutItem, 
  updateAboutItem, 
  deleteAboutItem,
  type AboutItem 
} from "@/lib/supabase/database"
import { supabase } from "@/lib/supabase/client"

export default function AboutManager() {
  const [items, setItems] = useState<AboutItem[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "section" as "section" | "item",
    image_file: null as File | null,
  })

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true)
      const data = await fetchAboutItems()
      setItems(data)
      setLoading(false)
    }
    loadItems()
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
    const filePath = `about/${fileName}`

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
      type: "section" as "section" | "item",
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
        const existingItem = items.find(i => i.id === editingId)
        imageUrl = existingItem?.image_url || null
      }

      const itemData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        ...(imageUrl && { image_url: imageUrl }),
      }

      if (editingId) {
        await updateAboutItem(editingId, itemData)
      } else {
        await createAboutItem(itemData)
      }

      const data = await fetchAboutItems()
      setItems(data)
      resetForm()
    } catch (error) {
      console.error('Error saving about item:', error)
      alert('Error saving about item. Please check console for details.')
    }
  }

  const handleEdit = (item: AboutItem) => {
    setFormData({
      title: item.title,
      description: item.description,
      type: item.type,
      image_file: null,
    })
    setEditingId(item.id)
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return

    try {
      const itemToDelete = items.find(i => i.id === id)
      
      if (itemToDelete?.image_url) {
        const filePath = itemToDelete.image_url.split('/').pop()
        if (filePath) {
          const { error: deleteError } = await supabase.storage
            .from('images')
            .remove([`about/${filePath}`])
          
          if (deleteError) console.error('Error deleting image:', deleteError)
        }
      }

      await deleteAboutItem(id)
      const data = await fetchAboutItems()
      setItems(data)
    } catch (error) {
      console.error('Error deleting about item:', error)
      alert('Error deleting about item. Please check console for details.')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading about content...</div>
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
        {isAdding ? "Cancel" : "Add Content"}
      </Button>

      {isAdding && (
        <Card className="glass p-6">
          <h3 className="text-lg font-bold mb-4">{editingId ? "Edit" : "Add"} About Content</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary md:col-span-2"
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as "section" | "item" })}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="section">Section</option>
              <option value="item">Item</option>
            </select>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary md:col-span-2"
            />
            {formData.image_file && (
              <div className="md:col-span-2">
                <p className="text-sm text-muted mb-2">Image selected: {formData.image_file.name}</p>
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave}>{editingId ? "Update" : "Save"}</Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id} className="glass p-4">
            <div className="flex justify-between items-start gap-4">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-24 w-24 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{item.title}</h4>
                    <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded mt-1 inline-block">
                      {item.type}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted mt-2">{item.description}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleEdit(item)} className="p-2 hover:bg-primary/20 rounded transition-colors">
                  <span className="text-lg">✏️</span>
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 hover:bg-red-500/20 rounded transition-colors"
                >
                  <span className="text-lg">🗑️</span>
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {items.length === 0 && !isAdding && (
        <Card className="glass p-8 text-center">
          <p className="text-muted">No content yet. Add some to get started.</p>
        </Card>
      )}
    </div>
  )
}
