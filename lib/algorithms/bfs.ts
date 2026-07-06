import type { Node, Edge } from "@/types/graph"

// BFS algorithm implementation
export function bfs(nodes: Node[], edges: Edge[], startId: number, endId: number) {
  const steps: any[] = []

  // Queue for BFS traversal
  const queue: number[] = [startId]

  // Track visited nodes
  const visited: Set<number> = new Set([startId])

  // Track parent nodes for path reconstruction
  const parent: Record<number, number | null> = {}
  nodes.forEach((node) => (parent[node.id] = null))

  // Record initial state
  steps.push({ visited: startId, current: startId })

  // BFS main loop
  while (queue.length > 0) {
    // Get the next node from the queue
    const current = queue.shift()!

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

    // Process each unvisited neighbor
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        // Mark as visited
        visited.add(neighbor)

        // Record parent for path reconstruction
        parent[neighbor] = current

        // Add to queue
        queue.push(neighbor)

        // Record this step
        steps.push({ visited: neighbor })
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
