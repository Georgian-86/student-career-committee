"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  threshold?: number
  rootMargin?: string
}

export function ScrollReveal({ 
  children, 
  delay = 0, 
  className = "",
  threshold = 0.1,
  rootMargin = '50px'
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          entry.target.classList.add("animate-slide-in-up")
          entry.target.classList.remove("opacity-0")
          observer.unobserve(entry.target)
        }
      },
      { threshold, rootMargin },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return (
    <div 
      ref={ref} 
      className={`${className} ${!isVisible ? 'opacity-0' : ''}`} 
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
