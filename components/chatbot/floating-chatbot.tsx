"use client"

import { useState, useCallback, memo, useEffect } from "react"
import { MessageCircle, Bot } from "lucide-react"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

// Dynamically import the Chatbot component with no SSR to avoid hydration issues
const Chatbot = dynamic(() => import("./chatbot"), { ssr: false })

function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check screen size
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const handleOpen = useCallback(() => setIsOpen(true), [])
  const handleClose = useCallback(() => setIsOpen(false), [])

  return (
    <>
      {/* Floating chat button */}
      <button
        onClick={handleOpen}
        className={cn(
          "fixed z-50 rounded-full shadow-lg",
          "flex items-center justify-center gap-1.5",
          "bg-emerald-600 text-white hover:bg-emerald-700",
          "transition-all duration-300 ease-out",
          "hover:shadow-xl hover:scale-105 active:scale-95",
          "bottom-6 right-6 h-14 w-14",
          "sm:bottom-8 sm:right-8",
          isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100",
        )}
        aria-label="Open chat"
      >
        <Bot className="h-5 w-5" />
        <MessageCircle className="h-5 w-5" />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <>
          {/* Backdrop (mobile only) */}
          {isMobile && (
            <div
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={handleClose}
            />
          )}

          {/* Chat popup panel */}
          <div
            className={cn(
              "fixed z-50 flex flex-col overflow-hidden",
              "bg-white dark:bg-zinc-900 shadow-2xl",
              "border border-zinc-200 dark:border-zinc-800",
              "animate-in slide-in-from-bottom-5 fade-in duration-300",
              // Mobile: nearly full screen
              isMobile
                ? "inset-2 rounded-2xl"
                // Desktop: popup in bottom-right
                : "bottom-6 right-6 sm:bottom-8 sm:right-8 w-[400px] h-[560px] rounded-2xl",
            )}
          >
            <Chatbot onClose={handleClose} />
          </div>
        </>
      )}
    </>
  )
}

export default memo(FloatingChatbot)