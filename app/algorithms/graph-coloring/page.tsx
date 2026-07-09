"use client"

import { useState, useEffect } from "react"
import GraphCanvas from "@/components/graph-canvas"
import { graphColoring } from "@/lib/algorithms/graph-coloring"
import type { Node, Edge } from "@/types/graph"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AlgorithmDetails from "@/components/algorithm-details"

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

      {nodes.length > 0 && edges.length > 0 && (
        <div className="mb-8">
          <GraphCanvas nodes={nodes} edges={edges} algorithm={graphColoring} startNodeId={0} endNodeId={0} algorithmName="graph-coloring" />
        </div>
      )}

      <AlgorithmDetails algorithmId="graph-coloring" />
    </div>
  )
}
