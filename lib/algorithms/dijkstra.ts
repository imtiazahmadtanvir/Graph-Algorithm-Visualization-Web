import type { Node, Edge } from "@/types/graph"

// Dijkstra's algorithm implementation
export function dijkstra(nodes: Node[], edges: Edge[], startId: number, endId: number) {
  const steps: any[] = []

  // Priority queue (simplified with an array)
  const queue: number[] = [startId]

  // Track distances and visited nodes
  const distances: Record<number, number> = {}
  const visited: Set<number> = new Set()
  const parent: Record<number, number | null> = {}

  // Initialize distances
  nodes.forEach((node) => {
    distances[node.id] = node.id === startId ? 0 : Number.POSITIVE_INFINITY
    parent[node.id] = null
  })

  // Record initial state
  steps.push({ visited: startId, current: startId })

  // Main Dijkstra loop
  while (queue.length > 0) {
    // Sort queue by distance (priority queue)
    queue.sort((a, b) => distances[a] - distances[b])

    // Get node with smallest distance
    const current = queue.shift()!

    // Skip if already processed
    if (visited.has(current)) continue

    // Mark as visited
    visited.add(current)

    // Record current node being processed
    steps.push({ current })

    // Check if we reached the target
    if (current === endId) {
      // Reconstruct and record the path
      const path = reconstructPath(parent, current)
      steps.push({ path })
      break
    }

    // Get all neighbors
    const neighbors = getNeighbors(current, edges)

    // Process each neighbor
    for (const neighbor of neighbors) {
      if (visited.has(neighbor)) continue

      // Find the edge weight
      const edge = edges.find((e) => e.from === current && e.to === neighbor)
      const weight = edge?.weight || 1

      // Calculate new distance
      const newDistance = distances[current] + weight

      // Update if we found a shorter path
      if (newDistance < distances[neighbor]) {
        distances[neighbor] = newDistance
        parent[neighbor] = current

        // Add to queue if not already there
        if (!queue.includes(neighbor)) {
          queue.push(neighbor)
          steps.push({ visited: neighbor })
        }
      }
    }
  }

  return { steps }
}

// Helper function to get neighbors
function getNeighbors(nodeId: number, edges: Edge[]): number[] {
  return edges.filter((edge) => edge.from === nodeId).map((edge) => edge.to)
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
