import type { NextApiRequest, NextApiResponse } from 'next';


//might not be needed as backend will do gesture detection
// takes json response from Gemini and returns it to the frontend
// This is a mock API route for testing purposes. In a real-world scenario, you would replace this with actual API calls to your backend or third-party service.    
// Expected format of the gesture response
type GestureResponse = {
  gesture: string;     // The raw gesture ("✋", "👉", etc.) or label ("peace sign")
  action: string;      // What the AI interpreted it as ("pause", "next", etc.)
  confidence: number;  // Confidence score from Gemini or your model
};

// ✅ MOCK gesture list (used for local frontend development)
const mockGestures: GestureResponse[] = [
  { gesture: '✋', action: 'pause', confidence: 0.94 },
  { gesture: '👉', action: 'next', confidence: 0.88 },
  { gesture: '👌', action: 'play', confidence: 0.91 },
  { gesture: '✌️', action: 'crossfade', confidence: 0.92 },
  { gesture: '🤟', action: 'loop', confidence: 0.87 }
];

// Optional: rotate through mock gestures for testing
let index = 0;

/**
 * Remove the mock list

Uncomment the fetch block

Replace 'http://localhost:5000/gesture' with your actual backend URL
 * @route GET /api/gesture
 * @desc  Returns mock gesture + action data for frontend testing
 * @note  Replace this with a fetch() call to your real backend when it's ready
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GestureResponse>
) {
  // ✅ Mock response (pretend we just got a live result from Gemini)
  const result = mockGestures[index];

  // Rotate to simulate dynamic changes
  index = (index + 1) % mockGestures.length;

  // ✅ Respond with gesture, action, and confidence
  res.status(200).json(result);

  // ----------------------------------------------------------
  // 🧠 REAL BACKEND INTEGRATION (when ready):
  // Instead of using mockGestures, you can:
  // const realRes = await fetch('http://localhost:5000/gesture');
  // const realData = await realRes.json();
  // res.status(200).json(realData);
  // ----------------------------------------------------------
}
