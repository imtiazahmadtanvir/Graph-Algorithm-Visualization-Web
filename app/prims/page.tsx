"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import GraphCanvas from "@/components/graph-canvas"
import { prims } from "@/lib/algorithms/prims"
import type { Node, Edge } from "@/types/graph"
import { GitBranch, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PrimsPage() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])

  // Generate the graph once on component mount
  useEffect(() => {
    // Create a weighted graph for Prim's MST visualization
    const newNodes: Node[] = []
    const newEdges: Edge[] = []

    // Create nodes in a grid pattern
    const gridSize = 4
    const spacing = 100
    const offsetX = 100
    const offsetY = 100

    // Create nodes
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

    // Create edges with weights
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const id = row * gridSize + col

        // Connect to right neighbor
        if (col < gridSize - 1) {
          newEdges.push({
            from: id,
            to: id + 1,
            weight: Math.floor(Math.random() * 9) + 1,
          })
        }

        // Connect to bottom neighbor
        if (row < gridSize - 1) {
          newEdges.push({
            from: id,
            to: id + gridSize,
            weight: Math.floor(Math.random() * 9) + 1,
          })
        }

        // Add some diagonal connections
        if (row < gridSize - 1 && col < gridSize - 1 && Math.random() > 0.5) {
          newEdges.push({
            from: id,
            to: id + gridSize + 1,
            weight: Math.floor(Math.random() * 9) + 1,
          })
        }
      }
    }

    setNodes(newNodes)
    setEdges(newEdges)
  }, [])

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Prim's MST Algorithm</h1>
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
            <GitBranch className="h-6 w-6 text-[#4ade80]" />
          </div>
          <div>
            <CardTitle>Prim's Minimum Spanning Tree Algorithm</CardTitle>
            <CardDescription>
              Prim's algorithm finds a minimum spanning tree for a weighted undirected graph.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Prim's algorithm works by:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Starting with a single vertex and growing the tree one edge at a time</li>
              <li>
                Always adding the minimum weight edge that connects a vertex in the tree to a vertex outside the tree
              </li>
              <li>Continuing until all vertices are included in the tree</li>
            </ul>
            <p>
              A minimum spanning tree connects all vertices with the minimum total edge weight, which is useful for
              network design, clustering, and approximation algorithms.
            </p>
          </div>
        </CardContent>
      </Card>

      {nodes.length > 0 && edges.length > 0 && (
        <GraphCanvas
          nodes={nodes}
          edges={edges}
          algorithm={(nodes, edges) => prims(nodes, edges, 0)}
          startNodeId={0}
          endNodeId={0}
          weighted={true}
        />
      )}
    </div>
  )
}
