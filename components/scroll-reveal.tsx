"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export function ScrollReveal({ children, delay = 0, className = "" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-slide-in-up")
          entry.target.classList.remove("opacity-0")
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}
