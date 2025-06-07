import { useState } from 'react'

function App() {
  const [text, setText] = useState('')
  const [generatedTexts, setGeneratedTexts] = useState<string[]>([])

  const handleGenerate = () => {
    if (text.trim()) {
      setGeneratedTexts([...generatedTexts, text])
      setText('')
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-8 bg-black">
      <div className="w-full max-w-2xl flex flex-col gap-8 items-center">
        <h1 className="text-white text-4xl font-semibold text-center mb-4">
          Night Sky Poetry
        </h1>
        <div className="w-full flex flex-col gap-4 items-center">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-white text-base resize-y min-h-[120px] placeholder-zinc-600 focus:outline-none focus:border-zinc-600"
            rows={6}
          />
          <button 
            onClick={handleGenerate} 
            className="px-8 py-3 bg-blue-500 text-white border-none rounded-lg text-base font-medium cursor-pointer hover:bg-blue-600 active:bg-blue-700 transition-colors"
          >
            Generate
          </button>
        </div>
        <div className="w-full flex flex-col gap-4">
          {generatedTexts.map((generatedText, index) => (
            <div 
              key={index} 
              className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg text-white leading-relaxed whitespace-pre-wrap"
            >
              {generatedText}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App