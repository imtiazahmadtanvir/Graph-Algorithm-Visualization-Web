"use client"

import { useState, useEffect } from "react"
import GraphCanvas from "@/components/graph-canvas"
import { dfs } from "@/lib/algorithms/dfs"
import type { Node, Edge } from "@/types/graph"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import AlgorithmDetails from "@/components/algorithm-details"

export default function DFSPage() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  // Generate the graph once on component mount
  useEffect(() => {
    // Generate a deep tree/graph structure for DFS visualization
    const newNodes: Node[] = [
      { id: 0, x: 250, y: 50, state: "default" },
      { id: 1, x: 150, y: 120, state: "default" },
      { id: 2, x: 350, y: 120, state: "default" },
      { id: 3, x: 100, y: 200, state: "default" },
      { id: 4, x: 200, y: 200, state: "default" },
      { id: 5, x: 300, y: 200, state: "default" },
      { id: 6, x: 400, y: 200, state: "default" },
      { id: 7, x: 70, y: 280, state: "default" },
      { id: 8, x: 130, y: 280, state: "default" },
      { id: 9, x: 170, y: 280, state: "default" },
      { id: 10, x: 230, y: 280, state: "default" },
      { id: 11, x: 270, y: 280, state: "default" },
      { id: 12, x: 330, y: 280, state: "default" },
      { id: 13, x: 370, y: 280, state: "default" },
      { id: 14, x: 430, y: 280, state: "default" },
    ]

    const newEdges: Edge[] = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 },
      { from: 3, to: 7 },
      { from: 3, to: 8 },
      { from: 4, to: 9 },
      { from: 4, to: 10 },
      { from: 5, to: 11 },
      { from: 5, to: 12 },
      { from: 6, to: 13 },
      { from: 6, to: 14 },
    ]

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

      {nodes.length > 0 && edges.length > 0 && (
        <div className="mb-8">
          <GraphCanvas nodes={nodes} edges={edges} algorithm={dfs} startNodeId={0} endNodeId={14} directed={true} algorithmName="dfs" />
        </div>
      )}

      <AlgorithmDetails algorithmId="dfs" />
    </div>
  )
}
