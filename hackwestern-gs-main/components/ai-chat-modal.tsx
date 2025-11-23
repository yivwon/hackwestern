"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Send } from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Message {
  role: "user" | "ai" | "context"
  content: string
}

interface AIChatModalProps {
  isOpen: boolean
  onClose: () => void
  initialMessages?: Message[]
  fullText?: string
  highlightedText?: string
}

export function AIChatModal({
  isOpen,
  onClose,
  initialMessages = [],
  fullText = "",
  highlightedText = "",
}: AIChatModalProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialMessages.length > 0) {
      setMessages(initialMessages)
    }
  }, [initialMessages])

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage: Message = { role: "user", content: input }
      setMessages((prev) => [...prev, userMessage])
      setInput("")
      setIsLoading(true)

      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullText: fullText,
            highlightedText: highlightedText,
            userQuestion: input,
          }),
        })

        const data = await response.json()

        const aiResponse: Message = {
          role: "ai",
          content: data.answer || data.error || "Unable to get response from AI.",
        }
        setMessages((prev) => [...prev, aiResponse])
      } catch (error) {
        const errorMessage: Message = {
          role: "ai",
          content: "Failed to connect to AI service. Please try again later.",
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col border-pink-200 shadow-2xl">
        <div className="bg-pink-500 text-white p-4 rounded-t-lg flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">AI Learning Assistant</h3>
            <p className="text-xs opacity-90">Powered by Gemini</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-pink-600">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : message.role === "context" ? "justify-center" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-pink-500 text-white"
                    : message.role === "context"
                      ? "bg-pink-50 text-pink-900 border border-pink-200 italic text-sm"
                      : "bg-gray-100 text-gray-900"
                }`}
              >
                {message.role === "ai" ? (
                  <div className="prose prose-sm max-w-none prose-headings:mt-3 prose-headings:mb-2 prose-p:my-2 prose-li:my-1">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{message.content}</p>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 rounded-lg p-4">
                <p className="text-sm leading-relaxed">Thinking...</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              placeholder="Ask a follow-up question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
              className="flex-1 border-pink-200 focus:border-pink-400"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
