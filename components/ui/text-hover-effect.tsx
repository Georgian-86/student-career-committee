"use client"

import React from "react"

interface TextHoverEffectProps {
  text: string
  className?: string
}

export function TextHoverEffect({ text, className = "" }: TextHoverEffectProps) {
  return (
    <div className={className}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          style={{
            display: 'inline-block',
            transition: 'all 0.3s ease',
            transitionDelay: `${index * 0.05}s`,
            cursor: 'default'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.1)'
            e.currentTarget.style.filter = 'brightness(1.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)'
            e.currentTarget.style.filter = 'brightness(1)'
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  )
}
