"use client"

import { Moon, Settings2, Sun, Github } from "lucide-react"
import { Button } from "./ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "./ui/input"
import { toast } from "sonner"
import { useEffect, useState } from "react"

interface HeaderAreaProps {
  theme: string
  setTheme: (theme: string) => void
  apiKeysOpen: boolean
  setApiKeysOpen: (open: boolean) => void
  apiKeys: {
    openai: string
    gemini: string
  }
  setApiKeys: (keys: { openai: string; gemini: string }) => void
  openAIBaseURL: string
  setOpenAIBaseURL: (value: string) => void
}

export const HeaderArea = ({
  theme,
  setTheme,
  apiKeysOpen,
  setApiKeysOpen,
  apiKeys,
  setApiKeys,
  openAIBaseURL,
  setOpenAIBaseURL,
}: HeaderAreaProps) => {
  const [githubStars, setGitHubStars] = useState(0)

  // HYDRATION FIX
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getGithubStars = async () => {
    try {
      const data = await fetch(
        "https://api.github.com/repos/habeebmoosa/opencontentgenerator"
      )

      const githubData = await data.json()

      setGitHubStars(githubData.stargazers_count ?? 0)
    } catch (error) {
      console.error("GitHub fetch error:", error)
    }
  }

  useEffect(() => {
    getGithubStars()
  }, [])

  const saveApiKeys = () => {
    // SAVE DIRECTLY (NO ENCRYPTION)
    localStorage.setItem("ai-api-keys", JSON.stringify(apiKeys))

    localStorage.setItem("openai-base-url", openAIBaseURL)

    setApiKeysOpen(false)

    toast.success("API Keys saved successfully.")
  }

  return (
    <header className="relative px-6">
      {/* LEFT SECTION */}
      <div className="absolute left-6 top-6 transform -translate-y-1/2 z-10">
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Digvijay-Ovhalkar/AI_Social_Media_Content_Studio_-Like-a-mini-Canva-ChatGPT-.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1 shadow-sm gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Github className="w-5 h-5" />

            <span className="text-base font-semibold text-gray-900 dark:text-white">
              {githubStars}
            </span>
          </a>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="absolute right-6 top-6 transform -translate-y-1/2 z-10">
        <div className="flex items-center gap-2">

          {/* THEME BUTTON */}
          <Button
            className="cursor-pointer"
            variant="outline"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted &&
              (theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              ))}
          </Button>

          {/* SETTINGS DIALOG */}
          <Dialog open={apiKeysOpen} onOpenChange={setApiKeysOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer"
              >
                <Settings2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>

            <DialogContent className="dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle className="dark:text-white">
                  API Keys Configuration
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">

                {/* OPENAI */}
                <div className="space-y-2">
                  <Label
                    htmlFor="openai-key"
                    className="dark:text-gray-200"
                  >
                    OpenAI API Key
                  </Label>

                  <Input
                    id="openai-key"
                    type="password"
                    placeholder="sk-..."
                    value={apiKeys.openai}
                    onChange={(e) =>
                      setApiKeys({
                        ...apiKeys,
                        openai: e.target.value,
                      })
                    }
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />

                  <Label
                    htmlFor="openai-baseurl"
                    className="dark:text-gray-200"
                  >
                    OpenAI Base URL (Optional)
                  </Label>

                  <Input
                    id="openai-baseurl"
                    value={openAIBaseURL}
                    onChange={(e) => setOpenAIBaseURL(e.target.value)}
                    placeholder="https://..."
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                {/* GEMINI */}
                <div className="space-y-2">
                  <Label
                    htmlFor="gemini-key"
                    className="dark:text-gray-200"
                  >
                    Google Gemini API Key
                  </Label>

                  <Input
                    id="gemini-key"
                    type="password"
                    placeholder="AIza..."
                    value={apiKeys.gemini}
                    onChange={(e) =>
                      setApiKeys({
                        ...apiKeys,
                        gemini: e.target.value,
                      })
                    }
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <Button onClick={saveApiKeys} className="w-full">
                  Save API Keys
                </Button>

              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  )
}