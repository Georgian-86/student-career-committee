"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageCrop } from "@/components/image-crop"
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
  const [showCropDialog, setShowCropDialog] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    category: "Talk",
    image_file: null as File | null,
    is_live: false,
    gallery_files: [] as File[],
    gallery_preview_urls: [] as string[],
    attendees: "",
    outcome: "",
    guest_feedback: "",
    student_feedback: "",
    guests: ["", "", "", "", "", "", "", "", "", ""],
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
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
        setShowCropDialog(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = (croppedImage: string) => {
    // Convert cropped image back to file
    fetch(croppedImage)
      .then(res => res.blob())
      .then(blob => {
        // Determine the file type from the blob
        const fileType = blob.type || 'image/jpeg'
        const extension = fileType.split('/')[1] || 'jpg'
        const file = new File([blob], `cropped-image.${extension}`, { type: fileType })
        setFormData(prev => ({ ...prev, image_file: file }))
        setImagePreview(croppedImage)
      })
      .catch(error => {
        console.error('Error converting cropped image:', error)
      })
  }

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Create preview URLs for the new files
      const newPreviewUrls = files.map(file => URL.createObjectURL(file))
      
      setFormData(prev => ({ 
        ...prev, 
        gallery_files: [...prev.gallery_files, ...files],
        gallery_preview_urls: [...prev.gallery_preview_urls, ...newPreviewUrls]
      }))
    }
  }

  const removeGalleryImage = (index: number) => {
    setFormData(prev => {
      const newFiles = prev.gallery_files.filter((_, i) => i !== index)
      const newPreviewUrls = prev.gallery_preview_urls.filter((_, i) => i !== index)
      
      // Revoke the object URL to prevent memory leaks
      URL.revokeObjectURL(prev.gallery_preview_urls[index])
      
      return {
        ...prev,
        gallery_files: newFiles,
        gallery_preview_urls: newPreviewUrls
      }
    })
  }

  const removeExistingGalleryImage = async (imageUrl: string, eventId: string) => {
    try {
      // Remove from database
      const existingEvent = events.find(e => e.id === eventId)
      if (existingEvent && existingEvent.gallery_images) {
        const updatedGallery = existingEvent.gallery_images.filter(url => url !== imageUrl)
        
        const result = await updateEvent(eventId, {
          ...existingEvent,
          gallery_images: updatedGallery
        })
        
        if (result) {
          // Refresh events list
          const data = await fetchEvents()
          setEvents(data)
          
          // If currently editing this event, update the form state
          if (editingId === eventId) {
            setFormData(prev => ({ ...prev, gallery_files: [], gallery_preview_urls: [] }))
          }
        }
      }
    } catch (error) {
      console.error('Error removing gallery image:', error)
      alert('Error removing image. Please try again.')
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

  const uploadGalleryImages = async (): Promise<string[]> => {
    if (formData.gallery_files.length === 0) return []

    const uploadedUrls: string[] = []
    
    for (const file of formData.gallery_files.slice(0, 10)) {
      const fileExt = file.name.split('.').pop()
      const fileName = `gallery_${Math.random()}.${fileExt}`
      const filePath = `events/gallery/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Error uploading gallery image:', uploadError)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      uploadedUrls.push(publicUrl)
    }

    return uploadedUrls
  }

  const resetForm = () => {
    // Revoke all object URLs to prevent memory leaks
    formData.gallery_preview_urls.forEach(url => URL.revokeObjectURL(url))
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    
    setFormData({
      title: "",
      date: "",
      location: "",
      description: "",
      category: "Talk",
      image_file: null,
      is_live: false,
      gallery_files: [],
      gallery_preview_urls: [],
      attendees: "",
      outcome: "",
      guest_feedback: "",
      student_feedback: "",
      guests: ["", "", "", "", "", "", "", "", "", ""],
    })
    setImagePreview(null)
    setShowCropDialog(false)
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.date || !formData.location || !formData.description) {
      alert("Please fill all required fields")
      return
    }

    setIsSaving(true)
    try {
      console.log('Saving event:', { editingId, formData })
      
      let imageUrl = null
      let galleryUrls: string[] = []
      
      if (formData.image_file) {
        imageUrl = await uploadImage()
      } else if (editingId) {
        const existingEvent = events.find(e => e.id === editingId)
        imageUrl = existingEvent?.image_url || null
      }
      
      if (formData.gallery_files.length > 0) {
        // Upload new gallery images
        const newGalleryUrls = await uploadGalleryImages()
        // Combine with existing gallery images if updating
        if (editingId) {
          const existingEvent = events.find(e => e.id === editingId)
          const existingGallery = existingEvent?.gallery_images || []
          galleryUrls = [...existingGallery, ...newGalleryUrls].slice(0, 10) // Limit to 10 total
        } else {
          galleryUrls = newGalleryUrls
        }
      } else if (editingId) {
        // Keep existing gallery images if no new ones selected
        const existingEvent = events.find(e => e.id === editingId)
        galleryUrls = existingEvent?.gallery_images || []
      }

      // Filter out empty guests and limit to 10
      const filteredGuests = formData.guests.filter(guest => guest.trim() !== "").slice(0, 10)

      const eventData = {
        title: formData.title,
        date: formData.date,
        location: formData.location,
        description: formData.description,
        category: formData.category,
        is_live: formData.is_live,
        gallery_images: galleryUrls,
        ...(imageUrl && { image_url: imageUrl }),
      }

      // Temporarily store additional fields in localStorage until DB is updated
      const additionalData = {
        ...(formData.attendees && { attendees: parseInt(formData.attendees) }),
        ...(formData.outcome && { outcome: formData.outcome }),
        ...(formData.guest_feedback && { guest_feedback: formData.guest_feedback }),
        ...(formData.student_feedback && { student_feedback: formData.student_feedback }),
        ...(filteredGuests.length > 0 && { guests: filteredGuests }),
      }

      console.log('Event data to save:', eventData)
      console.log('Gallery URLs:', galleryUrls)
      
      if (Object.keys(additionalData).length > 0) {
        console.log('Additional fields (stored locally):', additionalData)
        // Store additional data temporarily
        if (typeof window !== 'undefined') {
          const eventExtraData = JSON.parse(localStorage.getItem('eventExtraData') || '{}')
          const eventId = editingId || `temp_${Date.now()}`
          eventExtraData[eventId] = additionalData
          localStorage.setItem('eventExtraData', JSON.stringify(eventExtraData))
        }
      }

      if (editingId) {
        console.log('Updating existing event:', editingId)
        console.log('With data:', eventData)
        const result = await updateEvent(editingId, eventData)
        if (!result) {
          throw new Error('Failed to update event')
        }
        console.log('Event updated successfully')
      } else {
        console.log('Creating new event')
        const result = await createEvent(eventData)
        if (!result) {
          throw new Error('Failed to create event')
        }
        console.log('Event created successfully')
      }

      const data = await fetchEvents()
      setEvents(data)
      resetForm()
    } catch (error) {
      console.error('Error saving event:', error)
      alert(`Error saving event: ${error instanceof Error ? error.message : 'Unknown error'}. Please check console for details.`)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (event: Event) => {
    // Load additional data from localStorage if available
    let additionalData: any = {}
    if (typeof window !== 'undefined') {
      const eventExtraData = JSON.parse(localStorage.getItem('eventExtraData') || '{}')
      additionalData = eventExtraData[event.id] || {}
    }

    // Set existing cover image preview if available
    if (event.image_url) {
      setImagePreview(event.image_url)
    }

    setFormData({
      title: event.title,
      date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
      location: event.location,
      description: event.description,
      category: event.category || 'Talk',
      image_file: null,
      is_live: event.is_live || false,
      gallery_files: [],
      gallery_preview_urls: [],
      attendees: additionalData.attendees?.toString() || event.attendees?.toString() || "",
      outcome: additionalData.outcome || event.outcome || "",
      guest_feedback: additionalData.guest_feedback || event.guest_feedback || "",
      student_feedback: additionalData.student_feedback || event.student_feedback || "",
      guests: additionalData.guests || event.guests || ["", "", "", "", "", "", "", "", "", ""],
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
            {/* Cover Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200 w-full"
                placeholder="Cover Image"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Upload a cover image for the event (16:9 aspect ratio recommended)
              </p>
            </div>
            
            {/* Crop Cover Photo Button - Show when editing and has existing image */}
            {editingId && imagePreview && !formData.image_file && (
              <div className="md:col-span-2">
                <Button
                  type="button"
                  onClick={() => setShowCropDialog(true)}
                  variant="outline"
                  className="w-full border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                  Crop Cover Photo
                </Button>
              </div>
            )}
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="md:col-span-2">
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Event cover preview"
                      className="w-32 h-[72px] object-cover rounded-lg border-2 border-purple-200 dark:border-purple-800"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                        {editingId && !formData.image_file ? "Current cover photo" : "Cover photo ready for cropping"}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">
                        {editingId && !formData.image_file 
                          ? "Click 'Crop Cover Photo' button to adjust the existing image" 
                          : "Click 'Crop Image' above to adjust the crop area"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Gallery Images Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Event Gallery Images (Optional - Max 10)</label>
              
              {/* Show existing gallery images when editing */}
              {editingId && (() => {
                const existingEvent = events.find(e => e.id === editingId)
                const existingGallery = existingEvent?.gallery_images || []
                if (existingGallery.length > 0) {
                  return (
                    <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Current gallery: {existingGallery.length} image(s)
                        </p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {existingGallery.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-20 object-cover rounded border-2 border-blue-200 dark:border-blue-800"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingGalleryImage(url, editingId!)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                              title="Remove image"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                return null
              })()}
              
              {/* Show preview of new images being uploaded */}
              {formData.gallery_preview_urls.length > 0 && (() => {
                const existingCount = editingId ? events.find(e => e.id === editingId)?.gallery_images?.length || 0 : 0;
                const totalCount = formData.gallery_preview_urls.length + existingCount;
                
                return (
                  <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-purple-700 dark:text-purple-300">
                        New images to upload: {formData.gallery_preview_urls.length}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">
                        Total: {totalCount}/10
                      </p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {formData.gallery_preview_urls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded border-2 border-purple-200 dark:border-purple-800"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                            title="Remove image"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
              
              {/* Calculate total images and limit status */}
              {(() => {
                const existingCount = editingId ? events.find(e => e.id === editingId)?.gallery_images?.length || 0 : 0;
                const totalCount = formData.gallery_preview_urls.length + existingCount;
                const isLimitReached = totalCount >= 10;
                
                return (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryChange}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200"
                      disabled={isLimitReached}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Upload up to 10 images that will be displayed in the event gallery section
                      {editingId && " (New images will be added to existing ones)"}
                      {isLimitReached && " - Maximum limit reached"}
                    </p>
                  </>
                );
              })()}
            </div>
            
            {/* Live Event Toggle */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_live}
                  onChange={(e) => setFormData({ ...formData, is_live: e.target.checked })}
                  className="w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Mark as Live Event</span>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
                    Featured
                  </span>
                </div>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-8">
                Live events appear prominently in the upcoming events section with special styling
              </p>
            </div>
            <textarea
              placeholder="Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200 md:col-span-2 resize-none"
              required
            />
            
            {/* Additional Fields */}
            <input
              type="number"
              placeholder="Number of Attendees (Optional)"
              value={formData.attendees}
              onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
              className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200 md:col-span-2"
              min="0"
            />
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Guest Speakers (Optional - Max 10)</label>
              <div className="space-y-2">
                {formData.guests.map((guest, index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Guest ${index + 1} Name`}
                    value={guest}
                    onChange={(e) => {
                      const newGuests = [...formData.guests]
                      newGuests[index] = e.target.value
                      setFormData({ ...formData, guests: newGuests })
                    }}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200"
                  />
                ))}
              </div>
            </div>
            
            <textarea
              placeholder="Event Outcome (Optional)"
              value={formData.outcome}
              onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
              rows={3}
              className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200 md:col-span-2 resize-none"
            />
            
            <textarea
              placeholder="Guest Feedback (Optional)"
              value={formData.guest_feedback}
              onChange={(e) => setFormData({ ...formData, guest_feedback: e.target.value })}
              rows={3}
              className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200 md:col-span-2 resize-none"
            />
            
            <textarea
              placeholder="Student Feedback (Optional)"
              value={formData.student_feedback}
              onChange={(e) => setFormData({ ...formData, student_feedback: e.target.value })}
              rows={3}
              className="px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all duration-200 md:col-span-2 resize-none"
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
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {editingId ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {editingId ? "Update Event" : "Create Event"}
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              onClick={resetForm} 
              disabled={isSaving}
              className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Live Events Section */}
      {events.filter(event => event.is_live).length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Live Events ({events.filter(event => event.is_live).length})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events.filter(event => event.is_live).map((event) => (
              <Card key={event.id} className="glass p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:-translate-y-1 border-l-4 border-l-red-500">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{event.title}</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full font-medium flex items-center gap-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        LIVE
                      </span>
                      <span className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                        {event.category || 'Talk'}
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
        </div>
      )}

      {/* Previous Events Section */}
      {events.filter(event => !event.is_live).length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Previous Events ({events.filter(event => !event.is_live).length})
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.filter(event => !event.is_live).map((event) => (
              <Card key={event.id} className="glass p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:-translate-y-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{event.title}</h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                        {event.category || 'Talk'}
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
        </div>
      )}

      {events.length === 0 && !isAdding && (
        <Card className="glass p-8 text-center">
          <p className="text-muted">No events yet. Create one to get started.</p>
        </Card>
      )}
      
      {/* Image Crop Dialog */}
      <ImageCrop
        imageSrc={imagePreview || ''}
        onCropComplete={handleCropComplete}
        onClose={() => setShowCropDialog(false)}
        open={showCropDialog}
      />
    </div>
  )
}
