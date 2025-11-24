"use client"

import type { ReactNode } from "react"

interface AnimatedCardProps {
  children: ReactNode
  delay?: number
  className?: string
  variant?: "default" | "glow" | "intense"
  hover?: boolean
}

export function AnimatedCard({
  children,
  delay = 0,
  className = "",
  variant = "default",
  hover = true,
}: AnimatedCardProps) {
  const glowClass = variant === "intense" ? "neon-glow-intense" : variant === "glow" ? "neon-glow" : ""

  return (
    <div
      className={`animate-scale-in opacity-100 ${glowClass} ${hover ? "hover-scale" : ""} ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
