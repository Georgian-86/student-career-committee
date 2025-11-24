"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

interface AuthContextType {
  user: any | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth state
    const storedUser = localStorage.getItem("sccAdminUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Demo authentication - replace with Firebase Auth
    if (email === "admin@scc.com" && password === "admin123") {
      const userData = { email, id: "admin_001", role: "admin" }
      setUser(userData)
      localStorage.setItem("sccAdminUser", JSON.stringify(userData))
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem("sccAdminUser")
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
