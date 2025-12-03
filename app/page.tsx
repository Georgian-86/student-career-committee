import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ScrollReveal } from "@/components/scroll-reveal"
import { AnimatedCard } from "@/components/animated-card"
import { BackgroundPaths } from "@/components/ui/background-paths"
import { ImageAutoSlider } from "@/components/ui/image-auto-slider"
import { LazyLoad } from "@/components/ui/lazy-load"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen px-4 sm:px-6 lg:px-8 overflow-hidden flex items-center">
        {/* BackgroundPaths as background layer */}
        <div className="absolute inset-0 -z-10">
          <BackgroundPaths title="" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center">
            <h1 className="text-6xl md:text-7xl font-black text-balance gradient-text-animated animate-fade-in mb-4 hover:scale-105 transition-transform duration-300 hover:brightness-110 cursor-default">
              Student Career Committee
            </h1>

            <p className="text-2xl md:text-3xl font-semibold text-balance mb-8 text-primary animate-slide-in-down hover:scale-105 transition-transform duration-300 hover:text-purple-400 cursor-default">
              Empowering Your Career
            </p>

            <p className="text-lg md:text-xl text-muted max-w-3xl mx-auto mb-8 leading-relaxed animate-slide-in-up animation-delay-500 hover:scale-102 transition-transform duration-300 hover:text-muted-foreground/90 cursor-default">
              The Student Career Committee (SCC) is a student-led body within the School of Computer Science &
              Engineering (SCSE) at Lovely Professional University. Our mission is to bridge the gap between students
              and industry, enhance career readiness, and create meaningful opportunities for students through events,
              mentorship, and industry engagement.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12 animate-slide-in-up animation-delay-1000">
            <Link href="/events">
              <Button size="lg" className="w-full sm:w-auto hover:neon-glow transition-all">
                Explore Events →
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent hover-scale">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <LazyLoad>
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30 dark:bg-secondary/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <ScrollReveal delay={0}>
            <div className="text-center p-6 rounded-lg transition-all duration-300 hover:bg-background/50 dark:hover:bg-background/20">
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">5000+</div>
              <p className="text-foreground/80 dark:text-foreground/70">Students Impacted</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="text-center p-6 rounded-lg transition-all duration-300 hover:bg-background/50 dark:hover:bg-background/20">
              <div className="text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">50+</div>
              <p className="text-foreground/80 dark:text-foreground/70">Events Organized</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="text-center p-6 rounded-lg transition-all duration-300 hover:bg-background/50 dark:hover:bg-background/20">
              <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">30+</div>
              <p className="text-foreground/80 dark:text-foreground/70">Industry Partners</p>
            </div>
          </ScrollReveal>
        </div>
        </section>
      </LazyLoad>

      {/* Features Section */}
      <LazyLoad>
        <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <h2 className="text-4xl font-bold text-center mb-12 text-balance">What We Offer</h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Tech Talks",
                description: "Learn from industry experts and tech leaders",
              },
              {
                title: "Mentorship",
                description: "Get guidance from alumni and professionals",
              },
              {
                title: "Internships",
                description: "Connect with companies for internship opportunities",
              },
              {
                title: "Workshops",
                description: "Develop skills through hands-on workshops",
              },
              {
                title: "Hackathons",
                description: "Compete and showcase your technical abilities",
              },
              {
                title: "Networking",
                description: "Build relationships with peers and industry leaders",
              },
            ].map((item, i) => (
              <AnimatedCard key={i} delay={i * 100} className="glass p-6 rounded-lg hover-scale" variant="glow">
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-muted">{item.description}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
        </section>
      </LazyLoad>

      {/* Image Auto Slider Section */}
      <section className="relative overflow-hidden">
        <ImageAutoSlider />
      </section>

      {/* CTA Section */}
      <LazyLoad>
        <section className="py-20 px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="max-w-4xl mx-auto">
          <div className="glass p-8 md:p-12 text-center rounded-2xl hover:neon-glow-intense transition-smooth">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Launch Your Career?</h2>
            <p className="text-lg text-muted mb-8">
              Join hundreds of SCSE students who have benefited from SCC events and mentorship programs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="hover:neon-glow">
                  Get in Touch
                </Button>
              </Link>
              <Link href="/events">
                <Button size="lg" variant="outline" className="hover-scale bg-transparent">
                  See Upcoming Events
                </Button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
      </LazyLoad>
    </div>
  )
}
