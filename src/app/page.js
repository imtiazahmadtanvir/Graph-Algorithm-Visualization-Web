/* eslint-disable react/no-unescaped-entities */
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GitGraph, GitFork, Palette, Network, Route, ArrowRight } from "lucide-react"

export default function Home() {
  const algorithms = [
    {
      title: "A* Algorithm",
      description: "A* is a best-first search algorithm that finds the shortest path between nodes using heuristics.",
      href: "/astar",
      icon: <GitGraph className="h-8 w-8 text-[#4ade80]" />,
    },
    {
      title: "Breadth-First Search",
      description:
        "BFS explores all neighbor nodes at the present depth before moving to nodes at the next depth level.",
      href: "/bfs",
      icon: <Network className="h-8 w-8 text-[#4ade80]" />,
    },
    {
      title: "Depth-First Search",
      description: "DFS is an algorithm for traversing or searching tree or graph data structures.",
      href: "/dfs",
      icon: <GitFork className="h-8 w-8 text-[#4ade80]" />,
    },
    {
      title: "Dijkstra's Algorithm",
      description: "Dijkstra's algorithm finds the shortest paths between nodes in a weighted graph.",
      href: "/dijkstra",
      icon: <Route className="h-8 w-8 text-[#4ade80]" />,
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#f0f9f0] py-16 md:py-24">
        <div className="container flex flex-col md:flex-row items-center gap-8 md:gap-16">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Visualize Graph Algorithms</h1>
            <p className="text-xl text-muted-foreground max-w-[600px]">
              Learn and understand complex graph algorithms through interactive visualizations. Perfect for students,
              developers, and algorithm enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#4ade80] hover:bg-[#22c55e] text-white">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
          <div className="flex-1 relative h-[300px] md:h-[400px] w-full">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Graph Algorithm Visualization"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Interactive Learning Experience</h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
              Our platform offers a hands-on approach to understanding graph algorithms through visual representation
              and step-by-step execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 rounded-full bg-[#f0f9f0] flex items-center justify-center mb-4">
                <GitGraph className="h-6 w-6 text-[#4ade80]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visual Learning</h3>
              <p className="text-muted-foreground">
                See algorithms in action with our interactive visualizations that make complex concepts easy to
                understand.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 rounded-full bg-[#f0f9f0] flex items-center justify-center mb-4">
                <GitFork className="h-6 w-6 text-[#4ade80]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Step-by-Step Execution</h3>
              <p className="text-muted-foreground">
                Control the pace of algorithm execution and observe each step to gain deeper insights.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
              <div className="h-12 w-12 rounded-full bg-[#f0f9f0] flex items-center justify-center mb-4">
                <Palette className="h-6 w-6 text-[#4ade80]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Customizable Graphs</h3>
              <p className="text-muted-foreground">
                Create and modify your own graphs to test different scenarios and algorithm behaviors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithms Section */}
      <section className="py-16 md:py-24 bg-[#f0f9f0]">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Algorithms</h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
              Discover and learn various graph algorithms through our interactive platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {algorithms.map((algorithm) => (
              <Card key={algorithm.href} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="mb-2">{algorithm.icon}</div>
                  <CardTitle>{algorithm.title}</CardTitle>
                  <CardDescription>{algorithm.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-muted-foreground">Algorithm visualization</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full bg-[#4ade80] hover:bg-[#22c55e] text-white">
                    <Link href={algorithm.href}>Visualize</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/algorithms">
                View All Algorithms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
              Hear from students and professionals who have used our platform to enhance their understanding of graph
              algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-[#f0f9f0] overflow-hidden">
                    <Image src="/placeholder-user.jpg" alt="User" width={48} height={48} />
                  </div>
                  <div>
                    <h4 className="font-bold">Sarah Johnson</h4>
                    <p className="text-sm text-muted-foreground">Computer Science Student</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "This platform made understanding complex graph algorithms so much easier. The visual representations
                  helped me grasp concepts that textbooks couldn't explain clearly."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-[#f0f9f0] overflow-hidden">
                    <Image src="/placeholder-user.jpg" alt="User" width={48} height={48} />
                  </div>
                  <div>
                    <h4 className="font-bold">Michael Chen</h4>
                    <p className="text-sm text-muted-foreground">Software Engineer</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "I use this tool regularly to refresh my knowledge of algorithms before technical interviews. The
                  step-by-step visualization is incredibly helpful."
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-[#f0f9f0] overflow-hidden">
                    <Image src="/placeholder-user.jpg" alt="User" width={48} height={48} />
                  </div>
                  <div>
                    <h4 className="font-bold">Dr. Emily Rodriguez</h4>
                    <p className="text-sm text-muted-foreground">Computer Science Professor</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  "I recommend this platform to all my students. It's an excellent supplement to theoretical learning
                  and helps students visualize abstract concepts."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[#f0f9f0]">
        <div className="container">
          <div className="max-w-[800px] mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Master Graph Algorithms?</h2>
            <p className="text-xl text-muted-foreground">
              Start your journey to understanding complex algorithms through our interactive visualizations.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button size="lg" className="bg-[#4ade80] hover:bg-[#22c55e] text-white">
                Get Started Now
              </Button>
              <Button size="lg" variant="outline">
                View Tutorials
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
