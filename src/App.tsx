import { useState } from 'react'
import './App.css'

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
    <div className="app">
      <div className="container">
        <h1>Night Sky Poetry</h1>
        <div className="input-section">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here..."
            className="text-input"
            rows={6}
          />
          <button onClick={handleGenerate} className="generate-button">
            Generate
          </button>
        </div>
        <div className="generated-texts">
          {generatedTexts.map((generatedText, index) => (
            <div key={index} className="generated-text">
              {generatedText}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App