"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import GraphCanvas from "@/components/graph-canvas"
import { dijkstra } from "@/lib/algorithms/dijkstra"
import type { Node, Edge } from "@/types/graph"
import { Route, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DijkstraPage() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  // Generate the graph once on component mount
  useEffect(() => {
    // Create a weighted graph for Dijkstra visualization
    const newNodes: Node[] = []
    const newEdges: Edge[] = []

    // Create nodes in a circular pattern
    const nodeCount = 10
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

    // Create edges with random weights
    for (let i = 0; i < nodeCount; i++) {
      // Connect to next node (circular)
      newEdges.push({
        from: i,
        to: (i + 1) % nodeCount,
        weight: Math.floor(Math.random() * 9) + 1,
      })

      // Connect to node across (if even number of nodes)
      if (nodeCount % 2 === 0 && i < nodeCount / 2) {
        newEdges.push({
          from: i,
          to: (i + nodeCount / 2) % nodeCount,
          weight: Math.floor(Math.random() * 9) + 1,
        })
      }

      // Add some random connections
      if (Math.random() > 0.7) {
        const target = (i + 2) % nodeCount
        newEdges.push({
          from: i,
          to: target,
          weight: Math.floor(Math.random() * 9) + 1,
        })
      }
    }

    setNodes(newNodes)
    setEdges(newEdges)
  }, [])

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dijkstra's Algorithm</h1>
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
            <Route className="h-6 w-6 text-[#4ade80]" />
          </div>
          <div>
            <CardTitle>Dijkstra's Algorithm</CardTitle>
            <CardDescription>
              Dijkstra's algorithm finds the shortest paths between nodes in a weighted graph.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Dijkstra's algorithm works by:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining a set of unvisited nodes and a distance value for each node</li>
              <li>Initially setting the distance of the start node to 0 and all other nodes to infinity</li>
              <li>Repeatedly selecting the unvisited node with the smallest distance</li>
              <li>Updating the distances of its neighbors if a shorter path is found</li>
              <li>Marking the current node as visited and continuing until the target is reached</li>
            </ul>
            <p>
              Dijkstra's algorithm is guaranteed to find the shortest path in a graph with non-negative edge weights.
            </p>
          </div>
        </CardContent>
      </Card>

      {nodes.length > 0 && edges.length > 0 && (
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          algorithm={dijkstra}
          startNodeId={0}
          endNodeId={5}
          weighted={true}
          directed={true}
        />
      )}
    </div>
  )
}
