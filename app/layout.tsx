import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Open Content Generator",
  description:
    "Generate AI-powered content for LinkedIn, Reddit, and X (Twitter)",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${inter.className}
          min-h-screen
          bg-background
          text-foreground
          antialiased
          transition-colors duration-300
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* APP */}
          <div className="min-h-screen bg-background text-foreground">
            {children}
          </div>

          {/* GLOBAL UTILITIES */}
          <Analytics />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}