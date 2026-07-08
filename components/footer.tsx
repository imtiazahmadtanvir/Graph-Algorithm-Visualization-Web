import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Mail, Linkedin, Globe, Network } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-850 text-zinc-600 dark:text-zinc-300 transition-colors duration-300">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center gap-2.5 group">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1.5px] shadow-md shadow-emerald-500/10 transition-all duration-300 group-hover:scale-105 group-hover:rotate-6">
                  <div className="h-full w-full rounded-[10px] bg-zinc-950 flex items-center justify-center">
                    <Network className="h-4.5 w-4.5 text-emerald-400 transition-transform duration-500 group-hover:scale-110" />
                  </div>
                </div>
                <span className="font-extrabold text-xl tracking-tight text-zinc-900 dark:text-white transition-all duration-300">
                  Graph<span className="text-emerald-500 dark:text-emerald-400">Algo</span>
                </span>
              </div>
            </Link>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Visualize and learn graph algorithms with our interactive platform.
            </p>
            <div className="flex space-x-3 pt-2">
              <Button variant="ghost" size="icon" aria-label="GitHub" asChild className="hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-300 h-9 w-9">
                <a href="https://github.com/imtiazahmadtanvir" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4.5 w-4.5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" aria-label="LinkedIn" asChild className="hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-300 h-9 w-9">
                <a href="https://www.linkedin.com/in/imtiaz-tanveer07" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-4.5 w-4.5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" aria-label="Portfolio" asChild className="hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors duration-300 h-9 w-9">
                <a href="https://imtiaz-tanvir-portfolio.netlify.app/" target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4.5 w-4.5" />
                </a>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider uppercase text-zinc-800 dark:text-zinc-200">Quick Links</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/algorithms" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Algorithms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider uppercase text-zinc-800 dark:text-zinc-200">Algorithms</h3>
            <ul className="space-y-2.5">
              <li>
                <Link href="/astar" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  A* Pathfinding
                </Link>
              </li>
              <li>
                <Link href="/dfs" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Depth-First Search
                </Link>
              </li>
              <li>
                <Link href="/bfs" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Breadth-First Search
                </Link>
              </li>
              <li>
                <Link href="/dijkstra" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Dijkstra's Algorithm
                </Link>
              </li>
              <li>
                <Link href="/prims" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Prim's MST
                </Link>
              </li>
              <li>
                <Link href="/graph-coloring" className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                  Graph Coloring
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider uppercase text-zinc-800 dark:text-zinc-200">Contact Us</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 flex items-center">
              <Mail className="h-4.5 w-4.5 mr-2 text-emerald-500" />
              imtiaz.tanvir.dev@gmail.com
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Stay updated with our latest algorithms and features.</p>
            <div className="flex flex-col sm:flex-row gap-2 pt-1.5">
              <Input
                placeholder="Your email"
                type="email"
                className="max-w-[220px] bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus-visible:ring-emerald-500"
              />
              <Button variant="default" className="bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-zinc-950 font-semibold shadow-sm">
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-850 text-center text-sm text-zinc-500">
          <p>© 2026 GraphAlgo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
