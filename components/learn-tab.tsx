"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { PlayCircle, FileQuestion, ArrowLeft } from "lucide-react"
import { AIChatModal } from "./ai-chat-modal"

interface Module {
  id: number
  title: string
  description: string
  level: "Beginner" | "Intermediate" | "Advanced"
  type: "Video" | "Quiz"
  videoUrl?: string
  keyTakeaways?: string[]
  quiz?: Quiz
}

interface Quiz {
  questions: Question[]
}

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const MOCK_MODULES: Module[] = [
  {
    id: 1,
    title: "Investing 101",
    description: "Learn the basics of investing and why it matters for your financial future.",
    level: "Beginner",
    type: "Video",
    videoUrl: "https://www.youtube.com/embed/O5Qb_PGpeFE",
    keyTakeaways: [
      "Understanding compound interest and time in the market",
      "The difference between stocks, bonds, and ETFs",
      "Risk vs. return fundamentals",
      "Starting with small, consistent contributions",
    ],
  },
  {
    id: 2,
    title: "What is a TFSA?",
    description: "Everything you need to know about Tax-Free Savings Accounts in Canada.",
    level: "Beginner",
    type: "Video",
    videoUrl: "https://www.youtube.com/embed/BfDA-i_ldts",
    keyTakeaways: [
      "TFSA contribution limits and rules",
      "Tax advantages of TFSA vs RRSP",
      "Best uses for your TFSA",
      "Avoiding over-contribution penalties",
    ],
  },
  {
    id: 3,
    title: "Introduction to ETFs",
    description: "Discover why ETFs are popular for long-term investing and building wealth.",
    level: "Intermediate",
    type: "Video",
    videoUrl: "https://www.youtube.com/embed/DPsUntwGIAg", // Embed version of your link
    keyTakeaways: [
      "How ETFs provide instant diversification",
      "Understanding expense ratios",
      "Index ETFs vs. sector ETFs",
      "Building a balanced ETF portfolio",
    ],
  },
  {
    id: 4,
    title: "Risk Assessment Quiz",
    description: "Test your knowledge about investment risk and your personal risk tolerance.",
    level: "Beginner",
    type: "Quiz",
    quiz: {
      questions: [
        {
          id: 1,
          question: 'What does "diversification" mean in investing?',
          options: [
            "Putting all your money in one stock",
            "Spreading investments across different assets",
            "Only investing in tech companies",
            "Keeping all money in a savings account",
          ],
          correctAnswer: 1,
          explanation:
            "Diversification means spreading your investments across different types of assets to reduce risk. If one investment performs poorly, others may balance it out.",
        },
        {
          id: 2,
          question: "Which investment typically has the highest risk?",
          options: [
            "Government bonds",
            "High-interest savings account",
            "Individual stocks",
            "GICs (Guaranteed Investment Certificates)",
          ],
          correctAnswer: 2,
          explanation:
            "Individual stocks carry the highest risk because their value can fluctuate significantly. Bonds and GICs are more stable but offer lower returns.",
        },
      ],
    },
  },
  {
    id: 5,
    title: "Understanding Market Cycles",
    description: "Learn about bull markets, bear markets, and how to stay calm during volatility.",
    level: "Intermediate",
    type: "Video",
    videoUrl: "https://www.youtube.com/embed/ebWL2TrIssA?start=426",
    keyTakeaways: [
      "What causes market ups and downs",
      "Historical market recovery patterns",
      "Emotional discipline during market crashes",
      "Dollar-cost averaging strategy",
    ],
  },  
  {
    id: 6,
    title: "Portfolio Basics Quiz",
    description: "Test your understanding of building and managing an investment portfolio.",
    level: "Intermediate",
    type: "Quiz",
    quiz: {
      questions: [
        {
          id: 1,
          question: "What is the main benefit of rebalancing your portfolio?",
          options: [
            "It guarantees higher returns",
            "It maintains your desired asset allocation",
            "It eliminates all investment risk",
            "It increases your contribution room",
          ],
          correctAnswer: 1,
          explanation:
            "Rebalancing helps maintain your target asset allocation (e.g., 60% stocks, 40% bonds) as market movements can shift these percentages over time.",
        },
        {
          id: 2,
          question: "What is an expense ratio?",
          options: [
            "The cost of buying shares",
            "Annual fee charged by a fund",
            "Your monthly investment amount",
            "The tax rate on investments",
          ],
          correctAnswer: 1,
          explanation:
            "An expense ratio is the annual fee that funds (like ETFs and mutual funds) charge for management, expressed as a percentage of your investment.",
        },
      ],
    },
  },
]

export function LearnTab() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [geminiQuestion, setGeminiQuestion] = useState("")
  const [isGeminiModalOpen, setIsGeminiModalOpen] = useState(false)
  const [geminiMessages, setGeminiMessages] = useState<{ role: "user" | "ai"; content: string }[]>([])

  const handleSelectModule = (module: Module) => {
    setSelectedModule(module)
    setQuizAnswers({})
    setShowResults(false)
  }

  const handleQuizSubmit = () => {
    setShowResults(true)
  }

  const calculateScore = () => {
    if (!selectedModule?.quiz) return 0
    const correct = selectedModule.quiz.questions.filter((q) => quizAnswers[q.id] === q.correctAnswer).length
    return Math.round((correct / selectedModule.quiz.questions.length) * 100)
  }

  const handleAskAI = async () => {
    if (geminiQuestion.trim()) {
      const userMessage = {
        role: "user" as const,
        content: geminiQuestion,
      }
      const loadingMessage = {
        role: "ai" as const,
        content: "Thinking...",
      }

      setGeminiMessages([userMessage, loadingMessage])
      setIsGeminiModalOpen(true)

      const questionToAsk = geminiQuestion
      setGeminiQuestion("")

      try {
        const response = await fetch("/api/gemini", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullText: "",
            highlightedText: "",
            userQuestion: questionToAsk,
          }),
        })

        const data = await response.json()

        setGeminiMessages([
          userMessage,
          {
            role: "ai" as const,
            content: data.answer || data.error || "Unable to get response from AI.",
          },
        ])
      } catch (error) {
        console.error("[v0] Error fetching AI response:", error)
        setGeminiMessages([
          userMessage,
          {
            role: "ai" as const,
            content: "Failed to connect to AI service. Please try again later.",
          },
        ])
      }
    }
  }

  if (selectedModule) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => setSelectedModule(null)} className="mb-4 hover:bg-accent">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to modules
        </Button>

        <Card className="p-6 border-border shadow-sm">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant={selectedModule.level === "Beginner" ? "secondary" : "default"}
                className="bg-accent text-accent-foreground"
              >
                {selectedModule.level}
              </Badge>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{selectedModule.type}</Badge>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{selectedModule.title}</h2>
            <p className="text-muted-foreground">{selectedModule.description}</p>
          </div>

          {selectedModule.type === "Video" && (
            <>
              <div className="relative rounded-lg overflow-hidden border border-border mb-6 aspect-video">
                <iframe
                  src={selectedModule.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              <div className="bg-accent rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3">Key Takeaways</h3>
                <ul className="space-y-2">
                  {selectedModule.keyTakeaways?.map((takeaway, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {selectedModule.type === "Quiz" && selectedModule.quiz && (
            <div className="space-y-6">
              {selectedModule.quiz.questions.map((question, qIndex) => (
                <div key={question.id} className="space-y-3">
                  <p className="font-semibold text-foreground">
                    {qIndex + 1}. {question.question}
                  </p>
                  <div className="space-y-2">
                    {question.options.map((option, oIndex) => {
                      const isSelected = quizAnswers[question.id] === oIndex
                      const isCorrect = oIndex === question.correctAnswer
                      const showFeedback = showResults && isSelected

                      return (
                        <button
                          key={oIndex}
                          onClick={() => !showResults && setQuizAnswers({ ...quizAnswers, [question.id]: oIndex })}
                          disabled={showResults}
                          className={`w-full text-left p-3 rounded-lg border transition-colors ${
                            showFeedback
                              ? isCorrect
                                ? "border-green-500 bg-green-50"
                                : "border-red-500 bg-red-50"
                              : isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary hover:bg-accent"
                          }`}
                        >
                          <span className="text-sm text-foreground">{option}</span>
                        </button>
                      )
                    })}
                  </div>
                  {showResults && (
                    <div className="bg-accent rounded-lg p-3">
                      <p className="text-sm text-foreground">{question.explanation}</p>
                    </div>
                  )}
                </div>
              ))}

              {!showResults ? (
                <Button
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length !== selectedModule.quiz.questions.length}
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  Submit Quiz
                </Button>
              ) : (
                <div className="text-center p-6 bg-accent rounded-lg">
                  <p className="text-3xl font-bold text-primary mb-2">{calculateScore()}%</p>
                  <p className="text-muted-foreground">Great job! Keep learning to improve your financial knowledge.</p>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    )
  }

  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Level up your money knowledge 💸</h1>

          <div className="max-w-2xl mx-auto mt-6 mb-4">
            <div className="flex gap-2">
              <Input
                placeholder="Ask a question about money or investing..."
                value={geminiQuestion}
                onChange={(e) => setGeminiQuestion(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAskAI()}
                className="flex-1 border-pink-200 focus:border-pink-400"
              />
              <Button
                onClick={handleAskAI}
                disabled={!geminiQuestion.trim()}
                className="bg-pink-500 hover:bg-pink-600 text-white"
              >
                Ask AI
              </Button>
            </div>
          </div>

          <p className="text-muted-foreground">Watch videos and take quizzes to master investing basics</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {MOCK_MODULES.map((module) => (
            <Card key={module.id} className="p-5 border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    module.type === "Video" ? "bg-primary/10" : "bg-accent"
                  }`}
                >
                  {module.type === "Video" ? (
                    <PlayCircle className="w-5 h-5 text-primary" />
                  ) : (
                    <FileQuestion className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant={module.level === "Beginner" ? "secondary" : "default"}
                      className="bg-accent text-accent-foreground text-xs"
                    >
                      {module.level}
                    </Badge>
                    <Badge className="bg-primary/10 text-primary hover:bg-primary/20 text-xs">
                      {module.type}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{module.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 text-pretty">
                    {module.description}
                  </p>

                  {/* NEW: preview video inside each tutorial card */}
                  {module.type === "Video" && module.videoUrl && (
                    <div className="mb-4 rounded-lg overflow-hidden border border-border aspect-video">
                      <iframe
                        src={module.videoUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  <Button
                    onClick={() => handleSelectModule(module)}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    Start
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>

      <AIChatModal
        isOpen={isGeminiModalOpen}
        onClose={() => {
          setIsGeminiModalOpen(false)
          setGeminiMessages([])
        }}
        initialMessages={geminiMessages}
      />
    </>
  )
}
