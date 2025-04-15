import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Github, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#f0f9f0] border-t">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold">GraphAlgo</h3>
            <p className="text-sm text-muted-foreground">
              Visualize and learn graph algorithms with our interactive platform.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                  About
                </Link>
              </li>
              <li>
                <Link href="/algorithms" className="text-sm text-muted-foreground hover:text-foreground">
                  Algorithms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Algorithms</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/astar" className="text-sm text-muted-foreground hover:text-foreground">
                  A* Pathfinding
                </Link>
              </li>
              <li>
                <Link href="/dfs" className="text-sm text-muted-foreground hover:text-foreground">
                  Depth-First Search
                </Link>
              </li>
              <li>
                <Link href="/bfs" className="text-sm text-muted-foreground hover:text-foreground">
                  Breadth-First Search
                </Link>
              </li>
              <li>
                <Link href="/dijkstra" className="text-sm text-muted-foreground hover:text-foreground">
                  Dijkstra's Algorithm
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Subscribe</h3>
            <p className="text-sm text-muted-foreground">Stay updated with our latest algorithms and features.</p>
            <div className="flex space-x-2">
              <Input placeholder="Your email" type="email" className="max-w-[220px]" />
              <Button variant="default">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© 2025 GraphAlgo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
