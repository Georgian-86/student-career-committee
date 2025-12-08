"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { fileToBase64 } from "@/lib/storage"
import { ImageCrop } from "@/components/image-crop"
import { 
  fetchTeamMembers, 
  createTeamMember, 
  updateTeamMember, 
  deleteTeamMember,
  type TeamMember 
} from "@/lib/supabase/database"
import { supabase } from "@/lib/supabase/client"

// SCC Structure departments from about page
const sccDepartments = [
  "Leadership Panel",
  "Operations Team", 
  "Outreach & Industry Relations",
  "Content & Media Team",
  "Technical Team",
  "Program & Event Management"
]

export default function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showCropDialog, setShowCropDialog] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    email: "",
    linkedin: "",
    description: "",
    image_file: null as File | null,
  })

  useEffect(() => {
    const loadMembers = async () => {
      setLoading(true)
      const data = await fetchTeamMembers()
      setMembers(data)
      setLoading(false)
    }
    loadMembers()
  }, [])

  const uploadImage = async (): Promise<string | null> => {
    if (!formData.image_file) return null

    const fileExt = formData.image_file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `team/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, formData.image_file)

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return publicUrl
  }

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
        // If conversion fails, keep the original image
        setImagePreview(imagePreview)
      })
  }

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      department: "",
      email: "",
      linkedin: "",
      description: "",
      image_file: null,
    })
    setImagePreview(null)
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.role || !formData.department || !formData.email) {
      alert("Please fill all required fields")
      return
    }

    setIsSaving(true)
    try {
      let imageUrl = null
      if (formData.image_file) {
        imageUrl = await uploadImage()
      } else if (editingId) {
        // Keep existing image if editing and no new image is uploaded
        const existingMember = members.find(m => m.id === editingId)
        imageUrl = existingMember?.image_url || null
      }

      const memberData = {
        name: formData.name,
        role: formData.role,
        department: formData.department,
        email: formData.email,
        linkedin: formData.linkedin || undefined,
        description: formData.description || undefined,
        ...(imageUrl && { image_url: imageUrl }),
      }

      if (editingId) {
        await updateTeamMember(editingId, memberData)
      } else {
        await createTeamMember(memberData)
      }

      // Refresh the team members list
      const data = await fetchTeamMembers()
      setMembers(data)
      resetForm()
    } catch (error) {
      console.error('Error saving team member:', error)
      alert('Error saving team member. Please check console for details.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (member: TeamMember) => {
    setFormData({
      name: member.name,
      role: member.role,
      department: member.department,
      email: member.email,
      linkedin: member.linkedin || "",
      description: member.description || "",
      image_file: null,
    })
    setEditingId(member.id)
    setIsAdding(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return

    try {
      // First get the member to check for an image
      const memberToDelete = members.find(m => m.id === id)
      
      // If there's an image, delete it from storage
      if (memberToDelete?.image_url) {
        const filePath = memberToDelete.image_url.split('/').pop()
        if (filePath) {
          const { error: deleteError } = await supabase.storage
            .from('images')
            .remove([`team/${filePath}`])
          
          if (deleteError) console.error('Error deleting image:', deleteError)
        }
      }

      // Delete the member from database
      await deleteTeamMember(id)

      // Refresh the list
      const data = await fetchTeamMembers()
      setMembers(data)
    } catch (error) {
      console.error('Error deleting team member:', error)
      alert('Error deleting team member. Please check console for details.')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading team members...</div>
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
        {isAdding ? "Cancel" : "Add Team Member"}
      </Button>

      {isAdding && (
        <Card className="glass p-6">
          <h3 className="text-lg font-bold mb-4">{editingId ? "Edit" : "Add New"} Team Member</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="text"
              placeholder="Role *"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <div>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
                <SelectTrigger className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent>
                  {sccDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <input
              type="text"
              placeholder="LinkedIn URL"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {imagePreview && (
              <div className="md:col-span-2">
                <p className="text-sm font-medium mb-2">Image Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-32 w-32 object-cover rounded-lg border-2 border-border"
                />
              </div>
            )}
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary md:col-span-2"
            />
            <div className="flex gap-2 mt-4 md:col-span-2">
              <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
                {isSaving ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {editingId ? "Updating..." : "Saving..."}
                  </div>
                ) : (
                  `${editingId ? "Update" : "Save"} Member`
                )}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {members.map((member) => (
          <Card key={member.id} className="glass p-4">
            <div className="flex gap-4">
              {member.image_url && (
                <img
                  src={member.image_url}
                  alt={member.name}
                  className="h-24 w-24 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1">
                <h4 className="font-bold">{member.name}</h4>
                <p className="text-sm text-primary">{member.role}</p>
                <p className="text-xs text-muted">{member.department}</p>
                <p className="text-xs text-muted mt-1">{member.email}</p>
                {member.description && <p className="text-xs text-muted mt-2">{member.description}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="p-2 hover:bg-primary/20 rounded transition-colors"
                >
                  <span className="text-lg">✏️</span>
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 hover:bg-red-500/20 rounded transition-colors"
                >
                  <span className="text-lg">🗑️</span>
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {members.length === 0 && !isAdding && (
        <Card className="glass p-8 text-center">
          <p className="text-muted">No team members yet. Add one to get started.</p>
        </Card>
      )}

      <ImageCrop
        imageSrc={imagePreview || ''}
        onCropComplete={handleCropComplete}
        onClose={() => setShowCropDialog(false)}
        open={showCropDialog}
      />
    </div>
  )
}
