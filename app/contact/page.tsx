"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, Phone, MapPin } from "lucide-react"
import { saveData, loadData } from "@/lib/storage"
import { supabase } from "@/lib/supabase/client"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Save to Supabase first
      const { data, error } = await supabase
        .from('messages')
        .insert({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          is_read: false
        })
        .select()
        .single()
      
      if (error) {
        console.error('Error saving to Supabase:', error)
        // Fallback to localStorage if Supabase fails
        const message = {
          id: Date.now().toString(),
          ...formData,
          date: new Date().toISOString().split("T")[0],
        }
        
        const existing = loadData("sccContactMessages", [])
        saveData("sccContactMessages", [...existing, message])
      } else {
        console.log('Message saved to Supabase:', data)
      }
      
      setSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
      setTimeout(() => setSubmitted(false), 3000)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error submitting message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-balance">Get in Touch</h1>
        <p className="text-xl text-muted mb-12">Have questions? We'd love to hear from you.</p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Mail className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="mailto:scc@scse.lpu.in" className="text-muted hover:text-primary transition-colors">
                    scc@scse.lpu.in
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Phone</h3>
                  <a href="tel:+91-XXXXX-XXXXX" className="text-muted hover:text-primary transition-colors">
                    +91 XXXXX XXXXX
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <MapPin className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Location</h3>
                  <p className="text-muted">
                    SCSE, Lovely Professional University
                    <br />
                    Phagwara, Punjab, India
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 glass p-6 rounded-lg">
              <h3 className="font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {[
                  { name: "LinkedIn", url: "https://linkedin.com" },
                  { name: "Instagram", url: "https://instagram.com" },
                  { name: "Twitter", url: "https://twitter.com" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-primary transition-colors text-sm"
                  >
                    {social.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Card className="glass p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Message subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your message..."
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </Button>

                {submitted && (
                  <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
                    Thank you! Your message has been sent successfully.
                  </div>
                )}
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
