"use client"

import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Send, Loader2, GitGraph, Bot } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  text: string
  role: "user" | "model"
  timestamp: Date
}

interface PredefinedQA {
  question: string
  answer: string
}

const PREDEFINED_QA: PredefinedQA[] = [
  {
    question: "What is GraphAlgo?",
    answer:
      "GraphAlgo is an interactive educational platform designed to help students, educators, and enthusiasts understand graph algorithms through visual simulations, step-by-step code tracing, and hands-on graph building. You can explore algorithms like BFS, DFS, Dijkstra's, A*, Prim's, and Graph Coloring — all with beautiful animations.",
  },
  {
    question: "Which algorithms are available?",
    answer:
      "GraphAlgo currently supports six core algorithms:\n\n• A* Pathfinding — Uses heuristics to find shortest obstacle-free paths.\n• Breadth-First Search (BFS) — Explores nodes level-by-level.\n• Depth-First Search (DFS) — Explores as deep as possible before backtracking.\n• Dijkstra's Algorithm — Finds shortest paths in weighted graphs.\n• Prim's Algorithm — Builds a minimum spanning tree.\n• Graph Coloring — Assigns colors so no adjacent nodes share a color.\n\nEach visualizer includes multi-language code tracing (JavaScript, C++, Java, Python, C, and C#).",
  },
  {
    question: "Do I need coding knowledge?",
    answer:
      "Not at all! GraphAlgo provides an intuitive visual interface where you can build graphs, run algorithms, and watch each step animate on a canvas — no coding required. However, if you do know how to code, you'll love our side-by-side code tracer that highlights exactly which line of code is executing at each algorithm step.",
  },
  {
    question: "Can I use it for teaching?",
    answer:
      "Absolutely! GraphAlgo is perfect for classroom demonstrations, homework assignments, and workshops. Instructors can use the interactive canvas to visually explain concepts like shortest-path relaxation, tree traversals, and greedy algorithms. The multi-language code panel also makes it easy to compare implementations across different programming languages.",
  },
  {
    question: "Is GraphAlgo free to use?",
    answer:
      "Yes! GraphAlgo is 100% free and open-source. We believe in open education and our mission is to make learning graph algorithms accessible to everyone, everywhere. No account sign-up, no installation — just open the website and start exploring.",
  },
  {
    question: "How does the code tracing work?",
    answer:
      "When you run an algorithm, our code tracer highlights the exact line of code being executed at each step. You can choose from 6 programming languages (JavaScript, C++, Java, Python, C, C#). The tracer also shows a step explanation describing what the algorithm is doing — like 'Visiting node 3' or 'Relaxing edge (2→5) with weight 4'. You can pause, step forward, or adjust the speed.",
  },
  {
    question: "Can I build custom graphs?",
    answer:
      "Yes! Each algorithm visualizer comes with a pre-built example graph, but you can also create your own. Add nodes by clicking on the canvas, connect them with edges, set edge weights for weighted algorithms, and then run the algorithm to see how it works on your custom graph.",
  },
  {
    question: "Does GraphAlgo work on mobile?",
    answer:
      "GraphAlgo is primarily optimized for desktop browsers to provide the best interactive canvas experience. While you can access it on tablets and larger mobile screens, the full graph-building and code-tracing experience is best enjoyed on a desktop or laptop.",
  },
]

// Fuzzy matching: find the best matching predefined Q&A for free-text input
function findBestMatch(input: string): PredefinedQA | null {
  const normalizedInput = input.toLowerCase().trim()

  // Direct keyword matching with scoring
  let bestMatch: PredefinedQA | null = null
  let bestScore = 0

  for (const qa of PREDEFINED_QA) {
    const normalizedQuestion = qa.question.toLowerCase()
    const normalizedAnswer = qa.answer.toLowerCase()

    // Exact match
    if (normalizedInput === normalizedQuestion) return qa

    // Calculate a simple keyword overlap score
    const inputWords = normalizedInput.split(/\s+/).filter((w) => w.length > 2)
    let score = 0

    for (const word of inputWords) {
      if (normalizedQuestion.includes(word)) score += 3
      if (normalizedAnswer.includes(word)) score += 1
    }

    // Bonus for key topic words
    const topicMap: Record<string, string[]> = {
      "What is GraphAlgo?": ["graphalgo", "what", "about", "platform", "this"],
      "Which algorithms are available?": ["algorithm", "which", "available", "support", "list", "bfs", "dfs", "dijkstra", "astar", "prim", "coloring"],
      "Do I need coding knowledge?": ["coding", "code", "programming", "knowledge", "need", "require", "beginner"],
      "Can I use it for teaching?": ["teach", "teaching", "classroom", "education", "instructor", "professor", "school", "university"],
      "Is GraphAlgo free to use?": ["free", "cost", "price", "pay", "open-source", "opensource"],
      "How does the code tracing work?": ["trace", "tracing", "code", "highlight", "step", "debug", "line"],
      "Can I build custom graphs?": ["custom", "build", "create", "own", "graph", "node", "edge", "add"],
      "Does GraphAlgo work on mobile?": ["mobile", "phone", "tablet", "responsive", "android", "ios", "ipad"],
    }

    const topics = topicMap[qa.question] || []
    for (const topic of topics) {
      if (normalizedInput.includes(topic)) score += 5
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = qa
    }
  }

  // Only return a match if the score is above a minimum threshold
  return bestScore >= 5 ? bestMatch : null
}

export default function Chatbot({ onClose }: { onClose?: () => void }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 200)
  }, [])

  // Get unasked questions
  const getUnaskedQuestions = useCallback(() => {
    const askedQuestions = messages.filter((msg) => msg.role === "user").map((msg) => msg.text)
    return PREDEFINED_QA.filter((item) => !askedQuestions.includes(item.question))
  }, [messages])

  // Handle clicking a predefined question
  const handleQuestionClick = useCallback((question: string) => {
    const qa = PREDEFINED_QA.find((item) => item.question === question)
    if (!qa) return

    const userMessage: Message = {
      text: question,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setShowSuggestions(false)
    setIsLoading(true)

    // Simulate a short delay for natural feel
    setTimeout(() => {
      const botMessage: Message = {
        text: qa.answer,
        role: "model",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
      setShowSuggestions(true)
    }, 600 + Math.random() * 400)
  }, [])

  // Handle free-text send
  const handleSendMessage = useCallback(() => {
    const text = userInput.trim()
    if (!text) return

    const userMessage: Message = {
      text,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setUserInput("")
    setShowSuggestions(false)
    setIsLoading(true)

    setTimeout(() => {
      const match = findBestMatch(text)

      const botMessage: Message = {
        text: match
          ? match.answer
          : "I'm sorry, I can only answer questions about GraphAlgo and its features. Try asking about our available algorithms, code tracing, custom graphs, or how to use the platform!",
        role: "model",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
      setShowSuggestions(true)
      setTimeout(() => inputRef.current?.focus(), 100)
    }, 700 + Math.random() * 500)
  }, [userInput])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSendMessage()
      }
    },
    [handleSendMessage],
  )

  const unaskedQuestions = getUnaskedQuestions()

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-950 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-900/40 flex items-center justify-center flex-shrink-0">
              <GitGraph className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100 leading-tight">
                GraphAlgo Assistant
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">
                  Online & Ready to help
                </span>
              </div>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-zinc-200"
              aria-label="Close chat"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto bg-zinc-950">
        <div className="p-4">
          {messages.length === 0 ? (
            // Welcome state — FAQ cards
            <div className="flex flex-col items-center">
              <p className="text-sm text-center text-emerald-300 mt-2 mb-5 px-4 leading-relaxed">
                Ask me anything about graph algorithms, visualizations, code tracing, or the platform!
              </p>

              <div className="w-full space-y-1">
                <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 px-1">
                  Frequently Asked Questions:
                </p>
                {PREDEFINED_QA.slice(0, 5).map((qa, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuestionClick(qa.question)}
                    className="w-full text-left px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-emerald-600 hover:bg-emerald-950/30 transition-all duration-200 group"
                  >
                    <span className="text-sm text-zinc-300 group-hover:text-emerald-300 transition-colors">
                      {qa.question}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Conversation state
            <div className="space-y-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-emerald-600 text-white rounded-br-md"
                        : "bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-bl-md shadow-sm",
                    )}
                  >
                    {msg.role === "model" && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Bot className="h-3.5 w-3.5 text-emerald-500" />
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                          Assistant
                        </span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
                      <span className="text-sm text-zinc-400">Typing...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested follow-up questions */}
              {showSuggestions && !isLoading && unaskedQuestions.length > 0 && messages.length > 0 && messages[messages.length - 1].role === "model" && (
                <div className="pt-2">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 px-1">
                    Related Questions:
                  </p>
                  <div className="space-y-1">
                    {unaskedQuestions.slice(0, 3).map((qa, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuestionClick(qa.question)}
                        className="w-full text-left px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-emerald-600 hover:bg-emerald-950/30 transition-all text-xs text-zinc-400 hover:text-emerald-300"
                      >
                        {qa.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950 flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask something about GraphAlgo..."
            disabled={isLoading}
            className={cn(
              "flex-1 h-10 px-4 rounded-full text-sm",
              "bg-zinc-900 text-zinc-100",
              "border-2 border-emerald-700",
              "focus:outline-none focus:border-emerald-500",
              "placeholder:text-zinc-500",
              "disabled:opacity-50 transition-colors",
            )}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !userInput.trim()}
            className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
              userInput.trim()
                ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-md hover:shadow-lg"
                : "bg-zinc-700 text-zinc-500 cursor-not-allowed",
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}