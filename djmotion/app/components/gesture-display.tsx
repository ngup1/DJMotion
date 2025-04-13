import { Card, CardContent } from "@/app/components/ui/card"
import { Progress } from "@/app/components/ui/progress"
import { Hand } from "lucide-react"

interface GestureDisplayProps {
  gesture: string
  confidence: number
}

export default function GestureDisplay({ gesture, confidence }: GestureDisplayProps) {
  return (
    <Card className="border-gray-800 bg-gray-950">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Detected Gesture</h3>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-900/30">
              <Hand className="h-4 w-4 text-purple-400" />
            </div>
          </div>

          <div className="flex h-16 items-center justify-center rounded-md border border-gray-800 bg-gray-900">
            <span className="text-3xl">{gesture || "👋"}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Confidence</span>
              <span>{Math.round(confidence * 100)}%</span>
            </div>
            <Progress value={confidence * 100} className="h-2 bg-gray-800" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
