import nlp from 'compromise'
import type { NightSkyData } from '../types'
import { NightSky } from './NightSky'
import { Legend } from './Legend'
import { classifyPartOfSpeech } from '../utils/nlp'
import { POS_COLORS, POS_SHAPES } from '../constants'

function GrammaticalBreakdown({ paragraph }: { paragraph: string }) {
  // Analyze the paragraph using NLP
  const doc = nlp(paragraph)
  const words = doc.terms().out('array')
  const terms = doc.terms()

  const wordAnalysis = words.map((word, index) => {
    if (word.trim().length === 0) return null
    
    const term = terms.eq(index)
    const pos = classifyPartOfSpeech(term)
    const color = POS_COLORS[pos]
    const shape = POS_SHAPES[pos]
    
    return {
      word: word.trim(),
      pos,
      color,
      shape,
      length: word.trim().length
    }
  }).filter(Boolean)

  return (
    <div className="mt-6 p-4 bg-gray-800 bg-opacity-30 rounded-lg border border-gray-600">
      <h4 className="text-sm font-semibold text-gray-300 mb-4">Grammatical Breakdown:</h4>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {wordAnalysis.map((analysis, index) => (
          <div key={index} className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {/* Visual representation */}
              <div className="flex-shrink-0">
                {analysis.shape === 'star' ? (
                  <svg width="12" height="12" viewBox="0 0 12 12">
                    <polygon
                      points="6,1 7.5,4.5 11,4.5 8.25,7 9.75,10.5 6,8.5 2.25,10.5 3.75,7 1,4.5 4.5,4.5"
                      fill={analysis.color}
                    />
                  </svg>
                ) : (
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: analysis.color }}
                  />
                )}
              </div>
              
              {/* Word info */}
              <span className="font-mono text-white min-w-0 truncate">"{analysis.word}"</span>
              <span className="text-gray-400">→</span>
              <span 
                className="font-semibold px-2 py-1 rounded text-xs"
                style={{ 
                  backgroundColor: `${analysis.color}20`,
                  color: analysis.color,
                  border: `1px solid ${analysis.color}40`
                }}
              >
                {analysis.pos}
              </span>
            </div>
            
            {/* Additional info */}
            <div className="flex items-center gap-2 text-gray-500 flex-shrink-0">
              <span>{analysis.length} chars</span>
              <span>•</span>
              <span>{analysis.shape}</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Summary */}
      <div className="mt-4 pt-3 border-t border-gray-600">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-gray-400">Total words:</span>
          <span className="text-white font-semibold">{wordAnalysis.length}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-400">Path length:</span>
          <span className="text-white font-semibold">
            {wordAnalysis.reduce((sum, w) => sum + (w.length * 1.5), 0).toFixed(1)} units
          </span>
        </div>
      </div>
    </div>
  )
}

interface ResultsViewProps {
  nightSky: NightSkyData
  selectedParagraph: number | null
  onReset: () => void
  onParagraphClick: (index: number) => void
}

export function ResultsView({ 
  nightSky, 
  selectedParagraph, 
  onReset, 
  onParagraphClick 
}: ResultsViewProps) {
  return (
    <div>
      {/* Header with title and reset button */}
      <div className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-2 tracking-wide">
          Night Sky Poetry
        </h1>
        <p className="text-base md:text-lg lg:text-xl font-serif italic text-gray-300 mb-6">
          Your text transformed into constellations
        </p>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-950"
        >
          Create New
        </button>
      </div>

      {/* Single Night Sky with all constellations */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-8">
          <NightSky data={nightSky} selectedParagraph={selectedParagraph} size="large" />
        </div>
        
        {/* Status text */}
        <p className="text-sm text-gray-400 mb-8">
          {selectedParagraph !== null 
            ? `Showing constellation ${selectedParagraph + 1} of ${nightSky.paragraphs.length}`
            : `${nightSky.paragraphs.length} constellation${nightSky.paragraphs.length !== 1 ? 's' : ''} from your text`
          }
        </p>
      </div>

      {/* Original paragraphs */}
      <div className="mt-16">
        <h2 className="text-xl md:text-2xl font-serif mb-8 text-center text-gray-300">
          Source Text
        </h2>
        <div className="space-y-6 max-w-4xl mx-auto">
          {nightSky.paragraphs.map((paragraph, index) => (
            <div 
              key={index} 
              className={`text-center cursor-pointer transition-all duration-300 p-4 rounded-lg border ${
                selectedParagraph === index 
                  ? 'bg-blue-900 bg-opacity-30 border-blue-400 shadow-lg' 
                  : selectedParagraph === null
                    ? 'hover:bg-blue-900 hover:bg-opacity-20 border-transparent hover:border-blue-500'
                    : 'opacity-50 border-transparent hover:opacity-70'
              }`}
              onClick={() => onParagraphClick(index)}
            >
              <h3 className={`text-lg font-serif mb-3 transition-colors ${
                selectedParagraph === index 
                  ? 'text-blue-300' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}>
                Paragraph {index + 1} {selectedParagraph === index && '(Selected)'}
              </h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed text-justify">
                {paragraph}
              </p>
              
              {/* Show grammatical breakdown only for selected paragraph */}
              {selectedParagraph === index && (
                <GrammaticalBreakdown paragraph={paragraph} />
              )}
            </div>
          ))}
        </div>
        
        {/* Instructions */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            Click on any paragraph above to isolate its constellation. Click again to show all constellations.
          </p>
        </div>
      </div>

      {/* Legend */}
      <Legend />
    </div>
  )
}