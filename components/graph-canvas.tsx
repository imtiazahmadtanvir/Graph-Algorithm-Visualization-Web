"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Play, Pause, RefreshCw, Copy, Check } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

const ALGORITHM_CODE = {
  astar: `// A* Pathfinding Algorithm
function astar(startNode, endNode) {
  const openSet = [startNode];
  const closedSet = [];
  
  const gScore = {}; // Cost from start
  const fScore = {}; // gScore + heuristic
  const parent = {};
  
  gScore[startNode.id] = 0;
  fScore[startNode.id] = heuristic(startNode, endNode);
  
  while (openSet.length > 0) {
    // Sort openSet by fScore (lowest first)
    openSet.sort((a, b) => fScore[a.id] - fScore[b.id]);
    const current = openSet.shift();
    
    if (current.id === endNode.id) {
      return reconstructPath(parent, current);
    }
    
    closedSet.push(current);
    
    for (const neighbor of current.neighbors) {
      if (closedSet.includes(neighbor)) continue;
      
      const tentativeG = gScore[current.id] + distance(current, neighbor);
      
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeG >= gScore[neighbor.id]) {
        continue;
      }
      
      parent[neighbor.id] = current;
      gScore[neighbor.id] = tentativeG;
      fScore[neighbor.id] = tentativeG + heuristic(neighbor, endNode);
    }
  }
  return []; // No path found
}`,
  bfs: `// Breadth-First Search
function bfs(startNode, endNode) {
  const queue = [startNode];
  const visited = new Set([startNode.id]);
  const parent = {};
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (current.id === endNode.id) {
      return reconstructPath(parent, current);
    }
    
    for (const neighbor of current.neighbors) {
      if (!visited.has(neighbor.id)) {
        visited.add(neighbor.id);
        parent[neighbor.id] = current;
        queue.push(neighbor);
      }
    }
  }
  return []; // Path not found
}`,
  dfs: `// Depth-First Search
function dfs(startNode, endNode) {
  const visited = new Set();
  const path = [];
  
  function dfsRecursive(node) {
    visited.add(node.id);
    path.push(node);
    
    if (node.id === endNode.id) {
      return true;
    }
    
    for (const neighbor of node.neighbors) {
      if (!visited.has(neighbor.id)) {
        if (dfsRecursive(neighbor)) {
          return true;
        }
      }
    }
    
    path.pop(); // Backtrack
    return false;
  }
  
  dfsRecursive(startNode);
  return path;
}`,
  dijkstra: `// Dijkstra's Algorithm
function dijkstra(startNode, endNode, allNodes) {
  const distances = {};
  const visited = new Set();
  const parent = {};
  const queue = [startNode];
  
  for (const node of allNodes) {
    distances[node.id] = Infinity;
  }
  distances[startNode.id] = 0;
  
  while (queue.length > 0) {
    // Sort queue by distance (lowest first)
    queue.sort((a, b) => distances[a.id] - distances[b.id]);
    const current = queue.shift();
    
    if (visited.has(current.id)) continue;
    visited.add(current.id);
    
    if (current.id === endNode.id) {
      return reconstructPath(parent, current);
    }
    
    for (const neighbor of current.neighbors) {
      if (visited.has(neighbor.id)) continue;
      
      const newDist = distances[current.id] + distance(current, neighbor);
      
      if (newDist < distances[neighbor.id]) {
        distances[neighbor.id] = newDist;
        parent[neighbor.id] = current;
        if (!queue.includes(neighbor)) {
          queue.push(neighbor);
        }
      }
    }
  }
  return [];
}`,
  "graph-coloring": `// Graph Coloring (Greedy)
function graphColoring(nodes) {
  const nodeColors = {}; // Assign color index
  const colors = ["Green", "Blue", "Orange", "Purple", "Pink"];
  
  for (const node of nodes) {
    const usedColors = new Set();
    
    // Check neighbor colors
    for (const neighbor of node.neighbors) {
      if (nodeColors[neighbor.id] !== undefined) {
        usedColors.add(nodeColors[neighbor.id]);
      }
    }
    
    // Find first available color index
    let colorIndex = 0;
    while (usedColors.has(colorIndex)) {
      colorIndex++;
    }
    
    nodeColors[node.id] = colorIndex;
  }
  
  return nodeColors;
}`,
  prims: `// Prim's MST Algorithm
function prims(startNode, allNodes) {
  const visited = new Set([startNode.id]);
  const mstEdges = [];
  
  while (visited.size < allNodes.length) {
    let minEdge = null;
    let minWeight = Infinity;
    
    // Find min weight edge connecting visited to unvisited
    for (const node of allNodes) {
      if (!visited.has(node.id)) continue;
      
      for (const edge of node.edges) {
        const neighbor = edge.otherNode;
        if (!visited.has(neighbor.id)) {
          if (edge.weight < minWeight) {
            minWeight = edge.weight;
            minEdge = edge;
          }
        }
      }
    }
    
    if (!minEdge) break; // Graph is disconnected
    
    visited.add(minEdge.target.id);
    mstEdges.push(minEdge);
  }
  
  return mstEdges;
}`
};

function getHighlightedLines(algorithmName: string, step: any): number[] {
  if (!step) return [];
  
  if (algorithmName === "bfs") {
    if (step.path) return [10];
    if (step.visited !== undefined && step.current !== undefined) return [2, 3, 4];
    if (step.current !== undefined) return [7, 9];
    if (step.visited !== undefined) return [14, 15, 17];
  }
  
  if (algorithmName === "dfs") {
    if (step.path) return [26];
    if (step.visited !== undefined && step.current !== undefined) return [25];
    if (step.current !== undefined) return [5, 6, 9];
    if (step.visited !== undefined) return [14, 15];
  }
  
  if (algorithmName === "astar") {
    if (step.path) return [18];
    if (step.visited !== undefined && step.current !== undefined) return [9, 10];
    if (step.current !== undefined) return [14, 15, 17];
    if (step.visited !== undefined) return [23, 26, 29];
  }
  
  if (algorithmName === "dijkstra") {
    if (step.path) return [21];
    if (step.visited !== undefined && step.current !== undefined) return [7, 8, 10];
    if (step.current !== undefined) return [14, 15, 18, 20];
    if (step.visited !== undefined) return [24, 27, 29, 33];
  }
  
  if (algorithmName === "graph-coloring") {
    if (step.nodeColor) return [9, 17, 21];
  }
  
  if (algorithmName === "prims") {
    if (step.mst) return [30];
    if (step.visited !== undefined && step.current !== undefined) return [2, 3];
    if (step.current !== undefined) return [10, 13, 16];
    if (step.visited !== undefined) return [26, 27];
  }
  
  return [];
}



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
  algorithmName?: string
}

export default function GraphCanvas({
  nodes: initialNodes,
  edges: initialEdges,
  algorithm,
  startNodeId,
  endNodeId,
  directed = false,
  weighted = false,
  algorithmName,
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
  const [copied, setCopied] = useState(false)
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

  const handleCopyCode = () => {
    if (!algorithmName) return
    const code = ALGORITHM_CODE[algorithmName as keyof typeof ALGORITHM_CODE]
    if (code) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const activeStep = currentStep > 0 ? steps[currentStep - 1] : null
  const highlightedLines = algorithmName && activeStep ? getHighlightedLines(algorithmName, activeStep) : []
  const codeLines = algorithmName && ALGORITHM_CODE[algorithmName as keyof typeof ALGORITHM_CODE]
    ? ALGORITHM_CODE[algorithmName as keyof typeof ALGORITHM_CODE].split("\n")
    : []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <Card className="lg:col-span-2 p-4 border border-[#4ade80]/20 shadow-lg bg-card">
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

      {algorithmName && ALGORITHM_CODE[algorithmName as keyof typeof ALGORITHM_CODE] && (
        <Card className="p-4 border border-[#4ade80]/20 shadow-lg flex flex-col gap-4 bg-card h-[610px]">
          <div className="flex items-center justify-between border-b pb-2 border-border">
            <h3 className="text-lg font-bold text-foreground">JavaScript Code</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="text-xs px-2.5 py-1 border-[#4ade80]/30 hover:bg-[#4ade80]/10 flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Code
                </>
              )}
            </Button>
          </div>
          <div className="relative flex-1 overflow-hidden rounded-md border border-border bg-[#18181b] p-4 text-xs font-mono text-gray-300">
            <ScrollArea className="h-full w-full">
              <div className="whitespace-pre font-mono leading-relaxed select-text">
                {codeLines.map((line, index) => {
                  const isHighlighted = highlightedLines.includes(index)
                  return (
                    <div
                      key={index}
                      className={cn(
                        "px-2 py-0.5 rounded transition-all duration-150 border-l-2",
                        isHighlighted
                          ? "bg-green-500/20 text-[#4ade80] font-bold border-l-[#4ade80]"
                          : "border-l-transparent text-gray-400"
                      )}
                    >
                      <span className="inline-block w-6 text-right select-none text-gray-600 mr-4">
                        {index + 1}
                      </span>
                      {line}
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </Card>
      )}
    </div>
  )
}
