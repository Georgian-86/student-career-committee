"use client"

import { Card } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { loadData } from "@/lib/storage"
import { ScrollReveal } from "@/components/scroll-reveal"

interface AboutItem {
  id: string
  title: string
  description: string
  type: "section" | "item"
  image?: string
}

export default function About() {
  const [items, setItems] = useState<AboutItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = loadData<AboutItem[]>("sccAbout", [])
    setItems(saved)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-accent" />
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
      "Connect students with industry leaders, recruiters, and alumni mentors",
      "Prepare students for internships, jobs, research roles, and higher studies",
      "Provide actionable guidance on career development",
      "Build a strong industry-college collaboration ecosystem",
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
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <h1 className="text-5xl font-bold mb-8 text-balance">About SCC</h1>
        </ScrollReveal>

        {/* Vision Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-lg text-muted leading-relaxed">
            {items.find((i) => i.type === "section" && i.title === "Vision")?.description || defaultSections.vision}
          </p>
        </section>

        {/* Mission Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-muted leading-relaxed">
            {items.find((i) => i.type === "section" && i.title === "Mission")?.description || defaultSections.mission}
          </p>
        </section>

        {/* Core Purpose */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Core Purpose</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {defaultSections.purposes.map((item, i) => (
              <Card key={i} className="glass p-4">
                <p className="text-muted">{item}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Structure Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">SCC Structure</h2>
          <div className="space-y-4">
            {defaultSections.structure.map((item, i) => (
              <div key={i} className="glass p-4 rounded-lg">
                <h3 className="font-bold text-primary mb-1">{item.title}</h3>
                <p className="text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Our Impact</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {defaultSections.impact.map((item, i) => (
              <Card key={i} className="glass p-6">
                <h3 className="text-lg font-bold mb-3 text-primary">{item.title}</h3>
                <ul className="space-y-2">
                  {item.items.map((subitem, j) => (
                    <li key={j} className="text-sm text-muted flex items-center">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                      {subitem}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* Admin added content */}
        {items.length > 0 && (
          <section className="mt-12 pt-12 border-t border-border">
            <h2 className="text-3xl font-bold mb-6">Additional Information</h2>
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id}>
                  {item.image && (
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="h-48 w-full object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted">{item.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
