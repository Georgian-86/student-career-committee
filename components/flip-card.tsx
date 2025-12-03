"use client"

import { ReactNode } from "react"

interface FlipCardProps {
  title: string
  description: string
  number: string
  gradient: string
}

export function FlipCard({ title, description, number, gradient }: FlipCardProps) {
  return (
    <>
      <style jsx>{`
        .flip-card {
          position: relative;
          width: 350px;
          height: 400px;
          margin: 0 auto;
          background: transparent;
          box-shadow: 0 15px 60px rgba(0,0,0, .1);
          border-radius: 1rem;
          transition: transform 0.3s ease;
        }

        .flip-card:hover {
          transform: translateY(-5px);
        }

        .flip-card .face {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .flip-card .face.face1 {
          box-sizing: border-box;
          padding: 1.25rem;
        }

        .flip-card .face.face2 {
          transition: 0.5s;
          border-radius: 1rem;
        }

        .flip-card .face.face2:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 50%;
          height: 100%;
          background: rgba(255,255,255, 0.1);
          border-radius: 1rem 0 0 1rem;
        }

        .flip-card .face.face2 h2 {
          margin: 0;
          padding: 0;
          font-size: 10em;
          color: #fff;
          transition: 0.5s;
          text-shadow: 0 2px 5px rgba(0,0,0, .2);
        }

        .flip-card:hover .face.face2 {
          height: 60px;
          border-radius: 0 0 1rem 1rem;
        }

        .flip-card:hover .face.face2 h2 {
          font-size: 2em;
        }

        @media (max-width: 400px) {
          .flip-card {
            width: 300px;
            height: 350px;
          }
        }
      `}</style>
      <div className="flip-card">
        <div className="face face1 bg-background border rounded-2xl p-5">
          <div className="content">
            <h2 className="text-foreground font-semibold text-lg mb-4">{title}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
          </div>
        </div>
        <div 
          className="face face2 rounded-2xl"
          style={{
            background: gradient
          }}
        >
          <h2 className="text-white font-bold text-8xl drop-shadow-lg">{number}</h2>
        </div>
      </div>
    </>
  )
}
