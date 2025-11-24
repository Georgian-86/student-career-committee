"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { loadData, saveData, fileToBase64 } from "@/lib/storage"

interface Event {
  id: string
  title: string
  date: string
  location: string
  description: string
  category: string
  image?: string
}

export default function EventsManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    category: "Talk",
    image: "",
  })

  useEffect(() => {
    const saved = loadData<Event[]>("sccEvents", [])
    setEvents(saved)
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
      date: "",
      location: "",
      description: "",
      category: "Talk",
      image: "",
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSave = () => {
    if (!formData.title || !formData.date || !formData.location || !formData.description) {
      alert("Please fill all required fields")
      return
    }

    let updated: Event[]

    if (editingId) {
      updated = events.map((e) =>
        e.id === editingId
          ? {
              ...e,
              ...formData,
            }
          : e,
      )
    } else {
      const newEvent: Event = {
        id: Date.now().toString(),
        ...formData,
      }
      updated = [...events, newEvent]
    }

    setEvents(updated)
    saveData("sccEvents", updated)
    resetForm()
  }

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      date: event.date,
      location: event.location,
      description: event.description,
      category: event.category,
      image: event.image || "",
    })
    setEditingId(event.id)
    setIsAdding(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      const updated = events.filter((e) => e.id !== id)
      setEvents(updated)
      saveData("sccEvents", updated)
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
        {isAdding ? "Cancel" : "Create Event"}
      </Button>

      {isAdding && (
        <Card className="glass p-6">
          <h3 className="text-lg font-bold mb-4">{editingId ? "Edit" : "Create New"} Event</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Event Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary md:col-span-2"
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Talk</option>
              <option>Workshop</option>
              <option>Hackathon</option>
              <option>Panel</option>
            </select>
            <input
              type="text"
              placeholder="Location *"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary md:col-span-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary md:col-span-2"
            />
            <textarea
              placeholder="Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
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
            <Button onClick={handleSave}>{editingId ? "Update" : "Save"} Event</Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="glass p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex gap-4">
                  {event.image && (
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="h-24 w-24 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-bold">{event.title}</h4>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">{event.category}</span>
                      <span className="text-xs px-2 py-1 bg-accent/20 text-accent rounded">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted mt-2">{event.description}</p>
                    <p className="text-xs text-muted mt-1">{event.location}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => handleEdit(event)} className="p-2 hover:bg-primary/20 rounded transition-colors">
                  <span className="text-lg">✏️</span>
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-2 hover:bg-red-500/20 rounded transition-colors"
                >
                  <span className="text-lg">🗑️</span>
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {events.length === 0 && !isAdding && (
        <Card className="glass p-8 text-center">
          <p className="text-muted">No events yet. Create one to get started.</p>
        </Card>
      )}
    </div>
  )
}
