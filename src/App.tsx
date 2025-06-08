import { useState } from 'react'
import type { ViewState, NightSkyData } from './types'
import { defaultText } from './constants'
import { generateNightSkyFromText } from './utils'
import { InputForm, GeneratingView, ResultsView } from './components'

function App() {
  const [viewState, setViewState] = useState<ViewState>('input')
  const [inputText, setInputText] = useState(defaultText)
  const [nightSky, setNightSky] = useState<NightSkyData | null>(null)
  const [selectedParagraph, setSelectedParagraph] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!inputText.trim()) return
    
    setViewState('generating')
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate single night sky from text
    const generatedNightSky = generateNightSkyFromText(inputText)
    setNightSky(generatedNightSky)
    setViewState('results')
  }

  const handleReset = () => {
    setViewState('input')
    setInputText(defaultText)
    setNightSky(null)
    setSelectedParagraph(null)
  }

  const handleParagraphClick = (paragraphIndex: number) => {
    if (selectedParagraph === paragraphIndex) {
      // If clicking the already selected paragraph, deselect it
      setSelectedParagraph(null)
    } else {
      // Otherwise, select this paragraph
      setSelectedParagraph(paragraphIndex)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white overflow-x-auto">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {viewState === 'input' && (
          <InputForm 
            inputText={inputText}
            setInputText={setInputText}
            onGenerate={handleGenerate}
          />
        )}
        
        {viewState === 'generating' && (
          <GeneratingView />
        )}
        
        {viewState === 'results' && nightSky && (
          <ResultsView 
            nightSky={nightSky}
            selectedParagraph={selectedParagraph}
            onReset={handleReset}
            onParagraphClick={handleParagraphClick}
          />
        )}
      </div>
    </div>
  )
}

export default App