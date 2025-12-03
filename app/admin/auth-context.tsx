"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { setCookie, deleteCookie, getCookie } from 'cookies-next'

interface User {
  email: string
  id: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for stored auth state
    const checkAuth = () => {
      try {
        const userCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('sccAdminUser='))
          ?.split('=')[1]
        
        if (userCookie) {
          const decodedUser = decodeURIComponent(userCookie)
          setUser(JSON.parse(decodedUser))
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        document.cookie = 'sccAdminUser=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    console.log('[Auth] Login attempt:', email)
    // Demo authentication - replace with Firebase Auth
    if (email === "admin@scc.com" && password === "admin123") {
      const userData = { email, id: "admin_001", role: "admin" }
      console.log('[Auth] Setting user data:', userData)
      setUser(userData)
      
      // Set cookie that expires in 1 day
      const expires = new Date()
      expires.setDate(expires.getDate() + 1)
      
      const cookieValue = encodeURIComponent(JSON.stringify(userData))
      const cookieString = `sccAdminUser=${cookieValue}; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax`
      console.log('[Auth] Setting cookie:', cookieString)
      document.cookie = cookieString
      console.log('[Auth] Current cookies:', document.cookie)
    } else {
      console.log('[Auth] Invalid credentials')
      throw new Error("Invalid credentials")
    }
  }

  const logout = async () => {
    setUser(null)
    // Clear the cookie
    document.cookie = 'sccAdminUser=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/admin/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
