"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GitGraph, GitFork, Palette, Network, Route, ArrowRight, User, Star, Code, ShieldCheck, HelpCircle, BookOpen, MousePointerClick, Play, Sliders } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

// Live Canvas Traversal Simulation for the Hero Section
function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = 0
    let height = 0
    let initialized = false

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      id: number;
      neighbors: number[];
    }

    const nodes: Node[] = []
    let steps: { nodeStates: Record<number, string>; activeEdge?: [number, number] }[] = []
    let stepIndex = 0
    let delayCounter = 0

    const computeBfs = () => {
      steps = []
      const currentNodesCount = nodes.length
      if (currentNodesCount === 0) return

      const start = Math.floor(Math.random() * currentNodesCount)
      const end = Math.floor(Math.random() * currentNodesCount)

      const queue: number[] = [start]
      const visited = new Set<number>([start])
      const parent: Record<number, number> = {}
      let pathFound = false

      steps.push({
        nodeStates: { [start]: "current" }
      })

      while (queue.length > 0) {
        const curr = queue.shift()!
        if (curr === end) {
          pathFound = true
          break
        }

        const currentStates: Record<number, string> = {}
        visited.forEach(id => { currentStates[id] = "visited" })
        currentStates[curr] = "current"
        steps.push({ nodeStates: currentStates })

        if (!nodes[curr]) continue

        for (const n of nodes[curr].neighbors) {
          if (!visited.has(n)) {
            visited.add(n)
            parent[n] = curr
            queue.push(n)

            const checkStates: Record<number, string> = {}
            visited.forEach(id => { checkStates[id] = "visited" })
            checkStates[curr] = "current"
            checkStates[n] = "current"

            steps.push({
              nodeStates: checkStates,
              activeEdge: [curr, n]
            })
          }
        }
      }

      if (pathFound) {
        const path: number[] = []
        let current = end
        while (current !== undefined) {
          path.push(current)
          current = parent[current]
        }

        for (let i = path.length - 1; i >= 0; i--) {
          const pathStates: Record<number, string> = {}
          visited.forEach(id => { pathStates[id] = "visited" })
          for (let j = path.length - 1; j >= i; j--) {
            pathStates[path[j]] = "path"
          }
          steps.push({ nodeStates: pathStates })
        }
      }
      stepIndex = 0
    }

    const initializeNodes = (w: number, h: number) => {
      nodes.length = 0

      // Adapt initial node count based on screen width
      const initialNodeCount = w < 640 ? 10 : 16

      // Adapt velocity factor to keep movement visual speed consistent
      const velocityFactor = w < 640 ? 0.25 : 0.35

      for (let i = 0; i < initialNodeCount; i++) {
        nodes.push({
          x: Math.random() * (w - 30) + 15,
          y: Math.random() * (h - 30) + 15,
          vx: (Math.random() - 0.5) * velocityFactor,
          vy: (Math.random() - 0.5) * velocityFactor,
          id: i,
          neighbors: [],
        })
      }

      for (let i = 0; i < initialNodeCount; i++) {
        const closest = nodes
          .map((n, idx) => ({ idx, dist: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
          .filter(t => t.idx !== i)
          .sort((a, b) => a.dist - b.dist)
          .slice(0, 3)

        closest.forEach(c => {
          if (!nodes[i].neighbors.includes(c.idx)) nodes[i].neighbors.push(c.idx)
          if (!nodes[c.idx].neighbors.includes(i)) nodes[c.idx].neighbors.push(i)
        })
      }

      computeBfs()
      initialized = true
    }

    let animationFrameId = 0

    // Use ResizeObserver for bullet-proof responsiveness on orientation shifts, mobile zooms, layout shifts
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        const h = entry.contentRect.height
        if (w === 0 || h === 0) return

        const prevWidth = width
        const prevHeight = height

        width = w
        height = h

        // Fix retina DPI scaling
        canvas.width = width * window.devicePixelRatio
        canvas.height = height * window.devicePixelRatio
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

        if (!initialized) {
          initializeNodes(width, height)
        } else if (prevWidth > 0 && prevHeight > 0) {
          const scaleX = width / prevWidth
          const scaleY = height / prevHeight
          nodes.forEach(n => {
            n.x = Math.max(15, Math.min(width - 15, n.x * scaleX))
            n.y = Math.max(15, Math.min(height - 15, n.y * scaleY))
          })
        }
      }
    })

    resizeObserver.observe(canvas)

    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top

      // Cap maximum nodes to avoid overcrowding (especially on mobile)
      const maxNodesLimit = width < 640 ? 22 : 35
      if (nodes.length >= maxNodesLimit) return

      // Adapt velocity factor to current width
      const velocityFactor = width < 640 ? 0.25 : 0.35
      const newId = nodes.length
      const newNode: Node = {
        x: clickX,
        y: clickY,
        vx: (Math.random() - 0.5) * velocityFactor,
        vy: (Math.random() - 0.5) * velocityFactor,
        id: newId,
        neighbors: []
      }

      // Connect to the 2 closest nodes
      if (nodes.length > 0) {
        const sortedByDist = nodes
          .map((n) => ({ node: n, dist: Math.hypot(n.x - clickX, n.y - clickY) }))
          .sort((a, b) => a.dist - b.dist)

        const closest = sortedByDist.slice(0, 2)
        closest.forEach(c => {
          newNode.neighbors.push(c.node.id)
          c.node.neighbors.push(newId)
        })
      }

      nodes.push(newNode)
      computeBfs()
    }

    canvas.addEventListener("click", handleCanvasClick)

    const isDarkMode = () => document.documentElement.classList.contains("dark")

    const animate = () => {
      if (!initialized) {
        animationFrameId = requestAnimationFrame(animate)
        return
      }

      ctx.clearRect(0, 0, width, height)

      const dark = isDarkMode()

      // Move nodes and strictly clamp them to boundaries with proper redirects
      nodes.forEach(n => {
        n.x += n.vx
        n.y += n.vy

        // Strict clamp to boundaries to prevent getting stuck outside the screen
        if (n.x < 10) {
          n.x = 10
          if (n.vx < 0) n.vx *= -1
        } else if (n.x > width - 10) {
          n.x = width - 10
          if (n.vx > 0) n.vx *= -1
        }

        if (n.y < 10) {
          n.y = 10
          if (n.vy < 0) n.vy *= -1
        } else if (n.y > height - 10) {
          n.y = height - 10
          if (n.vy > 0) n.vy *= -1
        }
      })

      const currStep = steps[stepIndex]
      const states = currStep ? currStep.nodeStates : {}
      const activeEdge = currStep ? currStep.activeEdge : undefined

      // Draw all edges
      ctx.lineWidth = 1
      ctx.strokeStyle = dark ? "rgba(63, 63, 70, 0.25)" : "rgba(161, 161, 170, 0.4)"
      for (let i = 0; i < nodes.length; i++) {
        if (!nodes[i]) continue
        nodes[i].neighbors.forEach(nIdx => {
          if (nIdx > i && nodes[nIdx]) {
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[nIdx].x, nodes[nIdx].y)
            ctx.stroke()
          }
        })
      }

      // Draw active scanning edge
      if (activeEdge) {
        const [u, v] = activeEdge
        if (nodes[u] && nodes[v]) {
          ctx.beginPath()
          ctx.lineWidth = 2.5
          ctx.strokeStyle = "rgba(16, 185, 129, 0.85)"
          ctx.moveTo(nodes[u].x, nodes[u].y)
          ctx.lineTo(nodes[v].x, nodes[v].y)
          ctx.stroke()
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        const state = states[n.id] || "default"
        ctx.beginPath()
        ctx.arc(n.x, n.y, 6.5, 0, Math.PI * 2)

        if (state === "current") {
          ctx.fillStyle = "#f97316" // orange-500
          ctx.shadowBlur = 12
          ctx.shadowColor = "#f97316"
        } else if (state === "path") {
          ctx.fillStyle = "#10b981" // emerald-500
          ctx.shadowBlur = 12
          ctx.shadowColor = "#10b981"
        } else if (state === "visited") {
          ctx.fillStyle = "#3b82f6" // blue-500
          ctx.shadowBlur = 0
        } else {
          ctx.fillStyle = dark ? "#3f3f46" : "#a1a1aa" // zinc-700 / zinc-400
          ctx.shadowBlur = 0
        }

        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Cycle animation step
      delayCounter++
      if (delayCounter > 30) {
        delayCounter = 0
        stepIndex++
        if (stepIndex >= steps.length) {
          computeBfs()
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Watch for theme changes to re-render canvas properly
    const observer = new MutationObserver(() => {
      // Theme class changed, canvas will pick up on next frame
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    return () => {
      resizeObserver.disconnect()
      canvas.removeEventListener("click", handleCanvasClick)
      cancelAnimationFrame(animationFrameId)
      observer.disconnect()
    }
  }, [])

  return (
    <div className="relative w-full h-[340px] lg:h-[420px] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/30 backdrop-blur shadow-2xl overflow-hidden flex items-center justify-center">
      {/* Animation Status Tags */}
      <div className="absolute top-4 left-4 px-3 py-1 bg-white/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 rounded-full text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
        Live BFS Traverser
      </div>

      <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 backdrop-blur-md select-none animate-pulse">
        Click to Add Nodes
      </div>

      <div className="absolute bottom-4 right-4 flex flex-wrap gap-3 text-[10px] font-bold text-zinc-500 bg-white/80 dark:bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-200/65 dark:border-zinc-800/65 backdrop-blur-md">
        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600"></span> Default</div>
        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Visited</div>
        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Current</div>
        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Path</div>
      </div>

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block cursor-crosshair" />
    </div>
  )
}

export default function Home() {
  const algorithms = [
    {
      title: "A* Pathfinding",
      description: "Uses coordinates and heuristics to plot the fastest obstacle-free course between nodes.",
      href: "/algorithms/astar",
      icon: <GitGraph className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />,
      svgPreview: (
        <svg viewBox="0 0 200 120" className="w-full h-full fill-none stroke-current stroke-[1.5] text-zinc-400 dark:text-zinc-600">
          <g>
            {/* Grid layout */}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={i} x1={i * 25} y1="0" x2={i * 25} y2="120" className="stroke-zinc-200 dark:stroke-zinc-800/50" />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1="0" y1={i * 30} x2={200} y2={i * 30} className="stroke-zinc-200 dark:stroke-zinc-800/50" />
            ))}
          </g>
          {/* Obstacles */}
          <rect x="75" y="30" width="25" height="60" fill="rgba(239, 68, 68, 0.15)" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1" />
          {/* Path nodes */}
          <circle cx="25" cy="60" r="5" fill="#3b82f6" stroke="#3b82f6" />
          <circle cx="175" cy="60" r="5" fill="#10b981" stroke="#10b981" />
          {/* Search frontier path line */}
          <path d="M 25,60 C 50,30 100,10 125,60 C 135,80 160,75 175,60" className="svg-astar-path" stroke="#10b981" strokeWidth="2.5" strokeDasharray="none" />
          <circle cx="125" cy="60" r="4" className="svg-astar-node" style={{ transformOrigin: "125px 60px" }} fill="#fb923c" stroke="#fb923c" />
        </svg>
      )
    },
    {
      title: "Breadth-First Search (BFS)",
      description: "Traverses layered concentric rings of child nodes level-by-level.",
      href: "/algorithms/bfs",
      icon: <Network className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />,
      svgPreview: (
        <svg viewBox="0 0 200 120" className="w-full h-full fill-none stroke-current stroke-[1.5] text-zinc-400 dark:text-zinc-600">
          {/* Layer rings */}
          <circle cx="100" cy="60" r="28" className="svg-bfs-ring-1" style={{ transformOrigin: "100px 60px" }} stroke="rgba(59, 130, 246, 0.15)" strokeDasharray="3 3" />
          <circle cx="100" cy="60" r="48" className="svg-bfs-ring-2" style={{ transformOrigin: "100px 60px" }} stroke="rgba(59, 130, 246, 0.08)" strokeDasharray="3 3" />
          {/* Center Start Node */}
          <circle cx="100" cy="60" r="5" className="svg-bfs-node-start" style={{ transformOrigin: "100px 60px" }} fill="#f97316" stroke="#f97316" />
          {/* Layer 1 Nodes */}
          <line x1="100" y1="60" x2="80" y2="40" className="stroke-zinc-300 dark:stroke-zinc-700/60" />
          <line x1="100" y1="60" x2="120" y2="40" className="stroke-zinc-300 dark:stroke-zinc-700/60" />
          <line x1="100" y1="60" x2="100" y2="88" className="stroke-zinc-300 dark:stroke-zinc-700/60" />
          <circle cx="80" cy="40" r="4.5" className="svg-bfs-node-l1" style={{ transformOrigin: "80px 40px" }} fill="#3b82f6" stroke="#3b82f6" />
          <circle cx="120" cy="40" r="4.5" className="svg-bfs-node-l1" style={{ transformOrigin: "120px 40px" }} fill="#3b82f6" stroke="#3b82f6" />
          <circle cx="100" cy="88" r="4.5" className="svg-bfs-node-l1" style={{ transformOrigin: "100px 88px" }} fill="#3b82f6" stroke="#3b82f6" />
          {/* Layer 2 Nodes */}
          <line x1="80" y1="40" x2="55" y2="35" className="stroke-zinc-200 dark:stroke-zinc-700/30" />
          <line x1="120" y1="40" x2="145" y2="35" className="stroke-zinc-200 dark:stroke-zinc-700/30" />
          <circle cx="55" cy="35" r="4" className="svg-bfs-node-l2 fill-zinc-400 stroke-zinc-400 dark:fill-zinc-600 dark:stroke-zinc-600" style={{ transformOrigin: "55px 35px" }} />
          <circle cx="145" cy="35" r="4" className="svg-bfs-node-l2 fill-zinc-400 stroke-zinc-400 dark:fill-zinc-600 dark:stroke-zinc-600" style={{ transformOrigin: "145px 35px" }} />
        </svg>
      )
    },
    {
      title: "Depth-First Search (DFS)",
      description: "Explores branches deeply down vertical paths before backtracking to branches.",
      href: "/algorithms/dfs",
      icon: <GitFork className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />,
      svgPreview: (
        <svg viewBox="0 0 200 120" className="w-full h-full fill-none stroke-current stroke-[1.5] text-zinc-400 dark:text-zinc-600">
          {/* Root node */}
          <circle cx="100" cy="20" r="5" fill="#3b82f6" stroke="#3b82f6" />
          {/* Left path */}
          <line x1="100" y1="20" x2="60" y2="55" className="svg-dfs-line-1" stroke="#10b981" strokeWidth="2" />
          <circle cx="60" cy="55" r="4.5" className="svg-dfs-node-1" style={{ transformOrigin: "60px 55px" }} fill="#10b981" stroke="#10b981" />
          {/* Left-most deep branch */}
          <line x1="60" y1="55" x2="35" y2="95" className="svg-dfs-line-2" stroke="#10b981" strokeWidth="2" />
          <circle cx="35" cy="95" r="4" className="svg-dfs-node-2" style={{ transformOrigin: "35px 95px" }} fill="#10b981" stroke="#10b981" />
          {/* Unexplored branch */}
          <line x1="60" y1="55" x2="85" y2="95" className="stroke-zinc-300 dark:stroke-zinc-700/50" />
          <circle cx="85" cy="95" r="4" className="fill-zinc-400 stroke-zinc-400 dark:fill-zinc-600 dark:stroke-zinc-600" />
          {/* Right unexplored path */}
          <line x1="100" y1="20" x2="140" y2="55" className="stroke-zinc-300 dark:stroke-zinc-700/50" />
          <circle cx="140" cy="55" r="4.5" className="fill-zinc-400 stroke-zinc-400 dark:fill-zinc-600 dark:stroke-zinc-600" />
        </svg>
      )
    },
    {
      title: "Dijkstra's Algorithm",
      description: "Computes absolute shortest weighted route via cost sum accumulation.",
      href: "/algorithms/dijkstra",
      icon: <Route className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />,
      svgPreview: (
        <svg viewBox="0 0 200 120" className="w-full h-full fill-none stroke-current stroke-[1.5] text-zinc-400 dark:text-zinc-600">
          {/* Node connections with weights */}
          <line x1="30" y1="60" x2="90" y2="25" className="svg-dijkstra-path-1" stroke="#10b981" strokeWidth="2" />
          <line x1="30" y1="60" x2="90" y2="95" className="stroke-zinc-300 dark:stroke-zinc-700/50" />
          <line x1="90" y1="25" x2="170" y2="60" className="svg-dijkstra-path-2" stroke="#10b981" strokeWidth="2" />
          <line x1="90" y1="95" x2="170" y2="60" className="stroke-zinc-300 dark:stroke-zinc-700/50" />
          {/* Nodes */}
          <circle cx="30" cy="60" r="5" className="svg-dijkstra-node-start" style={{ transformOrigin: "30px 60px" }} fill="#3b82f6" stroke="#3b82f6" />
          <circle cx="90" cy="25" r="4.5" className="svg-dijkstra-node-mid" style={{ transformOrigin: "90px 25px" }} fill="#10b981" stroke="#10b981" />
          <circle cx="90" cy="95" r="4.5" className="fill-zinc-400 stroke-zinc-400 dark:fill-zinc-600 dark:stroke-zinc-600" />
          <circle cx="170" cy="60" r="5" className="svg-dijkstra-node-end" style={{ transformOrigin: "170px 60px" }} fill="#10b981" stroke="#10b981" />
          {/* Text weights */}
          <text x="50" y="37" className="text-[9px] fill-zinc-500 dark:fill-zinc-400 stroke-none font-bold">2</text>
          <text x="50" y="87" className="text-[9px] fill-zinc-500 dark:fill-zinc-400 stroke-none font-bold">7</text>
          <text x="135" y="37" className="text-[9px] fill-zinc-500 dark:fill-zinc-400 stroke-none font-bold">3</text>
          <text x="135" y="87" className="text-[9px] fill-zinc-500 dark:fill-zinc-400 stroke-none font-bold">1</text>
        </svg>
      )
    },
  ]

  return (
    <div className="relative bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 min-h-screen selection:bg-emerald-500/30 selection:text-emerald-600 dark:selection:text-emerald-400 overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[40rem] right-10 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-40 left-1/3 w-80 h-80 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden border-b border-zinc-200 dark:border-zinc-900 bg-gradient-to-b from-white via-zinc-50/30 to-white dark:from-zinc-950 dark:via-zinc-900/5 dark:to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/20 via-transparent to-transparent dark:from-emerald-950/10 dark:via-zinc-950/0 dark:to-zinc-950/0 pointer-events-none" />

        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left Info Column */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-600 dark:text-emerald-400 font-bold tracking-wide">
                <Star className="w-3.5 h-3.5 fill-current" />
                State-of-the-Art Visualizer
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Master{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
                  Graph Algorithms
                </span>
                {" "}With Interactive Tracing
              </h1>

              <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-[550px] leading-relaxed">
                Step inside the graph logic. Play traversal animations, trace runtime code variables in C++, Python, and Java, and customize nodes dynamically.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button size="lg" asChild className="bg-emerald-500 hover:bg-emerald-400 text-white dark:text-zinc-950 font-bold transition-transform hover:-translate-y-0.5 shadow-md shadow-emerald-500/10">
                  <Link href="/algorithms">
                    Explore Visualizers
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-transform hover:-translate-y-0.5">
                  <Link href="/about">
                    Learn How it Works
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Live Simulation Column */}
            <div className="w-full">
              <HeroCanvas />
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 border-b border-zinc-200 dark:border-zinc-900 relative">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Interactive Learning Ecosystem
            </h2>
            <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-[700px] mx-auto">
              Our workspace bridges math and syntax seamlessly, making complex graph pathways intuitive.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-start p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-900/50 bg-white/50 dark:bg-zinc-900/20 backdrop-blur-md hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all duration-300 group shadow-md hover:-translate-y-1 hover:shadow-lg">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <GitGraph className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-zinc-800 dark:text-zinc-200">Step Tracing Console</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Slow down, fast-forward, or step frame-by-frame. Trace which parts of the implementation code run in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-start p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-900/50 bg-white/50 dark:bg-zinc-900/20 backdrop-blur-md hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all duration-300 group shadow-md hover:-translate-y-1 hover:shadow-lg">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Code className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-zinc-800 dark:text-zinc-200">Multi-Language Code</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Compare variables and structures inside clean C++, Java, Python, C, C# or JavaScript snippet consoles instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-start p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-900/50 bg-white/50 dark:bg-zinc-900/20 backdrop-blur-md hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all duration-300 group shadow-md hover:-translate-y-1 hover:shadow-lg col-span-1 sm:col-span-2 md:col-span-1">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Palette className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-zinc-800 dark:text-zinc-200">Interactive Canvas</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Add, remove, drag, and connect nodes in a weighted or unweighted canvas sandbox to model custom graph scenarios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 lg:py-24 border-b border-zinc-200 dark:border-zinc-900 bg-zinc-50/20 dark:bg-zinc-900/5 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/2 rounded-full blur-[120px] pointer-events-none z-0" />
        
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
              Quick Guide
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              How Does It Work?
            </h2>
            <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-[700px] mx-auto">
              Follow these simple steps to start visualizing, customizing, and mastering graph algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-[2.25rem] left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-zinc-200 via-emerald-200 to-zinc-200 dark:from-zinc-800/80 dark:via-emerald-950/50 dark:to-zinc-800/80 z-0" />

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-4 group relative z-10">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-center shadow-lg group-hover:border-emerald-500 dark:group-hover:border-emerald-500/60 transition-all duration-300 group-hover:-translate-y-1">
                  <BookOpen className="w-7 h-7 text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-emerald-500 text-white dark:text-zinc-950 flex items-center justify-center text-xs font-extrabold border-2 border-white dark:border-zinc-950 shadow-md">
                  1
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Select Algorithm
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[220px] mx-auto">
                  Pick from pathfinding (A*, Dijkstra) or traversal (BFS, DFS) algorithms to load the workspace.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-4 group relative z-10">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-center shadow-lg group-hover:border-emerald-500 dark:group-hover:border-emerald-500/60 transition-all duration-300 group-hover:-translate-y-1">
                  <MousePointerClick className="w-7 h-7 text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-emerald-500 text-white dark:text-zinc-950 flex items-center justify-center text-xs font-extrabold border-2 border-white dark:border-zinc-950 shadow-md">
                  2
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Build Your Graph
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[220px] mx-auto">
                  Click on the canvas sandbox to add nodes, drag them, and build custom topological paths.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-4 group relative z-10">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-center shadow-lg group-hover:border-emerald-500 dark:group-hover:border-emerald-500/60 transition-all duration-300 group-hover:-translate-y-1">
                  <Play className="w-7 h-7 text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-emerald-500 text-white dark:text-zinc-950 flex items-center justify-center text-xs font-extrabold border-2 border-white dark:border-zinc-950 shadow-md">
                  3
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Run Traversal
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[220px] mx-auto">
                  Play the traversal simulation. Adjust speed sliders, pause, or step through node activations.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center space-y-4 group relative z-10">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 flex items-center justify-center shadow-lg group-hover:border-emerald-500 dark:group-hover:border-emerald-500/60 transition-all duration-300 group-hover:-translate-y-1">
                  <Sliders className="w-7 h-7 text-zinc-700 dark:text-zinc-300 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors" />
                </div>
                <div className="absolute -top-2.5 -right-2.5 w-7 h-7 rounded-full bg-emerald-500 text-white dark:text-zinc-950 flex items-center justify-center text-xs font-extrabold border-2 border-white dark:border-zinc-950 shadow-md">
                  4
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  Trace Variables
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[220px] mx-auto">
                  Compare execution state variables across C++, Java, Python, C#, and JavaScript side-by-side.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithms Showcase Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-zinc-50/30 dark:bg-zinc-900/5 relative border-b border-zinc-200 dark:border-zinc-900">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Explore Traversers</h2>
            <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-[700px] mx-auto">
              Select one of our core visualizers to trace heuristics, radial searches, or shortest-paths.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {algorithms.map((algorithm) => (
              <Card key={algorithm.href} className="border-zinc-200/60 dark:border-zinc-900/60 bg-white/70 dark:bg-zinc-900/30 backdrop-blur-md hover:border-emerald-500/40 dark:hover:border-emerald-500/30 transition-all duration-300 flex flex-col group overflow-hidden shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="inline-flex items-center gap-2 mb-2">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg group-hover:scale-105 transition-transform duration-300">
                      {algorithm.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{algorithm.title}</CardTitle>
                  <CardDescription className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed h-[36px] overflow-hidden">
                    {algorithm.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="h-32 bg-zinc-100/40 dark:bg-zinc-950/40 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center p-3 overflow-hidden shadow-inner group-hover:border-zinc-300/80 dark:group-hover:border-zinc-800/80 transition-colors duration-300">
                    {algorithm.svgPreview}
                  </div>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-400 text-white dark:text-zinc-950 font-bold transition-all duration-300 shadow-sm shadow-emerald-500/20">
                    <Link href={algorithm.href}>Launch Visualizer</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Button asChild variant="outline" size="lg" className="border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-all hover:translate-x-0.5">
              <Link href="/algorithms">
                View Other Algorithms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-20 lg:py-24 border-b border-zinc-200 dark:border-zinc-900 relative">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Approved by Academics</h2>
            <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-[700px] mx-auto">
              Students, engineers, and educators leverage GraphAlgo to make graph models click.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Testimonial 1 */}
            <Card className="border-zinc-200/50 dark:border-zinc-900/50 bg-white/50 dark:bg-zinc-900/20 backdrop-blur-md shadow-md hover:shadow-lg hover:border-zinc-300/80 dark:hover:border-zinc-800 transition-all duration-300 hover:-translate-y-0.5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-11 w-11 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                    <User className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">Sarah Johnson</h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">CS Student, University of Washington</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
                  "This platform made understanding BFS and Dijkstra so much easier. The side-by-side tracer helped me visual-trace the call stack of nested functions."
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="border-zinc-200/50 dark:border-zinc-900/50 bg-white/50 dark:bg-zinc-900/20 backdrop-blur-md shadow-md hover:shadow-lg hover:border-zinc-300/80 dark:hover:border-zinc-800 transition-all duration-300 hover:-translate-y-0.5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-11 w-11 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                    <User className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">Michael Chen</h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Front-End Engineer, Tech Lead</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
                  "I use the visualizer to prepare for technical interviews. Being able to choose C++ or Python code snippet view fits right into my review stack."
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="border-zinc-200/50 dark:border-zinc-900/50 bg-white/50 dark:bg-zinc-900/20 backdrop-blur-md shadow-md hover:shadow-lg hover:border-zinc-300/80 dark:hover:border-zinc-800 transition-all duration-300 hover:-translate-y-0.5 col-span-1 sm:col-span-2 md:col-span-1">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-11 w-11 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                    <User className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-sm">Dr. Emily Rodriguez</h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">Professor of Algorithms & Data Structures</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
                  "I highly recommend this platform in my lectures. The custom canvas is perfect to demonstrate Dijkstra edge relaxation scenarios live."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-20 lg:py-24 border-b border-zinc-200 dark:border-zinc-900 relative">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-zinc-500 dark:text-zinc-400 max-w-[600px] mx-auto">
              Learn more about how to navigate and customize the algorithm workspace.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            <AccordionItem value="item-1" className="border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl bg-white/50 dark:bg-zinc-900/10 backdrop-blur-md px-6">
              <AccordionTrigger className="text-base font-bold text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-4 no-underline hover:no-underline">
                How does the custom sandbox canvas work?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed pb-4">
                You can dynamically create your own custom graphs! Click or double-click to spawn new vertices, drag nodes around to modify positions, assign weights, and link vertices together. This lets you construct custom test cases instantly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl bg-white/50 dark:bg-zinc-900/10 backdrop-blur-md px-6">
              <AccordionTrigger className="text-base font-bold text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-4 no-underline hover:no-underline">
                What programming languages can I trace live?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed pb-4">
                The visualizer's code tracing panel supports real-time line-by-line syntax highlights in multiple languages: <strong>JavaScript, C++, Java, Python, C, and C#</strong>. Comparing execution logic across stacks has never been easier.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl bg-white/50 dark:bg-zinc-900/10 backdrop-blur-md px-6">
              <AccordionTrigger className="text-base font-bold text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-4 no-underline hover:no-underline">
                Is GraphAlgo mobile responsive?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed pb-4">
                Yes, absolutely. Every tool, canvas sandbox, coding tracer console, speed control, and chatbot in GraphAlgo is carefully optimized for touch points, screen boundaries, and scaling across mobile phones, tablets, and wide monitors.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl bg-white/50 dark:bg-zinc-900/10 backdrop-blur-md px-6">
              <AccordionTrigger className="text-base font-bold text-zinc-800 dark:text-zinc-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-4 no-underline hover:no-underline">
                How does the AI helper chatbot work?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed pb-4">
                The bottom-right chatbot contains pre-loaded configurations and details about different traversers (like BFS rings or Dijkstra cost accumulation). It is ready to answer questions about graph search complexities, weights, and controls.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-28 relative overflow-hidden bg-white dark:bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-emerald-100/10 via-transparent to-transparent dark:from-emerald-950/10 dark:via-zinc-950/0 dark:to-zinc-950/0 pointer-events-none" />

        <div className="container max-w-5xl mx-auto px-4 sm:px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Free & Open-Source
          </div>

          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Ready to Master Graph Logic?
          </h2>

          <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-[600px] mx-auto leading-relaxed">
            Jump in and start visualizing right away. No account sign-up, email configuration, or installation required.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button size="lg" asChild className="bg-emerald-500 hover:bg-emerald-400 text-white dark:text-zinc-950 font-bold transition-transform hover:-translate-y-0.5">
              <Link href="/algorithms">Get Started Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-zinc-300 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 transition-transform hover:-translate-y-0.5">
              <Link href="/about">Read Documentation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
