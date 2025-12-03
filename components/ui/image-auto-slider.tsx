"use client"

import React, { useState, useEffect, useRef } from 'react';

export const ImageAutoSlider = () => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Images for the infinite scroll - using Unsplash URLs
  const images = [
    "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=2152&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1505142468610-359e7d316be0?q=80&w=2126&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?q=80&w=1965&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1673264933212-d78737f38e48?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1711434824963-ca894373272e?q=80&w=2030&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1675705721263-0bbeec261c49?q=80&w=1940&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1524799526615-766a9833dec0?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];

  // Duplicate images for seamless loop
  const duplicatedImages = [...images, ...images];

  return (
    <div ref={containerRef} className="w-full py-20 bg-background relative overflow-hidden">
      {!isVisible && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
      
      {isVisible && (
        <>
          <style>{`
            @keyframes scroll-right {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            .infinite-scroll {
              animation: scroll-right 40s linear infinite;
            }

            .scroll-container {
              mask: linear-gradient(
                90deg,
                transparent 0%,
                black 10%,
                black 90%,
                transparent 100%
              );
              -webkit-mask: linear-gradient(
                90deg,
                transparent 0%,
                black 10%,
                black 90%,
                transparent 100%
              );
            }

            .image-item {
              transition: transform 0.3s ease, filter 0.3s ease;
            }

            .image-item:hover {
              transform: scale(1.05);
              filter: brightness(1.1);
            }
          `}</style>
          
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background z-0" />
          
          {/* Section title */}
          <div className="relative z-10 text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Gallery Highlights</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Explore moments from our events, workshops, and student activities
            </p>
          </div>
          
          {/* Scrolling images container */}
          <div className="relative z-10 w-full flex items-center justify-center">
            <div className="scroll-container w-full">
              <div className="infinite-scroll flex gap-6 w-max">
                {duplicatedImages.map((image, index) => (
                  <div
                    key={index}
                    className="image-item flex-shrink-0 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 rounded-xl overflow-hidden shadow-2xl border border-border"
                  >
                    <img
                      src={image}
                      alt={`Gallery image ${(index % images.length) + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Bottom gradient overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-20" />
        </>
      )}
    </div>
  );
};
