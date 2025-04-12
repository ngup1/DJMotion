export default function Home() {
    return (
      <>
        <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-black text-white font-mono">
          <h1 className="text-3xl font-bold mb-4">🎧 Air DJ</h1>
  
          {/* Webcam Feed Placeholder */}
          <div className="mb-4 bg-gray-800 w-full max-w-md h-64 flex items-center justify-center">
            <span className="text-gray-400">Webcam Feed Here</span>
          </div>
  
          {/* Gesture Display Placeholder */}
          <div className="text-lg mb-2">Gesture: ✋</div>
  
          {/* Track Info Placeholder */}
          <div className="text-sm text-gray-400 mb-4">Now Playing: Loading...</div>
  
          {/* Controls Placeholder */}
          <div className="flex gap-2 mb-4">
            <button className="bg-green-600 px-4 py-2">▶️ Play</button>
            <button className="bg-yellow-600 px-4 py-2">⏭️ Next</button>
            <button className="bg-red-600 px-4 py-2">⏹️ Stop</button>
          </div>
  
          {/* Gemini Prompt Placeholder */}
          <div className="w-full max-w-md">
            <input
              className="p-2 bg-gray-700 text-white w-full"
              type="text"
              placeholder="Enter vibe (e.g. hype up a party)"
            />
            <button className="bg-blue-600 px-4 py-2 mt-2 w-full">Ask Gemini</button>
          </div>
        </main>
      </>
    );
  }
  