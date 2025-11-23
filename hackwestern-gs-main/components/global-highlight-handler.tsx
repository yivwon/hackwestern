"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, X } from "lucide-react"
import { AIChatModal } from "./ai-chat-modal"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface SelectionPosition {
  top: number
  left: number
}

interface Message {
  role: "user" | "ai" | "context"
  content: string
}

export function GlobalHighlightHandler({ children }: { children: React.ReactNode }) {
  const [selectedText, setSelectedText] = useState("")
  const [fullText, setFullText] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showPlaceholder, setShowPlaceholder] = useState(false)
  const [confirmationPosition, setConfirmationPosition] = useState<SelectionPosition>({ top: 0, left: 0 })
  const [placeholderPosition, setPlaceholderPosition] = useState<SelectionPosition>({ top: 0, left: 0 })
  const [followUpQuestion, setFollowUpQuestion] = useState("")
  const [isChatModalOpen, setIsChatModalOpen] = useState(false)
  const [chatInitialMessages, setChatInitialMessages] = useState<Message[]>([])
  const [aiInsight, setAiInsight] = useState<string>("")
  const [isLoadingInsight, setIsLoadingInsight] = useState(false)

  useEffect(() => {
    const handleSelection = () => {
      setTimeout(() => {
        const selection = window.getSelection()

        if (!selection || selection.rangeCount === 0) {
          return
        }

        const text = selection.toString().trim()

        if (text.length >= 3) {
          const range = selection.getRangeAt(0)
          const rect = range.getBoundingClientRect()

          let parentElement = range.commonAncestorContainer
          if (parentElement.nodeType === Node.TEXT_NODE) {
            parentElement = parentElement.parentElement as Node
          }
          const fullContext = (parentElement as HTMLElement)?.textContent?.trim() || text
          setFullText(fullContext)

          setConfirmationPosition({
            top: rect.bottom + window.scrollY + 8,
            left: rect.left + window.scrollX + rect.width / 2,
          })

          setSelectedText(text)
          setShowConfirmation(true)
          setShowPlaceholder(false)
        } else {
          if (text.length === 0) {
            setShowConfirmation(false)
          }
        }
      }, 10)
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Don't close if clicking inside popup elements
      if (
        target.closest("[data-confirmation-popup]") ||
        target.closest("[data-placeholder-box]") ||
        target.closest("[data-chat-modal]")
      ) {
        return
      }

      // Close popups when clicking outside
      setShowConfirmation(false)
      setShowPlaceholder(false)
    }

    document.addEventListener("mouseup", handleSelection)
    document.addEventListener("touchend", handleSelection)
    document.addEventListener("click", handleClickOutside)

    return () => {
      document.removeEventListener("mouseup", handleSelection)
      document.removeEventListener("touchend", handleSelection)
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const handleAskAI = async () => {
    setShowConfirmation(false)

    setPlaceholderPosition({
      top: confirmationPosition.top + 50,
      left: confirmationPosition.left,
    })

    setShowPlaceholder(true)
    setIsLoadingInsight(true)
    setAiInsight("")

    window.getSelection()?.removeAllRanges()

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullText: fullText,
          highlightedText: selectedText,
          userQuestion: "",
        }),
      })

      const data = await response.json()
      setAiInsight(data.answer || data.error || "Unable to get response from AI.")
    } catch (error) {
      console.error("[v0] Error fetching AI insight:", error)
      setAiInsight("Failed to connect to AI service. Please try again later.")
    } finally {
      setIsLoadingInsight(false)
    }
  }

  const handleContinueToChat = async () => {
    if (followUpQuestion.trim()) {
      const contextMessage: Message = {
        role: "context",
        content: `Context: "${selectedText}"`,
      }
      const userMessage: Message = {
        role: "user",
        content: followUpQuestion,
      }
      const loadingMessage: Message = {
        role: "ai",
        content: "Thinking...",
      }

      setChatInitialMessages([contextMessage, userMessage, loadingMessage])
      setIsChatModalOpen(true)
      setShowPlaceholder(false)

      const questionToAsk = followUpQuestion
      setFollowUpQuestion("")

      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullText: fullText,
            highlightedText: selectedText,
            userQuestion: questionToAsk,
          }),
        })

        const data = await response.json()

        const aiMessage: Message = {
          role: "ai",
          content: data.answer || data.error || "Unable to get response from AI.",
        }

        setChatInitialMessages([contextMessage, userMessage, aiMessage])
      } catch (error) {
        console.error("[v0] Error fetching AI response:", error)
        const errorMessage: Message = {
          role: "ai",
          content: "Failed to connect to AI service. Please try again later.",
        }
        setChatInitialMessages([contextMessage, userMessage, errorMessage])
      }
    }
  }

  const handleClosePlaceholder = () => {
    setShowPlaceholder(false)
    setFollowUpQuestion("")
    setAiInsight("")
    setIsLoadingInsight(false)
  }

  const handleCancelConfirmation = () => {
    setShowConfirmation(false)
    window.getSelection()?.removeAllRanges()
  }

  return (
    <>
      {children}

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div
          data-confirmation-popup
          className="absolute animate-in fade-in duration-200"
          style={{
            top: `${confirmationPosition.top}px`,
            left: `${confirmationPosition.left}px`,
            transform: "translateX(-50%)",
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          <Card className="px-4 py-3 border-pink-300 shadow-lg bg-white" style={{ pointerEvents: "auto" }}>
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="text-sm text-foreground font-medium">Ask AI about this?</span>
              <div className="flex gap-2">
                <Button
                  onClick={handleAskAI}
                  size="sm"
                  className="bg-pink-500 hover:bg-pink-600 text-white text-xs px-3 py-1 h-auto"
                >
                  Yes
                </Button>
                <Button
                  onClick={handleCancelConfirmation}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 text-xs px-2 py-1 h-auto"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Inline Placeholder Box */}
      {showPlaceholder && (
        <div
          data-placeholder-box
          className="absolute w-[90%] max-w-md animate-in fade-in slide-in-from-top-4 duration-300"
          style={{
            top: `${placeholderPosition.top}px`,
            left: `${placeholderPosition.left}px`,
            transform: "translateX(-50%)",
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          <Card className="p-5 border-pink-300 shadow-2xl bg-white" style={{ pointerEvents: "auto" }}>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-pink-500" />
                  AI Insight
                </h3>
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 mb-3">
                  <p className="text-sm text-pink-900 italic">"{selectedText}"</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  {isLoadingInsight ? (
                    <p className="text-sm text-gray-600">Analyzing with Gemini...</p>
                  ) : (
                    <div className="text-sm text-gray-900 leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-900 prose-strong:text-gray-900 prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1 prose-code:rounded">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiInsight || "No response yet."}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Ask a follow-up question:</label>
                <Textarea
                  placeholder="Ask for more help or clarification..."
                  value={followUpQuestion}
                  onChange={(e) => setFollowUpQuestion(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleContinueToChat()
                    }
                  }}
                  className="border-pink-200 focus:border-pink-400 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={handleClosePlaceholder} className="text-gray-600">
                  Cancel
                </Button>
                <Button
                  onClick={handleContinueToChat}
                  disabled={!followUpQuestion.trim()}
                  size="sm"
                  className="bg-pink-500 hover:bg-pink-600 text-white"
                >
                  Continue in Chat
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Reusable AI Chat Modal */}
      <div data-chat-modal>
        <AIChatModal
          isOpen={isChatModalOpen}
          onClose={() => {
            setIsChatModalOpen(false)
            setChatInitialMessages([])
          }}
          initialMessages={chatInitialMessages}
          fullText={fullText}
          highlightedText={selectedText}
        />
      </div>
    </>
  )
}
