"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Sparkles, Music } from "lucide-react"

interface AiSuggestionsProps {
  onSelectTrack: (track: string) => void
}

// Mock suggestions that would come from Gemini AI
const moodSuggestions = [
  { mood: "chill", track: "chill-lofi.mp3" },
  { mood: "hype", track: "hype-trap.mp3" },
  { mood: "focus", track: "electronic-beat.mp3" },
  { mood: "party", track: "hype-trap.mp3" },
  { mood: "relax", track: "chill-lofi.mp3" },
]

export default function AiSuggestions({ onSelectTrack }: AiSuggestionsProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<{ mood: string; track: string }[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsLoading(true)

    // Simulate AI processing
    setTimeout(() => {
      // Filter suggestions based on input
      const filtered = moodSuggestions.filter((s) => s.mood.toLowerCase().includes(input.toLowerCase()))

      setSuggestions(filtered.length ? filtered : [moodSuggestions[0]])
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">AI Track Suggestions</h3>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tell me a mood (e.g., 'chill')"
          className="border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
        />
        <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
          <Sparkles className="mr-2 h-4 w-4" />
          {isLoading ? "Thinking..." : "Suggest"}
        </Button>
      </form>

      {suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Here are some tracks that match your mood:</p>
          <div className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start border-gray-700 bg-gray-800 hover:bg-gray-700"
                onClick={() => onSelectTrack(suggestion.track)}
              >
                <Music className="mr-2 h-4 w-4" />
                <span className="mr-2 font-medium">{suggestion.mood}:</span>
                <span className="text-gray-400">{suggestion.track}</span>
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
