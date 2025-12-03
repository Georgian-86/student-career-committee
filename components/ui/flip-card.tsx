"use client"

import React from "react"

interface FlipCardProps {
  title: string
  description: string
  number: string
  gradient: string
  className?: string
}

export function FlipCard({ title, description, number, gradient, className = "" }: FlipCardProps) {
  return (
    <div className={`flip-card ${className}`}>
      <div className="flip-card-face face1">
        <div className="flip-card-content">
          <h3 className="flip-card-title">{title}</h3>
          <p className="flip-card-description">{description}</p>
        </div>
      </div>
      <div className="flip-card-face face2" style={{ background: gradient }}>
        <div className="flip-card-number">{number}</div>
      </div>
    </div>
  )
}
