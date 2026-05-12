import { type NextRequest, NextResponse } from "next/server"

import { generateText } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"

interface GenerateRequest {
  prompt: string
  platforms: string[]
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json()

    const { prompt, platforms } = body

    // ✅ Validate input
    if (!prompt || !platforms?.length) {
      return NextResponse.json(
        { error: "Missing prompt or platforms" },
        { status: 400 }
      )
    }

    // ✅ Use backend env key (SECURE WAY)
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GEMINI_API_KEY in environment" },
        { status: 500 }
      )
    }

    const google = createGoogleGenerativeAI({
      apiKey,
    })

    const generatedPosts: any[] = []

    for (const platform of platforms) {
      try {
        const { text } = await generateText({
          model: google("gemini-1.5-flash"),

          prompt: `
Generate ONE high-quality ${platform} social media post about:

${prompt}

Rules:
- Make it engaging
- Add relevant hashtags
- Platform optimized writing style
- Return ONLY the post content
          `,
        })

        generatedPosts.push({
          id: crypto.randomUUID(),
          platform,
          content: text,
          hashtags: [],
        })

      } catch (err: any) {
        // ✅ REAL ERROR LOGGING (IMPORTANT FIX)
        console.error(
          `❌ Gemini Error on ${platform}:`,
          err?.message || err
        )

        // optional fallback so UI still works
        generatedPosts.push({
          id: crypto.randomUUID(),
          platform,
          content: `ERROR: ${err?.message || "Generation failed"}`,
          hashtags: [],
        })
      }
    }

    // ❌ If nothing generated
    if (generatedPosts.length === 0) {
      return NextResponse.json(
        {
          error: "Failed to generate any content",
        },
        { status: 500 }
      )
    }

    // ✅ SUCCESS RESPONSE
    return NextResponse.json({
      posts: generatedPosts,
    })

  } catch (error: any) {
    console.error("API ERROR:", error)

    return NextResponse.json(
      {
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    )
  }
}