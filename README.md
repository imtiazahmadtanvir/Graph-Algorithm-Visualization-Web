# GraphAlgo - Interactive Graph Visualization & Analysis Platform

Welcome to **GraphAlgo** – a state-of-the-art interactive visualizer built to make graph algorithms intuitive, accessible, and engaging. 

**🚀 Live Website:** [graph-algorithm-visualization.vercel.app](https://graph-algorithm-visualization.vercel.app/)  
**🕸️ Algorithms Hub:** [graph-algorithm-visualization.vercel.app/algorithms](https://graph-algorithm-visualization.vercel.app/algorithms)

---

## 🌟 What We Build

GraphAlgo bridges the gap between abstract computer science theory and real-time execution. Instead of reading pseudocode on a page, GraphAlgo lets you run step-by-step visualizations on custom graph networks, complete with side-by-side code tracing and execution variables.

### 1. Interactive Sandbox Canvas
* **Custom Topology:** Add, delete, drag, and connect vertices dynamically on a responsive canvas.
* **Edge Weights:** Assign custom weights to edges for pathfinding and minimum spanning tree simulations.
* **Obstacle Creation:** Toggle nodes as active blocks to watch search algorithms navigate around grid obstacles in real-time.

### 2. Real-Time Multilingual Code Visualizer
* Trace the active line of code as the algorithm runs.
* Select from 6 language formats: **JavaScript, C++, Java, Python, C, and C#**.
* Watch line highlights adapt to each step of traversal.

### 3. Step Tracing Console
* Detailed tracing console log output at the bottom of the screen.
* Tells you exactly what the queue/stack/priority queue is holding, which nodes are being popped, and path updates.

### 4. Smart Control Center
* Toggles for Play, Pause, Step-Forward, and Step-Backward.
* Speed slider to change node execution intervals from 1ms up to 100ms.
* Preset graph patterns (grids, circular nodes, trees) generated on mount.

### 5. Floating AlgoBot Chatbot
* An intelligent helper assistant in the bottom-right corner to help users understand complex graph terms, complexity values, and controls.

---

## 📊 Supported Algorithms & Live Pages

Here are the direct routes and definitions for all supported graph algorithms:

| Algorithm | Live Path | Key Concepts | Real-World Application |
| :--- | :--- | :--- | :--- |
| **A* Pathfinding** | [🔗 `/algorithms/astar`](https://graph-algorithm-visualization.vercel.app/algorithms/astar) | Uses $f(n) = g(n) + h(n)$ coordinate distance heuristics for directed, fast path searches. | Video Game NPC pathing, autonomous vacuum robots. |
| **Breadth-First Search (BFS)** | [🔗 `/algorithms/bfs`](https://graph-algorithm-visualization.vercel.app/algorithms/bfs) | Explores vertices level-by-level, ensuring shortest path in unweighted graphs. | LinkedIn connections, P2P network discovery. |
| **Depth-First Search (DFS)** | [🔗 `/algorithms/dfs`](https://graph-algorithm-visualization.vercel.app/algorithms/dfs) | Navigates branches deeply down vertical paths before backtracking. | Maze solvers, compiler dependency sorting, cycle checks. |
| **Dijkstra's Algorithm** | [🔗 `/algorithms/dijkstra`](https://graph-algorithm-visualization.vercel.app/algorithms/dijkstra) | Accumulates weighted costs to find the absolute shortest path in weighted graphs. | Google Maps driving routes, OSPF network routers. |
| **Prim's MST** | [🔗 `/algorithms/prims`](https://graph-algorithm-visualization.vercel.app/algorithms/prims) | Connects all nodes using a greedy min-weight criteria with no cyclic loops. | Fiber-optic broadband layout, water pipeline grid laying. |
| **Graph Coloring** | [🔗 `/algorithms/graph-coloring`](https://graph-algorithm-visualization.vercel.app/algorithms/graph-coloring) | Assigns colors to nodes so adjacent vertices never share duplicate categories. | Exam scheduling, compiler CPU register allocations. |

---

## 🛠️ Tech Stack

This project is built using a modern, scalable web stack:

* **Frontend:** Next.js 15 (React 19) utilizing both Server and Client Components.
* **Type Safety:** TypeScript for structuring Nodes, Edges, Graph states, and Algorithms.
* **Styling:** Tailwind CSS (v3) with dynamic CSS variables for full Dark Mode support.
* **Interactive Layer:** HTML5 Canvas & Custom SVGs for smooth animations.
* **UI Components:** Radix UI primitives (Accordion, Slider, Tabs, Dialog) styled via custom tailwind classes.
* **Icons:** Lucide React.
* **AI Integration:** Google Gemini API (`@google/generative-ai`) powering the AlgoBot Chatbot.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **pnpm** or **npm** Package Manager

### Installation
1. Clone the repository and navigate to the folder:
   ```bash
   cd Graph-Algorithm-Visualization-Web
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running Locally
To launch the hot-reloading development server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Build and Deployment
Build the Next.js bundle for production:
```bash
pnpm build
pnpm start
```
