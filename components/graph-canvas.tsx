"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Play, Pause, RefreshCw } from "lucide-react"

// Simple types for nodes and edges
interface Node {
  id: number
  x: number
  y: number
  color?: string
  state?: "default" | "visited" | "current" | "path" | "start" | "end"
}

interface Edge {
  from: number
  to: number
  weight?: number
}

interface GraphCanvasProps {
  nodes: Node[]
  edges: Edge[]
  algorithm: (nodes: Node[], edges: Edge[], startId: number, endId: number) => { steps: any[] }
  startNodeId: number
  endNodeId: number
  directed?: boolean
  weighted?: boolean
}

export default function GraphCanvas({
  nodes: initialNodes,
  edges: initialEdges,
  algorithm,
  startNodeId,
  endNodeId,
  directed = false,
  weighted = false,
}: GraphCanvasProps) {
  // References and state
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<any[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const { theme } = useTheme()

  // Initialize the graph once
  useEffect(() => {
    if (isInitialized || initialNodes.length === 0) return

    // Deep clone the nodes and edges
    const clonedNodes = initialNodes.map((node) => ({
      ...node,
      state: node.id === startNodeId ? "start" : node.id === endNodeId ? "end" : "default",
    }))

    setNodes(clonedNodes)
    setEdges([...initialEdges])
    setIsInitialized(true)

    // Run the algorithm once
    try {
      const result = algorithm(clonedNodes, initialEdges, startNodeId, endNodeId)
      if (result && result.steps) {
        setSteps(result.steps)
      }
    } catch (error) {
      console.error("Error running algorithm:", error)
    }
  }, [initialNodes, initialEdges, algorithm, startNodeId, endNodeId, isInitialized])

  // Handle animation
  useEffect(() => {
    if (!isPlaying || steps.length === 0 || currentStep >= steps.length) return

    const timer = setTimeout(
      () => {
        // Apply the current step
        const step = steps[currentStep]

        setNodes((prevNodes) => {
          const newNodes = [...prevNodes]

          // Handle different step types
          if (step.reset) {
            newNodes.forEach((node) => {
              if (node.id !== startNodeId && node.id !== endNodeId) {
                node.state = "default"
                node.color = undefined
              }
            })
          }

          if (step.visited) {
            const node = newNodes.find((n) => n.id === step.visited)
            if (node && node.state !== "start" && node.state !== "end") {
              node.state = "visited"
            }
          }

          if (step.current) {
            // Reset previous current node
            newNodes.forEach((node) => {
              if (node.state === "current") {
                node.state = "visited"
              }
            })

            // Set new current node
            const node = newNodes.find((n) => n.id === step.current)
            if (node && node.state !== "start" && node.state !== "end") {
              node.state = "current"
            }
          }

          if (step.path) {
            step.path.forEach((id: number) => {
              const node = newNodes.find((n) => n.id === id)
              if (node && node.state !== "start" && node.state !== "end") {
                node.state = "path"
              }
            })
          }

          if (step.nodeColor) {
            const node = newNodes.find((n) => n.id === step.nodeColor.id)
            if (node) {
              node.color = step.nodeColor.color
            }
          }

          if (step.edge) {
            // Highlight edge in MST algorithms
            // This would require additional state for edges
            // For simplicity, we're just handling node states here
          }

          return newNodes
        })

        // Move to next step
        setCurrentStep((prev) => {
          const next = prev + 1
          if (next >= steps.length) {
            setIsPlaying(false)
          }
          return next
        })
      },
      1000 - speed * 9,
    ) // Speed control

    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, steps, speed, startNodeId, endNodeId])

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || nodes.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Get colors based on theme
    const isDark = theme === "dark"
    const edgeColor = isDark ? "#94a3b8" : "#64748b" // slate-400/500
    const nodeStrokeColor = isDark ? "#e2e8f0" : "#334155" // slate-200/700
    const textColor = isDark ? "#f8fafc" : "#0f172a" // slate-50/900
    const defaultNodeColor = isDark ? "#1e293b" : "#f1f5f9" // slate-800/100

    // Draw edges
    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from)
      const toNode = nodes.find((n) => n.id === edge.to)

      if (fromNode && toNode) {
        // Draw the edge line
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.strokeStyle = edgeColor
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw arrow if directed
        if (directed) {
          const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x)
          const arrowSize = 10

          ctx.beginPath()
          ctx.moveTo(toNode.x - Math.cos(angle) * 20, toNode.y - Math.sin(angle) * 20)
          ctx.lineTo(
            toNode.x - Math.cos(angle) * 20 - Math.cos(angle - Math.PI / 6) * arrowSize,
            toNode.y - Math.sin(angle) * 20 - Math.sin(angle - Math.PI / 6) * arrowSize,
          )
          ctx.lineTo(
            toNode.x - Math.cos(angle) * 20 - Math.cos(angle + Math.PI / 6) * arrowSize,
            toNode.y - Math.sin(angle) * 20 - Math.sin(angle + Math.PI / 6) * arrowSize,
          )
          ctx.closePath()
          ctx.fillStyle = edgeColor
          ctx.fill()
        }

        // Draw weight if weighted
        if (weighted && edge.weight !== undefined) {
          const midX = (fromNode.x + toNode.x) / 2
          const midY = (fromNode.y + toNode.y) / 2

          ctx.font = "12px sans-serif"
          ctx.fillStyle = textColor
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(edge.weight.toString(), midX, midY - 10)
        }
      }
    })

    // Draw nodes
    nodes.forEach((node) => {
      ctx.beginPath()
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2)

      // Set fill color based on node state
      if (node.color) {
        ctx.fillStyle = node.color
      } else {
        switch (node.state) {
          case "visited":
            ctx.fillStyle = isDark ? "#60a5fa" : "#93c5fd" // blue-400/300
            break
          case "current":
            ctx.fillStyle = isDark ? "#f97316" : "#fb923c" // orange-500/400
            break
          case "path":
            ctx.fillStyle = isDark ? "#10b981" : "#4ade80" // green-500/400
            break
          case "start":
            ctx.fillStyle = "#22c55e" // green-500
            break
          case "end":
            ctx.fillStyle = "#ef4444" // red-500
            break
          default:
            ctx.fillStyle = defaultNodeColor
        }
      }

      ctx.fill()
      ctx.strokeStyle = nodeStrokeColor
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw node ID
      ctx.font = "14px sans-serif"
      ctx.fillStyle = textColor
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node.id.toString(), node.x, node.y)
    })
  }, [nodes, edges, directed, weighted, theme])

  // Reset the visualization
  const resetVisualization = () => {
    setIsPlaying(false)
    setCurrentStep(0)

    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        state: node.id === startNodeId ? "start" : node.id === endNodeId ? "end" : "default",
        color: undefined,
      })),
    )
  }

  return (
    <Card className="p-4 border border-[#4ade80]/20 shadow-lg">
      <div className="flex flex-col gap-4">
        <div className="relative border rounded-lg overflow-hidden bg-background h-[500px]">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={steps.length === 0 || currentStep >= steps.length}
              className="bg-[#4ade80] hover:bg-[#22c55e] text-white"
            >
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-4 w-4" /> Pause
                </>
              ) : currentStep >= steps.length ? (
                "Finished"
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Play
                </>
              )}
            </Button>
            <Button onClick={resetVisualization} variant="outline" className="border-[#4ade80]/50">
              <RefreshCw className="mr-2 h-4 w-4" /> Reset
            </Button>
            <div className="flex-1 flex items-center gap-4">
              <Label htmlFor="speed" className="min-w-20">
                Speed:
              </Label>
              <Slider
                id="speed"
                min={1}
                max={100}
                step={1}
                value={[speed]}
                onValueChange={(value) => setSpeed(value[0])}
                className="flex-1"
              />
            </div>
          </div>

          <div className="flex gap-4 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#22c55e]"></div>
              <span>Start</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#ef4444]"></div>
              <span>End</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#93c5fd] dark:bg-[#60a5fa]"></div>
              <span>Visited</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#fb923c] dark:bg-[#f97316]"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#4ade80] dark:bg-[#10b981]"></div>
              <span>Path</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
