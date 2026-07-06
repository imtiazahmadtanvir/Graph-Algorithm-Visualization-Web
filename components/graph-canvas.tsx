"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { useTheme } from "next-themes"
import { Play, Pause, RefreshCw, Copy, Check } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const ALGORITHM_CODE = {
  javascript: {
    astar: `// A* Pathfinding Algorithm
function astar(startNode, endNode) {
  const openSet = [startNode];
  const closedSet = [];
  
  const gScore = {}; // Cost from start
  const fScore = {}; // gScore + heuristic
  const parent = {};
  
  gScore[startNode.id] = 0;
  fScore[startNode.id] = heuristic(startNode, endNode);
  
  while (openSet.length > 0) {
    // Sort openSet by fScore (lowest first)
    openSet.sort((a, b) => fScore[a.id] - fScore[b.id]);
    const current = openSet.shift();
    
    if (current.id === endNode.id) {
      return reconstructPath(parent, current);
    }
    
    closedSet.push(current);
    
    for (const neighbor of current.neighbors) {
      if (closedSet.includes(neighbor)) continue;
      
      const tentativeG = gScore[current.id] + distance(current, neighbor);
      
      if (!openSet.includes(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeG >= gScore[neighbor.id]) {
        continue;
      }
      
      parent[neighbor.id] = current;
      gScore[neighbor.id] = tentativeG;
      fScore[neighbor.id] = tentativeG + heuristic(neighbor, endNode);
    }
  }
  return []; // No path found
}`,
    bfs: `// Breadth-First Search
function bfs(startNode, endNode) {
  const queue = [startNode];
  const visited = new Set([startNode.id]);
  const parent = {};
  
  while (queue.length > 0) {
    const current = queue.shift();
    
    if (current.id === endNode.id) {
      return reconstructPath(parent, current);
    }
    
    for (const neighbor of current.neighbors) {
      if (!visited.has(neighbor.id)) {
        visited.add(neighbor.id);
        parent[neighbor.id] = current;
        queue.push(neighbor);
      }
    }
  }
  return []; // Path not found
}`,
    dfs: `// Depth-First Search
function dfs(startNode, endNode) {
  const visited = new Set();
  const path = [];
  
  function dfsRecursive(node) {
    visited.add(node.id);
    path.push(node);
    
    if (node.id === endNode.id) {
      return true;
    }
    
    for (const neighbor of node.neighbors) {
      if (!visited.has(neighbor.id)) {
        if (dfsRecursive(neighbor)) {
          return true;
        }
      }
    }
    
    path.pop(); // Backtrack
    return false;
  }
  
  dfsRecursive(startNode);
  return path;
}`,
    dijkstra: `// Dijkstra's Algorithm
function dijkstra(startNode, endNode, allNodes) {
  const distances = {};
  const visited = new Set();
  const parent = {};
  const queue = [startNode];
  
  for (const node of allNodes) {
    distances[node.id] = Infinity;
  }
  distances[startNode.id] = 0;
  
  while (queue.length > 0) {
    // Sort queue by distance (lowest first)
    queue.sort((a, b) => distances[a.id] - distances[b.id]);
    const current = queue.shift();
    
    if (visited.has(current.id)) continue;
    visited.add(current.id);
    
    if (current.id === endNode.id) {
      return reconstructPath(parent, current);
    }
    
    for (const neighbor of current.neighbors) {
      if (visited.has(neighbor.id)) continue;
      
      const newDist = distances[current.id] + distance(current, neighbor);
      
      if (newDist < distances[neighbor.id]) {
        distances[neighbor.id] = newDist;
        parent[neighbor.id] = current;
        if (!queue.includes(neighbor)) {
          queue.push(neighbor);
        }
      }
    }
  }
  return [];
}`,
    "graph-coloring": `// Graph Coloring (Greedy)
function graphColoring(nodes) {
  const nodeColors = {}; // Assign color index
  const colors = ["Green", "Blue", "Orange", "Purple", "Pink"];
  
  for (const node of nodes) {
    const usedColors = new Set();
    
    // Check neighbor colors
    for (const neighbor of node.neighbors) {
      if (nodeColors[neighbor.id] !== undefined) {
        usedColors.add(nodeColors[neighbor.id]);
      }
    }
    
    // Find first available color index
    let colorIndex = 0;
    while (usedColors.has(colorIndex)) {
      colorIndex++;
    }
    
    nodeColors[node.id] = colorIndex;
  }
  
  return nodeColors;
}`,
    prims: `// Prim's MST Algorithm
function prims(startNode, allNodes) {
  const visited = new Set([startNode.id]);
  const mstEdges = [];
  
  while (visited.size < allNodes.length) {
    let minEdge = null;
    let minWeight = Infinity;
    
    // Find min weight edge connecting visited to unvisited
    for (const node of allNodes) {
      if (!visited.has(node.id)) continue;
      
      for (const edge of node.edges) {
        const neighbor = edge.otherNode;
        if (!visited.has(neighbor.id)) {
          if (edge.weight < minWeight) {
            minWeight = edge.weight;
            minEdge = edge;
          }
        }
      }
    }
    
    if (!minEdge) break; // Graph is disconnected
    
    visited.add(minEdge.target.id);
    mstEdges.push(minEdge);
  }
  
  return mstEdges;
}`
  },
  cpp: {
    astar: `// A* Pathfinding Algorithm (C++)
vector<Node*> astar(Node* startNode, Node* endNode) {
  priority_queue<pair<double, Node*>> openSet;
  unordered_set<int> closedSet;
  
  unordered_map<int, double> gScore; // Cost from start
  unordered_map<int, double> fScore; // gScore + heuristic
  unordered_map<int, Node*> parent;
  
  gScore[startNode->id] = 0;
  fScore[startNode->id] = heuristic(startNode, endNode);
  
  while (!openSet.empty()) {
    // Sort openSet by fScore (lowest first)
    openSet.sort(); // Simplified priority queue
    Node* current = openSet.pop();
    
    if (current->id == endNode->id) {
      return reconstructPath(parent, current);
    }
    
    closedSet.insert(current->id);
    
    for (Node* neighbor : current->neighbors) {
      if (closedSet.count(neighbor->id)) continue;
      
      double tentativeG = gScore[current->id] + distance(current, neighbor);
      
      if (!openSet.contains(neighbor)) {
        openSet.push(neighbor);
      } else if (tentativeG >= gScore[neighbor->id]) {
        continue;
      }
      
      parent[neighbor->id] = current;
      gScore[neighbor->id] = tentativeG;
      fScore[neighbor->id] = tentativeG + heuristic(neighbor, endNode);
    }
  }
  return {}; // No path found
}`,
    bfs: `// Breadth-First Search (C++)
vector<Node*> bfs(Node* startNode, Node* endNode) {
  queue<Node*> q; q.push(startNode);
  unordered_set<int> visited = {startNode->id};
  unordered_map<int, Node*> parent;
  
  while (!q.empty()) {
    Node* current = q.front(); q.pop();
    
    if (current->id == endNode->id) {
      return reconstructPath(parent, current);
    }
    
    for (Node* neighbor : current->neighbors) {
      if (!visited.count(neighbor->id)) {
        visited.insert(neighbor->id);
        parent[neighbor->id] = current;
        q.push(neighbor);
      }
    }
  }
  return {}; // Path not found
}`,
    dfs: `// Depth-First Search (C++)
vector<Node*> dfs(Node* startNode, Node* endNode) {
  unordered_set<int> visited;
  vector<Node*> path;
  
  auto dfsRecursive = [&](auto& self, Node* node) -> bool {
    visited.insert(node->id);
    path.push_back(node);
    
    if (node->id == endNode->id) {
      return true;
    }
    
    for (Node* neighbor : node->neighbors) {
      if (!visited.count(neighbor->id)) {
        if (self(self, neighbor)) {
          return true;
        }
      }
    }
    
    path.pop_back(); // Backtrack
    return false;
  };
  
  dfsRecursive(dfsRecursive, startNode);
  return path;
}`,
    dijkstra: `// Dijkstra's Algorithm (C++)
vector<Node*> dijkstra(Node* startNode, Node* endNode, vector<Node*>& allNodes) {
  unordered_map<int, double> distances;
  unordered_set<int> visited;
  unordered_map<int, Node*> parent;
  queue<Node*> q; q.push(startNode);
  
  for (Node* node : allNodes) {
    distances[node->id] = INFINITY;
  }
  distances[startNode->id] = 0;
  
  while (!q.empty()) {
    // Sort queue by distance (lowest first)
    q.sort(); // Simplified priority queue
    Node* current = q.pop();
    
    if (visited.count(current->id)) continue;
    visited.insert(current->id);
    
    if (current->id == endNode->id) {
      return reconstructPath(parent, current);
    }
    
    for (Node* neighbor : current->neighbors) {
      if (visited.count(neighbor->id)) continue;
      
      double newDist = distances[current->id] + distance(current, neighbor);
      
      if (newDist < distances[neighbor->id]) {
        distances[neighbor->id] = newDist;
        parent[neighbor->id] = current;
        if (!q.contains(neighbor)) {
          q.push(neighbor);
        }
      }
    }
  }
  return {};
}`,
    "graph-coloring": `// Graph Coloring (Greedy) (C++)
unordered_map<int, int> graphColoring(vector<Node*>& nodes) {
  unordered_map<int, int> nodeColors; // Assign color index
  vector<string> colors = {"Green", "Blue", "Orange", "Purple", "Pink"};
  
  for (Node* node : nodes) {
    unordered_set<int> usedColors;
    
    // Check neighbor colors
    for (Node* neighbor : node->neighbors) {
      if (nodeColors.count(neighbor->id)) {
        usedColors.insert(nodeColors[neighbor->id]);
      }
    }
    
    // Find first available color index
    int colorIndex = 0;
    while (usedColors.count(colorIndex)) {
      colorIndex++;
    }
    
    nodeColors[node->id] = colorIndex;
  }
  
  return nodeColors;
}`,
    prims: `// Prim's MST Algorithm (C++)
vector<Edge> prims(Node* startNode, vector<Node*>& allNodes) {
  unordered_set<int> visited = {startNode->id};
  vector<Edge> mstEdges;
  
  while (visited.size() < allNodes.size()) {
    Edge* minEdge = nullptr;
    double minWeight = INFINITY;
    
    // Find min weight edge connecting visited to unvisited
    for (Node* node : allNodes) {
      if (!visited.count(node->id)) continue;
      
      for (Edge& edge : node->edges) {
        Node* neighbor = edge.otherNode;
        if (!visited.count(neighbor->id)) {
          if (edge.weight < minWeight) {
            minWeight = edge.weight;
            minEdge = &edge;
          }
        }
      }
    }
    
    if (!minEdge) break; // Graph is disconnected
    
    visited.insert(minEdge->target->id);
    mstEdges.push_back(*minEdge);
  }
  
  return mstEdges;
}`
  },
  java: {
    astar: `// A* Pathfinding Algorithm (Java)
List<Node> astar(Node startNode, Node endNode) {
  PriorityQueue<Node> openSet = new PriorityQueue<>();
  Set<Node> closedSet = new HashSet<>();
  
  Map<Integer, Double> gScore = new HashMap<>(); // Cost from start
  Map<Integer, Double> fScore = new HashMap<>(); // gScore + heuristic
  Map<Integer, Node> parent = new HashMap<>();
  
  gScore.put(startNode.id, 0.0);
  fScore.put(startNode.id, heuristic(startNode, endNode));
  
  while (!openSet.isEmpty()) {
    // Sort openSet by fScore (lowest first)
    openSet.sort(); // Simplified queue sort
    Node current = openSet.poll();
    
    if (current.id == endNode.id) {
      return reconstructPath(parent, current);
    }
    
    closedSet.add(current);
    
    for (Node neighbor : current.neighbors) {
      if (closedSet.contains(neighbor)) continue;
      
      double tentativeG = gScore.get(current.id) + distance(current, neighbor);
      
      if (!openSet.contains(neighbor)) {
        openSet.add(neighbor);
      } else if (tentativeG >= gScore.get(neighbor.id)) {
        continue;
      }
      
      parent.put(neighbor.id, current);
      gScore.put(neighbor.id, tentativeG);
      fScore.put(neighbor.id, tentativeG + heuristic(neighbor, endNode));
    }
  }
  return new ArrayList<>(); // No path found
}`,
    bfs: `// Breadth-First Search (Java)
List<Node> bfs(Node startNode, Node endNode) {
  Queue<Node> queue = new LinkedList<>(); queue.add(startNode);
  Set<Integer> visited = new HashSet<>(Arrays.asList(startNode.id));
  Map<Integer, Node> parent = new HashMap<>();
  
  while (!queue.isEmpty()) {
    Node current = queue.poll();
    
    if (current.id == endNode.id) {
      return reconstructPath(parent, current);
    }
    
    for (Node neighbor : current.neighbors) {
      if (!visited.contains(neighbor.id)) {
        visited.add(neighbor.id);
        parent.put(neighbor.id, current);
        queue.add(neighbor);
      }
    }
  }
  return new ArrayList<>(); // Path not found
}`,
    dfs: `// Depth-First Search (Java)
List<Node> dfs(Node startNode, Node endNode) {
  Set<Integer> visited = new HashSet<>();
  List<Node> path = new ArrayList<>();
  
  class Helper {
    boolean dfsRecursive(Node node) {
      visited.add(node.id);
      path.add(node);
      
      if (node.id == endNode.id) {
        return true;
      }
      
      for (Node neighbor : node.neighbors) {
        if (!visited.contains(neighbor.id)) {
          if (dfsRecursive(neighbor)) {
            return true;
          }
        }
      }
      
      path.remove(path.size() - 1); // Backtrack
      return false;
    }
  }
  
  new Helper().dfsRecursive(startNode);
  return path;
}`,
    dijkstra: `// Dijkstra's Algorithm (Java)
List<Node> dijkstra(Node startNode, Node endNode, List<Node> allNodes) {
  Map<Integer, Double> distances = new HashMap<>();
  Set<Integer> visited = new HashSet<>();
  Map<Integer, Node> parent = new HashMap<>();
  Queue<Node> queue = new LinkedList<>(); queue.add(startNode);
  
  for (Node node : allNodes) {
    distances.put(node.id, Double.POSITIVE_INFINITY);
  }
  distances.put(startNode.id, 0.0);
  
  while (!queue.isEmpty()) {
    // Sort queue by distance (lowest first)
    queue.sort(); // Simplified queue sort
    Node current = queue.poll();
    
    if (visited.contains(current.id)) continue;
    visited.add(current.id);
    
    if (current.id == endNode.id) {
      return reconstructPath(parent, current);
    }
    
    for (Node neighbor : current.neighbors) {
      if (visited.contains(neighbor.id)) continue;
      
      double newDist = distances.get(current.id) + distance(current, neighbor);
      
      if (newDist < distances.get(neighbor.id)) {
        distances.put(neighbor.id, newDist);
        parent.put(neighbor.id, current);
        if (!queue.contains(neighbor)) {
          queue.add(neighbor);
        }
      }
    }
  }
  return new ArrayList<>();
}`,
    "graph-coloring": `// Graph Coloring (Greedy) (Java)
Map<Integer, Integer> graphColoring(List<Node> nodes) {
  Map<Integer, Integer> nodeColors = new HashMap<>(); // Assign color index
  String[] colors = {"Green", "Blue", "Orange", "Purple", "Pink"};
  
  for (Node node : nodes) {
    Set<Integer> usedColors = new HashSet<>();
    
    // Check neighbor colors
    for (Node neighbor : node.neighbors) {
      if (nodeColors.get(neighbor.id) != null) {
        usedColors.add(nodeColors.get(neighbor.id));
      }
    }
    
    // Find first available color index
    int colorIndex = 0;
    while (usedColors.contains(colorIndex)) {
      colorIndex++;
    }
    
    nodeColors.put(node.id, colorIndex);
  }
  
  return nodeColors;
}`,
    prims: `// Prim's MST Algorithm (Java)
List<Edge> prims(Node startNode, List<Node> allNodes) {
  Set<Integer> visited = new HashSet<>(Arrays.asList(startNode.id));
  List<Edge> mstEdges = new ArrayList<>();
  
  while (visited.size() < allNodes.size()) {
    Edge minEdge = null;
    double minWeight = Double.POSITIVE_INFINITY;
    
    // Find min weight edge connecting visited to unvisited
    for (Node node : allNodes) {
      if (!visited.contains(node.id)) continue;
      
      for (Edge edge : node.edges) {
        Node neighbor = edge.otherNode;
        if (!visited.contains(neighbor.id)) {
          if (edge.weight < minWeight) {
            minWeight = edge.weight;
            minEdge = edge;
          }
        }
      }
    }
    
    if (minEdge == null) break; // Graph is disconnected
    
    visited.add(minEdge.target.id);
    mstEdges.add(minEdge);
  }
  
  return mstEdges;
}`
  },
  python: {
    astar: `# A* Pathfinding Algorithm (Python)
def astar(startNode, endNode):
    openSet = [startNode]
    closedSet = []
    
    gScore = {} # Cost from start
    fScore = {} # gScore + heuristic
    parent = {}
    
    gScore[startNode.id] = 0
    fScore[startNode.id] = heuristic(startNode, endNode)
    
    while len(openSet) > 0:
        # Sort openSet by fScore (lowest first)
        openSet.sort(key=lambda x: fScore.get(x.id, float('inf')))
        current = openSet.pop(0)
        
        if current.id == endNode.id:
            return reconstructPath(parent, current)
            
        closedSet.append(current)
        
        for neighbor in current.neighbors:
            if neighbor in closedSet: continue
            
            tentativeG = gScore[current.id] + distance(current, neighbor)
            
            if neighbor not in openSet:
                openSet.append(neighbor)
            elif tentativeG >= gScore.get(neighbor.id, float('inf')):
                continue
                
            parent[neighbor.id] = current
            gScore[neighbor.id] = tentativeG
            fScore[neighbor.id] = tentativeG + heuristic(neighbor, endNode)
            
    return [] # No path found`,
    bfs: `# Breadth-First Search (Python)
def bfs(startNode, endNode):
    queue = [startNode]
    visited = {startNode.id}
    parent = {}
    
    while len(queue) > 0:
        current = queue.pop(0)
        
        if current.id == endNode.id:
            return reconstructPath(parent, current)
            
        for neighbor in current.neighbors:
            if neighbor.id not in visited:
                visited.add(neighbor.id)
                parent[neighbor.id] = current
                queue.append(neighbor)
                
    return [] # Path not found`,
    dfs: `# Depth-First Search (Python)
def dfs(startNode, endNode):
    visited = set()
    path = []
    
    def dfsRecursive(node):
        visited.add(node.id)
        path.append(node)
        
        if node.id == endNode.id:
            return True
            
        for neighbor in node.neighbors:
            if neighbor.id not in visited:
                if dfsRecursive(neighbor):
                    return True
                    
        path.pop() # Backtrack
        return False
        
    dfsRecursive(startNode)
    return path`,
    dijkstra: `# Dijkstra's Algorithm (Python)
def dijkstra(startNode, endNode, allNodes):
    distances = {}
    visited = set()
    parent = {}
    queue = [startNode]
    
    for node in allNodes:
        distances[node.id] = float('inf')
    distances[startNode.id] = 0
    
    while len(queue) > 0:
        # Sort queue by distance (lowest first)
        queue.sort(key=lambda x: distances.get(x.id, float('inf')))
        current = queue.pop(0)
        
        if current.id in visited: continue
        visited.add(current.id)
        
        if current.id == endNode.id:
            return reconstructPath(parent, current)
            
        for neighbor in current.neighbors:
            if neighbor.id in visited: continue
            
            newDist = distances[current.id] + distance(current, neighbor)
            
            if newDist < distances.get(neighbor.id, float('inf')):
                distances[neighbor.id] = newDist
                parent[neighbor.id] = current
                if neighbor not in queue:
                    queue.append(neighbor)
                    
    return []`,
    "graph-coloring": `# Graph Coloring (Greedy) (Python)
def graphColoring(nodes):
    nodeColors = {} # Assign color index
    colors = ["Green", "Blue", "Orange", "Purple", "Pink"]
    
    for node in nodes:
        usedColors = set()
        
        # Check neighbor colors
        for neighbor in node.neighbors:
            if neighbor.id in nodeColors:
                usedColors.add(nodeColors[neighbor.id])
                
        # Find first available color index
        colorIndex = 0
        while colorIndex in usedColors:
            colorIndex += 1
            
        nodeColors[node.id] = colorIndex
        
    return nodeColors`,
    prims: `# Prim's MST Algorithm (Python)
def prims(startNode, allNodes):
    visited = {startNode.id}
    mstEdges = []
    
    while len(visited) < len(allNodes):
        minEdge = None
        minWeight = float('inf')
        
        # Find min weight edge connecting visited to unvisited
        for node in allNodes:
            if node.id not in visited: continue
            
            for edge in node.edges:
                neighbor = edge.otherNode
                if neighbor.id not in visited:
                    if edge.weight < minWeight:
                        minWeight = edge.weight
                        minEdge = edge
                        
        if not minEdge: break # Graph is disconnected
        
        visited.add(minEdge.target.id)
        mstEdges.append(minEdge)
        
    return mstEdges`
  },
  c: {
    astar: `// A* Pathfinding Algorithm (C)
Path astar(Node* startNode, Node* endNode) {
  Node* openSet[100]; int openCount = 1; openSet[0] = startNode;
  Node* closedSet[100]; int closedCount = 0;
  
  double gScore[100]; // Cost map
  double fScore[100]; // Total score map
  Node* parent[100];
  
  gScore[startNode->id] = 0;
  fScore[startNode->id] = heuristic(startNode, endNode);
  
  while (openCount > 0) {
    // Sort openSet by fScore (lowest first)
    sortOpenSet(openSet, openCount, fScore);
    Node* current = shiftOpenSet(openSet, &openCount);
    
    if (current->id == endNode->id) {
      return reconstructPath(parent, current);
    }
    
    closedSet[closedCount++] = current;
    
    for (int i = 0; i < current->neighborCount; i++) {
      Node* neighbor = current->neighbors[i];
      if (containsNode(closedSet, closedCount, neighbor)) continue;
      
      double tentativeG = gScore[current->id] + distance(current, neighbor);
      
      if (!containsNode(openSet, openCount, neighbor)) {
        openSet[openCount++] = neighbor;
      } else if (tentativeG >= gScore[neighbor->id]) {
        continue;
      }
      
      parent[neighbor->id] = current;
      gScore[neighbor->id] = tentativeG;
      fScore[neighbor->id] = tentativeG + heuristic(neighbor, endNode);
    }
  }
  return emptyPath(); // No path found
}`,
    bfs: `// Breadth-First Search (C)
Path bfs(Node* startNode, Node* endNode) {
  Node* queue[100]; int qHead = 0, qTail = 0; queue[qTail++] = startNode;
  int visited[100] = {0}; visited[startNode->id] = 1;
  Node* parent[100] = {NULL};
  
  while (qHead < qTail) {
    Node* current = queue[qHead++];
    
    if (current->id == endNode->id) {
      return reconstructPath(parent, current);
    }
    
    for (int i = 0; i < current->neighborCount; i++) {
      Node* neighbor = current->neighbors[i];
      if (!visited[neighbor->id]) {
        visited[neighbor->id] = 1;
        parent[neighbor->id] = current;
        queue[qTail++] = neighbor;
      }
    }
  }
  return emptyPath(); // Path not found
}`,
    dfs: `// Depth-First Search (C)
int visited[100] = {0};
Node* path[100]; int pathCount = 0;

int dfsRecursive(Node* node, Node* endNode) {
  visited[node->id] = 1;
  path[pathCount++] = node;
  
  if (node->id == endNode->id) {
    return 1;
  }
  
  for (int i = 0; i < node->neighborCount; i++) {
    Node* neighbor = node->neighbors[i];
    if (!visited[neighbor->id]) {
      if (dfsRecursive(neighbor, endNode)) {
        return 1;
      }
    }
  }
  
  pathCount--; // Backtrack
  return 0;
}

Path solveDfs(Node* startNode, Node* endNode) {
  dfsRecursive(startNode, endNode);
  return buildPath(path, pathCount);
}`,
    dijkstra: `// Dijkstra's Algorithm (C)
Path dijkstra(Node* startNode, Node* endNode, Node* allNodes[], int nodeCount) {
  double distances[100];
  int visited[100] = {0};
  Node* parent[100] = {NULL};
  Node* queue[100]; int qCount = 1; queue[0] = startNode;
  
  for (int i = 0; i < nodeCount; i++) {
    distances[allNodes[i]->id] = INFINITY;
  }
  distances[startNode->id] = 0;
  
  while (qCount > 0) {
    // Sort queue by distance (lowest first)
    sortQueue(queue, qCount, distances);
    Node* current = shiftQueue(queue, &qCount);
    
    if (visited[current->id]) continue;
    visited[current->id] = 1;
    
    if (current->id == endNode->id) {
      return reconstructPath(parent, current);
    }
    
    for (int i = 0; i < current->neighborCount; i++) {
      Node* neighbor = current->neighbors[i];
      if (visited[neighbor->id]) continue;
      
      double newDist = distances[current->id] + distance(current, neighbor);
      
      if (newDist < distances[neighbor->id]) {
        distances[neighbor->id] = newDist;
        parent[neighbor->id] = current;
        if (!containsNode(queue, qCount, neighbor)) {
          queue[qCount++] = neighbor;
        }
      }
    }
  }
  return emptyPath();
}`,
    "graph-coloring": `// Graph Coloring (Greedy) (C)
void graphColoring(Node* nodes[], int nodeCount) {
  int nodeColors[100]; memset(nodeColors, -1, sizeof(nodeColors));
  char* colors[] = {"Green", "Blue", "Orange", "Purple", "Pink"};
  
  for (int i = 0; i < nodeCount; i++) {
    Node* node = nodes[i];
    int usedColors[100] = {0};
    
    // Check neighbor colors
    for (int j = 0; j < node->neighborCount; j++) {
      Node* neighbor = node->neighbors[j];
      if (nodeColors[neighbor->id] != -1) {
        usedColors[nodeColors[neighbor->id]] = 1;
      }
    }
    
    // Find first available color index
    int colorIndex = 0;
    while (usedColors[colorIndex]) {
      colorIndex++;
    }
    
    nodeColors[node->id] = colorIndex;
  }
}`,
    prims: `// Prim's MST Algorithm (C)
void prims(Node* startNode, Node* allNodes[], int nodeCount, Edge mstEdges[], int* mstCount) {
  int visited[100] = {0}; visited[startNode->id] = 1;
  int visitedCount = 1; *mstCount = 0;
  
  while (visitedCount < nodeCount) {
    Edge* minEdge = NULL;
    double minWeight = INFINITY;
    
    // Find min weight edge connecting visited to unvisited
    for (int i = 0; i < nodeCount; i++) {
      Node* node = allNodes[i];
      if (!visited[node->id]) continue;
      
      for (int j = 0; j < node->edgeCount; j++) {
        Edge* edge = &node->edges[j];
        if (!visited[edge->target->id]) {
          if (edge->weight < minWeight) {
            minWeight = edge->weight;
            minEdge = edge;
          }
        }
      }
    }
    
    if (!minEdge) break; // Graph is disconnected
    
    visited[minEdge->target->id] = 1;
    visitedCount++;
    mstEdges[(*mstCount)++] = *minEdge;
  }
}`
  },
  csharp: {
    astar: `// A* Pathfinding Algorithm (C#)
List<Node> AStar(Node startNode, Node endNode) {
  var openSet = new List<Node> { startNode };
  var closedSet = new List<Node>();
  
  var gScore = new Dictionary<int, double>(); // Cost
  var fScore = new Dictionary<int, double>(); // Total
  var parent = new Dictionary<int, Node>();
  
  gScore[startNode.Id] = 0;
  fScore[startNode.Id] = Heuristic(startNode, endNode);
  
  while (openSet.Count > 0) {
    // Sort openSet by fScore (lowest first)
    openSet.Sort((a, b) => fScore.GetValueOrDefault(a.Id, double.MaxValue).CompareTo(fScore.GetValueOrDefault(b.Id, double.MaxValue)));
    var current = openSet[0]; openSet.RemoveAt(0);
    
    if (current.Id == endNode.Id) {
      return ReconstructPath(parent, current);
    }
    
    closedSet.Add(current);
    
    foreach (var neighbor in current.Neighbors) {
      if (closedSet.Contains(neighbor)) continue;
      
      double tentativeG = gScore[current.Id] + Distance(current, neighbor);
      
      if (!openSet.Contains(neighbor)) {
        openSet.Add(neighbor);
      } else if (tentativeG >= gScore.GetValueOrDefault(neighbor.Id, double.MaxValue)) {
        continue;
      }
      
      parent[neighbor.Id] = current;
      gScore[neighbor.Id] = tentativeG;
      fScore[neighbor.Id] = tentativeG + Heuristic(neighbor, endNode);
    }
  }
  return new List<Node>(); // No path found
}`,
    bfs: `// Breadth-First Search (C#)
List<Node> Bfs(Node startNode, Node endNode) {
  var queue = new Queue<Node>(); queue.Enqueue(startNode);
  var visited = new HashSet<int> { startNode.Id };
  var parent = new Dictionary<int, Node>();
  
  while (queue.Count > 0) {
    var current = queue.Dequeue();
    
    if (current.Id == endNode.Id) {
      return ReconstructPath(parent, current);
    }
    
    foreach (var neighbor in current.Neighbors) {
      if (!visited.Contains(neighbor.Id)) {
        visited.Add(neighbor.Id);
        parent[neighbor.Id] = current;
        queue.Enqueue(neighbor);
      }
    }
  }
  return new List<Node>(); // Path not found
}`,
    dfs: `// Depth-First Search (C#)
List<Node> Dfs(Node startNode, Node endNode) {
  var visited = new HashSet<int>();
  var path = new List<Node>();
  
  bool DfsRecursive(Node node) {
    visited.Add(node.Id);
    path.Add(node);
    
    if (node.Id == endNode.Id) {
      return true;
    }
    
    foreach (var neighbor in node.Neighbors) {
      if (!visited.Contains(neighbor.Id)) {
        if (DfsRecursive(neighbor)) {
          return true;
        }
      }
    }
    
    path.RemoveAt(path.Count - 1); // Backtrack
    return false;
  }
  
  DfsRecursive(startNode);
  return path;
}`,
    dijkstra: `// Dijkstra's Algorithm (C#)
List<Node> Dijkstra(Node startNode, Node endNode, List<Node> allNodes) {
  var distances = new Dictionary<int, double>();
  var visited = new HashSet<int>();
  var parent = new Dictionary<int, Node>();
  var queue = new List<Node> { startNode };
  
  foreach (var node in allNodes) {
    distances[node.Id] = double.PositiveInfinity;
  }
  distances[startNode.Id] = 0;
  
  while (queue.Count > 0) {
    // Sort queue by distance (lowest first)
    queue.Sort((a, b) => distances.GetValueOrDefault(a.Id, double.MaxValue).CompareTo(distances.GetValueOrDefault(b.Id, double.MaxValue)));
    var current = queue[0]; queue.RemoveAt(0);
    
    if (visited.Contains(current.Id)) continue;
    visited.Add(current.Id);
    
    if (current.Id == endNode.Id) {
      return ReconstructPath(parent, current);
    }
    
    foreach (var neighbor in current.Neighbors) {
      if (visited.Contains(neighbor.Id)) continue;
      
      double newDist = distances[current.Id] + Distance(current, neighbor);
      
      if (newDist < distances.GetValueOrDefault(neighbor.Id, double.MaxValue)) {
        distances[neighbor.Id] = newDist;
        parent[neighbor.Id] = current;
        if (!queue.Contains(neighbor)) {
          queue.Add(neighbor);
        }
      }
    }
  }
  return new List<Node>();
}`,
    "graph-coloring": `// Graph Coloring (Greedy) (C#)
Dictionary<int, int> GraphColoring(List<Node> nodes) {
  var nodeColors = new Dictionary<int, int>(); // Assign color index
  var colors = new string[] { "Green", "Blue", "Orange", "Purple", "Pink" };
  
  foreach (var node in nodes) {
    var usedColors = new HashSet<int>();
    
    // Check neighbor colors
    foreach (var neighbor in node.Neighbors) {
      if (nodeColors.ContainsKey(neighbor.Id)) {
        usedColors.Add(nodeColors[neighbor.Id]);
      }
    }
    
    // Find first available color index
    int colorIndex = 0;
    while (usedColors.Contains(colorIndex)) {
      colorIndex++;
    }
    
    nodeColors[node.Id] = colorIndex;
  }
  
  return nodeColors;
}`,
    prims: `// Prim's MST Algorithm (C#)
List<Edge> Prims(Node startNode, List<Node> allNodes) {
  var visited = new HashSet<int> { startNode.Id };
  var mstEdges = new List<Edge>();
  
  while (visited.Count < allNodes.Count) {
    Edge minEdge = null;
    double minWeight = double.PositiveInfinity;
    
    // Find min weight edge connecting visited to unvisited
    foreach (var node in allNodes) {
      if (!visited.Contains(node.Id)) continue;
      
      foreach (var edge in node.Edges) {
        var neighbor = edge.OtherNode;
        if (!visited.Contains(neighbor.Id)) {
          if (edge.Weight < minWeight) {
            minWeight = edge.Weight;
            minEdge = edge;
          }
        }
      }
    }
    
    if (minEdge == null) break; // Graph is disconnected
    
    visited.Add(minEdge.Target.Id);
    mstEdges.Add(minEdge);
  }
  
  return mstEdges;
}`
  }
};


function getHighlightedLines(algorithmName: string, step: any, language: string): number[] {
  if (!step) return [];
  
  if (language === "python") {
    if (algorithmName === "bfs") {
      if (step.path) return [10];
      if (step.visited !== undefined && step.current !== undefined) return [2, 3, 4];
      if (step.current !== undefined) return [6, 7, 9];
      if (step.visited !== undefined) return [13, 14, 15, 16];
    }
    if (algorithmName === "dfs") {
      if (step.path) return [21];
      if (step.visited !== undefined && step.current !== undefined) return [20];
      if (step.current !== undefined) return [5, 6, 7, 9];
      if (step.visited !== undefined) return [13, 14];
    }
    if (algorithmName === "astar") {
      if (step.path) return [18];
      if (step.visited !== undefined && step.current !== undefined) return [9, 10];
      if (step.current !== undefined) return [14, 15, 17];
      if (step.visited !== undefined) return [22, 25, 28];
    }
    if (algorithmName === "dijkstra") {
      if (step.path) return [20];
      if (step.visited !== undefined && step.current !== undefined) return [7, 8, 9];
      if (step.current !== undefined) return [13, 14, 16, 17, 19];
      if (step.visited !== undefined) return [22, 25, 28, 31];
    }
    if (algorithmName === "graph-coloring") {
      if (step.nodeColor) return [9, 15, 18];
    }
    if (algorithmName === "prims") {
      if (step.mst) return [25];
      if (step.visited !== undefined && step.current !== undefined) return [2, 3];
      if (step.current !== undefined) return [10, 13, 16];
      if (step.visited !== undefined) return [22, 23];
    }
    return [];
  }
  
  if (algorithmName === "bfs") {
    if (step.path) return [10];
    if (step.visited !== undefined && step.current !== undefined) return [2, 3, 4];
    if (step.current !== undefined) return [7, 9];
    if (step.visited !== undefined) return [14, 15, 17];
  }
  
  if (algorithmName === "dfs") {
    if (step.path) return [26];
    if (step.visited !== undefined && step.current !== undefined) return [25];
    if (step.current !== undefined) return [5, 6, 9];
    if (step.visited !== undefined) return [14, 15];
  }
  
  if (algorithmName === "astar") {
    if (step.path) return [18];
    if (step.visited !== undefined && step.current !== undefined) return [9, 10];
    if (step.current !== undefined) return [14, 15, 17];
    if (step.visited !== undefined) return [23, 26, 29];
  }
  
  if (algorithmName === "dijkstra") {
    if (step.path) return [21];
    if (step.visited !== undefined && step.current !== undefined) return [7, 8, 10];
    if (step.current !== undefined) return [14, 15, 18, 20];
    if (step.visited !== undefined) return [24, 27, 29, 32];
  }
  
  if (algorithmName === "graph-coloring") {
    if (step.nodeColor) return [9, 17, 21];
  }
  
  if (algorithmName === "prims") {
    if (step.mst) return [30];
    if (step.visited !== undefined && step.current !== undefined) return [2, 3];
    if (step.current !== undefined) return [10, 13, 16];
    if (step.visited !== undefined) return [26, 27];
  }
  
  return [];
}

function getStepExplanation(algorithmName: string, step: any): string {
  if (!step) return "Click Play or step forward to begin.";
  
  if (step.reset) {
    return "Resetting visualization to initial state.";
  }
  
  if (algorithmName === "bfs") {
    if (step.path) return `Target found! Reconstructing shortest path: ${step.path.join(" ➔ ")}`;
    if (step.visited !== undefined && step.current !== undefined) return `Initializing BFS starting at node ${step.current}.`;
    if (step.current !== undefined) return `De-queueing node ${step.current} and checking if it's the target.`;
    if (step.visited !== undefined) return `Discovered neighbor node ${step.visited}, pushing to queue.`;
  }
  
  if (algorithmName === "dfs") {
    if (step.path) return `Target found! Path discovered: ${step.path.join(" ➔ ")}`;
    if (step.visited !== undefined && step.current !== undefined) return `Initializing DFS starting at node ${step.current}.`;
    if (step.current !== undefined) return `Recursively visiting node ${step.current}.`;
    if (step.visited !== undefined) return `Traversing down to unvisited neighbor node ${step.visited}.`;
  }
  
  if (algorithmName === "astar") {
    if (step.path) return `Optimal path found! Shortest path: ${step.path.join(" ➔ ")}`;
    if (step.visited !== undefined && step.current !== undefined) return `Initializing A* pathfinding from node ${step.current}.`;
    if (step.current !== undefined) return `Expanding node ${step.current} with the lowest total f(n) = g(n) + h(n) value.`;
    if (step.visited !== undefined) return `Calculating cost and adding neighbor node ${step.visited} to Open Set.`;
  }
  
  if (algorithmName === "dijkstra") {
    if (step.path) return `Shortest path found! Path: ${step.path.join(" ➔ ")}`;
    if (step.visited !== undefined && step.current !== undefined) return `Initializing Dijkstra's algorithm from node ${step.current}.`;
    if (step.current !== undefined) return `Selecting unvisited node ${step.current} with the minimum tentative distance.`;
    if (step.visited !== undefined) return `Relaxing edge to neighbor node ${step.visited} and updating tentative distance.`;
  }
  
  if (algorithmName === "graph-coloring") {
    if (step.nodeColor) return `Assigning first available color to node ${step.nodeColor.id}. (Assigned color: ${step.nodeColor.color})`;
  }
  
  if (algorithmName === "prims") {
    if (step.mst) return "Prim's algorithm finished. Minimum Spanning Tree constructed.";
    if (step.visited !== undefined && step.current !== undefined) return `Initializing Prim's MST starting at node ${step.current}.`;
    if (step.current !== undefined) return `Examining all cut edges and choosing the minimum weight edge to node ${step.current}.`;
    if (step.visited !== undefined) return `Adding node ${step.visited} and its connecting edge to the MST.`;
  }
  
  return "Processing algorithm step...";
}

function highlightJS(line: string) {
  const trimmedLine = line.trim();
  if (trimmedLine.startsWith("//") || trimmedLine.startsWith("#")) {
    return <span className="text-emerald-500 font-normal">{line}</span>;
  }

  const keywords = [
    "const", "let", "function", "while", "for", "if", "else", "return", "break", "continue", "class", "new", "Set", "Map", "Record", "Infinity",
    "def", "elif", "in", "import", "from", "None", "True", "False", "lambda", "float",
    "int", "double", "vector", "queue", "priority_queue", "unordered_set", "unordered_map", "pair", "nullptr", "void", "string",
    "public", "private", "using", "namespace", "std", "List", "HashMap", "HashSet", "ArrayList", "Queue", "LinkedList", "PriorityQueue"
  ];
  const tokens = line.split(/(\s+|\(|\)|\{|\}|\[|\]|;|,|\.|\+|-|\*|\/|=|<|>|!|&|\|)/);
  
  return (
    <>
      {tokens.map((token, idx) => {
        const trimmed = token.trim();
        if (keywords.includes(trimmed)) {
          if (["if", "elif", "else", "return", "break", "while", "for", "continue", "in"].includes(trimmed)) {
            return <span key={idx} className="text-[#c586c0] font-semibold">{token}</span>;
          }
          return <span key={idx} className="text-[#569cd6] font-semibold">{token}</span>;
        }
        if (["bfs", "dfs", "astar", "dijkstra", "graphColoring", "prims", "heuristic", "reconstructPath", "distance"].includes(trimmed)) {
          return <span key={idx} className="text-[#dcdcaa]">{token}</span>;
        }
        if (/^\d+(\.\d+)?$/.test(trimmed)) {
          return <span key={idx} className="text-[#b5cea8]">{token}</span>;
        }
        if (/^(".*"|'.*'|`.*`)$/.test(trimmed)) {
          return <span key={idx} className="text-[#ce9178]">{token}</span>;
        }
        if (["=", "+", "-", "*", "/", "<", ">", "!", "&&", "||"].includes(trimmed)) {
          return <span key={idx} className="text-[#d4d4d4] font-medium">{token}</span>;
        }
        return <span key={idx} className="text-[#d4d4d4]">{token}</span>;
      })}
    </>
  );
}



// Simple types for nodes and edges
interface Node {
  id: number
  x: number
  y: number
  color?: string
  state?: "default" | "visited" | "current" | "path" | "start" | "end"
}

interface Edge {
  from: number
  to: number
  weight?: number
}

interface GraphCanvasProps {
  nodes: Node[]
  edges: Edge[]
  algorithm: (nodes: Node[], edges: Edge[], startId: number, endId: number) => { steps: any[] }
  startNodeId: number
  endNodeId: number
  directed?: boolean
  weighted?: boolean
  algorithmName?: string
}

export default function GraphCanvas({
  nodes: initialNodes,
  edges: initialEdges,
  algorithm,
  startNodeId,
  endNodeId,
  directed = false,
  weighted = false,
  algorithmName,
}: GraphCanvasProps) {
  // References and state
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const codeViewportRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<any[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [copied, setCopied] = useState(false)
  const [selectedLang, setSelectedLang] = useState<string>("javascript")
  const { theme } = useTheme()

  // Initialize the graph once
  useEffect(() => {
    if (isInitialized || initialNodes.length === 0) return

    // Deep clone the nodes and edges
    const clonedNodes: Node[] = initialNodes.map((node) => ({
      ...node,
      state: (node.id === startNodeId ? "start" : node.id === endNodeId ? "end" : "default") as Node["state"],
    }))

    setNodes(clonedNodes)
    setEdges([...initialEdges])
    setIsInitialized(true)

    // Run the algorithm once
    try {
      const result = algorithm(clonedNodes, initialEdges, startNodeId, endNodeId)
      if (result && result.steps) {
        setSteps(result.steps)
      }
    } catch (error) {
      console.error("Error running algorithm:", error)
    }
  }, [initialNodes, initialEdges, algorithm, startNodeId, endNodeId, isInitialized])

  // Handle animation
  useEffect(() => {
    if (!isPlaying || steps.length === 0 || currentStep >= steps.length) return

    const timer = setTimeout(
      () => {
        // Apply the current step
        const step = steps[currentStep]

        setNodes((prevNodes) => {
          const newNodes = [...prevNodes]

          // Handle different step types
          if (step.reset) {
            newNodes.forEach((node) => {
              if (node.id !== startNodeId && node.id !== endNodeId) {
                node.state = "default"
                node.color = undefined
              }
            })
          }

          if (step.visited) {
            const node = newNodes.find((n) => n.id === step.visited)
            if (node && node.state !== "start" && node.state !== "end") {
              node.state = "visited"
            }
          }

          if (step.current) {
            // Reset previous current node
            newNodes.forEach((node) => {
              if (node.state === "current") {
                node.state = "visited"
              }
            })

            // Set new current node
            const node = newNodes.find((n) => n.id === step.current)
            if (node && node.state !== "start" && node.state !== "end") {
              node.state = "current"
            }
          }

          if (step.path) {
            step.path.forEach((id: number) => {
              const node = newNodes.find((n) => n.id === id)
              if (node && node.state !== "start" && node.state !== "end") {
                node.state = "path"
              }
            })
          }

          if (step.nodeColor) {
            const node = newNodes.find((n) => n.id === step.nodeColor.id)
            if (node) {
              node.color = step.nodeColor.color
            }
          }

          if (step.edge) {
            // Highlight edge in MST algorithms
            // This would require additional state for edges
            // For simplicity, we're just handling node states here
          }

          return newNodes
        })

        // Move to next step
        setCurrentStep((prev) => {
          const next = prev + 1
          if (next >= steps.length) {
            setIsPlaying(false)
          }
          return next
        })
      },
      1000 - speed * 9,
    ) // Speed control

    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, steps, speed, startNodeId, endNodeId])

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || nodes.length === 0) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Get colors based on theme
    const isDark = theme === "dark"
    const edgeColor = isDark ? "#94a3b8" : "#64748b" // slate-400/500
    const nodeStrokeColor = isDark ? "#e2e8f0" : "#334155" // slate-200/700
    const textColor = isDark ? "#f8fafc" : "#0f172a" // slate-50/900
    const defaultNodeColor = isDark ? "#1e293b" : "#f1f5f9" // slate-800/100

    // Draw edges
    edges.forEach((edge) => {
      const fromNode = nodes.find((n) => n.id === edge.from)
      const toNode = nodes.find((n) => n.id === edge.to)

      if (fromNode && toNode) {
        // Draw the edge line
        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.strokeStyle = edgeColor
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw arrow if directed
        if (directed) {
          const angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x)
          const arrowSize = 10

          ctx.beginPath()
          ctx.moveTo(toNode.x - Math.cos(angle) * 20, toNode.y - Math.sin(angle) * 20)
          ctx.lineTo(
            toNode.x - Math.cos(angle) * 20 - Math.cos(angle - Math.PI / 6) * arrowSize,
            toNode.y - Math.sin(angle) * 20 - Math.sin(angle - Math.PI / 6) * arrowSize,
          )
          ctx.lineTo(
            toNode.x - Math.cos(angle) * 20 - Math.cos(angle + Math.PI / 6) * arrowSize,
            toNode.y - Math.sin(angle) * 20 - Math.sin(angle + Math.PI / 6) * arrowSize,
          )
          ctx.closePath()
          ctx.fillStyle = edgeColor
          ctx.fill()
        }

        // Draw weight if weighted
        if (weighted && edge.weight !== undefined) {
          const midX = (fromNode.x + toNode.x) / 2
          const midY = (fromNode.y + toNode.y) / 2

          ctx.font = "12px sans-serif"
          ctx.fillStyle = textColor
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(edge.weight.toString(), midX, midY - 10)
        }
      }
    })

    // Draw nodes
    nodes.forEach((node) => {
      ctx.beginPath()
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2)

      // Set fill color based on node state
      if (node.color) {
        ctx.fillStyle = node.color
      } else {
        switch (node.state) {
          case "visited":
            ctx.fillStyle = isDark ? "#60a5fa" : "#93c5fd" // blue-400/300
            break
          case "current":
            ctx.fillStyle = isDark ? "#f97316" : "#fb923c" // orange-500/400
            break
          case "path":
            ctx.fillStyle = isDark ? "#10b981" : "#4ade80" // green-500/400
            break
          case "start":
            ctx.fillStyle = "#22c55e" // green-500
            break
          case "end":
            ctx.fillStyle = "#ef4444" // red-500
            break
          default:
            ctx.fillStyle = defaultNodeColor
        }
      }

      ctx.fill()
      ctx.strokeStyle = nodeStrokeColor
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw node ID
      ctx.font = "14px sans-serif"
      ctx.fillStyle = textColor
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node.id.toString(), node.x, node.y)
    })
  }, [nodes, edges, directed, weighted, theme])

  // Reset the visualization
  const resetVisualization = () => {
    setIsPlaying(false)
    setCurrentStep(0)

    setNodes((prevNodes) =>
      prevNodes.map((node) => ({
        ...node,
        state: (node.id === startNodeId ? "start" : node.id === endNodeId ? "end" : "default") as Node["state"],
        color: undefined,
      })),
    )
  }

  const handleCopyCode = () => {
    if (!algorithmName || !selectedLang) return
    const langCodeMap = ALGORITHM_CODE[selectedLang as keyof typeof ALGORITHM_CODE]
    const code = langCodeMap ? langCodeMap[algorithmName as keyof typeof langCodeMap] : ""
    if (code) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const activeStep = currentStep > 0 ? steps[currentStep - 1] : null
  const highlightedLines = algorithmName && activeStep ? getHighlightedLines(algorithmName, activeStep, selectedLang) : []
  
  const langCodeMap = ALGORITHM_CODE[selectedLang as keyof typeof ALGORITHM_CODE]
  const codeLines = algorithmName && langCodeMap && langCodeMap[algorithmName as keyof typeof langCodeMap]
    ? langCodeMap[algorithmName as keyof typeof langCodeMap].split("\n")
    : []

  // Auto-scroll the code viewport to keep the active line centered
  useEffect(() => {
    if (highlightedLines.length === 0 || !codeViewportRef.current) return

    const activeLine = codeViewportRef.current.querySelector("[data-active='true']") as HTMLElement
    if (activeLine) {
      const container = codeViewportRef.current
      const offsetTop = activeLine.offsetTop

      // Center the active line inside the code scroll window (with safe offsets)
      container.scrollTo({
        top: Math.max(0, offsetTop - 60),
        behavior: "smooth"
      })
    }
  }, [highlightedLines])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <Card className="lg:col-span-2 p-4 border border-[#4ade80]/20 shadow-lg bg-card">
        <div className="flex flex-col gap-4">
          <div className="relative border rounded-lg overflow-hidden bg-background h-[500px]">
            <canvas ref={canvasRef} className="w-full h-full" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsPlaying(!isPlaying)}
                disabled={steps.length === 0 || currentStep >= steps.length}
                className="bg-[#4ade80] hover:bg-[#22c55e] text-white"
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" /> Pause
                  </>
                ) : currentStep >= steps.length ? (
                  "Finished"
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" /> Play
                  </>
                )}
              </Button>
              <Button onClick={resetVisualization} variant="outline" className="border-[#4ade80]/50">
                <RefreshCw className="mr-2 h-4 w-4" /> Reset
              </Button>
              <div className="flex-1 flex items-center gap-4">
                <Label htmlFor="speed" className="min-w-20">
                  Speed:
                </Label>
                <Slider
                  id="speed"
                  min={1}
                  max={100}
                  step={1}
                  value={[speed]}
                  onValueChange={(value) => setSpeed(value[0])}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="flex gap-4 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#22c55e]"></div>
                <span>Start</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#ef4444]"></div>
                <span>End</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#93c5fd] dark:bg-[#60a5fa]"></div>
                <span>Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#fb923c] dark:bg-[#f97316]"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[#4ade80] dark:bg-[#10b981]"></div>
                <span>Path</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {algorithmName && ALGORITHM_CODE[selectedLang as keyof typeof ALGORITHM_CODE] && (
        <Card className="p-4 border border-[#4ade80]/20 shadow-lg flex flex-col gap-4 bg-card h-[610px]">
          <div className="flex items-center justify-between border-b pb-2 border-border gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider hidden sm:inline">Lang:</span>
              <Select value={selectedLang} onValueChange={setSelectedLang}>
                <SelectTrigger className="w-[110px] h-8 text-xs font-semibold border-[#4ade80]/30 hover:bg-[#4ade80]/10 bg-background text-foreground">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="cpp">C++</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="c">C</SelectItem>
                  <SelectItem value="csharp">C#</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="text-xs px-2.5 py-1.5 h-8 border-[#4ade80]/30 hover:bg-[#4ade80]/10 flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Code
                </>
              )}
            </Button>
          </div>

          {/* Trace Status/Explanation Card */}
          <div className="p-3 bg-[#f0f9f0] dark:bg-[#0a1f0a] rounded-md border border-[#4ade80]/20 flex flex-col gap-1 shadow-inner">
            <div className="flex justify-between items-center text-[10px] font-bold text-green-800 dark:text-green-300 uppercase tracking-wider">
              <span>Tracer Action</span>
              <span>Step {currentStep} / {steps.length}</span>
            </div>
            <p className="text-xs font-semibold text-green-950 dark:text-green-100 leading-relaxed mt-0.5">
              {activeStep ? getStepExplanation(algorithmName, activeStep) : "Click Play to trace the algorithm step-by-step."}
            </p>
          </div>

          <div 
            ref={codeViewportRef}
            className="relative flex-1 overflow-y-auto rounded-md border border-border bg-[#1e1e1e] p-3 text-xs font-mono leading-relaxed select-text shadow-lg max-h-[430px]"
          >
            <div className="whitespace-pre font-mono select-text">
              {codeLines.map((line, index) => {
                const isHighlighted = highlightedLines.includes(index)
                const isFirstHighlighted = isHighlighted && index === highlightedLines[0]
                return (
                  <div
                    key={index}
                    data-active={isFirstHighlighted ? "true" : "false"}
                    className={cn(
                      "px-2 py-0.5 rounded transition-all duration-150 border-l-2 flex items-start",
                      isHighlighted
                        ? "bg-green-500/20 text-white font-bold border-l-[#4ade80] shadow-sm"
                        : "border-l-transparent text-gray-400"
                    )}
                  >
                    <span className="inline-block w-6 text-right select-none text-gray-600 mr-4 font-normal font-mono">
                      {index + 1}
                    </span>
                    <span className="flex-1 whitespace-pre-wrap font-mono">
                      {highlightJS(line)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
