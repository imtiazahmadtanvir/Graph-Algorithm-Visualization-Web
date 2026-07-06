"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GitGraph, GitFork, Palette, Network, Route, ArrowRight, User, Star, Code, ShieldCheck } from "lucide-react"

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

    const nodeCount = 16
    const nodes: Node[] = []
    let steps: { nodeStates: Record<number, string>; activeEdge?: [number, number] }[] = []
    let stepIndex = 0
    let delayCounter = 0

    const computeBfs = () => {
      steps = []
      const start = Math.floor(Math.random() * nodeCount)
      const end = Math.floor(Math.random() * nodeCount)
      
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
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * (w - 30) + 15,
          y: Math.random() * (h - 30) + 15,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          id: i,
          neighbors: [],
        })
      }

      for (let i = 0; i < nodeCount; i++) {
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

    const handleResize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      console.log("[Canvas Debug] handleResize called: w =", w, "h =", h, "devicePixelRatio =", window.devicePixelRatio)
      if (w === 0 || h === 0) return

      width = w
      height = h
      canvas.width = width * window.devicePixelRatio
      canvas.height = height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

      if (!initialized) {
        initializeNodes(width, height)
      }
    }

    // Initialize dimensions on mount
    handleResize()
    window.addEventListener("resize", handleResize)

    const animate = () => {
      if (!initialized) {
        const w = canvas.clientWidth
        const h = canvas.clientHeight
        if (w > 0 && h > 0) {
          console.log("[Canvas Debug] Dimensions became available in animate loop: w =", w, "h =", h)
          handleResize()
        } else {
          animationFrameId = requestAnimationFrame(animate)
          return
        }
      }

      // Log drawing state occasionally (every 100 frames)
      if (Math.random() < 0.01) {
        console.log("[Canvas Debug] animate drawing frame: width =", width, "height =", height, "nodes count =", nodes.length, "steps count =", steps.length)
      }

      ctx.clearRect(0, 0, width, height)

      // Move nodes slightly
      nodes.forEach(n => {
        n.x += n.vx
        n.y += n.vy
        if (n.x < 10 || n.x > width - 10) n.vx *= -1
        if (n.y < 10 || n.y > height - 10) n.vy *= -1
      })

      const currStep = steps[stepIndex]
      const states = currStep ? currStep.nodeStates : {}
      const activeEdge = currStep ? currStep.activeEdge : undefined

      // Draw all edges
      ctx.lineWidth = 1
      ctx.strokeStyle = "rgba(63, 63, 70, 0.25)"
      for (let i = 0; i < nodeCount; i++) {
        nodes[i].neighbors.forEach(nIdx => {
          if (nIdx > i) {
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
        ctx.beginPath()
        ctx.lineWidth = 2.5
        ctx.strokeStyle = "rgba(16, 185, 129, 0.85)"
        ctx.moveTo(nodes[u].x, nodes[u].y)
        ctx.lineTo(nodes[v].x, nodes[v].y)
        ctx.stroke()
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
          ctx.fillStyle = "#3f3f46" // zinc-700
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

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="relative w-full h-[340px] lg:h-[420px] rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur shadow-2xl overflow-hidden flex items-center justify-center">
      {/* Animation Status Tags */}
      <div className="absolute top-4 left-4 px-3 py-1 bg-zinc-900/80 border border-zinc-800/80 rounded-full text-[10px] text-zinc-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
        Live BFS Traverser
      </div>

      <div className="absolute bottom-4 right-4 flex flex-wrap gap-3 text-[10px] font-bold text-zinc-500 bg-zinc-950/80 px-3 py-1.5 rounded-lg border border-zinc-800/65 backdrop-blur-md">
        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span> Default</div>
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
      href: "/astar",
      icon: <GitGraph className="h-6 w-6 text-emerald-400" />,
      svgPreview: (
        <svg viewBox="0 0 200 120" className="w-full h-full text-zinc-600 fill-none stroke-current stroke-[1.5]">
          <g>
            {/* Grid layout */}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={i} x1={i * 25} y1="0" x2={i * 25} y2="120" stroke="rgba(63, 63, 70, 0.2)" />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={i} x1="0" y1={i * 30} x2={200} y2={i * 30} stroke="rgba(63, 63, 70, 0.2)" />
            ))}
          </g>
          {/* Obstacles */}
          <rect x="75" y="30" width="25" height="60" fill="rgba(239, 68, 68, 0.15)" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="1" />
          {/* Path nodes */}
          <circle cx="25" cy="60" r="5" fill="#3b82f6" stroke="#3b82f6" />
          <circle cx="175" cy="60" r="5" fill="#10b981" stroke="#10b981" />
          {/* Search frontier path line */}
          <path d="M 25,60 C 50,30 100,10 125,60 C 135,80 160,75 175,60" stroke="#10b981" strokeWidth="2.5" strokeDasharray="none" />
          <circle cx="125" cy="60" r="4" fill="#fb923c" stroke="#fb923c" />
        </svg>
      )
    },
    {
      title: "Breadth-First Search (BFS)",
      description: "Traverses layered concentric rings of child nodes level-by-level.",
      href: "/bfs",
      icon: <Network className="h-6 w-6 text-emerald-400" />,
      svgPreview: (
        <svg viewBox="0 0 200 120" className="w-full h-full text-zinc-600 fill-none stroke-current stroke-[1.5]">
          {/* Layer rings */}
          <circle cx="100" cy="60" r="28" stroke="rgba(59, 130, 246, 0.15)" strokeDasharray="3 3" />
          <circle cx="100" cy="60" r="48" stroke="rgba(59, 130, 246, 0.08)" strokeDasharray="3 3" />
          {/* Center Start Node */}
          <circle cx="100" cy="60" r="5" fill="#f97316" stroke="#f97316" />
          {/* Layer 1 Nodes */}
          <line x1="100" y1="60" x2="80" y2="40" stroke="rgba(63, 63, 70, 0.4)" />
          <line x1="100" y1="60" x2="120" y2="40" stroke="rgba(63, 63, 70, 0.4)" />
          <line x1="100" y1="60" x2="100" y2="88" stroke="rgba(63, 63, 70, 0.4)" />
          <circle cx="80" cy="40" r="4.5" fill="#3b82f6" stroke="#3b82f6" />
          <circle cx="120" cy="40" r="4.5" fill="#3b82f6" stroke="#3b82f6" />
          <circle cx="100" cy="88" r="4.5" fill="#3b82f6" stroke="#3b82f6" />
          {/* Layer 2 Nodes */}
          <line x1="80" y1="40" x2="55" y2="35" stroke="rgba(63, 63, 70, 0.2)" />
          <line x1="120" y1="40" x2="145" y2="35" stroke="rgba(63, 63, 70, 0.2)" />
          <circle cx="55" cy="35" r="4" fill="#3f3f46" stroke="#3f3f46" />
          <circle cx="145" cy="35" r="4" fill="#3f3f46" stroke="#3f3f46" />
        </svg>
      )
    },
    {
      title: "Depth-First Search (DFS)",
      description: "Explores branches deeply down vertical paths before backtracking to branches.",
      href: "/dfs",
      icon: <GitFork className="h-6 w-6 text-emerald-400" />,
      svgPreview: (
        <svg viewBox="0 0 200 120" className="w-full h-full text-zinc-600 fill-none stroke-current stroke-[1.5]">
          {/* Root node */}
          <circle cx="100" cy="20" r="5" fill="#3b82f6" stroke="#3b82f6" />
          {/* Left path */}
          <line x1="100" y1="20" x2="60" y2="55" stroke="#10b981" strokeWidth="2" />
          <circle cx="60" cy="55" r="4.5" fill="#10b981" stroke="#10b981" />
          {/* Left-most deep branch */}
          <line x1="60" y1="55" x2="35" y2="95" stroke="#10b981" strokeWidth="2" />
          <circle cx="35" cy="95" r="4" fill="#10b981" stroke="#10b981" />
          {/* Unexplored branch */}
          <line x1="60" y1="55" x2="85" y2="95" stroke="rgba(63, 63, 70, 0.3)" />
          <circle cx="85" cy="95" r="4" fill="#3f3f46" stroke="#3f3f46" />
          {/* Right unexplored path */}
          <line x1="100" y1="20" x2="140" y2="55" stroke="rgba(63, 63, 70, 0.3)" />
          <circle cx="140" cy="55" r="4.5" fill="#3f3f46" stroke="#3f3f46" />
        </svg>
      )
    },
    {
      title: "Dijkstra's Algorithm",
      description: "Computes absolute shortest weighted route via cost sum accumulation.",
      href: "/dijkstra",
      icon: <Route className="h-6 w-6 text-emerald-400" />,
      svgPreview: (
        <svg viewBox="0 0 200 120" className="w-full h-full text-zinc-550 fill-none stroke-current stroke-[1.5]">
          {/* Node connections with weights */}
          <line x1="30" y1="60" x2="90" y2="25" stroke="#10b981" strokeWidth="2" />
          <line x1="30" y1="60" x2="90" y2="95" stroke="rgba(63, 63, 70, 0.3)" />
          <line x1="90" y1="25" x2="170" y2="60" stroke="#10b981" strokeWidth="2" />
          <line x1="90" y1="95" x2="170" y2="60" stroke="rgba(63, 63, 70, 0.3)" />
          {/* Nodes */}
          <circle cx="30" cy="60" r="5" fill="#3b82f6" stroke="#3b82f6" />
          <circle cx="90" cy="25" r="4.5" fill="#10b981" stroke="#10b981" />
          <circle cx="90" cy="95" r="4.5" fill="#3f3f46" stroke="#3f3f46" />
          <circle cx="170" cy="60" r="5" fill="#10b981" stroke="#10b981" />
          {/* Text weights */}
          <text x="50" y="37" className="text-[9px] fill-zinc-400 stroke-none font-bold">2</text>
          <text x="50" y="87" className="text-[9px] fill-zinc-400 stroke-none font-bold">7</text>
          <text x="135" y="37" className="text-[9px] fill-zinc-400 stroke-none font-bold">3</text>
          <text x="135" y="87" className="text-[9px] fill-zinc-400 stroke-none font-bold">1</text>
        </svg>
      )
    },
  ]

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen selection:bg-emerald-500/30 selection:text-emerald-400">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden border-b border-zinc-900 bg-gradient-to-b from-zinc-950 via-zinc-900/10 to-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-zinc-950/0 to-zinc-950/0 pointer-events-none" />
        
        <div className="container max-w-7xl mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Info Column */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs text-emerald-400 font-bold tracking-wide">
                <Star className="w-3.5 h-3.5 fill-current" />
                State-of-the-Art Visualizer
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
                Master{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Graph Algorithms
                </span>
                {" "}With Interactive Tracing
              </h1>
              
              <p className="text-lg text-zinc-400 max-w-[550px] leading-relaxed">
                Step inside the graph logic. Play traversal animations, trace runtime code variables in C++, Python, and Java, and customize nodes dynamically.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <Button size="lg" asChild className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-transform hover:-translate-y-0.5">
                  <Link href="/algorithms">
                    Explore Visualizers
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-zinc-800 text-zinc-300 hover:bg-zinc-900/60 transition-transform hover:-translate-y-0.5">
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
      <section className="py-20 border-b border-zinc-900 relative">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Interactive Learning Ecosystem
            </h2>
            <p className="text-lg text-zinc-400 max-w-[700px] mx-auto">
              Our workspace bridges math and syntax seamlessly, making complex graph pathways intuitive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-start p-6 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur hover:border-emerald-500/30 transition-all duration-300 group shadow-lg">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <GitGraph className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-zinc-200">Step Tracing Console</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Slow down, fast-forward, or step frame-by-frame. Trace which parts of the implementation code run in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-start p-6 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur hover:border-emerald-500/30 transition-all duration-300 group shadow-lg">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Code className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-zinc-200">Multi-Language Code</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Compare variables and structures inside clean C++, Java, Python, C, C# or JavaScript snippet consoles instantly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-start p-6 rounded-2xl border border-zinc-900 bg-zinc-900/20 backdrop-blur hover:border-emerald-500/30 transition-all duration-300 group shadow-lg">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Palette className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-zinc-200">Interactive Canvas</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Add, remove, drag, and connect nodes in a weighted or unweighted canvas sandbox to model custom graph scenarios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithms Showcase Section */}
      <section className="py-20 bg-zinc-900/10 relative border-b border-zinc-900">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Explore Traversers</h2>
            <p className="text-lg text-zinc-400 max-w-[700px] mx-auto">
              Select one of our core visualizers to trace heuristics, radial searches, or shortest-paths.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {algorithms.map((algorithm) => (
              <Card key={algorithm.href} className="border-zinc-900 bg-zinc-900/30 backdrop-blur hover:border-zinc-800 transition-all duration-200 flex flex-col group overflow-hidden shadow-xl">
                <CardHeader className="pb-3">
                  <div className="inline-flex items-center gap-2 mb-2">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg group-hover:scale-105 transition-transform">
                      {algorithm.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-zinc-100">{algorithm.title}</CardTitle>
                  <CardDescription className="text-xs text-zinc-400 leading-relaxed h-[36px] overflow-hidden">
                    {algorithm.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="h-32 bg-zinc-950/80 rounded-xl border border-zinc-800/80 flex items-center justify-center p-3 overflow-hidden shadow-inner group-hover:border-zinc-800 transition-colors">
                    {algorithm.svgPreview}
                  </div>
                </CardContent>
                <CardFooter className="mt-auto">
                  <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-all">
                    <Link href={algorithm.href}>Launch Visualizer</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Button asChild variant="outline" size="lg" className="border-zinc-850 text-zinc-300 hover:bg-zinc-900/60 transition-all hover:translate-x-0.5">
              <Link href="/algorithms">
                View Other Algorithms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 border-b border-zinc-900 relative">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Approved by Academics</h2>
            <p className="text-lg text-zinc-400 max-w-[700px] mx-auto">
              Students, engineers, and educators leverage GrappAlgo to make graph models click.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card className="border-zinc-900 bg-zinc-900/20 backdrop-blur shadow-xl hover:border-zinc-850 transition-colors duration-250">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-11 w-11 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <User className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200 text-sm">Sarah Johnson</h4>
                    <p className="text-[11px] text-zinc-400 font-medium">CS Student, University of Washington</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed italic">
                  "This platform made understanding BFS and Dijkstra so much easier. The side-by-side tracer helped me visual-trace the call stack of nested functions."
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card className="border-zinc-900 bg-zinc-900/20 backdrop-blur shadow-xl hover:border-zinc-850 transition-colors duration-250">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-11 w-11 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <User className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200 text-sm">Michael Chen</h4>
                    <p className="text-[11px] text-zinc-400 font-medium">Front-End Engineer, Tech Lead</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed italic">
                  "I use the visualizer to prepare for technical interviews. Being able to choose C++ or Python code snippet view fits right into my review stack."
                </p>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card className="border-zinc-900 bg-zinc-900/20 backdrop-blur shadow-xl hover:border-zinc-850 transition-colors duration-250">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-11 w-11 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <User className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200 text-sm">Dr. Emily Rodriguez</h4>
                    <p className="text-[11px] text-zinc-400 font-medium">Professor of Algorithms & Data Structures</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 leading-relaxed italic">
                  "I highly recommend this platform in my lectures. The custom canvas is perfect to demonstrate Dijkstra edge relaxation scenarios live."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-emerald-950/15 via-zinc-950/0 to-zinc-950/0 pointer-events-none" />
        
        <div className="container max-w-5xl mx-auto px-4 relative text-center space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 rounded-full text-xs text-emerald-400 font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            100% Free & Open-Source
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Ready to Master Graph Logic?
          </h2>
          
          <p className="text-base text-zinc-400 max-w-[600px] mx-auto leading-relaxed">
            Jump in and start visualizing right away. No account sign-up, email configuration, or installation required.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button size="lg" asChild className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition-transform hover:-translate-y-0.5">
              <Link href="/algorithms">Get Started Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-zinc-800 text-zinc-300 hover:bg-zinc-900/60 transition-transform hover:-translate-y-0.5">
              <Link href="/about">Read Documentation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
