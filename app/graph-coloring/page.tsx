"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import GraphCanvas from "@/components/graph-canvas"
import { graphColoring } from "@/lib/algorithms/graph-coloring"
import type { Node, Edge } from "@/types/graph"
import { Palette, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GraphColoringPage() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  // Generate the graph once on component mount
  useEffect(() => {
    // Create a graph for coloring visualization
    const newNodes: Node[] = []
    const newEdges: Edge[] = []

    // Create nodes in a circular pattern
    const nodeCount = 12
    const centerX = 250
    const centerY = 250
    const radius = 200

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      newNodes.push({
        id: i,
        x,
        y,
        state: "default",
      })
    }

    // Create edges for a planar graph
    // Connect each node to its neighbors
    for (let i = 0; i < nodeCount; i++) {
      // Connect to next node (circular)
      newEdges.push({
        from: i,
        to: (i + 1) % nodeCount,
      })

      // Connect to node across (if even number of nodes)
      if (i % 3 === 0) {
        newEdges.push({
          from: i,
          to: (i + nodeCount / 3) % nodeCount,
        })
      }

      // Add some chords
      if (i % 4 === 0) {
        newEdges.push({
          from: i,
          to: (i + 2) % nodeCount,
        })
      }
    }

    setNodes(newNodes)
    setEdges(newEdges)
  }, [])

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Graph Coloring</h1>
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
            <Palette className="h-6 w-6 text-[#4ade80]" />
          </div>
          <div>
            <CardTitle>Graph Coloring Algorithm</CardTitle>
            <CardDescription>
              Graph coloring assigns colors to vertices such that no adjacent vertices have the same color.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Graph coloring works by:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Processing vertices in a specific order (often by degree)</li>
              <li>Assigning the smallest available color to each vertex</li>
              <li>Ensuring no adjacent vertices have the same color</li>
            </ul>
            <p>
              Graph coloring has applications in scheduling, register allocation in compilers, map coloring, and solving
              Sudoku puzzles.
            </p>
          </div>
        </CardContent>
      </Card>

      {nodes.length > 0 && edges.length > 0 && (
        <GraphCanvas nodes={nodes} edges={edges} algorithm={graphColoring} startNodeId={0} endNodeId={0} />
      )}
    </div>
  )
}
