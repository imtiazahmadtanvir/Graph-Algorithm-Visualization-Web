export interface ProblemSolved {
  title: string
  problem: string
  solution: string
  example: string
}

export interface Complexity {
  best: string
  average: string
  worst: string
}

export interface AlgorithmInfo {
  id: string
  title: string
  description: string
  timeComplexity: Complexity
  spaceComplexity: string
  coreDataStructure: string
  stepByStep: string[]
  problemsSolved: ProblemSolved[]
  pros: string[]
  cons: string[]
  whenToUse: string
}

export const algorithmsData: Record<string, AlgorithmInfo> = {
  bfs: {
    id: "bfs",
    title: "Breadth-First Search (BFS)",
    description: "BFS is a graph traversal algorithm that explores all neighbor nodes at the present depth level before moving to the nodes at the next depth level.",
    timeComplexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)"
    },
    spaceComplexity: "O(V)",
    coreDataStructure: "Queue (FIFO)",
    stepByStep: [
      "Choose a starting node and enqueue it into the Queue. Mark it as visited.",
      "While the Queue is not empty, dequeue the front node from the Queue.",
      "Inspect the dequeued node. If it is the target node, search is complete.",
      "Otherwise, loop through all unvisited neighbors of the current node. Mark them as visited and enqueue them into the Queue.",
      "Repeat the process until the Queue becomes empty or the target is found."
    ],
    problemsSolved: [
      {
        title: "Shortest Path in Unweighted Graphs",
        problem: "Finding the minimum number of hops/edges between a starting location and a destination.",
        solution: "Because BFS expands outward level-by-level, the first time it reaches any node, it is guaranteed to have taken the shortest possible route (in terms of edge count).",
        example: "Finding degrees of connection on LinkedIn (1st, 2nd, or 3rd degree connection)."
      },
      {
        title: "Social Network Recommendations",
        problem: "Suggesting friends or connections who are closely linked to a user.",
        solution: "By scanning immediate neighbors (depth 1) and then neighbors of neighbors (depth 2), BFS can rank potential connections by proximity.",
        example: "Facebook's 'People You May Know' feature recommending friends within 2-3 hops."
      },
      {
        title: "Web Crawling & Indexing",
        problem: "Downloading web pages systematically starting from a root URL.",
        solution: "Web crawlers use BFS to fetch pages immediately linked to the current page before going deep into nested link trees, ensuring a balanced local indexing.",
        example: "Search engine crawlers gathering pages up to a certain link depth."
      },
      {
        title: "Peer-to-Peer (P2P) Network Discovery",
        problem: "Locating nearby active peer nodes to download files or transfer data.",
        solution: "A node broadcasts a query to all immediate neighbors, who in turn broadcast it to their neighbors, finding the nearest seeders/peers.",
        example: "BitTorrent protocol finding active seeds in a local swarm."
      }
    ],
    pros: [
      "Guaranteed to find the shortest path in an unweighted graph.",
      "Will not get stuck in infinite loops/paths in finite graphs.",
      "Highly effective for nodes that are close to the start vertex."
    ],
    cons: [
      "High memory consumption: stores all nodes of the current level in the queue, which can grow exponentially (O(b^d)).",
      "Slower on very deep graphs if the target node is far from the starting node."
    ],
    whenToUse: "Use BFS when you need to find the shortest path on an unweighted graph, or when you are searching for elements that are relatively close to the starting point."
  },
  dfs: {
    id: "dfs",
    title: "Depth-First Search (DFS)",
    description: "DFS is a graph traversal algorithm that explores as far as possible along each branch before backtracking.",
    timeComplexity: {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)"
    },
    spaceComplexity: "O(V)",
    coreDataStructure: "Stack (LIFO) / Call Stack (Recursion)",
    stepByStep: [
      "Choose a starting node and push it onto the Stack. Mark it as visited.",
      "Pop a node from the Stack.",
      "If it's the target node, stop search.",
      "Otherwise, push all its unvisited adjacent nodes onto the Stack and mark them as visited.",
      "If a node has no unvisited neighbors, backtrack to the previous node and continue.",
      "Repeat until the Stack is empty."
    ],
    problemsSolved: [
      {
        title: "Solving Mazes and Puzzles",
        problem: "Navigating a complex labyrinth with branching corridors to find the exit.",
        solution: "DFS systematically tests a path to its very end. If it hits a dead-end, it backtracks to the last junction and tries the next path.",
        example: "AI solving a Sudoku grid or finding a path out of a 2D grid-based maze."
      },
      {
        title: "Topological Sorting (Task Dependency Scheduling)",
        problem: "Determining the correct order of tasks when some tasks depend on others.",
        solution: "DFS runs until it finds a node with no dependencies, adds it to the output stack, and backtracks, naturally ordering prerequisites first.",
        example: "Compilers deciding file build compilation order, or course syllabus prerequisite engines."
      },
      {
        title: "Cycle Detection in Graphs",
        problem: "Detecting circular dependencies which could cause infinite loops or deadlocks.",
        solution: "By keeping track of the recursion stack (back-edges), DFS can detect if a path points back to an ancestor node that is still currently being processed.",
        example: "Detecting cyclic dependencies in package management systems (like npm or pip)."
      },
      {
        title: "Connected Components in Networks",
        problem: "Grouping isolated clusters of nodes in a massive network structure.",
        solution: "Running DFS on an unvisited node will traverse every reachable node in its component. The number of times DFS is initiated equals the number of isolated networks.",
        example: "Identifying clusters of users in social groups or isolated islands in routing maps."
      }
    ],
    pros: [
      "Low memory consumption compared to BFS on wide graphs: only needs to store the current path (O(d) stack space).",
      "Excellent for finding cycles, topological sorting, and exploring all possible paths (puzzles/decision trees)."
    ],
    cons: [
      "Not guaranteed to find the shortest path.",
      "Can get stuck in infinite paths or deep recursion loops in infinite/extremely large graphs (unless search depth is limited)."
    ],
    whenToUse: "Use DFS when you need to traverse the entire graph, search all possible path permutations, check for cycles, perform topological sorting, or when memory constraint is a priority."
  },
  dijkstra: {
    id: "dijkstra",
    title: "Dijkstra's Shortest Path",
    description: "Dijkstra's algorithm finds the shortest path between a starting node and all other nodes in a weighted graph with non-negative edge weights.",
    timeComplexity: {
      best: "O((V + E) log V)",
      average: "O((V + E) log V)",
      worst: "O(V^2)"
    },
    spaceComplexity: "O(V)",
    coreDataStructure: "Min-Priority Queue / Binary Heap",
    stepByStep: [
      "Initialize all node distances from the source as infinity (∞), and the source node distance as 0.",
      "Add all nodes to a Min-Priority Queue, ordered by their current distance.",
      "While the queue is not empty, extract the node with the smallest distance.",
      "For each unvisited neighbor of this node, calculate the distance from the source through the current node.",
      "If the newly calculated distance is shorter than the previously recorded distance, update the distance and set the current node as the parent.",
      "Repeat until the target node is visited or the queue is empty."
    ],
    problemsSolved: [
      {
        title: "GPS & Map Navigation",
        problem: "Finding the shortest or fastest driving route from location A to B on a physical road network.",
        solution: "Road intersections are vertices, road segments are edges, and travel times/distances are weights. Dijkstra finds the optimal sequence of turns to minimize travel cost.",
        example: "Routing engines in Google Maps, Apple Maps, or Waze calculating driving routes."
      },
      {
        title: "Network Routing Protocols (OSPF)",
        problem: "Directing internet data packets through servers to reach destinations with minimal latency.",
        solution: "Routers run OSPF (Open Shortest Path First) which relies on Dijkstra to dynamically update routing tables, choosing links with the lowest delay or highest bandwidth.",
        example: "Core internet switches routing your video streaming traffic through optimal server hops."
      },
      {
        title: "Flight & Logistics Scheduling",
        problem: "Finding the cheapest or fastest multi-connection flight route.",
        solution: "Airports are nodes, flights are edges with ticket prices/durations as weights. Dijkstra searches combinations to find the absolute cheapest travel path.",
        example: "Travel aggregates like Skyscanner or Expedia matching connecting flights."
      },
      {
        title: "Telecom Network Path Routing",
        problem: "Assigning dedicated paths for telecommunication signals to avoid congestion.",
        solution: "Dijkstra calculates routes based on line congestion rates and signal quality degradation coefficients as edge weights.",
        example: "routing optical signals across submarine fiber cables."
      }
    ],
    pros: [
      "Guaranteed to find the mathematically shortest path in graphs with non-negative edge weights.",
      "Highly efficient when implemented using min-heaps/priority queues."
    ],
    cons: [
      "Does not work with negative edge weights (can result in incorrect paths).",
      "Explores blindly in all directions without any heuristics, performing slower on massive spatial grids compared to A*."
    ],
    whenToUse: "Use Dijkstra's algorithm when you need to calculate the shortest path on a weighted graph with non-negative edge weights, and you don't have spatial heuristic information (like straight-line coordinates) to guide the search."
  },
  astar: {
    id: "astar",
    title: "A* Pathfinding Algorithm",
    description: "A* is an advanced best-first search algorithm that combines Dijkstra's shortest path tracking with a heuristic estimate to find the shortest path quickly.",
    timeComplexity: {
      best: "O(E)",
      average: "O(b^d)",
      worst: "O(V log V)"
    },
    spaceComplexity: "O(V)",
    coreDataStructure: "Min-Priority Queue / Binary Heap",
    stepByStep: [
      "Define three values for each node: g(n) (cost from start), h(n) (estimated cost to end), and f(n) = g(n) + h(n).",
      "Initialize all nodes with g(n) = ∞ and add the start node to the open list (priority queue) with g(start) = 0.",
      "Pop the node with the lowest f(n) value from the queue.",
      "If the current node is the goal, reconstruct the path and stop.",
      "Otherwise, move the node to the closed list. For each neighbor, calculate its tentative g(n).",
      "If the tentative g(n) is lower than its recorded g(n), update its parent, set g(n), calculate h(n), and add/update it in the queue.",
      "Repeat until the goal is reached or open list is empty."
    ],
    problemsSolved: [
      {
        title: "Video Game Character Pathfinding",
        problem: "Moving non-playable characters (NPCs) realistically around walls, obstacles, and terrain in real-time.",
        solution: "A* uses coordinate distances (heuristics) to guide the NPC directly toward the target, bypassing irrelevant branches of the map that Dijkstra would normally explore.",
        example: "Unit movement navigation in real-time strategy games like StarCraft or RPGs like Diablo."
      },
      {
        title: "Autonomous Robotics & Self-Driving Vehicles",
        problem: "Calculating obstacle-free trajectories for drones or robots moving through environments.",
        solution: "Robots combine spatial coordinates and sensor data into grids, using A* to continuously re-plan paths around newly detected obstacles.",
        example: "Robotic vacuum cleaners mapping a room and pathing around table legs."
      },
      {
        title: "Real-time Traffic Congestion Path Routing",
        problem: "Avoiding congested gridlock streets in urban routing while maintaining heading toward the destination.",
        solution: "A* integrates physical distance as the heuristic h(n) and real-time street speeds as g(n) to compute paths that balance distance and traffic delays.",
        example: "Dynamic re-routing algorithms suggesting alternatives while you drive."
      }
    ],
    pros: [
      "Extremely fast and directed search compared to Dijkstra.",
      "Guaranteed to find the shortest path if the heuristic function h(n) is admissible (never overestimates the true cost) and consistent."
    ],
    cons: [
      "Performance depends heavily on a good heuristic function.",
      "Consumes significant memory because it must keep track of all visited nodes in memory (in both open and closed lists)."
    ],
    whenToUse: "Use A* when finding paths in physical or grid-based coordinates (like maps or games) where you can easily calculate a straight-line estimate (Euclidean/Manhattan distance) to guide the search toward the goal."
  },
  prims: {
    id: "prims",
    title: "Prim's Minimum Spanning Tree",
    description: "Prim's algorithm is a greedy algorithm that finds a Minimum Spanning Tree (MST) for a weighted undirected graph, connecting all vertices with the minimum total edge weight.",
    timeComplexity: {
      best: "O(E log V)",
      average: "O(E log V)",
      worst: "O(V^2)"
    },
    spaceComplexity: "O(V)",
    coreDataStructure: "Min-Priority Queue / Binary Heap",
    stepByStep: [
      "Choose any starting vertex and include it in the Minimum Spanning Tree (MST) set.",
      "Set the key values of all other vertices to infinity (∞) and set the starting vertex's key to 0.",
      "Place all vertices in a priority queue sorted by their key values.",
      "Extract the vertex with the minimum key value. Let this be vertex u.",
      "For each neighbor v of u that is not yet in the MST set, if the weight of edge (u, v) is less than the current key of v, update v's key and set its parent to u.",
      "Repeat until all vertices are included in the MST."
    ],
    problemsSolved: [
      {
        title: "Fiber Optic & Telecommunications Network Layout",
        problem: "Connecting a list of cities/hubs with high-speed internet cables using the least amount of physical fiber cable.",
        solution: "Cities are nodes, and potential cable paths are edges with distance/laying-cost as weights. Prim's algorithm connects every city together at the absolute lowest overall cable installation cost.",
        example: "ISPs planning structural internet backbone runs between towns."
      },
      {
        title: "Electrical Grid & Utility Piping Design",
        problem: "Designing pipeline layouts (water, gas, electricity) to reach all houses without creating loops and using minimal pipes.",
        solution: "Prim's MST ensures every location is serviced using the minimum total linear pipe/wire footage, avoiding costly redundant runs.",
        example: "Water treatment boards designing distribution mains for new subdivisions."
      },
      {
        title: "Approximating Traveling Salesperson Problem (TSP)",
        problem: "Finding the shortest tour that visits every node exactly once (NP-hard).",
        solution: "Although calculating the absolute shortest TSP tour is highly complex, Prim's MST provides a solid starting structure. A double-MST traversal creates a route guaranteed to be at most 2 times the length of the optimal tour.",
        example: "Logistics companies optimizing multi-stop delivery route baselines."
      },
      {
        title: "Image Segmentation & Clustering",
        problem: "Dividing pixels in an image or grouping data points into distinct, similar clusters.",
        solution: "By constructing a Minimum Spanning Tree of data similarities and then breaking the heaviest edges, the algorithm naturally splits data into cohesive groups.",
        example: "Computer vision engines segmenting foreground objects from backgrounds."
      }
    ],
    pros: [
      "Guaranteed to find the Minimum Spanning Tree.",
      "Performs exceptionally well on dense graphs (graphs with a high ratio of edges to vertices) when using priority queues."
    ],
    cons: [
      "Requires a connected graph (if the graph is disconnected, it will only find the MST of the connected component).",
      "Slower on highly sparse graphs compared to Kruskal's algorithm, which operates on edges directly."
    ],
    whenToUse: "Use Prim's algorithm when you need to construct a spanning tree that connects all vertices with the minimum total cost, particularly in dense graphs where edge connections are frequent."
  },
  "graph-coloring": {
    id: "graph-coloring",
    title: "Welch-Powell Graph Coloring",
    description: "Graph coloring is an assignment of colors to vertices of a graph such that no two adjacent vertices share the same color. The Welch-Powell greedy algorithm is an efficient heuristic method to color a graph using a near-minimal number of colors.",
    timeComplexity: {
      best: "O(V log V + E)",
      average: "O(V^2 + E)",
      worst: "O(V^2 + E)"
    },
    spaceComplexity: "O(V)",
    coreDataStructure: "Sorted Arrays / Hash Sets",
    stepByStep: [
      "Calculate the degree of each vertex (the number of edges connected to it).",
      "Sort the vertices in descending order based on their degrees.",
      "Assign color 1 (e.g. Red) to the first vertex in the sorted list.",
      "Traverse down the list and assign color 1 to any vertex that is NOT adjacent to any vertex already colored with color 1.",
      "Move to the next uncolored vertex, select color 2 (e.g. Blue), and repeat the traversal down the list, coloring non-adjacent nodes.",
      "Repeat this process with new colors (3, 4, etc.) until all vertices are colored."
    ],
    problemsSolved: [
      {
        title: "University Course & Exam Timetabling",
        problem: "Scheduling exam slots for a university so no student has two exams at the same time.",
        solution: "Courses are nodes. An edge exists between two courses if at least one student takes both. Colors represent exam time slots. Graph coloring schedules courses in minimal slots with zero conflicts.",
        example: "Registrar offices arranging final exam schedules for thousands of students."
      },
      {
        title: "Compiler Register Allocation",
        problem: "Assigning variables to a limited number of fast CPU registers during code execution.",
        solution: "Variables are nodes. An edge connects two variables if they are active at the same time (interference). Colors represent physical CPU registers. Graph coloring maps variables to registers without conflict, spilling to RAM only when colors exceed registers.",
        example: "GCC or LLVM compilers compiling C++/Rust code into optimized assembly."
      },
      {
        title: "Mobile Tower Frequency Assignment",
        problem: "Assigning transmission frequencies to cellular towers so overlapping towers do not cause signal interference.",
        solution: "Towers are nodes. Adjacent towers with overlapping signals are connected by edges. Colors represent frequency bands. The algorithm finds the minimal number of frequency channels needed to cover a region interference-free.",
        example: "Cellular network providers organizing 5G transmitter signal cells."
      },
      {
        title: "Sudoku Puzzle Solver",
        problem: "Solving a 9x9 grid where rows, columns, and sub-grids must contain unique digits 1-9.",
        solution: "Sudoku cells are nodes. Cells that are in the same row, column, or 3x3 square share edges. Assigning digits 1-9 is mathematically identical to 9-coloring this specific graph.",
        example: "Sudoku game apps solving grids instantly behind the scenes."
      }
    ],
    pros: [
      "Extremely fast heuristic (Welch-Powell runs in polynomial time) compared to exact NP-complete algorithms.",
      "Highly applicable to resource scheduling, map coloring, and allocation problems."
    ],
    cons: [
      "Greedy search is a heuristic: it does not guarantee finding the absolute minimum possible number of colors (the Chromatic Number).",
      "Sorting is static: it doesn't adjust if the graph topology changes dynamically during coloring."
    ],
    whenToUse: "Use graph coloring when you need to schedule items, allocate resources, or partition elements into non-conflicting groups where overlapping/adjacent pairs cannot share the same category/time slot."
  }
}
