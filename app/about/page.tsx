import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GitGraph, BookOpen, Code, User } from "lucide-react"

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Johnson",
      role: "Founder & Lead Developer",
    },
    {
      name: "Maria Garcia",
      role: "Algorithm Specialist",
    },
    {
      name: "David Kim",
      role: "UI/UX Designer",
    },
    {
      name: "Sarah Williams",
      role: "Educational Content Creator",
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#f0f9f0] dark:bg-[#0a1f0a] py-16 md:py-24">
        <div className="container">
          <div className="max-w-[800px] mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">About GraphAlgo</h1>
            <p className="text-xl text-muted-foreground">
              We're on a mission to make graph algorithms accessible and understandable for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Our Story</h2>
              <p className="text-lg text-muted-foreground">
                GraphAlgo was born from a simple observation: many students and professionals struggle to understand
                graph algorithms through traditional learning methods.
              </p>
              <p className="text-lg text-muted-foreground">
                Founded in 2023, our platform aims to bridge the gap between theoretical knowledge and practical
                understanding by providing interactive visualizations of complex algorithms.
              </p>
              <p className="text-lg text-muted-foreground">
                What started as a small project has grown into a comprehensive learning platform used by thousands of
                students, educators, and professionals worldwide.
              </p>
            </div>
            <div className="relative h-[400px] w-400">
              <Image
                src="/home.png"
                alt="Our Story"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 md:py-24 bg-[#f0f9f0] dark:bg-[#0a1f0a]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
              We're dedicated to making complex algorithms accessible through visual learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white dark:bg-card">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-[#f0f9f0] dark:bg-[#0a1f0a] flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-[#4ade80]" />
                  </div>
                  <h3 className="text-xl font-bold">Education</h3>
                  <p className="text-muted-foreground">
                    Provide accessible educational resources that make learning algorithms engaging and effective.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-[#f0f9f0] dark:bg-[#0a1f0a] flex items-center justify-center">
                    <GitGraph className="h-6 w-6 text-[#4ade80]" />
                  </div>
                  <h3 className="text-xl font-bold">Visualization</h3>
                  <p className="text-muted-foreground">
                    Create intuitive visualizations that transform abstract concepts into tangible understanding.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-[#f0f9f0] dark:bg-[#0a1f0a] flex items-center justify-center">
                    <Code className="h-6 w-6 text-[#4ade80]" />
                  </div>
                  <h3 className="text-xl font-bold">Innovation</h3>
                  <p className="text-muted-foreground">
                    Continuously improve our platform with new algorithms, features, and learning approaches.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
              The passionate individuals behind GraphAlgo who are dedicated to making algorithm learning accessible.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-4">
                <div className="h-32 w-32 rounded-full bg-[#f0f9f0] dark:bg-[#0a1f0a] flex items-center justify-center">
                  <User className="h-16 w-16 text-[#4ade80]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#f0f9f0] dark:bg-[#0a1f0a]">
        <div className="container">
          <div className="max-w-[800px] mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Join Our Community</h2>
            <p className="text-xl text-muted-foreground">
              Be part of our growing community of algorithm enthusiasts and learners.
            </p>
            <div className="pt-4">
              <Button size="lg" className="bg-[#4ade80] hover:bg-[#22c55e] text-white">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
