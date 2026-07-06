"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import GraphCanvas from "@/components/graph-canvas"
import { bfs } from "@/lib/algorithms/bfs"
import type { Node, Edge } from "@/types/graph"
import { Network, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BFSPage() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  // Generate the graph once on component mount
  useEffect(() => {
    // Create a grid graph for BFS visualization
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
          })
        }

        // Connect to bottom neighbor
        if (row < gridSize - 1) {
          newEdges.push({
            from: id,
            to: id + gridSize,
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
        <h1 className="text-3xl font-bold">Breadth-First Search (BFS)</h1>
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
            <Network className="h-6 w-6 text-[#4ade80]" />
          </div>
          <div>
            <CardTitle>Breadth-First Search (BFS)</CardTitle>
            <CardDescription>
              BFS is a graph traversal algorithm that explores all neighbor nodes at the present depth before moving to
              nodes at the next depth level.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>BFS works by exploring all neighbors before going deeper:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Start at the root node (or any arbitrary node for a graph)</li>
              <li>Explore all neighbors at the current depth before moving to the next depth</li>
              <li>Use a queue to keep track of nodes to visit</li>
              <li>Mark nodes as visited to avoid cycles</li>
            </ul>
            <p>
              BFS is guaranteed to find the shortest path in an unweighted graph and is useful for finding the shortest
              path, connected components, and level-order traversals.
            </p>
          </div>
        </CardContent>
      </Card>

      {nodes.length > 0 && edges.length > 0 && (
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          algorithm={bfs}
          startNodeId={0}
          endNodeId={nodes.length - 1}
          directed={true}
        />
      )}
    </div>
  )
}
