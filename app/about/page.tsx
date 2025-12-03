"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollReveal } from "@/components/scroll-reveal"
import { GradientText } from "@/components/ui/gradient-text"
import { DynamicBackground } from "@/components/ui/dynamic-background"
import { FloatingShapes } from "@/components/ui/floating-shapes"
import { supabase } from "@/lib/supabase/client"
import { FlipCard } from "@/components/flip-card"
import { ArrowRight } from "lucide-react"
import { fetchAboutItems, type AboutItem } from "@/lib/supabase/database"

export default function About() {
  const [items, setItems] = useState<AboutItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true)
      const data = await fetchAboutItems()
      setItems(data)
      setLoading(false)
    }
    loadItems()
  }, [])

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <DynamicBackground />
        <FloatingShapes />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-2xl text-white">Loading...</div>
        </div>
      </div>
    )
  }

  // Default content if no admin content exists
  const defaultSections = {
    vision:
      "To empower every SCSE student with the skills, exposure, and confidence required to excel in their professional journey.",
    mission:
      "The Student Career Committee (SCC) is a student-led body within the School of Computer Science & Engineering (SCSE) at Lovely Professional University. Our mission is to bridge the gap between students and industry, enhance career readiness, and create meaningful opportunities for students through events, mentorship, and industry engagement.",
    purposes: [
      { 
        title: "Industry Connections", 
        description: "Building bridges between students and industry professionals through networking events, mentorship programs, and direct interactions with recruiters and alumni leaders."
      },
      { 
        title: "Career Preparation", 
        description: "Equipping students with the necessary skills and knowledge for successful internships, job placements, research opportunities, and advanced academic pursuits."
      },
      { 
        title: "Career Guidance", 
        description: "Providing personalized career counseling, skill development workshops, and actionable insights to help students make informed career decisions."
      },
      { 
        title: "Collaboration Ecosystem", 
        description: "Creating a sustainable platform for industry-academia collaboration that benefits both students and corporate partners through meaningful engagements."
      },
    ],
    structure: [
      { title: "Leadership Panel", desc: "Head, Vice Head, Coordinators" },
      { title: "Operations Team", desc: "Logistics and event planning" },
      { title: "Outreach & Industry Relations", desc: "Speaker engagement and partnerships" },
      { title: "Content & Media Team", desc: "Creatives and social media" },
      { title: "Technical Team", desc: "Websites and live streaming" },
      { title: "Program & Event Management", desc: "Speaker and volunteer management" },
    ],
    impact: [
      { title: "Career Growth", items: ["Improved placements", "Industry awareness", "Interview prep"] },
      { title: "Skill Development", items: ["Technical skills", "Soft skills", "Real-world problem solving"] },
      { title: "Networking", items: ["Industry connections", "Alumni relations", "Mentorship access"] },
      { title: "Community", items: ["Tech communities", "Peer learning", "Student initiatives"] },
    ],
  }

  return (
    <div className="relative min-h-screen">
      <DynamicBackground />
      <FloatingShapes />
      
      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-purple-500/30">
              <h1 className="text-6xl md:text-7xl font-bold mb-6">
                <GradientText>About SCC</GradientText>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl text-foreground/90 leading-relaxed mb-4 whitespace-nowrap"
              >
                Empowering the next generation of tech leaders through innovation, collaboration, and excellence
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-lg text-muted-foreground leading-relaxed text-justify"
              >
                The Student Career Committee (SCC) at Lovely Professional University's School of Computer Science & Engineering is a dynamic student-led organization dedicated to bridging the gap between academia and industry. We strive to create comprehensive opportunities for students to develop their technical skills, build professional networks, and gain real-world exposure through workshops, seminars, hackathons, and industry interactions.
              </motion.p>
            </div>
          </motion.div>

          {/* Vision Section */}
          <section className="mb-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-6">
                <GradientText>Our Vision</GradientText>
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 md:p-12 border-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-lg">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center">
                  {items.find((i) => i.type === "section" && i.title === "Vision")?.description || defaultSections.vision}
                </p>
              </Card>
            </motion.div>
          </section>

          {/* Mission Section */}
          <section className="mb-20">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-6">
                <GradientText>Our Mission</GradientText>
              </h2>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 md:p-12 border-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-lg">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed text-center">
                  {items.find((i) => i.type === "section" && i.title === "Mission")?.description || defaultSections.mission}
                </p>
              </Card>
            </motion.div>
          </section>

          {/* Core Purpose */}
          <section className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-6">
                <GradientText>Core Purpose</GradientText>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {defaultSections.purposes.map((item, i) => (
                <FlipCard
                  key={i}
                  title={item.title}
                  description={item.description}
                  number={`0${i + 1}`}
                  gradient={i === 0 ? 'linear-gradient(45deg, #3503ad, #f7308c)' : i === 1 ? 'linear-gradient(45deg, #ccff00, #09afff)' : i === 2 ? 'linear-gradient(45deg, #e91e63, #ffeb3b)' : 'linear-gradient(45deg, #8b5cf6, #ec4899)'}
                />
              ))}
            </div>
          </section>

          {/* Structure Section */}
          <section className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-6">
                <GradientText>SCC Structure</GradientText>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {defaultSections.structure.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-lg hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300 group">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform duration-300">
                          {i + 1}
                        </div>
                        <h3 className="ml-4 font-bold text-lg group-hover:text-purple-400 transition-colors duration-300">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">{item.desc}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full group-hover:bg-purple-500/10 group-hover:border-purple-500/50 transition-all duration-300"
                      onClick={() => window.location.href = `/team?structure=${encodeURIComponent(item.title)}`}
                    >
                      View Team Members
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Button>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Impact Section */}
          <section className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-6">
                <GradientText>Our Impact</GradientText>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {defaultSections.impact.map((item, i) => (
                <FlipCard
                  key={i}
                  title={item.title}
                  description={item.items.join(' • ')}
                  number={`0${i + 1}`}
                  gradient={i === 0 ? 'linear-gradient(45deg, #8b5cf6, #ec4899)' : i === 1 ? 'linear-gradient(45deg, #3b82f6, #8b5cf6)' : i === 2 ? 'linear-gradient(45deg, #10b981, #3b82f6)' : 'linear-gradient(45deg, #f59e0b, #ef4444)'}
                />
              ))}
            </div>
          </section>

          {/* Stats Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-8 text-center border-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-lg">
                <div className="text-4xl font-bold text-purple-400 mb-2">5000+</div>
                <div className="text-muted-foreground">Students Impacted</div>
              </Card>
              <Card className="p-8 text-center border-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg">
                <div className="text-4xl font-bold text-blue-400 mb-2">50+</div>
                <div className="text-muted-foreground">Events Conducted</div>
              </Card>
              <Card className="p-8 text-center border-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-lg">
                <div className="text-4xl font-bold text-pink-400 mb-2">30+</div>
                <div className="text-muted-foreground">Industry Partners</div>
              </Card>
            </div>
          </motion.section>

          {/* Admin added content */}
          {items.length > 0 && (
            <section className="mt-20">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-4xl font-bold mb-6">
                  <GradientText>Additional Information</GradientText>
                </h2>
              </motion.div>
              <div className="space-y-8">
                {items.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="p-8 border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-lg">
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="h-64 w-full object-cover rounded-lg mb-6"
                        />
                      )}
                      <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
