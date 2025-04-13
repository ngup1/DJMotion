"use client"

import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Play, Pause, SkipForward, Waves } from "lucide-react"

interface AudioControlsProps {
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  onNext: () => void
  onCrossfade: () => void
}

export default function AudioControls({ isPlaying, onPlay, onPause, onNext, onCrossfade }: AudioControlsProps) {
  return (
    <Card className="border-gray-800 bg-gray-950">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-medium">Controls</h3>

          <div className="flex justify-between gap-2">
            <Button
              variant="outline"
              className="flex-1 border-gray-700 bg-gray-800 hover:bg-gray-700"
              onClick={isPlaying ? onPause : onPlay}
            >
              {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
              {isPlaying ? "Pause" : "Play"}
            </Button>

            <Button variant="outline" className="flex-1 border-gray-700 bg-gray-800 hover:bg-gray-700" onClick={onNext}>
              <SkipForward className="mr-2 h-4 w-4" />
              Next
            </Button>
          </div>

          <Button
            variant="outline"
            className="border-purple-900/50 bg-purple-950/50 hover:bg-purple-900/50"
            onClick={onCrossfade}
          >
            <Waves className="mr-2 h-4 w-4" />
            Crossfade
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
