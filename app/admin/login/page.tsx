"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../auth-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && user) {
      router.push("/admin")
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-accent" />
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    console.log("[v0] Login attempt with email:", email)

    try {
      await login(email, password)
      console.log("[v0] Login successful, redirecting")
      router.push("/admin")
    } catch (err) {
      console.log("[v0] Login error:", err)
      setError(err instanceof Error ? err.message : "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-background">
      <Card className="glass w-full max-w-md p-8">
        <div className="mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg mb-4" />
          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-muted">Manage SCC content and events</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="admin@scc.com"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm flex items-start gap-2">
              <span className="text-lg mt-0.5 flex-shrink-0">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>

          <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
            <p className="text-xs font-semibold text-primary mb-2">Demo Credentials</p>
            <p className="text-xs text-muted">Email: admin@scc.com</p>
            <p className="text-xs text-muted">Password: admin123</p>
          </div>
        </form>
      </Card>
    </div>
  )
}
