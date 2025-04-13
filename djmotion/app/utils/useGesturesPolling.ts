import { useEffect } from 'react';

// Define the expected structure of the backend's JSON response
type GestureResponse = {
  gesture: string;     // Raw or interpreted gesture (e.g., "✌️" or "peace sign")
  action: string;      // What the system believes should be done (e.g., "pause", "play", "crossfade")
  confidence: number;  // AI confidence in the action (0.0 to 1.0)
};

type Props = {
  onGesture: (gesture: string) => void;             // Callback to update the gesture display
  onAction: (action: string) => void;               // Callback to trigger an app action (like play music)
  onConfidence?: (confidence: number) => void;      // Optional: Callback to display AI confidence level
  endpoint?: string;                                // Optional: lets you override the API endpoint (mock or real)
};

/**
 * useGesturePolling
 * -----------------
 * This React hook continuously polls your backend API (default: /api/gesture)
 * every second to retrieve gesture data (gesture, action, confidence).
 *
 * It updates state in your app using callback functions you pass in.
 * You can point it at either your mock API or your real backend.
 */
export function useGesturePolling({
  onGesture,
  onAction,
  onConfidence,
  endpoint = '/api/gesture', // Default is mock API, but can be changed to real (e.g., http://localhost:5000/gesture)
}: Props) {
  useEffect(() => {
    // Set up interval to call the backend API every 1 second
    const interval = setInterval(async () => {
      try {
        // Fetch gesture data from the backend
        const res = await fetch(endpoint);
        const data: GestureResponse = await res.json();

        // Update app state with the new gesture
        if (data.gesture) {
          onGesture(data.gesture);
        }

        // Trigger the corresponding action (e.g., pause, play, next)
        if (data.action) {
          onAction(data.action);
        }

        // Optionally update the confidence level (for display/logging)
        if (onConfidence && typeof data.confidence === 'number') {
          onConfidence(data.confidence);
        }

      } catch (err) {
        // Log any errors that happen while polling
        console.error('[useGesturePolling] Failed to fetch gesture data:', err);
      }
    }, 1000); // Run every 1000ms (1 second)

    // Cleanup: stop polling when the component unmounts or deps change
    return () => clearInterval(interval);
  }, [onGesture, onAction, onConfidence, endpoint]);
}
