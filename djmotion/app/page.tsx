"use client"

import { useState, useEffect } from "react"
import WebcamView from "../app/components/webcam-view"
import AudioControls from "../app/components/audio-controls"
import TrackDisplay from "../app/components/track-display"
import GestureDisplay from "../app/components/gesture-display"
import AiSuggestions from "../app/components/ai-suggestions"
import DJControls from "../app/components/dj-controls"
import GestureMidiEngine from "../app/components/gesture-midi-engine"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import * as audioUtils from "../app/utils/audioUtils"

export default function Home() {
  const [isStarted, setIsStarted] = useState(false)
  const [currentGesture, setCurrentGesture] = useState("")
  const [currentTrack, setCurrentTrack] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isStarted) {
      setCurrentTrack(audioUtils.getCurrentTrackName())
    }
  }, [isStarted, isPlaying])

  const handleAction = (action: string) => {
    if (!isStarted) return

    switch (action) {
      case "play":
        audioUtils.playTrack()
        setIsPlaying(true)
        toast({ title: "Playing track", description: audioUtils.getCurrentTrackName() })
        break
      case "pause":
        audioUtils.pauseTrack()
        setIsPlaying(false)
        toast({ title: "Paused", description: "Music playback paused" })
        break
      case "next":
        audioUtils.nextTrack()
        setCurrentTrack(audioUtils.getCurrentTrackName())
        toast({ title: "Next track", description: audioUtils.getCurrentTrackName() })
        break
      case "crossfade":
        audioUtils.applyFX("crossfade")
        toast({ title: "Crossfade", description: "Applying crossfade effect" })
        break
      default:
        break
    }
  }



  const handleStart = () => {
    audioUtils.setTrackList([
      "/tracks/electronic-beat.mp3",
      "/tracks/chill-lofi.mp3",
      "/tracks/hype-trap.mp3"
    ])
    setIsStarted(true)
    toast({ title: "DJ App Started", description: "Wave your hand to control the music!" })
  }

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight">
            <span className="text-purple-400">DJ</span>Motion
          </h1>
          <p className="text-gray-400">Control your music with hand gestures</p>
        </header>

        {!isStarted ? (
          <div className="flex flex-col items-center justify-center space-y-6 py-20">
            <div className="max-w-md text-center">
              <h2 className="mb-4 text-2xl font-bold">Ready to become a gesture DJ?</h2>
              <p className="mb-6 text-gray-400">
                Wave, point, or pinch in front of your webcam to control the music.
              </p>
              <Button size="lg" onClick={handleStart} className="bg-purple-600 hover:bg-purple-700">
                Start DJing
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="flex flex-col space-y-6">
                <WebcamView />
                <GestureDisplay gesture={currentGesture} confidence={confidence} />
              </div>

              <div className="flex flex-col space-y-6">
                <TrackDisplay currentTrack={currentTrack} isPlaying={isPlaying} />
                <AudioControls
                  isPlaying={isPlaying}
                  onPlay={() => handleAction("play")}
                  onPause={() => handleAction("pause")}
                  onNext={() => handleAction("next")}
                  onCrossfade={() => handleAction("crossfade")}
                />

                <Tabs defaultValue="gestures" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="gestures">Gesture Guide</TabsTrigger>
                    <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
                    <TabsTrigger value="controls">MIDI Controls</TabsTrigger>
                  </TabsList>

                  <TabsContent value="gestures" className="rounded-md border border-gray-800 bg-gray-900 p-4">
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>👋 Wave to pause/play</li>
                      <li>✌️ Peace sign to crossfade</li>
                      <li>👆 Point up for next track</li>
                      <li>👍 Thumbs up to increase volume</li>
                    </ul>
                  </TabsContent>

                  <TabsContent value="ai" className="rounded-md border border-gray-800 bg-gray-900 p-4">
                    <AiSuggestions
                      onSelectTrack={(track) => {
                        audioUtils.playTrackByFilename(track)
                        setCurrentTrack(track)
                        setIsPlaying(true)
                      }}
                    />
                  </TabsContent>

                  <TabsContent value="controls" className="p-0">
                    <DJControls />
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Mount gesture tracking engine */}
            <GestureMidiEngine />
          </>
        )}
      </div>
    </main>
  )
}
