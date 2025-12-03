"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedCard } from "@/components/animated-card"
import { LazyLoad } from "@/components/ui/lazy-load"
import { fetchGalleryImages } from "@/lib/supabase/database"

interface GalleryImage {
  id: string
  title: string
  image_url: string
  category: string
  description?: string
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true)
      const data = await fetchGalleryImages()
      setImages(data)
      setLoading(false)
    }
    loadImages()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-accent" />
          <p className="mt-4 text-muted">Loading gallery...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              SCC Gallery
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Relive the memorable moments and highlights from our events, workshops, and activities
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {images.map((image, idx) => (
            <div key={image.id} onClick={() => setSelectedImage(image)} className="cursor-pointer">
              <AnimatedCard
                delay={idx * 100}
                className="glass overflow-hidden rounded-2xl group shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md"
                variant="glow"
              >
                <div className="aspect-square overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {image.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{image.category}</p>
                </div>
              </AnimatedCard>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-8 h-8" />
              </button>
              <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.title}
                  className="w-full max-h-[70vh] object-contain"
                />
                <div className="p-6 bg-gray-800">
                  <h3 className="text-2xl font-bold text-white mb-2">{selectedImage.title}</h3>
                  <p className="text-blue-400 text-sm font-medium mb-3">{selectedImage.category}</p>
                  {selectedImage.description && <p className="text-gray-300">{selectedImage.description}</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {images.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">No Photos Yet</h3>
              <p className="text-gray-600 dark:text-gray-300">No photos to display. Add them in the admin dashboard to showcase your events!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
