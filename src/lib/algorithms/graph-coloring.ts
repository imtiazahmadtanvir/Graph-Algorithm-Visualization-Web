import type { Node, Edge } from "@/types/graph"

// Graph coloring algorithm implementation
export function graphColoring(nodes: Node[], edges: Edge[]) {
  const steps: any[] = []

  // Available colors
  const colors = ["#4ade80", "#60a5fa", "#f97316", "#a855f7", "#ec4899"]

  // Track node colors
  const nodeColors: Record<number, number> = {}

  // Create adjacency list
  const adjacencyList: Record<number, number[]> = {}
  nodes.forEach((node) => {
    adjacencyList[node.id] = []
  })

  edges.forEach((edge) => {
    adjacencyList[edge.from].push(edge.to)
    // For undirected graphs, add the reverse edge too
    adjacencyList[edge.to].push(edge.from)
  })

  // Process nodes in order
  for (const node of nodes) {
    // Track used colors by neighbors
    const usedColors = new Set<number>()

    // Check all neighbors
    for (const neighbor of adjacencyList[node.id]) {
      if (nodeColors[neighbor] !== undefined) {
        usedColors.add(nodeColors[neighbor])
      }
    }

    // Find the first available color
    let colorIndex = 0
    while (usedColors.has(colorIndex)) {
      colorIndex++
    }

    // Assign color to node
    nodeColors[node.id] = colorIndex

    // Record this step
    steps.push({
      current: node.id,
      nodeColor: {
        id: node.id,
        color: colors[colorIndex % colors.length],
      },
    })
  }

  return { steps }
}
