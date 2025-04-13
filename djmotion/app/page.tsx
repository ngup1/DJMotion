"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  playTrack,
  pauseTrack,
  nextTrack,
  applyFX,
  playTrackByFilename,
  setTrackList,
  getCurrentTrackName
} from './utils/audioUtils';
import { useGesturePolling } from './utils/useGesturesPolling';

export default function Home() {
  const [gesture, setGesture] = useState('');
  const [action, setAction] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [trackName, setTrackName] = useState('');

  // Poll mock or real backend every 1s
  useGesturePolling({
    onGesture: setGesture,
    onAction: (newAction: string) => {
      setAction(newAction);
      // Trigger music based on gesture action
      if (newAction === 'play') playTrack();
      if (newAction === 'pause') pauseTrack();
      if (newAction === 'next') nextTrack();
      if (newAction === 'crossfade') applyFX('crossfade');
    },
    onConfidence: setConfidence,
    // Optional: swap to real backend
    // endpoint: 'http://localhost:5000/gesture'
  });

  useEffect(() => {
    setTrackName(getCurrentTrackName());
  }, []);
  

  return (
    <>
      <Head>
        <title>Air DJ</title>
        <meta name="description" content="Gesture-controlled DJ app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-mono p-8">
        <h1 className="text-3xl font-bold mb-6">🖐️ Air DJ</h1>

        {/* Display Gesture Info */}
        <div className="text-xl mb-2">Gesture: {gesture || 'None'}</div>
        <div className="text-lg mb-2">Action: {action || 'Waiting'}</div>
        <div className="text-md mb-6 text-gray-400">
          Confidence: {(confidence * 100).toFixed(0)}%
        </div>

        {/* Now Playing */}
        <div className="text-lg mb-4">
          Now Playing: <span className="text-green-400">{getCurrentTrackName()}</span>
        </div>

        {/* Manual Audio Controls (Dev/Test) */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button onClick={playTrack} className="bg-green-600 px-4 py-2 rounded">▶️ Play</button>
          <button onClick={pauseTrack} className="bg-yellow-600 px-4 py-2 rounded">⏸️ Pause</button>
          <button onClick={nextTrack} className="bg-blue-600 px-4 py-2 rounded">⏭️ Next</button>
          <button onClick={() => playTrackByFilename('track2.mp3')} className="bg-purple-600 px-4 py-2 rounded">🎯 Play Track 2</button>
          <button
            onClick={() => {
              setTrackList(['/tracks/hype.mp3', '/tracks/chill.mp3']);
              playTrackByFilename('hype.mp3');
            }}
            className="bg-pink-600 px-4 py-2 rounded"
          >
            🔀 Load Gemini Playlist
          </button>
        </div>

        <p>Now Playing: <span className="text-green-400">{trackName || 'None'}</span></p>
      </main>
    </>
  );
}
