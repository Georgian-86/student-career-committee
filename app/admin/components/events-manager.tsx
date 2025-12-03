"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fileToBase64 } from "@/lib/storage"
import { 
  fetchEvents, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  type Event 
} from "@/lib/supabase/database"
import { supabase } from "@/lib/supabase/client"

export default function EventsManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    category: "Talk",
    image_file: null as File | null,
  })

  const eventCategories = ["Talk", "Workshop", "Hackathon", "Panel"]

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      const data = await fetchEvents()
      setEvents(data)
      setLoading(false)
    }
    loadEvents()
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
    const filePath = `events/${fileName}`

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
      date: "",
      location: "",
      description: "",
      category: "Talk",
      image_file: null,
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.date || !formData.location || !formData.description) {
      alert("Please fill all required fields")
      return
    }

    try {
      console.log('Saving event:', { editingId, formData })
      
      let imageUrl = null
      if (formData.image_file) {
        imageUrl = await uploadImage()
      } else if (editingId) {
        const existingEvent = events.find(e => e.id === editingId)
        imageUrl = existingEvent?.image_url || null
      }

      const eventData = {
        title: formData.title,
        date: formData.date,
        location: formData.location,
        description: formData.description,
        category: formData.category,
        ...(imageUrl && { image_url: imageUrl }),
      }

      console.log('Event data to save:', eventData)

      if (editingId) {
        console.log('Updating existing event:', editingId)
        const result = await updateEvent(editingId, eventData)
        if (!result) {
          throw new Error('Failed to update event')
        }
      } else {
        console.log('Creating new event')
        const result = await createEvent(eventData)
        if (!result) {
          throw new Error('Failed to create event')
        }
      }

      const data = await fetchEvents()
      setEvents(data)
      resetForm()
    } catch (error) {
      console.error('Error saving event:', error)
      alert(`Error saving event: ${error instanceof Error ? error.message : 'Unknown error'}. Please check console for details.`)
    }
  }

  const handleEdit = (event: Event) => {
    setFormData({
      title: event.title,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      location: event.location,
      description: event.description,
      category: event.category || 'Talk',
      image_file: null,
    })
    setEditingId(event.id)
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const eventToDelete = events.find(e => e.id === id)
      
      if (eventToDelete?.image_url) {
        const filePath = eventToDelete.image_url.split('/').pop()
        if (filePath) {
          const { error: deleteError } = await supabase.storage
            .from('images')
            .remove([`events/${filePath}`])
          
          if (deleteError) console.error('Error deleting image:', deleteError)
        }
      }

      await deleteEvent(id)
      const data = await fetchEvents()
      setEvents(data)
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Error deleting event. Please check console for details.')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading events...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Events Management</h2>
          <p className="text-gray-600 dark:text-gray-300">Create and manage SCC events, workshops, and talks</p>
        </div>
        <Button
          onClick={() => {
            setIsAdding(!isAdding)
            if (isAdding) resetForm()
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <span className="text-lg">➕</span>
          {isAdding ? "Cancel" : "Create Event"}
        </Button>
      </div>

      {isAdding && (
        <Card className="glass p-6 shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">{editingId ? "Edit Event" : "Create New Event"}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Event Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200 md:col-span-2"
              required
            />
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200"
              required
            />
            <div>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {eventCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <input
              type="text"
              placeholder="Location *"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200 md:col-span-2"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200 md:col-span-2"
            />
            <textarea
              placeholder="Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200 md:col-span-2 resize-none"
              required
            />
            {formData.image_file && (
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm text-purple-700 dark:text-purple-300">Image selected: {formData.image_file.name}</p>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300">
              {editingId ? "Update Event" : "Create Event"}
            </Button>
            <Button variant="outline" onClick={resetForm} className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200">
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card key={event.id} className="glass p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:-translate-y-1">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{event.title}</h4>
                <div className="flex gap-2 mb-3 flex-wrap">
                  <span className="text-xs px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium">
                    {event.category}
                  </span>
                  <span className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full font-medium">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{event.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {event.location}
                </div>
              </div>
            </div>
            {event.image_url && (
              <div className="mb-4">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(event)}
                className="flex-1 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors duration-200 font-medium text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="flex-1 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200 font-medium text-sm"
              >
                Delete
              </button>
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
