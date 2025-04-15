"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import GraphCanvas from "@/components/graph-canvas"
import { dfs } from "@/lib/algorithms/dfs"
import type { Node, Edge } from "@/types/graph"
import { GitFork, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DFSPage() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  // Generate the graph once on component mount
  useEffect(() => {
    // Create a tree-like graph for DFS visualization
    const newNodes: Node[] = []
    const newEdges: Edge[] = []

    // Create nodes
    const nodeCount = 15
    const centerX = 300
    const centerY = 100
    const radius = 200

    // Root node
    newNodes.push({
      id: 0,
      x: centerX,
      y: centerY,
      state: "default",
    })

    // Create nodes in a circular pattern
    for (let i = 1; i < nodeCount; i++) {
      const angle = (i / (nodeCount - 1)) * Math.PI * 2
      const level = Math.floor(i / 5) + 1
      const x = centerX + Math.cos(angle) * radius * (level / 2)
      const y = centerY + Math.sin(angle) * radius * (level / 2) + 100 * level

      newNodes.push({
        id: i,
        x,
        y,
        state: "default",
      })
    }

    // Create edges (tree-like structure)
    // Connect root to first level
    for (let i = 1; i <= 3; i++) {
      newEdges.push({
        from: 0,
        to: i,
      })
    }

    // Connect first level to second level
    newEdges.push({ from: 1, to: 4 })
    newEdges.push({ from: 1, to: 5 })
    newEdges.push({ from: 2, to: 6 })
    newEdges.push({ from: 2, to: 7 })
    newEdges.push({ from: 3, to: 8 })
    newEdges.push({ from: 3, to: 9 })

    // Connect second level to third level
    newEdges.push({ from: 4, to: 10 })
    newEdges.push({ from: 5, to: 11 })
    newEdges.push({ from: 7, to: 12 })
    newEdges.push({ from: 8, to: 13 })
    newEdges.push({ from: 9, to: 14 })

    // Add some cross-connections for more interesting paths
    newEdges.push({ from: 4, to: 6 })
    newEdges.push({ from: 7, to: 9 })
    newEdges.push({ from: 10, to: 11 })
    newEdges.push({ from: 12, to: 13 })

    setNodes(newNodes)
    setEdges(newEdges)
  }, [])

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Depth-First Search (DFS)</h1>
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
            <GitFork className="h-6 w-6 text-[#4ade80]" />
          </div>
          <div>
            <CardTitle>Depth-First Search (DFS)</CardTitle>
            <CardDescription>
              DFS is an algorithm for traversing or searching tree or graph data structures that explores as far as
              possible along each branch before backtracking.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>DFS works by exploring a path as deep as possible before backtracking:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Start at the root node (or any arbitrary node for a graph)</li>
              <li>Explore the first child node completely before exploring siblings</li>
              <li>Use a stack (or recursion) to keep track of nodes to visit</li>
              <li>Mark nodes as visited to avoid cycles</li>
            </ul>
            <p>DFS is useful for topological sorting, finding connected components, and solving puzzles like mazes.</p>
          </div>
        </CardContent>
      </Card>

      {nodes.length > 0 && edges.length > 0 && (
        <GraphCanvas nodes={nodes} edges={edges} algorithm={dfs} startNodeId={0} endNodeId={14} directed={true} />
      )}
    </div>
  )
}
