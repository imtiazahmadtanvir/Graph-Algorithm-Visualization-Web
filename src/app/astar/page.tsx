"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import GraphCanvas from "@/components/graph-canvas"
import { astar } from "@/lib/algorithms/astar"
import type { Node, Edge } from "@/types/graph"
import { GitGraph, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AStarPage() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  // Generate the graph once on component mount
  useEffect(() => {
    // Create a grid graph for A* visualization
    const gridSize = 5
    const spacing = 80
    const offsetX = 100
    const offsetY = 100

    const newNodes: Node[] = []
    const newEdges: Edge[] = []

    // Create nodes in a grid
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const id = row * gridSize + col
        newNodes.push({
          id,
          x: offsetX + col * spacing,
          y: offsetY + row * spacing,
          state: "default",
        })
      }
    }

    // Create edges (4-way connectivity)
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const id = row * gridSize + col

        // Connect to right neighbor
        if (col < gridSize - 1) {
          newEdges.push({
            from: id,
            to: id + 1,
            weight: 1,
          })

          // Make it bidirectional
          newEdges.push({
            from: id + 1,
            to: id,
            weight: 1,
          })
        }

        // Connect to bottom neighbor
        if (row < gridSize - 1) {
          newEdges.push({
            from: id,
            to: id + gridSize,
            weight: 1,
          })

          // Make it bidirectional
          newEdges.push({
            from: id + gridSize,
            to: id,
            weight: 1,
          })
        }

        // Add some diagonal connections for more interesting paths
        if (row < gridSize - 1 && col < gridSize - 1 && Math.random() > 0.7) {
          newEdges.push({
            from: id,
            to: id + gridSize + 1,
            weight: 1.4, // Diagonal is slightly longer
          })

          // Make it bidirectional
          newEdges.push({
            from: id + gridSize + 1,
            to: id,
            weight: 1.4,
          })
        }
      }
    }

    // Add some random obstacles (by removing edges)
    const edgesToRemove = Math.floor(newEdges.length * 0.2) // Remove 20% of edges
    for (let i = 0; i < edgesToRemove; i++) {
      const randomIndex = Math.floor(Math.random() * newEdges.length)
      newEdges.splice(randomIndex, 1)
    }

    setNodes(newNodes)
    setEdges(newEdges)
  }, [])

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">A* Pathfinding Algorithm</h1>
        <Button asChild variant="outline" className="border-[#4ade80]/50">
          <Link href="/algorithms">
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
            Back to Algorithms
          </Link>
        </Button>
      </div>

      <Card className="mb-8 border border-[#4ade80]/20">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-[#f0f9f0] flex items-center justify-center">
            <GitGraph className="h-6 w-6 text-[#4ade80]" />
          </div>
          <div>
            <CardTitle>A* Pathfinding Algorithm</CardTitle>
            <CardDescription>
              A* is a best-first search algorithm that finds the shortest path between nodes using heuristics.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>A* works by maintaining a priority queue of nodes to visit, sorted by the sum of:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>g(n)</strong>: The cost from the start node to the current node
              </li>
              <li>
                <strong>h(n)</strong>: A heuristic that estimates the cost from the current node to the goal
              </li>
            </ul>
            <p>
              The algorithm expands nodes with the lowest f(n) = g(n) + h(n) value first, ensuring it finds the optimal
              path.
            </p>
          </div>
        </CardContent>
      </Card>

      {nodes.length > 0 && edges.length > 0 && (
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          algorithm={astar}
          startNodeId={0}
          endNodeId={nodes.length - 1}
          weighted={true}
        />
      )}
    </div>
  )
}
