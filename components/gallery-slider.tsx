"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GalleryImage {
  src: string
  alt: string
  title: string
  description: string
}

const galleryImages: GalleryImage[] = [
  {
    src: "/gallery/event1.jpg",
    alt: "Workshop on Web Development",
    title: "Web Dev Workshop",
    description: "Students learning modern web development techniques"
  },
  {
    src: "/gallery/event2.jpg",
    alt: "Hackathon 2023",
    title: "Annual Hackathon",
    description: "24-hour coding competition with industry experts"
  },
  {
    src: "/gallery/event3.jpg",
    alt: "Guest Lecture Series",
    title: "Industry Talk",
    description: "Insights from leading tech professionals"
  },
  {
    src: "/gallery/event4.jpg",
    alt: "Coding Bootcamp",
    title: "Coding Bootcamp",
    description: "Intensive hands-on coding sessions"
  },
  {
    src: "/gallery/event5.jpg",
    alt: "Networking Event",
    title: "Tech Networking",
    description: "Connecting students with industry leaders"
  }
]

export function GallerySlider() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryImages.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + galleryImages.length) % galleryImages.length)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      nextSlide()
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [isAutoPlaying])

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden rounded-xl bg-background/50 dark:bg-background/20 backdrop-blur-sm border border-border">
      {/* Navigation Arrows */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background/90 rounded-full h-10 w-10 shadow-lg"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background/90 rounded-full h-10 w-10 shadow-lg"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Slides */}
      <div className="relative aspect-video w-full">
        {galleryImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              priority={index === currentIndex}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-2xl font-bold text-white">{image.title}</h3>
              <p className="text-white/90">{image.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
        {galleryImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentIndex ? 'bg-primary w-6' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Auto-play toggle */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="bg-background/80 hover:bg-background/90 text-xs"
        >
          {isAutoPlaying ? 'Pause' : 'Play'}
        </Button>
      </div>
    </div>
  )
}
