"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { loadData, saveData, fileToBase64 } from "@/lib/storage"

interface TeamMember {
  id: string
  name: string
  role: string
  department: string
  email: string
  linkedin?: string
  image?: string
  description?: string
}

export default function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    email: "",
    linkedin: "",
    description: "",
    image: "",
  })

  useEffect(() => {
    const saved = loadData<TeamMember[]>("sccTeamMembers", [])
    setMembers(saved)
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
      name: "",
      role: "",
      department: "",
      email: "",
      linkedin: "",
      description: "",
      image: "",
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleSave = () => {
    if (!formData.name || !formData.role || !formData.department || !formData.email) {
      alert("Please fill all required fields")
      return
    }

    let updated: TeamMember[]

    if (editingId) {
      updated = members.map((m) =>
        m.id === editingId
          ? {
              ...m,
              ...formData,
            }
          : m,
      )
    } else {
      const newMember: TeamMember = {
        id: Date.now().toString(),
        ...formData,
      }
      updated = [...members, newMember]
    }

    setMembers(updated)
    saveData("sccTeamMembers", updated)
    resetForm()
  }

  const handleEdit = (member: TeamMember) => {
    setFormData({
      name: member.name,
      role: member.role,
      department: member.department,
      email: member.email,
      linkedin: member.linkedin || "",
      description: member.description || "",
      image: member.image || "",
    })
    setEditingId(member.id)
    setIsAdding(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      const updated = members.filter((m) => m.id !== id)
      setMembers(updated)
      saveData("sccTeamMembers", updated)
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
            />
            <input
              type="text"
              placeholder="Role *"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="text"
              placeholder="Department *"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
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
            <textarea
              placeholder="Description"
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
            <Button onClick={handleSave}>{editingId ? "Update" : "Save"} Member</Button>
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {members.map((member) => (
          <Card key={member.id} className="glass p-4">
            <div className="flex gap-4">
              {member.image && (
                <img
                  src={member.image || "/placeholder.svg"}
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
    </div>
  )
}
