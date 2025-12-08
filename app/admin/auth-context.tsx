"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

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
    const checkAuth = async () => {
      try {
        // Check current Supabase session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.log('[Auth] Session error:', error)
          setUser(null)
          return
        }

        if (session?.user) {
          const userData = { 
            email: session.user.email!, 
            id: session.user.id, 
            role: "admin" 
          }
          console.log('[Auth] Found active session:', userData)
          setUser(userData)
          
          // Update cookie
          const expires = new Date()
          expires.setDate(expires.getDate() + 1)
          const cookieValue = encodeURIComponent(JSON.stringify(userData))
          const cookieString = `sccAdminUser=${cookieValue}; Path=/; Expires=${expires.toUTCString()}; SameSite=Lax`
          document.cookie = cookieString
        } else {
          // Check cookie as fallback
          const cookie = document.cookie.split('; ').find(row => row.startsWith('sccAdminUser='))
          if (cookie) {
            const userData = JSON.parse(decodeURIComponent(cookie.split('=')[1]))
            console.log('[Auth] Found cookie user:', userData)
            setUser(userData)
          } else {
            setUser(null)
          }
        }
      } catch (err) {
        console.log('[Auth] Check auth error:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    console.log('[Auth] Login attempt:', email)
    try {
      // Use Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.log('[Auth] Supabase error:', error)
        throw new Error(error.message)
      }

      if (data.user) {
        const userData = { 
          email: data.user.email!, 
          id: data.user.id, 
          role: "admin" 
        }
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
      }
    } catch (err) {
      console.log('[Auth] Login error:', err)
      throw err
    }
  }

  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut()
    } catch (err) {
      console.log('[Auth] Supabase logout error:', err)
    }
    
    // Clear local state and cookie
    setUser(null)
    document.cookie = 'sccAdminUser=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/login')
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
