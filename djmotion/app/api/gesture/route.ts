// temporary mock API to simulate gesture recognition
// This will be replaced with a real API call to your backend service
import { NextResponse } from 'next/server';

export async function GET() {
  const mockGestures = [
    { gesture: '✋', action: 'pause', confidence: 0.94 },
    { gesture: '👉', action: 'next', confidence: 0.88 },
    { gesture: '👌', action: 'play', confidence: 0.91 },
    { gesture: '✌️', action: 'crossfade', confidence: 0.92 }
  ];

  const result = mockGestures[Math.floor(Math.random() * mockGestures.length)];
  return NextResponse.json(result);
}
