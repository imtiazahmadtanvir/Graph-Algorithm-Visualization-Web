import type { Node, Edge } from "@/types/graph"

// A* algorithm implementation
export function astar(nodes: Node[], edges: Edge[], startId: number, endId: number) {
  // Find start and end nodes
  const start = nodes.find((n) => n.id === startId)
  const end = nodes.find((n) => n.id === endId)

  if (!start || !end) {
    return { steps: [] }
  }

  // Track algorithm steps for visualization
  const steps: any[] = []

  // A* data structures
  const openSet: number[] = [startId]
  const closedSet: number[] = []

  // Track costs and parents
  const gScore: Record<number, number> = {}
  const fScore: Record<number, number> = {}
  const parent: Record<number, number | null> = {}

  // Initialize scores
  nodes.forEach((node) => {
    gScore[node.id] = Number.POSITIVE_INFINITY
    fScore[node.id] = Number.POSITIVE_INFINITY
    parent[node.id] = null
  })

  // Start node has zero cost to itself
  gScore[startId] = 0

  // Heuristic for start node (estimated cost to end)
  fScore[startId] = heuristic(start, end)

  // Record initial state
  steps.push({ visited: startId, current: startId })

  // Main A* loop
  while (openSet.length > 0) {
    // Find node with lowest fScore
    openSet.sort((a, b) => fScore[a] - fScore[b])
    const current = openSet.shift()!

    // Record current node being processed
    steps.push({ current })

    // Check if we reached the end
    if (current === endId) {
      // Reconstruct and record the path
      const path = reconstructPath(parent, current)
      steps.push({ path })
      break
    }

    // Add to closed set
    closedSet.push(current)

    // Get all neighbors
    const neighbors = getNeighbors(current, edges)

    // Process each neighbor
    for (const neighbor of neighbors) {
      // Skip if already processed
      if (closedSet.includes(neighbor)) continue

      // Calculate tentative gScore
      const edge = edges.find((e) => e.from === current && e.to === neighbor)
      const weight = edge?.weight || 1
      const tentativeGScore = gScore[current] + weight

      // Add to open set if not already there
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor)
        steps.push({ visited: neighbor })
      }

      // Skip if this path isn't better
      if (tentativeGScore >= gScore[neighbor]) continue

      // This path is better, record it
      parent[neighbor] = current
      gScore[neighbor] = tentativeGScore
      fScore[neighbor] = gScore[neighbor] + heuristic(nodes.find((n) => n.id === neighbor)!, end)
    }
  }

  return { steps }
}

// Helper function to get neighbors of a node
function getNeighbors(nodeId: number, edges: Edge[]): number[] {
  return edges.filter((edge) => edge.from === nodeId).map((edge) => edge.to)
}

// Heuristic function (Euclidean distance)
function heuristic(a: Node, b: Node): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
}

// Reconstruct path from parents
function reconstructPath(parent: Record<number, number | null>, current: number): number[] {
  const path = [current]
  while (parent[current] !== null) {
    current = parent[current]!
    path.unshift(current)
  }
  return path
}
