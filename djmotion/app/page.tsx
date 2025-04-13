"use client"

import { useState, useEffect } from "react"
import { useGesturePolling } from "../app/utils/useGesturesPolling"
import * as audioUtils from "../app/utils/audioUtils"
import * as midiUtils from "../app/utils/midiUtils"
import WebcamView from "../app/components/webcam-view"
import AudioControls from "../app/components/audio-controls"
import TrackDisplay from "../app/components/track-display"
import GestureDisplay from "../app/components/gesture-display"
import AiSuggestions from "../app/components/ai-suggestions"
import DJControls from "../app/components/dj-controls"
import { Button } from "@/app/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [isStarted, setIsStarted] = useState(false)
  const [currentGesture, setCurrentGesture] = useState("")
  const [currentTrack, setCurrentTrack] = useState("")
  const [confidence, setConfidence] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const { toast } = useToast()

  // Update current track display
  useEffect(() => {
    if (isStarted) {
      setCurrentTrack(audioUtils.getCurrentTrackName())
    }
  }, [isStarted, isPlaying])

  // Handle gesture actions
  const handleAction = (action: string) => {
    if (!isStarted) return

    switch (action) {
      case "play":
        audioUtils.playTrack()
        setIsPlaying(true)
        toast({
          title: "Playing track",
          description: audioUtils.getCurrentTrackName(),
        })
        break
      case "pause":
        audioUtils.pauseTrack()
        setIsPlaying(false)
        toast({
          title: "Paused",
          description: "Music playback paused",
        })
        break
      case "next":
        audioUtils.nextTrack()
        setCurrentTrack(audioUtils.getCurrentTrackName())
        toast({
          title: "Next track",
          description: audioUtils.getCurrentTrackName(),
        })
        break
      case "crossfade":
        audioUtils.applyFX("crossfade")
        toast({
          title: "Crossfade",
          description: "Applying crossfade effect",
        })
        break
      default:
        break
    }
  }

  // Initialize gesture polling when app starts
  useGesturePolling({
    onGesture: setCurrentGesture,
    onAction: handleAction,
    onConfidence: setConfidence,
    endpoint: "/api/gesture", // Using mock API for demo
  })

  const handleStart = async () => {
    try {
      // Set mock tracks for demo
      audioUtils.setTrackList([
        "/tracks/electronic-beat.mp3",
        "/tracks/chill-lofi.mp3",
        "/tracks/hype-trap.mp3",
      ])
      setIsStarted(true)
      toast({
        title: "DJ App Started",
        description: "Wave your hand to control the music!",
      })
    } catch (error) {
      console.error("Failed to start app:", error)
      toast({
        title: "Error",
        description: "Failed to start the DJ app",
        variant: "destructive",
      })
    }
  }

  // Handle MIDI settings
  const handleMidiDeviceChange = (device: string) => {
    midiUtils.setMidiDevice(device)
    toast({
      title: "MIDI Device Changed",
      description: `Now using: ${device}`,
    })
  }

  const handleBpmChange = (bpm: number) => {
    midiUtils.setBpm(bpm)
    toast({
      title: "BPM Updated",
      description: `Tempo set to: ${bpm} BPM`,
    })
  }

  const handleChannelChange = (channel: number) => {
    console.log("MIDI channel changed to:", channel)
  }

  const handleSendMidiNotes = (enabled: boolean) => {
    midiUtils.enableMidi(enabled)
    toast({
      title: enabled ? "MIDI Enabled" : "MIDI Disabled",
      description: enabled ? "Now sending MIDI messages" : "MIDI output turned off",
    })
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
                Wave, point, or pinch in front of your webcam to control the music. No equipment needed!
              </p>
              <Button size="lg" onClick={handleStart} className="bg-purple-600 hover:bg-purple-700">
                Start DJing
              </Button>
            </div>
          </div>
        ) : (
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
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium">Gesture Controls</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li className="flex items-center">
                        <span className="mr-2 text-xl">👋</span> Wave to pause/play
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 text-xl">✌️</span> Peace sign to crossfade
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 text-xl">👆</span> Point up for next track
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2 text-xl">👍</span> Thumbs up to increase volume
                      </li>
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="ai" className="rounded-md border border-gray-800 bg-gray-900 p-4">
                  <AiSuggestions
                    onSelectTrack={(track) => {
                      audioUtils.playTrackByFilename(track)
                      setIsPlaying(true)
                      setCurrentTrack(track)
                    }}
                  />
                </TabsContent>
                <TabsContent value="controls" className="p-0">
                  <DJControls 
                    onSelectMidiDevice={handleMidiDeviceChange}
                    onBpmChange={handleBpmChange}
                    onChannelChange={handleChannelChange}
                    onSendMidiNotes={handleSendMidiNotes}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
