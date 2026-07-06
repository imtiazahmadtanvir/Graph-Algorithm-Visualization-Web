import type { Node, Edge } from "@/types/graph"

// Prim's MST algorithm implementation
export function prims(nodes: Node[], edges: Edge[], startId: number) {
  const steps: any[] = []

  // Track visited nodes and MST edges
  const visited: Set<number> = new Set([startId])
  const mstEdges: Edge[] = []

  // Record initial state
  steps.push({ visited: startId, current: startId })

  // Continue until all nodes are in the MST
  while (visited.size < nodes.length) {
    let minEdge: Edge | null = null
    let minWeight = Number.POSITIVE_INFINITY

    // Find the minimum weight edge that connects a visited node to an unvisited node
    for (const edge of edges) {
      const sourceVisited = visited.has(edge.from)
      const targetVisited = visited.has(edge.to)

      // We want an edge that connects visited to unvisited
      if ((sourceVisited && !targetVisited) || (!sourceVisited && targetVisited)) {
        const weight = edge.weight || 1

        if (weight < minWeight) {
          minWeight = weight
          minEdge = edge
        }
      }
    }

    // If no edge found, graph might be disconnected
    if (!minEdge) break

    // Add the new node to visited
    const newNode = visited.has(minEdge.from) ? minEdge.to : minEdge.from
    visited.add(newNode)

    // Add edge to MST
    mstEdges.push(minEdge)

    // Record this step
    steps.push({
      current: newNode,
      visited: newNode,
      edge: { from: minEdge.from, to: minEdge.to },
    })
  }

  // Record the final MST
  steps.push({ mst: mstEdges })

  return { steps }
}
