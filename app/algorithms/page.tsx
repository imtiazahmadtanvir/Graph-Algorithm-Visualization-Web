import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GitGraph, GitFork, Palette, Network, Route, GitBranch, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AlgorithmsPage() {
  const algorithms = [
    {
      title: "A* Algorithm",
      description: "A* is a best-first search algorithm that finds the shortest path between nodes using heuristics.",
      href: "/astar",
      icon: <GitGraph className="h-8 w-8 text-[#4ade80]" />,
      category: "pathfinding",
    },
    {
      title: "Breadth-First Search",
      description:
        "BFS explores all neighbor nodes at the present depth before moving to nodes at the next depth level.",
      href: "/bfs",
      icon: <Network className="h-8 w-8 text-[#4ade80]" />,
      category: "traversal",
    },
    {
      title: "Depth-First Search",
      description: "DFS is an algorithm for traversing or searching tree or graph data structures.",
      href: "/dfs",
      icon: <GitFork className="h-8 w-8 text-[#4ade80]" />,
      category: "traversal",
    },
    {
      title: "Dijkstra's Algorithm",
      description: "Dijkstra's algorithm finds the shortest paths between nodes in a weighted graph.",
      href: "/dijkstra",
      icon: <Route className="h-8 w-8 text-[#4ade80]" />,
      category: "pathfinding",
    },
    {
      title: "Prim's MST Algorithm",
      description: "Prim's algorithm finds a minimum spanning tree for a weighted undirected graph.",
      href: "/prims",
      icon: <GitBranch className="h-8 w-8 text-[#4ade80]" />,
      category: "spanning-tree",
    },
    {
      title: "Graph Coloring",
      description: "Graph coloring is a special case of graph labeling where values are assigned to vertices.",
      href: "/graph-coloring",
      icon: <Palette className="h-8 w-8 text-[#4ade80]" />,
      category: "coloring",
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#f0f9f0] py-16 md:py-24">
        <div className="container">
          <div className="max-w-[800px] mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold">Graph Algorithms</h1>
            <p className="text-xl text-muted-foreground">
              Explore our collection of interactive graph algorithm visualizations.
            </p>
          </div>
        </div>
      </section>

      {/* Algorithm Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="container">
          <div className="flex flex-wrap gap-4 justify-center">
            {["all", "pathfinding", "traversal", "spanning-tree", "coloring"].map((category) => (
              <Link
                key={category}
                href={`#${category}`}
                className="px-4 py-2 rounded-full bg-[#f0f9f0] text-[#4ade80] hover:bg-[#4ade80] hover:text-white transition-colors"
              >
                {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Algorithms Tabs */}
      <section className="py-16" id="all">
        <div className="container">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full justify-start mb-8 bg-[#f0f9f0] p-1 overflow-x-auto flex-nowrap">
              <TabsTrigger value="all" className="flex-shrink-0">
                All Algorithms
              </TabsTrigger>
              <TabsTrigger value="pathfinding" className="flex-shrink-0">
                Pathfinding
              </TabsTrigger>
              <TabsTrigger value="traversal" className="flex-shrink-0">
                Traversal
              </TabsTrigger>
              <TabsTrigger value="spanning-tree" className="flex-shrink-0">
                Spanning Tree
              </TabsTrigger>
              <TabsTrigger value="coloring" className="flex-shrink-0">
                Coloring
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {algorithms.map((algorithm) => (
                  <AlgorithmCard key={algorithm.href} algorithm={algorithm} />
                ))}
              </div>
            </TabsContent>

            {["pathfinding", "traversal", "spanning-tree", "coloring"].map((category) => (
              <TabsContent key={category} value={category} className="mt-0" id={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {algorithms
                    .filter((algo) => algo.category === category)
                    .map((algorithm) => (
                      <AlgorithmCard key={algorithm.href} algorithm={algorithm} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </>
  )
}

function AlgorithmCard({ algorithm }) {
  return (
    <Card className="overflow-hidden border border-[#4ade80]/20 hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="mb-2">{algorithm.icon}</div>
        <CardTitle>{algorithm.title}</CardTitle>
        <CardDescription>{algorithm.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-40 bg-[#f0f9f0] rounded-md flex items-center justify-center">
          <div className="h-24 w-24 flex items-center justify-center">{algorithm.icon}</div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-[#4ade80] hover:bg-[#22c55e] text-white">
          <Link href={algorithm.href}>
            Visualize
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
