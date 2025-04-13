import * as Tone from 'tone';

interface MidiNote {
  note: number;
  velocity: number;
  channel: number;
}

interface ContinuousControl {
  channel: number;
  cc: number;
  value: number | string;
}

let midiDeviceName = "IAC Driver Bus 1";
let currentBpm = 120;
let isEnabled = false;

/**
 * Set the MIDI output device
 */
export function setMidiDevice(deviceName: string) {
  midiDeviceName = deviceName;
  console.log(`MIDI device set to: ${deviceName}`);
  return true;
}

/**
 * Enable or disable MIDI output
 */
export function enableMidi(enabled: boolean) {
  isEnabled = enabled;
  console.log(`MIDI output ${enabled ? 'enabled' : 'disabled'}`);
  return true;
}

/**
 * Set the BPM for MIDI timing
 */
export function setBpm(bpm: number) {
  currentBpm = bpm;
  Tone.Transport.bpm.value = bpm;
  console.log(`BPM set to: ${bpm}`);
  return true;
}

/**
 * Send a MIDI note
 */
export function sendMidiNote({ note, velocity, channel }: MidiNote) {
  if (!isEnabled) return false;
  
  console.log(`Sending MIDI note: ${note} with velocity ${velocity} on channel ${channel}`);
  // In a real implementation, this would send the MIDI note to the selected output device
  // This is a placeholder for demonstration purposes
  
  return true;
}

/**
 * Send a continuous controller message
 */
export function sendCC({ channel, cc, value }: ContinuousControl) {
  if (!isEnabled) return false;
  
  // Convert string controls to appropriate CC values
  let ccValue = 0;
  if (typeof value === 'string') {
    switch (value) {
      case 'modulation':
        ccValue = 64; // middle value
        break;
      case 'expression':
        ccValue = 100; // high expression
        break;
      default:
        ccValue = 0; // default value
    }
  } else {
    ccValue = value;
  }
  
  console.log(`Sending CC: ${cc} with value ${ccValue} on channel ${channel}`);
  // In a real implementation, this would send the CC message to the selected output device
  
  return true;
}

/**
 * Send a pitch bend message
 */
export function sendPitchBend(channel: number, value: string | number) {
  if (!isEnabled) return false;
  
  // Convert string pitch bend directions to appropriate values
  let pitchValue = 0;
  if (typeof value === 'string') {
    switch (value) {
      case 'pitch-up':
        pitchValue = 8192 + 4096; // 75% up
        break;
      case 'pitch-down':
        pitchValue = 8192 - 4096; // 75% down
        break;
      default:
        pitchValue = 8192; // center (no bend)
    }
  } else {
    pitchValue = value;
  }
  
  console.log(`Sending pitch bend: ${pitchValue} on channel ${channel}`);
  // In a real implementation, this would send the pitch bend message to the selected output device
  
  return true;
}

/**
 * Send an aftertouch message
 */
export function sendAftertouch(channel: number, value: string | number) {
  if (!isEnabled) return false;
  
  // Convert string aftertouch types to appropriate values
  let afterValue = 0;
  if (typeof value === 'string') {
    switch (value) {
      case 'pressure':
        afterValue = 100; // high pressure
        break;
      case 'vibrato':
        afterValue = 64; // medium vibrato
        break;
      default:
        afterValue = 0; // no aftertouch
    }
  } else {
    afterValue = value;
  }
  
  console.log(`Sending aftertouch: ${afterValue} on channel ${channel}`);
  // In a real implementation, this would send the aftertouch message to the selected output device
  
  return true;
}

/**
 * Process a recognized gesture and convert it to MIDI
 */
export function gestureToMidi(gesture: string, midiNote: number, channel: number) {
  if (!isEnabled) return false;
  
  console.log(`Converting gesture "${gesture}" to MIDI note ${midiNote} on channel ${channel}`);
  
  // Send a note on message
  sendMidiNote({ note: midiNote, velocity: 100, channel });
  
  // After a short delay, send a note off message
  setTimeout(() => {
    sendMidiNote({ note: midiNote, velocity: 0, channel });
  }, 300);
  
  return true;
}

/**
 * Get current MIDI status
 */
export function getMidiStatus() {
  return {
    device: midiDeviceName,
    bpm: currentBpm,
    enabled: isEnabled
  };
} 