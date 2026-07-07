import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GitGraph, BookOpen, Code, Github, Linkedin, Globe, Mail } from "lucide-react"

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#f0f9f0] dark:bg-black py-16 md:py-24 transition-colors duration-200">
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
      <section className="hidden py-16 md:py-24">
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
            <div className="relative h-[400px] w-full">
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
      <section className="py-16 md:py-24 bg-[#f0f9f0] dark:bg-black transition-colors duration-200">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
              We're dedicated to making complex algorithms accessible through visual learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white dark:bg-zinc-950 border border-[#4ade80]/20">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-[#f0f9f0] dark:bg-zinc-900 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-[#4ade80]" />
                  </div>
                  <h3 className="text-xl font-bold">Education</h3>
                  <p className="text-muted-foreground">
                    Provide accessible educational resources that make learning algorithms engaging and effective.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-950 border border-[#4ade80]/20">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-[#f0f9f0] dark:bg-zinc-900 flex items-center justify-center">
                    <GitGraph className="h-6 w-6 text-[#4ade80]" />
                  </div>
                  <h3 className="text-xl font-bold">Visualization</h3>
                  <p className="text-muted-foreground">
                    Create intuitive visualizations that transform abstract concepts into tangible understanding.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-950 border border-[#4ade80]/20">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="h-12 w-12 rounded-full bg-[#f0f9f0] dark:bg-zinc-900 flex items-center justify-center">
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

      {/* Developer Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet the Developer</h2>
            <p className="text-xl text-muted-foreground">
              The creator behind the interactive GraphAlgo platform.
            </p>
          </div>

          <Card className="border border-[#4ade80]/20 bg-white dark:bg-zinc-950 shadow-xl overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="h-40 w-40 rounded-full bg-[#f0f9f0] dark:bg-zinc-900 border border-[#4ade80]/25 flex items-center justify-center flex-shrink-0">
                  <Code className="h-20 w-20 text-[#4ade80]" />
                </div>
                <div className="space-y-4 text-center md:text-left flex-1">
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Imtiaz Ahmad Tanvir</h3>
                    <p className="text-[#4ade80] font-semibold">Full-Stack Developer</p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    A passionate software developer specialized in building visual education platforms, algorithm traversers, and state-of-the-art interactive front-ends. Imtiaz creates tools that bridge theory with interactive execution to make complex computer science themes simple and accessible.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                    <Button variant="outline" size="sm" asChild className="border-[#4ade80]/30 hover:bg-[#4ade80]/10 flex items-center gap-2">
                      <a href="https://github.com/imtiazahmadtanvir" target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 text-[#4ade80]" />
                        GitHub
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="border-[#4ade80]/30 hover:bg-[#4ade80]/10 flex items-center gap-2">
                      <a href="https://www.linkedin.com/in/imtiaz-tanveer07" target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 text-[#4ade80]" />
                        LinkedIn
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="border-[#4ade80]/30 hover:bg-[#4ade80]/10 flex items-center gap-2">
                      <a href="https://imtiaz-tanvir-portfolio.netlify.app/" target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 text-[#4ade80]" />
                        Portfolio
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="border-[#4ade80]/30 hover:bg-[#4ade80]/10 flex items-center gap-2">
                      <a href="mailto:imtiaz.tanvir.dev@gmail.com">
                        <Mail className="h-4 w-4 text-[#4ade80]" />
                        Email
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#f0f9f0] dark:bg-black transition-colors duration-200">
        <div className="container">
          <div className="max-w-[800px] mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Join Our Community</h2>
            <p className="text-xl text-muted-foreground">
              Be part of our growing community of algorithm enthusiasts and learners.
            </p>
            <div className="pt-4">
              <Button size="lg" className="bg-[#4ade80] hover:bg-[#22c55e] text-white font-semibold">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
