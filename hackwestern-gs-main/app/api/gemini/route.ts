import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(request: NextRequest) {
  try {
    const { fullText, highlightedText, userQuestion } = await request.json()

    // Validate that we have at least something to work with
    if (!userQuestion && !highlightedText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get API key from environment
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      console.warn("[v0] GEMINI_API_KEY not configured")
      return NextResponse.json(
        {
          answer:
            "Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables to enable AI responses.",
        },
        { status: 200 },
      )
    }

    let prompt: string

    if (userQuestion && !highlightedText) {
      // Learn tab case: just a question
      prompt = `You are a helpful financial education assistant. Answer the following question clearly and concisely:

${userQuestion}

Provide a clear, educational response suitable for someone learning about finance.`
    } else if (highlightedText && !userQuestion) {
      // Highlight case: explain the highlighted text
      prompt = `You are a helpful financial education assistant. A user is reading about finance and has highlighted some text.

${fullText ? `Full context:\n"${fullText}"\n\n` : ""}Highlighted text:
"${highlightedText}"

Please explain the highlighted text in simple terms for someone learning about finance.`
    } else {
      // Both: highlighted text + question
      prompt = `You are a helpful financial education assistant. A user is reading about finance and has highlighted some text.

${fullText ? `Full context:\n"${fullText}"\n\n` : ""}Highlighted text:
"${highlightedText}"

User's question: ${userQuestion}

Provide a clear, concise, and educational response.`
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const result = await model.generateContent(prompt)
    const response = await result.response
    const answer = response.text()

    return NextResponse.json({ answer })
  } catch (error) {
    console.error("[v0] Gemini API error:", error)
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
