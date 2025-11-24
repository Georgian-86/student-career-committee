"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface Message {
  id: string
  name: string
  email: string
  subject: string
  message: string
  date: string
}

export default function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("sccContactMessages")
    if (saved) setMessages(JSON.parse(saved))
  }, [])

  const handleDelete = (id: string) => {
    const updated = messages.filter((m) => m.id !== id)
    setMessages(updated)
    localStorage.setItem("sccContactMessages", JSON.stringify(updated))
  }

  return (
    <div className="space-y-4">
      {messages.length > 0 ? (
        messages.map((msg) => (
          <Card key={msg.id} className="glass p-4 hover:neon-glow transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold">{msg.subject}</h4>
                <p className="text-sm text-primary">{msg.name}</p>
                <a href={`mailto:${msg.email}`} className="text-xs text-accent hover:underline">
                  {msg.email}
                </a>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted">{new Date(msg.date).toLocaleDateString()}</p>
                <button
                  onClick={() => handleDelete(msg.id)}
                  className="mt-2 p-2 hover:bg-red-500/20 rounded transition-colors inline-block"
                >
                  <span className="text-lg">🗑️</span>
                </button>
              </div>
            </div>
            <p className="text-sm text-muted mt-3">{msg.message}</p>
          </Card>
        ))
      ) : (
        <Card className="glass p-8 text-center">
          <p className="text-muted">No messages yet. Contact messages will appear here.</p>
        </Card>
      )}
    </div>
  )
}
