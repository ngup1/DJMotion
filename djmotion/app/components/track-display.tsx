import { Card, CardContent } from "@/app/components/ui/card"
import { Music } from "lucide-react"

interface TrackDisplayProps {
  currentTrack: string
  isPlaying: boolean
}

export default function TrackDisplay({ currentTrack, isPlaying }: TrackDisplayProps) {
  return (
    <Card className="border-gray-800 bg-gray-950">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-md bg-purple-900/30">
              <Music className="h-8 w-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium">{currentTrack || "No track selected"}</h3>
              <p className="text-sm text-gray-400">{isPlaying ? "Now Playing" : "Ready to play"}</p>
            </div>
          </div>

          {isPlaying && (
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 w-1 animate-pulse rounded-full bg-purple-500"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: "0.8s",
                  }}
                ></div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
