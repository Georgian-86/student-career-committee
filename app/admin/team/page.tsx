'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function TeamPage() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setMembers(data || [])
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading team members...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <button
          onClick={() => router.push('/admin/team/new')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Add Team Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            {member.image_url && (
              <img
                src={member.image_url}
                alt={member.full_name}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6">
              <h3 className="text-lg font-semibold">{member.full_name}</h3>
              <p className="text-indigo-600">{member.role}</p>
              <p className="mt-2 text-gray-600">{member.bio}</p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => router.push(`/admin/team/${member.id}`)}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this member?')) {
                      await supabase
                        .from('team_members')
                        .delete()
                        .eq('id', member.id)
                      fetchTeamMembers()
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
