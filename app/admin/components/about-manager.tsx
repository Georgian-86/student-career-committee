"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { loadData, saveData, fileToBase64 } from "@/lib/storage"

interface AboutItem {
  id: string
  title: string
  description: string
  type: "section" | "item"
  image?: string
}

export default function AboutManager() {
  const [items, setItems] = useState<AboutItem[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "section" as const,
    image: "",
  })

  useEffect(() => {
    const saved = loadData<AboutItem[]>("sccAbout", [])
    setItems(saved)
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
      type: "section",
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

    let updated: AboutItem[]

    if (editingId) {
      updated = items.map((i) => (i.id === editingId ? { ...i, ...formData } : i))
    } else {
      const newItem: AboutItem = {
        id: Date.now().toString(),
        ...formData,
      }
      updated = [...items, newItem]
    }

    setItems(updated)
    saveData("sccAbout", updated)
    resetForm()
  }

  const handleEdit = (item: AboutItem) => {
    setFormData({
      title: item.title,
      description: item.description,
      type: item.type,
      image: item.image || "",
    })
    setEditingId(item.id)
    setIsAdding(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure?")) {
      const updated = items.filter((i) => i.id !== id)
      setItems(updated)
      saveData("sccAbout", updated)
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
              {item.image && (
                <img
                  src={item.image || "/placeholder.svg"}
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
