import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Instagram, Github, Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors duration-200">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">GraphAlgo</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Visualize and learn graph algorithms with our interactive platform.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" aria-label="Facebook" className="hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Twitter" className="hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Instagram" className="hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="GitHub" className="hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400">
                <Github className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-zinc-550 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-zinc-550 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/algorithms" className="text-sm text-zinc-550 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Algorithms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-zinc-550 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Algorithms</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/astar" className="text-sm text-zinc-550 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  A* Pathfinding
                </Link>
              </li>
              <li>
                <Link href="/dfs" className="text-sm text-zinc-550 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Depth-First Search
                </Link>
              </li>
              <li>
                <Link href="/bfs" className="text-sm text-zinc-550 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Breadth-First Search
                </Link>
              </li>
              <li>
                <Link href="/dijkstra" className="text-sm text-zinc-550 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Dijkstra's Algorithm
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Contact Us</h3>
            <p className="text-sm text-zinc-550 dark:text-zinc-400">
              <Mail className="h-4 w-4 inline-block mr-2" />
              imtiaztanveer07@gmail.com
            </p>
            <p className="text-sm text-zinc-550 dark:text-zinc-400">Stay updated with our latest algorithms and features.</p>
            <div className="flex space-x-2">
              <Input 
                placeholder="Your email" 
                type="email" 
                className="max-w-[220px] bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500" 
              />
              <Button variant="default" className="bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 font-semibold">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500">
          <p>© 2025 GraphAlgo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
