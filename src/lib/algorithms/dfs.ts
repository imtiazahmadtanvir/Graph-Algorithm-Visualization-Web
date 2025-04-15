import type { Node, Edge } from "@/types/graph"

// DFS algorithm implementation
export function dfs(nodes: Node[], edges: Edge[], startId: number, endId: number) {
  const steps: any[] = []
  const visited: Set<number> = new Set()
  const path: number[] = []

  // Record initial state
  steps.push({ visited: startId, current: startId })

  // Run DFS recursively
  dfsRecursive(startId)

  // Return the steps for visualization
  return { steps }

  // Recursive DFS function
  function dfsRecursive(nodeId: number) {
    // Mark as visited
    visited.add(nodeId)
    path.push(nodeId)

    // Record this step
    steps.push({ visited: nodeId, current: nodeId })

    // Check if we found the target
    if (nodeId === endId) {
      steps.push({ path: [...path] })
      return true
    }

    // Get all neighbors
    const neighbors = getNeighbors(nodeId, edges)

    // Visit each unvisited neighbor
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfsRecursive(neighbor)) {
          return true
        }
      }
    }

    // Backtrack
    path.pop()
    return false
  }
}

// Helper function to get neighbors
function getNeighbors(nodeId: number, edges: Edge[]): number[] {
  return edges.filter((edge) => edge.from === nodeId).map((edge) => edge.to)
}
