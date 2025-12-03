"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { supabase } from "@/lib/supabase/client"

export interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  created_at: string
  is_read: boolean
}

export default function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setMessages(data || [])
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError('Failed to load messages. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return
    
    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      // Update local state
      setMessages(messages.filter(msg => msg.id !== id))
    } catch (err) {
      console.error('Error deleting message:', err)
      setError('Failed to delete message. Please try again.')
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', id)
      
      if (error) throw error
      
      // Update local state
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, is_read: true } : msg
      ))
    } catch (err) {
      console.error('Error marking message as read:', err)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Loading messages...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
        <button 
          onClick={fetchMessages}
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {messages.length > 0 ? (
        messages.map((msg) => (
          <Card 
            key={msg.id} 
            className={`p-4 transition-all ${!msg.is_read ? 'border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
            onClick={() => !msg.is_read && markAsRead(msg.id)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold">{msg.subject}</h4>
                  {!msg.is_read && (
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                  )}
                </div>
                <p className="text-sm text-primary mt-1">
                  {msg.name} • {msg.email}
                </p>
              </div>
              <div className="text-right ml-4">
                <p className="text-xs text-muted">
                  {new Date(msg.created_at).toLocaleString()}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(msg.id)
                  }}
                  className="mt-2 p-2 hover:bg-red-500/20 rounded transition-colors inline-block"
                  title="Delete message"
                >
                  <span className="text-lg">🗑️</span>
                </button>
              </div>
            </div>
            <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded">
              <p className="text-sm whitespace-pre-line">{msg.message}</p>
            </div>
            <div className="mt-3 pt-2 border-t border-border/50">
              <a 
                href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                className="text-sm text-blue-500 hover:underline inline-flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <span>✉️</span> Reply
              </a>
            </div>
          </Card>
        ))
      ) : (
        <Card className="p-8 text-center">
          <p className="text-muted">No messages yet. Contact form submissions will appear here.</p>
        </Card>
      )}
    </div>
  )
}
