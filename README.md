# GrappAlgo - Graph Visualization & Analysis Platform

GrappAlgo is an interactive, modern web application designed to help students, developers, and algorithm enthusiasts visualize, understand, and interact with complex graph algorithms. Built with a high-performance interactive canvas and a sleek user interface, users can run step-by-step simulations of classic pathfinding, traversal, and optimization algorithms.

---

## 🌟 Key Features & Pages

The application is structured into specialized routes, each dedicated to visualizing a specific graph-based algorithm. Here is a breakdown of what each page does:

### 1. 🟢 Graph Coloring (`/graph-coloring`)
* **What it does:** Assigns a color to each vertex (node) of a graph such that no two adjacent vertices share the same color.
* **Key Concept:** Solves the vertex-coloring problem, striving to minimize the total number of colors used (chromatic number).
* **Applications:** Scheduling, register allocation, compiler design, map coloring, and Sudoku solvers.

### 2. 🧭 A* Pathfinding (`/astar`)
* **What it does:** Visualizes the A* search algorithm, finding the shortest path between a starting node and a target node.
* **Key Concept:** Uses a heuristic function ($f(n) = g(n) + h(n)$) to guide the search path efficiently.

### 3. 🕸️ Breadth-First Search (`/bfs`)
* **What it does:** Explores the graph level-by-level, visiting all immediate neighbors of a node before moving deeper.
* **Key Concept:** Guarantees finding the shortest path in unweighted graphs.

### 4. 🪵 Depth-First Search (`/dfs`)
* **What it does:** Traverses the graph by exploring as far as possible along each branch before backtracking.
* **Key Concept:** Deep traversal using stack-based backtracking, useful for cycle detection and topological sorting.

### 5. ⚡ Dijkstra's Algorithm (`/dijkstra`)
* **What it does:** Finds the single-source shortest path in weighted graphs.
* **Key Concept:** Employs a greedy strategy, picking the node with the minimum distance at each step.

### 6. 🌲 Prim's Algorithm (`/prims`)
* **What it does:** Computes the Minimum Spanning Tree (MST) of a weighted undirected graph.
* **Key Concept:** Builds the tree one vertex at a time, always adding the cheapest edge from the tree to an unreached vertex.

---

## 🛠️ Tech Stack

This project is built using a modern, scalable web stack:

### **Frontend Framework**
* **Next.js 15 (React 19)**: Leveraging Server & Client Components for speed and responsiveness.
* **TypeScript**: Strict type safety for data models (Nodes, Edges, Paths, and Graph States).

### **Styling & UI Components**
* **Tailwind CSS (v3)**: Utility-first CSS styling for highly custom, responsive layout grids.
* **Radix UI Primitives**: Accessible UI component library (Accordion, Dialog, Select, Dropdown Menu, Navigation Menu, Slider, and Switch).
* **Lucide React**: High-quality SVG icons for interactive visual cues.
* **Sonner / React Toast**: Sleek micro-interaction notifications.

### **Interactive Canvas & Charts**
* **HTML5 Canvas / SVG Rendering**: Custom interactive canvas component for drawing nodes, connecting edges, and displaying path animations.
* **Recharts**: For displaying performance comparison charts and metric tracking.
* **vaul**: Smooth bottom-drawer sheets for controls on mobile screens.

### **State & Data Validation**
* **Zod**: Declarative schema validation.
* **React Hook Form**: Form state management for customizing algorithm parameters (e.g. node weight, speed, heuristics).
* **date-fns**: Time and date formatting.

### **AI Integration**
* **@google/generative-ai**: Google Gemini API integration for explanations and tutoring.

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0.0 or higher recommended)
* **pnpm** (Package Manager)

### Installation
1. Clone the repository and navigate to the project directory:
   ```bash
   cd "Graph-Algorithm-Visualization-Web"
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development Server
Run the local development server:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to explore the visualizer.

### Production Build
Build and optimize the application for production deployment:
```bash
pnpm build
pnpm start
```
