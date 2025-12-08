'use client'

import { AuthProvider } from '../admin/auth-context'

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
