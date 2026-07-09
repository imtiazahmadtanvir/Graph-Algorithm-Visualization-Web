"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  GitGraph, 
  GitFork, 
  Palette, 
  Network, 
  Route, 
  GitBranch, 
  ArrowRight, 
  Star, 
  Clock, 
  Database, 
  Cpu 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

// Particle network simulation for the hero section background
function ParticleNetworkCanvas() {
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
    const maxParticles = 60
    const connectionDist = 110

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
      })
    }

    let mouse = { x: -1000, y: -1000 }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)

    let animationFrameId = 0

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      
      // Determine theme colors dynamically
      const isDark = document.documentElement.classList.contains("dark")
      const dotColor = isDark ? "rgba(16, 185, 129, 0.25)" : "rgba(16, 185, 129, 0.15)"
      const lineColor = isDark ? "rgba(16, 185, 129, 0.08)" : "rgba(16, 185, 129, 0.05)"

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        
        // Connect to mouse
        const dxMouse = p1.x - mouse.x
        const dyMouse = p1.y - mouse.y
        const distMouse = Math.hypot(dxMouse, dyMouse)
        if (distMouse < connectionDist + 30) {
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = isDark ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.1)"
          ctx.lineWidth = 0.8
          ctx.stroke()
        }

        // Connect to other particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.hypot(dx, dy)

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

      // Draw particles
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = dotColor
        ctx.fill()

        // Move
        p.x += p.vx
        p.y += p.vy

        // Bounce boundaries
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
      canvas?.removeEventListener("mousemove", handleMouseMove)
      canvas?.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0"
    />
  )
}

interface Algorithm {
  id: string
  title: string
  description: string
  href: string
  icon: React.ReactNode
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  timeComplexity: string
  spaceComplexity: string
  primaryDataStructure: string
  svgPreview: React.ReactNode
}

export default function AlgorithmsPage() {
  const algorithms: Algorithm[] = [
    {
      id: "astar",
      title: "A* Pathfinding",
      description: "Finds the shortest path on a coordinate grid using weighted costs and straight-line heuristics.",
      href: "/algorithms/astar",
      icon: <GitGraph className="h-6 w-6 text-emerald-400" />,
      category: "pathfinding",
      difficulty: "Hard",
      timeComplexity: "O(E)",
      spaceComplexity: "O(V)",
      primaryDataStructure: "Min-Priority Queue",
      svgPreview: (
        <svg viewBox="0 0 200 120" className="w-full h-full fill-none stroke-current stroke-[1.5] text-zinc-400 dark:text-zinc-600">
          <g>
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={i} x1={i * 25} y1="0" x2={i * 25} y2="120" className="stroke-zinc-200 dark:stroke-zinc-800/40" strokeWidth="0.8" />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1="0" y1={i * 30} x2={200} y2={i * 30} className="stroke-zinc-200 dark:stroke-zinc-800/40" strokeWidth="0.8" />
            ))}
          </g>
          <rect x="75" y="30" width="25" height="60" fill="rgba(239, 68, 68, 0.08)" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="1" />
          <circle cx="25" cy="60" r="5" fill="#3b82f6" stroke="#3b82f6" />
          <circle cx="175" cy="60" r="5" fill="#10b981" stroke="#10b981" />
          <path d="M 25,60 C 50,30 100,10 125,60 C 135,80 160,75 175,60" className="svg-astar-path" stroke="#10b981" strokeWidth="2.5" />
          <circle cx="125" cy="60" r="4" className="svg-astar-node" style={{ transformOrigin: "125px 60px" }} fill="#fb923c" stroke="#fb923c" />
        </svg>
      )
    },
    {
      id: "bfs",
      title: "Breadth-First Search",
      description: "Explores nodes level-by-level, traversing outward in concentric circles to find unweighted paths.",
      href: "/algorithms/bfs",
      icon: <Network className="h-6 w-6 text-emerald-400" />,
      category: "traversal",
      difficulty: "Easy",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
      primaryDataStructure: "Queue (FIFO)",
      svgPreview: (
        <svg viewBox="0 0 200 120" className="w-full h-full fill-none stroke-current stroke-[1.5] text-zinc-400 dark:text-zinc-600">
          <circle cx="100" cy="60" r="28" className="svg-bfs-ring-1" style={{ transformOrigin: "100px 60px" }} stroke="rgba(16, 185, 129, 0.15)" strokeDasharray="3 3" />
          <circle cx="100" cy="60" r="48" className="svg-bfs-ring-2" style={{ transformOrigin: "100px 60px" }} stroke="rgba(16, 185, 129, 0.08)" strokeDasharray="3 3" />
          <circle cx="100" cy="60" r="5" className="svg-bfs-node-start" style={{ transformOrigin: "100px 60px" }} fill="#f97316" stroke="#f97316" />
          <line x1="100" y1="60" x2="80" y2="40" className="stroke-zinc-300 dark:stroke-zinc-700/60" />
          <line x1="100" y1="60" x2="120" y2="40" className="stroke-zinc-300 dark:stroke-zinc-700/60" />
          <line x1="100" y1="60" x2="100" y2="88" className="stroke-zinc-300 dark:stroke-zinc-700/60" />
          <circle cx="80" cy="40" r="4.5" className="svg-bfs-node-l1" style={{ transformOrigin: "80px 40px" }} fill="#3b82f6" stroke="#3b82f6" />
          <circle cx="120" cy="40" r="4.5" className="svg-bfs-node-l1" style={{ transformOrigin: "120px 40px" }} fill="#3b82f6" stroke="#3b82f6" />
          <circle cx="100" cy="88" r="4.5" className="svg-bfs-node-l1" style={{ transformOrigin: "100px 88px" }} fill="#3b82f6" stroke="#3b82f6" />
          <line x1="80" y1="40" x2="55" y2="35" className="stroke-zinc-200 dark:stroke-zinc-700/30" />
          <line x1="120" y1="40" x2="145" y2="35" className="stroke-zinc-200 dark:stroke-zinc-700/30" />
          <circle cx="55" cy="35" r="4" className="svg-bfs-node-l2 fill-zinc-400 stroke-zinc-400 dark:fill-zinc-600 dark:stroke-zinc-600" style={{ transformOrigin: "55px 35px" }} />
          <circle cx="145" cy="35" r="4" className="svg-bfs-node-l2 fill-zinc-400 stroke-zinc-400 dark:fill-zinc-600 dark:stroke-zinc-600" style={{ transformOrigin: "145px 35px" }} />
        </svg>
      )
    },
    {
      id: "dfs",
      title: "Depth-First Search",
      description: "Traverses tree branches deeply down vertical corridors before backtracking.",
      href: "/algorithms/dfs",
      icon: <GitFork className="h-6 w-6 text-emerald-400" />,
      category: "traversal",
      difficulty: "Easy",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
      primaryDataStructure: "Stack / Call Stack",
      svgPreview: (
        <svg viewBox="0 0 200 120" className="w-full h-full fill-none stroke-current stroke-[1.5] text-zinc-400 dark:text-zinc-600">
          <circle cx="100" cy="20" r="5" fill="#3b82f6" stroke="#3b82f6" />
          <line x1="100" y1="20" x2="60" y2="55" className="svg-dfs-line-1" stroke="#10b981" strokeWidth="2" />
          <circle cx="60" cy="55" r="4.5" className="svg-dfs-node-1" style={{ transformOrigin: "60px 55px" }} fill="#10b981" stroke="#10b981" />
          <line x1="60" y1="55" x2="35" y2="95" className="svg-dfs-line-2" stroke="#10b981" strokeWidth="2" />
          <circle cx="35" cy="95" r="4" className="svg-dfs-node-2" style={{ transformOrigin: "35px 95px" }} fill="#10b981" stroke="#10b981" />
          <line x1="60" y1="55" x2="85" y2="95" className="stroke-zinc-300 dark:stroke-zinc-700/50" />
          <circle cx="85" cy="95" r="4" className="fill-zinc-400 stroke-zinc-400 dark:fill-zinc-600 dark:stroke-zinc-600" />
          <line x1="100" y1="20" x2="140" y2="55" className="stroke-zinc-300 dark:stroke-zinc-700/50" />
          <circle cx="140" cy="55" r="4.5" className="fill-zinc-400 stroke-zinc-400 dark:fill-zinc-600 dark:stroke-zinc-600" />
        </svg>
      )
    },
    {
      id: "dijkstra",
      title: "Dijkstra's Algorithm",
      description: "Finds the absolute shortest weighted route by greedily evaluating path costs.",
      href: "/algorithms/dijkstra",
      icon: <Route className="h-6 w-6 text-emerald-400" />,
      category: "pathfinding",
      difficulty: "Medium",
      timeComplexity: "O((V+E) log V)",
      spaceComplexity: "O(V)",
      primaryDataStructure: "Min-Heap Queue",
      svgPreview: (
        <svg viewBox="0 0 200 120" className="w-full h-full fill-none stroke-current stroke-[1.5] text-zinc-400 dark:text-zinc-600">
          <line x1="30" y1="60" x2="90" y2="25" className="svg-dijkstra-path-1" stroke="#10b981" strokeWidth="2" />
          <line x1="30" y1="60" x2="90" y2="95" className="stroke-zinc-300 dark:stroke-zinc-700/50" />
          <line x1="90" y1="25" x2="170" y2="60" className="svg-dijkstra-path-2" stroke="#10b981" strokeWidth="2" />
          <line x1="90" y1="95" x2="170" y2="60" className="stroke-zinc-300 dark:stroke-zinc-700/50" />
          <circle cx="30" cy="60" r="5" className="svg-dijkstra-node-start" style={{ transformOrigin: "30px 60px" }} fill="#3b82f6" stroke="#3b82f6" />
          <circle cx="90" cy="25" r="4.5" className="svg-dijkstra-node-mid" style={{ transformOrigin: "90px 25px" }} fill="#10b981" stroke="#10b981" />
          <circle cx="90" cy="95" r="4.5" className="fill-zinc-400 stroke-zinc-400 dark:fill-zinc-600 dark:stroke-zinc-600" />
          <circle cx="170" cy="60" r="5" className="svg-dijkstra-node-end" style={{ transformOrigin: "170px 60px" }} fill="#10b981" stroke="#10b981" />
          <text x="50" y="37" className="text-[9px] fill-zinc-500 dark:fill-zinc-400 stroke-none font-bold">2</text>
          <text x="50" y="87" className="text-[9px] fill-zinc-500 dark:fill-zinc-400 stroke-none font-bold">7</text>
          <text x="135" y="37" className="text-[9px] fill-zinc-500 dark:fill-zinc-400 stroke-none font-bold">3</text>
          <text x="135" y="87" className="text-[9px] fill-zinc-500 dark:fill-zinc-400 stroke-none font-bold">1</text>
        </svg>
      )
    },
    {
      id: "prims",
      title: "Prim's MST Algorithm",
      description: "Computes a Minimum Spanning Tree connecting all nodes with the minimum edge weight sum.",
      href: "/algorithms/prims",
      icon: <GitBranch className="h-6 w-6 text-emerald-400" />,
      category: "spanning-tree",
      difficulty: "Medium",
      timeComplexity: "O(E log V)",
      spaceComplexity: "O(V)",
      primaryDataStructure: "Min-Priority Queue",
      svgPreview: (
        <svg viewBox="0 0 200 120" className="w-full h-full fill-none stroke-current stroke-[1.5] text-zinc-400 dark:text-zinc-600">
          <line x1="40" y1="30" x2="100" y2="20" stroke="rgba(156, 163, 175, 0.15)" strokeDasharray="2 2" />
          <line x1="100" y1="20" x2="160" y2="40" stroke="rgba(156, 163, 175, 0.15)" strokeDasharray="2 2" />
          <line x1="40" y1="90" x2="160" y2="80" stroke="rgba(156, 163, 175, 0.15)" strokeDasharray="2 2" />
          
          <line x1="40" y1="30" x2="40" y2="90" stroke="#10b981" strokeWidth="2.5" className="svg-mst-edge-1" />
          <line x1="40" y1="90" x2="100" y2="100" stroke="#10b981" strokeWidth="2.5" className="svg-mst-edge-2" />
          <line x1="100" y1="100" x2="160" y2="80" stroke="#10b981" strokeWidth="2.5" className="svg-mst-edge-3" />
          <line x1="100" y1="20" x2="100" y2="100" stroke="#10b981" strokeWidth="2.5" className="svg-mst-edge-4" />

          <circle cx="40" cy="30" r="4.5" fill="#3b82f6" stroke="#3b82f6" />
          <circle cx="100" cy="20" r="4.5" fill="#10b981" stroke="#10b981" />
          <circle cx="160" cy="40" r="4.5" fill="#10b981" stroke="#10b981" />
          <circle cx="40" cy="90" r="4.5" fill="#10b981" stroke="#10b981" />
          <circle cx="100" cy="100" r="4.5" fill="#10b981" stroke="#10b981" />
          <circle cx="160" cy="80" r="4.5" fill="#10b981" stroke="#10b981" />

          <text x="32" y="63" className="text-[8px] fill-zinc-500 dark:fill-zinc-400 stroke-none font-bold">1</text>
          <text x="65" y="103" className="text-[8px] fill-zinc-500 dark:fill-zinc-400 stroke-none font-bold">3</text>
          <text x="135" y="97" className="text-[8px] fill-zinc-500 dark:fill-zinc-400 stroke-none font-bold">2</text>
          <text x="105" y="63" className="text-[8px] fill-zinc-500 dark:fill-zinc-400 stroke-none font-bold">4</text>
        </svg>
      )
    },
    {
      id: "graph-coloring",
      title: "Graph Coloring",
      description: "Colors vertices such that no adjacent sharing edges share the same color category.",
      href: "/algorithms/graph-coloring",
      icon: <Palette className="h-6 w-6 text-emerald-400" />,
      category: "coloring",
      difficulty: "Medium",
      timeComplexity: "O(V^2 + E)",
      spaceComplexity: "O(V)",
      primaryDataStructure: "Adjacent Sets / Array",
      svgPreview: (
        <svg viewBox="0 0 200 120" className="w-full h-full fill-none stroke-current stroke-[1.5] text-zinc-400 dark:text-zinc-600">
          <polygon points="100,20 160,55 137,100 63,100 40,55" stroke="rgba(156, 163, 175, 0.3)" strokeWidth="1" />
          <line x1="100" y1="20" x2="137" y2="100" stroke="rgba(156, 163, 175, 0.15)" />
          <line x1="40" y1="55" x2="160" y2="55" stroke="rgba(156, 163, 175, 0.15)" />

          <circle cx="100" cy="20" r="5.5" fill="#ef4444" stroke="#ef4444" className="svg-coloring-node" style={{ transformOrigin: "100px 20px" }} />
          <circle cx="160" cy="55" r="5.5" fill="#3b82f6" stroke="#3b82f6" className="svg-coloring-node svg-coloring-node-delay-1" style={{ transformOrigin: "160px 55px" }} />
          <circle cx="137" cy="100" r="5.5" fill="#10b981" stroke="#10b981" className="svg-coloring-node svg-coloring-node-delay-2" style={{ transformOrigin: "137px 100px" }} />
          <circle cx="63" cy="100" r="5.5" fill="#3b82f6" stroke="#3b82f6" className="svg-coloring-node svg-coloring-node-delay-3" style={{ transformOrigin: "63px 100px" }} />
          <circle cx="40" cy="55" r="5.5" fill="#10b981" stroke="#10b981" className="svg-coloring-node svg-coloring-node-delay-4" style={{ transformOrigin: "40px 55px" }} />
        </svg>
      )
    },
  ]

  const getDifficultyColor = (diff: "Easy" | "Medium" | "Hard") => {
    switch (diff) {
      case "Easy":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
      case "Medium":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20"
      case "Hard":
        return "bg-rose-500/10 text-rose-500 border border-rose-500/20"
    }
  }

  return (
    <div className="bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen">
      {/* Hero Section with Network Particles Canvas */}
      <section className="relative overflow-hidden py-20 md:py-28 border-b border-zinc-200 dark:border-zinc-900 bg-gradient-to-b from-emerald-50/20 via-transparent to-transparent dark:from-emerald-950/5">
        <ParticleNetworkCanvas />
        <div className="container relative z-10">
          <div className="max-w-[800px] mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-xs text-emerald-600 dark:text-emerald-400 font-bold tracking-wide animate-pulse">
              <Star className="w-3.5 h-3.5 fill-current" />
              Algorithm Core Hub
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              Interactive Library
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 max-w-[650px] mx-auto leading-relaxed">
              Unlock complex structures step-by-step. Select a category below and visualize operations on dynamic nodes instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs list & filtering */}
      <section className="py-16">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-center mb-10">
              <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 border border-zinc-200 dark:border-zinc-800 rounded-xl max-w-2xl overflow-x-auto flex-nowrap w-full sm:w-auto">
                <TabsTrigger value="all" className="rounded-lg text-xs font-semibold py-2 px-4 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 transition-all">
                  All Algorithms
                </TabsTrigger>
                <TabsTrigger value="pathfinding" className="rounded-lg text-xs font-semibold py-2 px-4 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 transition-all">
                  Pathfinding
                </TabsTrigger>
                <TabsTrigger value="traversal" className="rounded-lg text-xs font-semibold py-2 px-4 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 transition-all">
                  Traversal
                </TabsTrigger>
                <TabsTrigger value="spanning-tree" className="rounded-lg text-xs font-semibold py-2 px-4 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 transition-all">
                  Spanning Tree
                </TabsTrigger>
                <TabsTrigger value="coloring" className="rounded-lg text-xs font-semibold py-2 px-4 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 transition-all">
                  Coloring
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {algorithms.map((algorithm) => (
                  <AlgorithmCard key={algorithm.id} algorithm={algorithm} difficultyColor={getDifficultyColor(algorithm.difficulty)} />
                ))}
              </div>
            </TabsContent>

            {["pathfinding", "traversal", "spanning-tree", "coloring"].map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {algorithms
                    .filter((algo) => algo.category === category)
                    .map((algorithm) => (
                      <AlgorithmCard key={algorithm.id} algorithm={algorithm} difficultyColor={getDifficultyColor(algorithm.difficulty)} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </div>
  )
}

function AlgorithmCard({ algorithm, difficultyColor }: { algorithm: Algorithm; difficultyColor: string }) {
  return (
    <Card className="group overflow-hidden border border-zinc-200/80 dark:border-zinc-900/80 bg-white dark:bg-zinc-900/20 backdrop-blur-md shadow-lg hover:shadow-emerald-500/[0.03] hover:border-emerald-500/30 transition-all duration-300 flex flex-col hover:-translate-y-1">
      <CardHeader className="pb-3 bg-gradient-to-b from-zinc-50/50 to-transparent dark:from-zinc-900/10">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-emerald-500/5">
            {algorithm.icon}
          </div>
          <Badge variant="outline" className={`font-mono text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${difficultyColor}`}>
            {algorithm.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-400 transition-colors">
          {algorithm.title}
        </CardTitle>
        <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed min-h-[40px] mt-1.5">
          {algorithm.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        {/* Animated Preview Canvas Grid */}
        <div className="h-32 bg-zinc-50/50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 flex items-center justify-center p-3 overflow-hidden shadow-inner group-hover:border-emerald-500/20 dark:group-hover:border-emerald-500/15 transition-colors duration-300">
          {algorithm.svgPreview}
        </div>

        {/* Info badges */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-900/60">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
            <Clock className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">{algorithm.timeComplexity}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
            <Database className="h-3.5 w-3.5 text-teal-500 shrink-0" />
            <span className="truncate">{algorithm.spaceComplexity}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium col-span-2 mt-1">
            <Cpu className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
            <span className="truncate text-zinc-600 dark:text-zinc-400 font-bold">{algorithm.primaryDataStructure}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="mt-auto pt-2 pb-4 px-6 bg-gradient-to-t from-zinc-50/20 to-transparent dark:from-zinc-900/5">
        <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 font-bold transition-all duration-300 shadow-sm shadow-emerald-500/15">
          <Link href={algorithm.href}>
            Launch Visualizer
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
