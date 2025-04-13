// utils/midiUtils.ts
import { WebMidi, Output } from "webmidi";

let output: Output | null = null;
let bpm = 120;
let midiEnabled = false;

export async function initMidi(): Promise<void> {
  try {
    await WebMidi.enable();
    console.log("✅ WebMidi enabled");

    if (WebMidi.outputs.length > 0) {
      output = WebMidi.outputs[0];
      console.log("🎹 Using MIDI device:", output.name);
    } else {
      console.warn("⚠️ No MIDI devices found.");
    }
  } catch (err) {
    console.error("❌ WebMidi failed to enable:", err);
  }
}

export function listMidiOutputs(): string[] {
  return WebMidi.outputs.map((o) => o.name);
}

export function setMidiDevice(deviceName: string) {
  const device = WebMidi.outputs.find((d) => d.name === deviceName);
  if (device) {
    output = device;
    console.log("🎛 MIDI device set to:", device.name);
  } else {
    console.warn("⚠️ Device not found:", deviceName);
  }
}

export function setBpm(newBpm: number) {
  bpm = newBpm;
  console.log("🎼 BPM set to:", bpm);
}

export function enableMidi(enabled: boolean) {
  midiEnabled = enabled;
  console.log(enabled ? "✅ MIDI Enabled" : "🛑 MIDI Disabled");
}

export function sendNote(note: number, channel = 1, velocity = 0.8, duration = 300) {
  if (output && midiEnabled) {
    output.playNote(note, channel, { duration, attack: velocity });
    console.log("🎵 Sent note:", note);
  }
}

export function sendCC(controller: number, value: number, channel = 1) {
  if (output && midiEnabled) {
    output.sendControlChange(controller, value, channel);
    console.log("🎚 Sent CC:", controller, value);
  }
}