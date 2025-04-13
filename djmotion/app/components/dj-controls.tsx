"use client"

import { useState } from "react"
import { Card, CardContent } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Sliders, Music2, Hand, ChevronDown, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface DJControlsProps {
  onSendMidiNotes?: (enabled: boolean) => void
  onBpmChange?: (bpm: number) => void
  onChannelChange?: (channel: number) => void
  onSelectMidiDevice?: (device: string) => void
}

export default function DJControls({
  onSendMidiNotes,
  onBpmChange,
  onChannelChange,
  onSelectMidiDevice,
}: DJControlsProps) {
  const [showControls, setShowControls] = useState(true)
  const [selfieView, setSelfieView] = useState(true)
  const [showTracking, setShowTracking] = useState(true)
  const [fps, setFps] = useState(18)
  const [selectedMidiDevice, setSelectedMidiDevice] = useState("IAC Driver Bus 1")
  const [sendMidiNotes, setSendMidiNotes] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [channel, setChannel] = useState(1)
  const [notePitch, setNotePitch] = useState("---")
  const [noteVelocity, setNoteVelocity] = useState("---")
  const [pitchBend, setPitchBend] = useState("---")
  const [aftertouch, setAftertouch] = useState("---")
  const [continuousControls, setContinuousControls] = useState([
    { channel: 1, cc: 1, value: "---" },
    { channel: 2, cc: 2, value: "---" },
    { channel: 3, cc: 3, value: "---" },
    { channel: 4, cc: 4, value: "---" },
  ])
  const [gestureRecognition, setGestureRecognition] = useState(false)
  const [gestureChannels, setGestureChannels] = useState([
    { channel: "", midiNote: 60 },
    { channel: "", midiNote: 60 },
    { channel: "", midiNote: 60 },
  ])

  const handleBpmChange = (value: number) => {
    setBpm(value)
    if (onBpmChange) onBpmChange(value)
  }

  const handleChannelChange = (value: number) => {
    setChannel(value)
    if (onChannelChange) onChannelChange(value)
  }

  const handleMidiDeviceChange = (device: string) => {
    setSelectedMidiDevice(device)
    if (onSelectMidiDevice) onSelectMidiDevice(device)
  }

  const handleSendMidiNotesChange = (enabled: boolean) => {
    setSendMidiNotes(enabled)
    if (onSendMidiNotes) onSendMidiNotes(enabled)
  }

  const updateContinuousControl = (index: number, field: 'channel' | 'cc' | 'value', value: any) => {
    const updatedControls = [...continuousControls]
    updatedControls[index] = { ...updatedControls[index], [field]: value }
    setContinuousControls(updatedControls)
  }

  const updateGestureChannel = (index: number, field: 'channel' | 'midiNote', value: any) => {
    const updatedChannels = [...gestureChannels]
    updatedChannels[index] = { ...updatedChannels[index], [field]: value }
    setGestureChannels(updatedChannels)
  }

  const renderInfoIcon = () => (
    <Info className="h-4 w-4 text-gray-500 cursor-help" />
  )

  return (
    <Card className="border-gray-800 bg-gray-950">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-gray-800 hover:bg-gray-700"
              onClick={() => setShowControls(!showControls)}
            >
              {showControls ? "Hide controls" : "Show controls"}
            </Button>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-400">Selfie view</label>
                <input 
                  type="checkbox" 
                  checked={selfieView} 
                  onChange={() => setSelfieView(!selfieView)}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-800"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-400">Show tracking</label>
                <input 
                  type="checkbox" 
                  checked={showTracking} 
                  onChange={() => setShowTracking(!showTracking)}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-800"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-400">Fps</label>
                <input 
                  type="number" 
                  value={fps} 
                  onChange={(e) => setFps(parseInt(e.target.value) || 0)}
                  className="h-7 w-12 rounded border-gray-700 bg-gray-800 text-center text-sm"
                />
              </div>
            </div>
          </div>

          {showControls && (
            <div className="space-y-4 mt-2">
              <div className="flex flex-col space-y-4">
                {/* MIDI device selector */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4">
                  <label className="text-sm text-gray-400 w-32">MIDI out device</label>
                  <div className="relative flex-1">
                    <select
                      value={selectedMidiDevice}
                      onChange={(e) => handleMidiDeviceChange(e.target.value)}
                      className="w-full h-9 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm appearance-none"
                    >
                      <option value="IAC Driver Bus 1">IAC Driver Bus 1</option>
                      <option value="Midi Device 2">Midi Device 2</option>
                      <option value="Midi Device 3">Midi Device 3</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Send MIDI notes toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-400">Send midi notes</label>
                    {renderInfoIcon()}
                  </div>
                  <input 
                    type="checkbox" 
                    checked={sendMidiNotes} 
                    onChange={() => handleSendMidiNotesChange(!sendMidiNotes)}
                    className="h-4 w-4 rounded border-gray-600 bg-gray-800"
                  />
                </div>

                {/* BPM Slider */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4">
                  <label className="text-sm text-gray-400 w-12">BPM</label>
                  <div className="flex-1 flex items-center space-x-3">
                    <div className="flex-1">
                      <input 
                        type="range" 
                        min="60" 
                        max="200" 
                        value={bpm} 
                        onChange={(e) => handleBpmChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-purple-900/30 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <span className="text-sm text-gray-300 w-8 text-right">{bpm}</span>
                  </div>
                </div>

                {/* Channel input */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-400">Channel:</label>
                    {renderInfoIcon()}
                  </div>
                  <Input
                    type="number"
                    value={channel}
                    onChange={(e) => handleChannelChange(parseInt(e.target.value) || 1)}
                    className="w-16 h-8 border-gray-700 bg-gray-800 text-center text-sm"
                    min="1" 
                    max="16"
                  />
                </div>

                {/* Note pitch and velocity selectors */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4">
                  <div className="flex items-center space-x-2 w-32">
                    <label className="text-sm text-gray-400">Note pitch</label>
                    {renderInfoIcon()}
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={notePitch}
                      onChange={(e) => setNotePitch(e.target.value)}
                      className="w-full h-8 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm appearance-none"
                    >
                      <option value="---">---</option>
                      <option value="C3">C3</option>
                      <option value="D3">D3</option>
                      <option value="E3">E3</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4">
                  <div className="flex items-center space-x-2 w-32">
                    <label className="text-sm text-gray-400">Note velocity</label>
                    {renderInfoIcon()}
                  </div>
                  <div className="relative flex-1">
                    <select
                      value={noteVelocity}
                      onChange={(e) => setNoteVelocity(e.target.value)}
                      className="w-full h-8 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm appearance-none"
                    >
                      <option value="---">---</option>
                      <option value="64">64</option>
                      <option value="100">100</option>
                      <option value="127">127</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Continuous controls section */}
                <div className="pt-2 border-t border-gray-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-sm font-medium">Continuous controls</h3>
                    {renderInfoIcon()}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4">
                      <label className="text-sm text-gray-400 w-24">Pitchbend</label>
                      <div className="relative flex-1">
                        <select
                          value={pitchBend}
                          onChange={(e) => setPitchBend(e.target.value)}
                          className="w-full h-8 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm appearance-none"
                        >
                          <option value="---">---</option>
                          <option value="pitch-up">pitch-up</option>
                          <option value="pitch-down">pitch-down</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-4">
                      <label className="text-sm text-gray-400 w-24">Aftertouch</label>
                      <div className="relative flex-1">
                        <select
                          value={aftertouch}
                          onChange={(e) => setAftertouch(e.target.value)}
                          className="w-full h-8 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm appearance-none"
                        >
                          <option value="---">---</option>
                          <option value="pressure">pressure</option>
                          <option value="vibrato">vibrato</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    {/* CC controls */}
                    {continuousControls.map((control, index) => (
                      <div key={index} className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center space-x-1">
                          <label className="text-sm text-gray-400">Chan:</label>
                          {renderInfoIcon()}
                        </div>
                        <Input
                          type="number"
                          value={control.channel}
                          onChange={(e) => updateContinuousControl(index, 'channel', parseInt(e.target.value) || '')}
                          className="w-12 h-8 border-gray-700 bg-gray-800 text-center text-sm"
                        />
                        
                        <div className="flex items-center space-x-1">
                          <label className="text-sm text-gray-400">CC:</label>
                          {renderInfoIcon()}
                        </div>
                        <Input
                          type="number"
                          value={control.cc}
                          onChange={(e) => updateContinuousControl(index, 'cc', parseInt(e.target.value) || '')}
                          className="w-12 h-8 border-gray-700 bg-gray-800 text-center text-sm"
                        />
                        
                        <div className="relative flex-1 min-w-[120px]">
                          <select
                            value={control.value}
                            onChange={(e) => updateContinuousControl(index, 'value', e.target.value)}
                            className="w-full h-8 rounded-md border border-gray-700 bg-gray-800 px-3 py-1 text-sm appearance-none"
                          >
                            <option value="---">---</option>
                            <option value="modulation">modulation</option>
                            <option value="expression">expression</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gesture Recognition */}
                <div className="pt-2 border-t border-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-medium">Gesture Recognition</h3>
                      {renderInfoIcon()}
                    </div>
                    <input 
                      type="checkbox" 
                      checked={gestureRecognition} 
                      onChange={() => setGestureRecognition(!gestureRecognition)}
                      className="h-4 w-4 rounded border-gray-600 bg-gray-800"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    {/* Gesture channels with emoji indicators */}
                    {gestureChannels.map((item, index) => (
                      <div key={index} className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center space-x-1">
                          <label className="text-sm text-gray-400">Channel:</label>
                          {renderInfoIcon()}
                        </div>
                        <Input
                          type="text"
                          value={item.channel}
                          onChange={(e) => updateGestureChannel(index, 'channel', e.target.value)}
                          className="w-16 h-8 border-gray-700 bg-gray-800 text-center text-sm"
                        />
                        
                        <div className="flex items-center space-x-1">
                          <label className="text-sm text-gray-400">Midi note:</label>
                          {renderInfoIcon()}
                        </div>
                        <Input
                          type="number"
                          value={item.midiNote}
                          onChange={(e) => updateGestureChannel(index, 'midiNote', parseInt(e.target.value) || 60)}
                          className="w-16 h-8 border-gray-700 bg-gray-800 text-center text-sm"
                          min="0"
                          max="127"
                        />
                        
                        {/* Emoji indicators */}
                        <div className="text-xl sm:text-2xl ml-1 flex-shrink-0">
                          {index === 0 ? "👉" : index === 1 ? "👍" : "✌️"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 