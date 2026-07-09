"use client"

import { algorithmsData } from "@/data/algorithms-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Clock, 
  Database, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  Lightbulb, 
  Cpu, 
  BookOpen, 
  Network, 
  GitFork, 
  Route, 
  GitGraph, 
  GitBranch, 
  Palette 
} from "lucide-react"

interface AlgorithmDetailsProps {
  algorithmId: string
}

export default function AlgorithmDetails({ algorithmId }: AlgorithmDetailsProps) {
  const algo = algorithmsData[algorithmId]

  if (!algo) {
    return (
      <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg text-destructive text-sm">
        Algorithm data not found for ID: {algorithmId}
      </div>
    )
  }

  // Choose the best match icon
  const getAlgoIcon = (id: string) => {
    switch (id) {
      case "bfs":
        return <Network className="h-6 w-6 text-emerald-400" />
      case "dfs":
        return <GitFork className="h-6 w-6 text-emerald-400" />
      case "dijkstra":
        return <Route className="h-6 w-6 text-emerald-400" />
      case "astar":
        return <GitGraph className="h-6 w-6 text-emerald-400" />
      case "prims":
        return <GitBranch className="h-6 w-6 text-emerald-400" />
      case "graph-coloring":
        return <Palette className="h-6 w-6 text-emerald-400" />
      default:
        return <Cpu className="h-6 w-6 text-emerald-400" />
    }
  }

  return (
    <Card className="border border-emerald-500/20 bg-zinc-950/40 backdrop-blur-md shadow-xl transition-all duration-300 hover:border-emerald-500/30 overflow-hidden">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-900/60 bg-gradient-to-b from-emerald-500/5 to-transparent">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shadow-md shadow-emerald-500/5 animate-pulse">
            {getAlgoIcon(algo.id)}
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400 dark:from-white dark:to-zinc-300">
              {algo.title}
            </CardTitle>
            <CardDescription className="text-zinc-400 mt-1 max-w-[650px]">
              {algo.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {/* Core Specs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl border border-zinc-900/80 bg-zinc-900/20 backdrop-blur-sm flex flex-col gap-1.5 transition-all duration-300 hover:bg-zinc-900/30">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-emerald-400" /> Time Complexity (Worst)
            </span>
            <span className="text-lg font-bold font-mono text-zinc-200">
              {algo.timeComplexity.worst}
            </span>
          </div>
          <div className="p-4 rounded-xl border border-zinc-900/80 bg-zinc-900/20 backdrop-blur-sm flex flex-col gap-1.5 transition-all duration-300 hover:bg-zinc-900/30">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-teal-400" /> Time Complexity (Average)
            </span>
            <span className="text-lg font-bold font-mono text-zinc-200">
              {algo.timeComplexity.average}
            </span>
          </div>
          <div className="p-4 rounded-xl border border-zinc-900/80 bg-zinc-900/20 backdrop-blur-sm flex flex-col gap-1.5 transition-all duration-300 hover:bg-zinc-900/30">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1.5">
              <Database className="h-3 w-3 text-cyan-400" /> Space Complexity
            </span>
            <span className="text-lg font-bold font-mono text-zinc-200">
              {algo.spaceComplexity}
            </span>
          </div>
          <div className="p-4 rounded-xl border border-zinc-900/80 bg-zinc-900/20 backdrop-blur-sm flex flex-col gap-1.5 transition-all duration-300 hover:bg-zinc-900/30">
            <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider flex items-center gap-1.5">
              <Cpu className="h-3 w-3 text-indigo-400" /> Primary Data Structure
            </span>
            <span className="text-lg font-bold text-emerald-400">
              {algo.coreDataStructure}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tabs defaultValue="problems" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-zinc-950 p-1 border border-zinc-900 rounded-xl max-w-lg mx-auto sm:mx-0">
            <TabsTrigger value="problems" className="rounded-lg text-xs font-semibold py-2 px-3 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/20 border border-transparent transition-all">
              Problems Solved
            </TabsTrigger>
            <TabsTrigger value="steps" className="rounded-lg text-xs font-semibold py-2 px-3 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/20 border border-transparent transition-all">
              How It Works
            </TabsTrigger>
            <TabsTrigger value="proscons" className="rounded-lg text-xs font-semibold py-2 px-3 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/20 border border-transparent transition-all">
              Pros & Cons
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Problems Solved */}
          <TabsContent value="problems" className="focus-visible:outline-none">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
                <h3 className="text-base font-bold text-zinc-200">Real-World Problems We Solve</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {algo.problemsSolved.map((item, index) => (
                  <div 
                    key={index}
                    className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/10 flex flex-col gap-3 transition-all duration-300 hover:border-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/[0.02]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-6.5 w-6.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[11px] font-bold text-emerald-400 font-mono">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      <h4 className="text-sm font-bold text-zinc-100">{item.title}</h4>
                    </div>
                    <div className="space-y-2.5 text-xs text-zinc-400 pl-9.5">
                      <p>
                        <strong className="text-zinc-300 font-semibold">The Problem:</strong> {item.problem}
                      </p>
                      <p>
                        <strong className="text-emerald-400/90 font-semibold">How It Solves:</strong> {item.solution}
                      </p>
                      {item.example && (
                        <div className="mt-1 px-2.5 py-1.5 rounded-lg bg-zinc-950/60 border border-zinc-900/60 flex items-start gap-1.5">
                          <Lightbulb className="h-3.5 w-3.5 text-teal-400 shrink-0 mt-0.5" />
                          <span className="text-[11px] text-zinc-400 leading-normal">
                            <strong className="text-zinc-300 font-medium">Real Example: </strong>
                            {item.example}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 2: How It Works */}
          <TabsContent value="steps" className="focus-visible:outline-none">
            <div className="space-y-6 max-w-3xl">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4.5 w-4.5 text-emerald-400" />
                <h3 className="text-base font-bold text-zinc-200">Execution Walkthrough</h3>
              </div>
              <div className="relative pl-6 border-l border-zinc-900/80 space-y-6">
                {algo.stepByStep.map((step, index) => (
                  <div key={index} className="relative">
                    {/* Circle Node on Timeline */}
                    <span className="absolute -left-[35px] top-1 h-4.5 w-4.5 rounded-full bg-zinc-950 border-2 border-emerald-500/50 flex items-center justify-center text-[8px] font-bold text-emerald-400 font-mono shadow-sm">
                      {index + 1}
                    </span>
                    <div className="p-4 rounded-xl border border-zinc-900/60 bg-zinc-900/10 hover:bg-zinc-900/20 transition-all duration-200">
                      <p className="text-xs leading-relaxed text-zinc-300">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: Pros & Cons */}
          <TabsContent value="proscons" className="focus-visible:outline-none">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pros Card */}
                <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/10 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <h3 className="text-sm font-bold text-zinc-200">Advantages</h3>
                  </div>
                  <ul className="space-y-3.5">
                    {algo.pros.map((pro, index) => (
                      <li key={index} className="flex gap-2.5 items-start text-xs text-zinc-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons Card */}
                <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-900/10 space-y-4">
                  <div className="flex items-center gap-2 text-rose-400">
                    <XCircle className="h-5 w-5" />
                    <h3 className="text-sm font-bold text-zinc-200">Limitations</h3>
                  </div>
                  <ul className="space-y-3.5">
                    {algo.cons.map((con, index) => (
                      <li key={index} className="flex gap-2.5 items-start text-xs text-zinc-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0 mt-1.5" />
                        <span className="leading-relaxed">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Best Scenario Card */}
              <div className="p-5 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.02] flex items-start gap-4">
                <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Lightbulb className="h-5 w-5 text-emerald-400 animate-bounce" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">When to Use</h4>
                  <p className="text-xs leading-relaxed text-zinc-300">
                    {algo.whenToUse}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
