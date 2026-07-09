"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { 
  GitGraph, 
  BookOpen, 
  Code, 
  Github, 
  Linkedin, 
  Globe, 
  Mail, 
  Star, 
  Award, 
  ShieldCheck,
  ArrowRight
} from "lucide-react"

// Particle network simulation for the hero background
function AboutParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
    }

    const particles: Particle[] = []
    const maxParticles = 40
    const connectionDist = 120

    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 2 + 1,
      })
    }

    let animationFrameId = 0

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const isDark = document.documentElement.classList.contains("dark")
      const dotColor = isDark ? "rgba(16, 185, 129, 0.2)" : "rgba(16, 185, 129, 0.12)"
      const lineColor = isDark ? "rgba(16, 185, 129, 0.06)" : "rgba(16, 185, 129, 0.04)"

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y)

          if (dist < connectionDist) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = lineColor
            ctx.lineWidth = (1 - dist / connectionDist) * 0.8
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = dotColor
        ctx.fill()

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
}

// Mini interactive graph visualization for "Our Story" section
function StoryGraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = (canvas.width = 400)
    const height = (canvas.height = 300)

    interface Node {
      id: number
      x: number
      y: number
      label: string
      state: "default" | "visited" | "current" | "path"
    }

    interface Edge {
      from: number
      to: number
      state: "default" | "active" | "path"
    }

    const nodes: Node[] = [
      { id: 0, x: 80, y: 150, label: "Start", state: "default" },
      { id: 1, x: 180, y: 70, label: "A", state: "default" },
      { id: 2, x: 180, y: 230, label: "B", state: "default" },
      { id: 3, x: 280, y: 70, label: "C", state: "default" },
      { id: 4, x: 280, y: 230, label: "D", state: "default" },
      { id: 5, x: 340, y: 150, label: "Goal", state: "default" },
    ]

    const edges: Edge[] = [
      { from: 0, to: 1, state: "default" },
      { from: 0, to: 2, state: "default" },
      { from: 1, to: 3, state: "default" },
      { from: 2, to: 4, state: "default" },
      { from: 1, to: 2, state: "default" },
      { from: 3, to: 5, state: "default" },
      { from: 4, to: 5, state: "default" },
      { from: 3, to: 4, state: "default" },
    ]

    let step = 0
    let timer = 0

    // Animation timeline values
    const resetGraph = () => {
      nodes.forEach(n => (n.state = "default"))
      edges.forEach(e => (e.state = "default"))
    }

    const runSimulation = () => {
      timer++
      if (timer % 60 === 0) {
        step++
        if (step === 1) {
          // Current: Start, visit A and B
          nodes[0].state = "current"
        } else if (step === 2) {
          nodes[0].state = "visited"
          nodes[1].state = "current"
          nodes[2].state = "current"
          edges[0].state = "active"
          edges[1].state = "active"
        } else if (step === 3) {
          nodes[1].state = "visited"
          nodes[2].state = "visited"
          nodes[3].state = "current"
          nodes[4].state = "current"
          edges[2].state = "active"
          edges[3].state = "active"
        } else if (step === 4) {
          nodes[3].state = "visited"
          nodes[4].state = "visited"
          nodes[5].state = "current"
          edges[5].state = "active"
          edges[6].state = "active"
        } else if (step === 5) {
          // Highlight shortest path
          nodes[0].state = "path"
          nodes[1].state = "path"
          nodes[3].state = "path"
          nodes[5].state = "path"
          edges[0].state = "path"
          edges[2].state = "path"
          edges[5].state = "path"
        } else if (step > 8) {
          step = 0
          resetGraph()
        }
      }
    }

    let animationFrameId = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      runSimulation()

      const isDark = document.documentElement.classList.contains("dark")
      const fontColor = isDark ? "#ffffff" : "#09090b"
      const defaultEdgeColor = isDark ? "rgba(255, 255, 255, 0.15)" : "rgba(9, 9, 11, 0.15)"

      // Draw edges
      for (const e of edges) {
        const fromNode = nodes[e.from]
        const toNode = nodes[e.to]

        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)

        if (e.state === "path") {
          ctx.strokeStyle = "#10b981"
          ctx.lineWidth = 3
        } else if (e.state === "active") {
          ctx.strokeStyle = "#3b82f6"
          ctx.lineWidth = 2
        } else {
          ctx.strokeStyle = defaultEdgeColor
          ctx.lineWidth = 1.2
        }
        ctx.stroke()
      }

      // Draw nodes
      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, 16, 0, Math.PI * 2)

        if (n.state === "path") {
          ctx.fillStyle = "#065f46"
          ctx.strokeStyle = "#10b981"
          ctx.lineWidth = 2.5
        } else if (n.state === "current") {
          ctx.fillStyle = "#1e3a8a"
          ctx.strokeStyle = "#3b82f6"
          ctx.lineWidth = 2.5
        } else if (n.state === "visited") {
          ctx.fillStyle = "#78350f"
          ctx.strokeStyle = "#f59e0b"
          ctx.lineWidth = 1.5
        } else {
          ctx.fillStyle = isDark ? "#18181b" : "#f4f4f5"
          ctx.strokeStyle = isDark ? "#3f3f46" : "#e4e4e7"
          ctx.lineWidth = 1.5
        }
        ctx.fill()
        ctx.stroke()

        // Label
        ctx.fillStyle = fontColor
        ctx.font = "bold 9px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(n.label, n.x, n.y)
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="h-full w-full rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 bg-zinc-50/20 dark:bg-zinc-950/20 backdrop-blur-md flex items-center justify-center p-6 shadow-inner overflow-hidden">
      <canvas ref={canvasRef} className="max-w-full aspect-[4/3] block" />
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="relative bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[40rem] right-10 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-900 bg-gradient-to-b from-emerald-50/20 via-transparent to-transparent dark:from-emerald-950/5">
        <AboutParticleCanvas />
        <div className="container relative z-10">
          <div className="max-w-[800px] mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-xs text-emerald-600 dark:text-emerald-400 font-bold tracking-wide animate-pulse">
              <Star className="w-3.5 h-3.5 fill-current" />
              Inside GraphAlgo
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              About GraphAlgo
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-[650px] mx-auto leading-relaxed">
              We make theoretical computer science accessible, interactive, and beautiful for learners worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50/30 dark:bg-zinc-900/5">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                <Award className="h-3.5 w-3.5" /> The Journey
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Our Story</h2>
              <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
                GraphAlgo was born from a simple observation: many students and developers struggle to understand graph algorithms through static textbooks and abstract pseudocode. 
              </p>
              <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Founded in 2026, our platform bridges the gap between theory and practical visualization. By tracking lines of code in real-time side-by-side with interactive network adjustments, learners grasp operations instantly.
              </p>
              <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
                What started as a sandbox experiment has grown into a comprehensive web suite serving students, educators, and software engineers aiming to build intuitive graph logic models.
              </p>
            </div>
            <div className="relative h-[320px] md:h-[400px] w-full">
              <StoryGraphCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-900">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Our Core Mission</h2>
            <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-[650px] mx-auto leading-relaxed">
              We focus on building learning layouts that make algorithms engaging, visual, and simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group overflow-hidden border border-zinc-200/80 dark:border-zinc-900/80 bg-white dark:bg-zinc-900/20 backdrop-blur-md shadow-lg hover:border-emerald-500/30 transition-all duration-300">
              <CardContent className="pt-8 pb-6 flex flex-col items-center text-center space-y-5">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold">Interactive Education</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed px-2">
                  Provide accessible education that transforms abstract pseudocode into dynamic, interactive sandboxes.
                </p>
              </CardContent>
            </Card>

            <Card className="group overflow-hidden border border-zinc-200/80 dark:border-zinc-900/80 bg-white dark:bg-zinc-900/20 backdrop-blur-md shadow-lg hover:border-emerald-500/30 transition-all duration-300">
              <CardContent className="pt-8 pb-6 flex flex-col items-center text-center space-y-5">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <GitGraph className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold">Visual Mechanics</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed px-2">
                  Design precise traversals showing current paths, queues, stack highlights, and node states in real-time.
                </p>
              </CardContent>
            </Card>

            <Card className="group overflow-hidden border border-zinc-200/80 dark:border-zinc-900/80 bg-white dark:bg-zinc-900/20 backdrop-blur-md shadow-lg hover:border-emerald-500/30 transition-all duration-300">
              <CardContent className="pt-8 pb-6 flex flex-col items-center text-center space-y-5">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Code className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold">Continuous Innovation</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed px-2">
                  Constantly add graph algorithms, expand supporting syntax types, and optimize visual canvas controls.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-20 md:py-28 bg-zinc-50/30 dark:bg-zinc-900/5 border-b border-zinc-200 dark:border-zinc-900">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Meet the Developer</h2>
            <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-[500px] mx-auto leading-relaxed">
              The founder and full-stack engineer behind the interactive visualizer.
            </p>
          </div>

          <Card className="group overflow-hidden border border-zinc-200/80 dark:border-zinc-900/80 bg-white dark:bg-zinc-900/20 backdrop-blur-md shadow-xl hover:border-emerald-500/30 transition-all duration-300">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Avatar Frame with gradient edge */}
                <div className="h-32 w-32 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 p-[1.5px] shadow-lg shadow-emerald-500/10 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 flex-shrink-0">
                  <div className="h-full w-full rounded-[14px] bg-zinc-950 flex items-center justify-center">
                    <Code className="h-14 w-14 text-emerald-400" />
                  </div>
                </div>
                <div className="space-y-4 text-center md:text-left flex-1">
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Imtiaz Ahmad Tanvir</h3>
                    <p className="text-emerald-500 dark:text-emerald-400 text-sm font-bold tracking-wide uppercase mt-1">Founder & Developer</p>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    A passionate full-stack engineer specialized in creating highly visual interactive learning environments. Imtiaz constructs tools that bridge structural data engineering with custom dynamic canvas illustrations to turn complex algorithm mechanics into clear mental maps.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                    <Button variant="outline" size="sm" asChild className="border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 shadow-sm transition-transform hover:-translate-y-0.5">
                      <a href="https://github.com/imtiazahmadtanvir" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <Github className="h-4 w-4 text-emerald-400" />
                        GitHub
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 shadow-sm transition-transform hover:-translate-y-0.5">
                      <a href="https://www.linkedin.com/in/imtiaz-tanveer07" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <Linkedin className="h-4 w-4 text-emerald-400" />
                        LinkedIn
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 shadow-sm transition-transform hover:-translate-y-0.5">
                      <a href="https://imtiaz-tanvir-portfolio.netlify.app/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-emerald-400" />
                        Portfolio
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 shadow-sm transition-transform hover:-translate-y-0.5">
                      <a href="mailto:imtiaz.tanvir.dev@gmail.com" className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-emerald-400" />
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
      <section className="relative overflow-hidden py-20 md:py-28 bg-gradient-to-t from-emerald-50/20 via-transparent to-transparent dark:from-emerald-950/5">
        <div className="container relative z-10">
          <div className="max-w-[700px] mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" /> Start Learning
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready to Master Graph Logic?</h2>
            <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-[500px] mx-auto leading-relaxed">
              Launch our visualizers and trace grid pathfindings, BFS levels, or graph coloring configurations instantly.
            </p>
            <div className="pt-4">
              <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 font-bold transition-transform hover:-translate-y-0.5 shadow-md shadow-emerald-500/15">
                <Link href="/algorithms">
                  Explore Visualizers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
