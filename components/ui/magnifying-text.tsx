"use client"

import React, { useState, useRef, useEffect } from 'react'

interface MagnifyingTextProps {
  children: React.ReactNode
  className?: string
}

export function MagnifyingText({ children, className = "" }: MagnifyingTextProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      container.addEventListener('mouseenter', () => setIsHovering(true))
      container.addEventListener('mouseleave', () => setIsHovering(false))
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('mouseenter', () => setIsHovering(true))
        container.removeEventListener('mouseleave', () => setIsHovering(false))
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className={`relative inline-block ${className}`}
      style={{ cursor: 'none' }}
    >
      {children}
      
      {isHovering && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            left: mousePosition.x - 75,
            top: mousePosition.y - 75,
            width: 150,
            height: 150,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(var(--primary),0.1) 0%, rgba(var(--primary),0.05) 40%, transparent 70%)',
            backdropFilter: 'blur(2px)',
            transform: 'scale(1.2)',
            transition: 'all 0.1s ease-out',
            border: '2px solid rgba(var(--primary),0.3)',
            boxShadow: '0 0 20px rgba(var(--primary),0.4)'
          }}
        />
      )}
      
      {/* Custom cursor */}
      {isHovering && (
        <div
          className="absolute pointer-events-none z-50"
          style={{
            left: mousePosition.x - 10,
            top: mousePosition.y - 10,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'rgba(var(--primary),0.8)',
            border: '2px solid white',
            boxShadow: '0 0 10px rgba(var(--primary),0.6)'
          }}
        />
      )}
    </div>
  )
}
