"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, Home as HomeIcon, Info, Network, Mail, Github, Linkedin, Globe } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: <HomeIcon className="h-4 w-4" />,
    },
    {
      name: "About",
      href: "/about",
      icon: <Info className="h-4 w-4" />,
    },
    {
      name: "Algorithms",
      href: "/algorithms",
      icon: <Network className="h-4 w-4" />,
    },
    {
      name: "Contact",
      href: "/contact",
      icon: <Mail className="h-4 w-4" />,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">GraphAlgo</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-zinc-950/95 border-l border-zinc-800/80 text-white backdrop-blur-xl w-[280px] sm:w-[350px]">
              {/* Header inside Sheet */}
              <div className="flex flex-col gap-1.5 pb-6 border-b border-zinc-800/60 mt-4">
                <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  GraphAlgo
                </span>
                <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                  Algorithm Visualizer
                </span>
              </div>

              {/* Navigation Items */}
              <nav className="flex flex-col gap-3 mt-6">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group hover:-translate-x-1",
                        isActive
                          ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 shadow-md shadow-emerald-500/5"
                          : "border border-transparent text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                      )}
                    >
                      <span className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-900 text-zinc-400 group-hover:bg-zinc-800 group-hover:text-white"
                      )}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </nav>

              {/* Developer / Founder info card at the footer of mobile menu */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/30 backdrop-blur-md flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold font-mono">
                    IT
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-200">Imtiaz Ahmad Tanvir</span>
                    <span className="text-[9px] text-zinc-500 font-medium">Founder & Dev</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-zinc-800/40">
                  <span className="text-[9px] text-zinc-500 font-bold tracking-wide uppercase">Connect</span>
                  <div className="flex gap-2">
                    <a
                      href="https://github.com/imtiazahmadtanvir"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-md bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/imtiaz-tanveer07"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-md bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <Linkedin className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href="https://imtiaz-tanvir-portfolio.netlify.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-md bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                    >
                      <Globe className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
