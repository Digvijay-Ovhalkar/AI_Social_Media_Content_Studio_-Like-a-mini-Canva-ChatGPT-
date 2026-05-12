"use client"

import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"
import { toast } from "sonner"

import { FloatingInputArea } from "@/components/input-area/FloatingInputArea"
import { HeaderArea } from "@/components/HeaderArea"
import { ContentArea } from "@/components/ContentArea"

import {
  getAvailableModels,
  type LLMModel,
} from "@/lib/models"

import {
  ApiKeys,
  GeneratedPost,
  UserConfig,
} from "@/lib/types"

export default function SocialMediaGenerator() {
  const modelOptions = getAvailableModels()

  const [prompt, setPrompt] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["linkedin"])
  const [selectedModel, setSelectedModel] = useState<LLMModel>(modelOptions[0])

  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const [selectedPost, setSelectedPost] = useState<GeneratedPost | null>(null)

  const { theme, setTheme } = useTheme()

  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openai: "",
    gemini: "",
  })

  const [userConfig, setUserConfig] = useState<UserConfig>({
    knowledgeBase: "",
    topic: "",
    tone: "professional",
    targetAudience: "",
    postLength: "medium",
    postsPerPlatform: {
      linkedin: 3,
      reddit: 3,
      twitter: 3,
    },
  })

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const savedKeys = localStorage.getItem("ai-api-keys")
    if (savedKeys) setApiKeys(JSON.parse(savedKeys))
  }, [])

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    )
  }

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt")
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          platforms: selectedPlatforms,
        }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setGeneratedPosts(data.posts ?? [])
      toast.success("Posts generated successfully")

    } catch (error: any) {
      toast.error(error.message || "Generation failed")

    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="h-screen w-full flex flex-col bg-background text-foreground transition-colors overflow-hidden">

      {/* TOP TITLE */}
      <div className="w-full text-center py-3 border-b border-white/10 bg-black/20 backdrop-blur-md">
        <h1 className="text-xl md:text-2xl font-bold text-white">
          AI Social Media Studio
        </h1>
        <p className="text-xs md:text-sm text-gray-400 mt-1">
          Generate AI-powered posts instantly
        </p>
      </div>
      
      {/* HEADER */}
      <HeaderArea
        theme={theme || "light"}
        setTheme={setTheme}
        apiKeysOpen={false}
        setApiKeysOpen={() => {}}
        apiKeys={apiKeys}
        setApiKeys={setApiKeys}
        openAIBaseURL={""}
        setOpenAIBaseURL={() => {}}
      />

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto pb-36 px-2">

        <ContentArea
          generatedPosts={generatedPosts}
          setGeneratedPosts={setGeneratedPosts}
          setSelectedPost={setSelectedPost}
          copyToClipboard={(text) => navigator.clipboard.writeText(text)}
          setPrompt={setPrompt}
        />

        {/* AI SUGGESTIONS (theme aware) */}
        <div className="max-w-3xl mx-auto mt-2 mb-2">
          <div className="bg-card border border-border backdrop-blur-xl rounded-lg p-2">

            <p className="text-foreground text-xs font-semibold mb-1">
              💡 Try something simple
            </p>

            <p className="text-muted-foreground text-[11px] mb-2">
              Pick an idea or type your own prompt
            </p>

            <div className="flex flex-wrap gap-1">

              <button
                onClick={() => setPrompt("Share 3 tips to improve productivity")}
                className="text-[10px] px-2 py-1 rounded-full bg-purple-500/20 text-foreground"
              >
                Productivity tips
              </button>

              <button
                onClick={() => setPrompt("What new tech is trending right now?")}
                className="text-[10px] px-2 py-1 rounded-full bg-pink-500/20 text-foreground"
              >
                Tech update
              </button>

              <button
                onClick={() => setPrompt("Summarize today's news simply")}
                className="text-[10px] px-2 py-1 rounded-full bg-blue-500/20 text-foreground"
              >
                News summary
              </button>

              <button
                onClick={() => setPrompt("Give a motivational message for developers")}
                className="text-[10px] px-2 py-1 rounded-full bg-green-500/20 text-foreground"
              >
                Motivation
              </button>

            </div>
          </div>
        </div>

      </div>

      {/* INPUT */}
      <div className="fixed bottom-14 left-0 right-0 flex justify-center px-3 z-50">
        <div className="w-full max-w-3xl bg-card border border-border rounded-xl p-1">

          <FloatingInputArea
            textareaRef={textareaRef}
            prompt={prompt}
            setPrompt={setPrompt}
            generateContent={generateContent}
            selectedPlatforms={selectedPlatforms}
            togglePlatform={togglePlatform}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            isGenerating={isGenerating}
            userConfig={userConfig}
            setUserConfig={setUserConfig}
          />

        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center text-muted-foreground text-xs py-2 border-t border-border">
        Built by <span className="text-foreground font-medium">Digvijay Ovhalkar</span>
      </div>

      {/* LOADER */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

    </div>
  )
}