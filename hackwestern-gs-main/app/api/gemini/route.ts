import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { fullText, highlightedText, userQuestion } = await request.json()

    // Validate input
    if (!fullText || !highlightedText) {
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

    // Build the prompt for Gemini
    const prompt = `You are a helpful financial education assistant. A user is reading about finance and has highlighted some text.

Full context:
"${fullText}"

Highlighted text:
"${highlightedText}"

${userQuestion ? `User's question: ${userQuestion}` : "Please explain the highlighted text in simple terms for someone learning about finance."}

Provide a clear, concise, and educational response.`

    // TODO: Make actual Gemini API call when ready
    // const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-goog-api-key': apiKey
    //   },
    //   body: JSON.stringify({
    //     contents: [{
    //       parts: [{ text: prompt }]
    //     }]
    //   })
    // })
    // const data = await response.json()
    // const answer = data.candidates[0].content.parts[0].text

    // Placeholder response for now
    const answer = `This is a placeholder response. When GEMINI_API_KEY is configured, I'll provide detailed explanations about "${highlightedText}" in the context of: "${fullText.substring(0, 100)}..."`

    return NextResponse.json({ answer })
  } catch (error) {
    console.error("[v0] Gemini API error:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
