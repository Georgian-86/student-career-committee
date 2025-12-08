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
  width?: number
  height?: number
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to load image dimensions
  const loadImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight })
      }
      img.onerror = reject
      img.src = url
    })
  }

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true)
      try {
        const data = await fetchGalleryImages()
        
        // Load dimensions for each image
        const imagesWithDimensions = await Promise.all(
          data.map(async (image) => {
            try {
              const dimensions = await loadImageDimensions(image.image_url)
              return { ...image, ...dimensions }
            } catch (error) {
              console.error('Failed to load dimensions for image:', image.image_url)
              return { ...image, width: 400, height: 300 } // fallback dimensions
            }
          })
        )
        
        setImages(imagesWithDimensions)
      } catch (error) {
        console.error('Error loading images:', error)
        setImages([])
      } finally {
        setLoading(false)
      }
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
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 dark:from-purple-900/40 dark:via-blue-900/40 dark:to-cyan-900/40">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-cyan-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16 relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-purple-500 to-cyan-500 rounded-full animate-pulse"></div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent animate-gradient bg-300">
              SCC Gallery
            </h1>
            <div className="h-1 w-24 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Immerse yourself in the vibrant memories and unforgettable moments from our events, workshops, and activities. Each photo tells a story of innovation, collaboration, and growth.
            </p>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-purple-500/20 rounded-full animate-bounce delay-300"></div>
            <div className="absolute -top-8 -right-8 w-6 h-6 bg-cyan-500/20 rounded-full animate-bounce delay-500"></div>
            <div className="absolute -bottom-4 left-8 w-4 h-4 bg-blue-500/20 rounded-full animate-bounce delay-700"></div>
          </div>
        </ScrollReveal>

        {/* Masonry Gallery */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-8 space-y-8">
          {images.map((image, idx) => {
            const aspectRatio = (image.height || 300) / (image.width || 400)
            const spanClass = aspectRatio > 1.5 ? 'span-y-2' : aspectRatio < 0.7 ? 'span-y-1' : 'span-y-1'
            
            return (
              <div 
                key={image.id} 
                onClick={() => setSelectedImage(image)} 
                className="cursor-pointer group/item break-inside-avoid mb-8"
              >
                <AnimatedCard
                  delay={idx * 100}
                  className="glass overflow-hidden rounded-3xl group shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md relative"
                  variant="glow"
                >
                  {/* Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                  
                  <div className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-blue-100 to-cyan-100 dark:from-purple-900/30 dark:via-blue-900/30 dark:to-cyan-900/30">
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="w-full object-cover group-hover:scale-110 transition-transform duration-700"
                      style={{
                        maxHeight: aspectRatio > 2 ? '600px' : aspectRatio < 0.5 ? '200px' : '400px'
                      }}
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      {image.category}
                    </div>
                  </div>
                  <div className="p-3 relative">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {image.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full animate-pulse"></span>
                        {image.category}
                      </p>
                      {image.width && image.height && (
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {image.width}×{image.height}
                        </span>
                      )}
                    </div>
                  </div>
                </AnimatedCard>
              </div>
            )
          })}
        </div>

        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
              <button
                className="absolute -top-16 right-0 text-white/80 hover:text-white transition-all duration-300 p-3 rounded-full hover:bg-white/10 backdrop-blur-sm"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-8 h-8" />
              </button>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-700/50">
                <div className="relative">
                  <img
                    src={selectedImage.image_url}
                    alt={selectedImage.title}
                    className="w-full max-h-[70vh] object-contain"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent"></div>
                </div>
                <div className="p-8 bg-gradient-to-br from-gray-800 to-gray-900 relative">
                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-32 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full"></div>
                  <div className="absolute top-0 right-0 w-24 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"></div>
                  
                  <h3 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {selectedImage.title}
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-full text-cyan-400 text-sm font-medium backdrop-blur-sm">
                      {selectedImage.category}
                    </span>
                    <div className="flex gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                      <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200"></span>
                      <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-400"></span>
                    </div>
                  </div>
                  {selectedImage.description && (
                    <p className="text-gray-300 text-lg leading-relaxed">{selectedImage.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {images.length === 0 && (
          <div className="text-center py-32 relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-gradient-to-br from-purple-200/20 to-cyan-200/20 dark:from-purple-900/20 dark:to-cyan-900/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
            
            <div className="relative z-10 max-w-md mx-auto">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-8 relative group">
                <svg className="w-12 h-12 text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {/* Floating Elements */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-purple-500/30 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-cyan-500/30 rounded-full animate-bounce delay-300"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                No Photos Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                Start building your visual story! Add photos in the admin dashboard to showcase your amazing events and activities.
              </p>
              <div className="flex justify-center gap-2">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200"></span>
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-400"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
