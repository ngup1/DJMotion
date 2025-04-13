// utils/audioUtils.ts
import * as Tone from 'tone';

// Initial track list – can be replaced at runtime
let trackList: string[] = [
  '/tracks/track1.mp3',
  '/tracks/track2.mp3',
  '/tracks/track3.mp3'
];

let currentTrackIndex = 0;
let player: Tone.Player | null = null;
let isPlaying = false;

/**
 * Dynamically update the track list (e.g., from Gemini suggestions)
 */
export function setTrackList(tracks: string[]) {
  trackList = tracks;
  currentTrackIndex = 0;
}

/**
 * Load a track by index and prepare it for playback
 */
async function loadTrack(index: number) {
  if (player) {
    player.dispose();
  }

  const url = trackList[index];
  player = new Tone.Player(url).toDestination();
  await Tone.loaded();
}

/**
 * Play the current track (at currentTrackIndex)
 */
export async function playTrack() {
  await Tone.start();
  if (!player) await loadTrack(currentTrackIndex);
  player?.start();
  isPlaying = true;
}

/**
 * Pause playback of the current track
 */
export function pauseTrack() {
  if (player && isPlaying) {
    player.stop();
    isPlaying = false;
  }
}

/**
 * Skip to the next track in the list
 */
export async function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % trackList.length;
  await loadTrack(currentTrackIndex);
  if (isPlaying) player?.start();
}

/**
 * Play a specific track by filename (e.g., "track1.mp3")
 */
export async function playTrackByFilename(filename: string) {
  const index = trackList.findIndex(t => t.includes(filename));
  if (index !== -1) {
    currentTrackIndex = index;
    await loadTrack(currentTrackIndex);
    player?.start();
    isPlaying = true;
  } else {
    console.warn(`Track "${filename}" not found in trackList.`);
  }
}

/**
 * Apply a placeholder crossfade effect (expand with real FX later)
 */
export function applyFX(effect: string) {
  if (!player) return;

  if (effect === 'crossfade') {
    console.log('Crossfade effect triggered');
    player.volume.linearRampTo(-20, 1);
    setTimeout(() => player?.volume.linearRampTo(0, 1), 1000);
  }
  // Additional effects like reverb, echo, filter can go here
}

/**
 * Get the currently playing track name
 */
export function getCurrentTrackName(): string {
  return trackList[currentTrackIndex]?.split('/').pop() || 'Unknown';
}
