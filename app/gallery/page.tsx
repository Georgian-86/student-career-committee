"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { loadData } from "@/lib/storage"

interface GalleryImage {
  id: string
  title: string
  image: string
  category: string
  description?: string
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = loadData<GalleryImage[]>("sccGallery", [])
    setImages(saved)
    setLoading(false)
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
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-balance">Gallery</h1>
        <p className="text-xl text-muted mb-12">Moments from our events and activities</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="aspect-square rounded-lg overflow-hidden cursor-pointer group relative"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img.image || "/placeholder.svg"}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end">
                <div className="p-4 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white font-semibold text-sm">{img.title}</p>
                  <p className="text-white/80 text-xs">{img.category}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                className="absolute -top-10 right-0 text-white hover:text-accent transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={selectedImage.image || "/placeholder.svg"}
                alt={selectedImage.title}
                className="w-full rounded-lg"
              />
              <div className="mt-4">
                <h3 className="text-xl font-bold">{selectedImage.title}</h3>
                <p className="text-muted">{selectedImage.category}</p>
                {selectedImage.description && <p className="text-sm text-muted mt-2">{selectedImage.description}</p>}
              </div>
            </div>
          </div>
        )}

        {images.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted">No photos to display. Add them in the admin dashboard.</p>
          </div>
        )}
      </div>
    </div>
  )
}
