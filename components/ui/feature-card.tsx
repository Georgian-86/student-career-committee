"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"

interface FeatureCardProps {
  title: string
  description: string
  icon?: React.ReactNode
  delay?: number
}

export function FeatureCard({ title, description, icon, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
    >
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:-translate-y-2">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative p-6">
          {icon && (
            <div className="mb-4 text-purple-500 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )}
          <h3 className="text-xl font-bold mb-3 group-hover:text-purple-400 transition-colors duration-300">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
