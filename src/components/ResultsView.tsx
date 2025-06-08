import type { NightSkyData } from '../types'
import { NightSky } from './NightSky'
import { Legend } from './Legend'

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