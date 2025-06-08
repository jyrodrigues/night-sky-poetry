import { useState, useMemo } from 'react'
import nlp from 'compromise'

// Parts of speech angle mapping (following Nicholas Rougeux's approach)
const POS_ANGLES = {
  Noun: 0,           // 0 degrees (top)
  Verb: 45,          // 45 degrees
  Adjective: 90,     // 90 degrees (right)
  Adverb: 135,       // 135 degrees
  Pronoun: 180,      // 180 degrees (bottom)
  Preposition: 225,  // 225 degrees
  Conjunction: 270,  // 270 degrees (left)
  Determiner: 315,   // 315 degrees
  Interjection: 30,  // 30 degrees
  Unknown: 60        // 60 degrees
} as const

// Colors for each part of speech (based on the legend in the reference)
const POS_COLORS = {
  Noun: '#ffffff',           // White - most common
  Verb: '#fbbf24',          // Yellow/Gold - action
  Adjective: '#ef4444',     // Red - descriptive
  Adverb: '#8b5cf6',        // Purple - modifying
  Pronoun: '#10b981',       // Green - reference
  Preposition: '#3b82f6',   // Blue - relationship
  Conjunction: '#f59e0b',   // Orange - connection
  Determiner: '#ec4899',    // Pink - specification
  Interjection: '#6366f1',  // Indigo - emotion
  Unknown: '#9ca3af'        // Gray - unclassified
} as const

// Star shapes for different POS (following the legend)
const POS_SHAPES = {
  Noun: 'circle',
  Verb: 'star',
  Adjective: 'star',
  Adverb: 'star',
  Pronoun: 'circle',
  Preposition: 'star',
  Conjunction: 'circle',
  Determiner: 'star',
  Interjection: 'circle',
  Unknown: 'circle'
} as const

// Utility functions for constellation generation
function generateNightSkyFromText(text: string): NightSkyData {
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0)
  
  const allStars: Star[] = []
  const allConnections: Connection[] = []
  
  paragraphs.forEach((paragraph, paragraphIndex) => {
    // Define area for this constellation within the circle
    const constellationArea = getConstellationArea(paragraphIndex, paragraphs.length)
    
    // Generate stars for this constellation using POS analysis
    const { stars: constellationStars, connections: constellationConnections } = 
      generateConstellationFromSentence(paragraph, constellationArea, paragraphIndex, allStars.length)
    
    allStars.push(...constellationStars)
    allConnections.push(...constellationConnections)
  })
  
  // Note: Removed decorative stars to keep background clean
  
  return {
    stars: allStars,
    connections: allConnections,
    paragraphs: paragraphs.map(p => p.trim())
  }
}

function generateConstellationFromSentence(
  sentence: string, 
  area: {centerX: number, centerY: number, radius: number}, 
  paragraphIndex: number,
  globalStarOffset: number
): { stars: Star[], connections: Connection[] } {
  // Clean and analyze the sentence
  const doc = nlp(sentence)
  const words = doc.terms().out('array')
  const terms = doc.terms()
  
  const stars: Star[] = []
  const connections: Connection[] = []
  
  words.forEach((word, index) => {
    if (word.trim().length === 0) return
    
    // Get POS tag using compromise
    const term = terms.eq(index)
    const pos = classifyPartOfSpeech(term)
    
    // Calculate position based on POS angle and word position in sentence
    const posAngle = POS_ANGLES[pos] || POS_ANGLES.Unknown
    const baseAngle = (posAngle + (index * 15)) * (Math.PI / 180) // Convert to radians, add slight offset per word
    
    // Distance from center based on word length and sentence position
    const wordLength = word.length
    const distance = Math.min(area.radius * 0.3, (wordLength * 3) + (index * 2))
    
    // Calculate position within the constellation area
    const x = area.centerX + distance * Math.cos(baseAngle)
    const y = area.centerY + distance * Math.sin(baseAngle)
    
    // Size based on word length (following Rougeux's approach)
    let size: 'large' | 'medium' | 'small' | 'tiny'
    if (wordLength > 8) size = 'large'
    else if (wordLength > 5) size = 'medium'
    else if (wordLength > 3) size = 'small'
    else size = 'tiny'
    
    stars.push({
      x: Math.max(5, Math.min(95, x)), // Keep within bounds
      y: Math.max(5, Math.min(95, y)),
      size,
      color: POS_COLORS[pos] || POS_COLORS.Unknown,
      paragraphIndex,
      roman: index === 0 ? toRoman(paragraphIndex + 1) : undefined, // First word gets Roman numeral
      partOfSpeech: pos,
      shape: POS_SHAPES[pos] || 'circle',
      word: word.toLowerCase().replace(/[^a-zA-Z]/g, '') // Store clean word for debugging
    })
    
    // Connect adjacent words in the sentence (following text flow)
    if (index > 0) {
      connections.push({
        from: globalStarOffset + index - 1,
        to: globalStarOffset + index,
        paragraphIndex
      })
    }
  })
  
  return { stars, connections }
}

function classifyPartOfSpeech(term: any): keyof typeof POS_ANGLES {
  if (term.has('#Noun')) return 'Noun'
  if (term.has('#Verb')) return 'Verb'
  if (term.has('#Adjective')) return 'Adjective'
  if (term.has('#Adverb')) return 'Adverb'
  if (term.has('#Pronoun')) return 'Pronoun'
  if (term.has('#Preposition')) return 'Preposition'
  if (term.has('#Conjunction')) return 'Conjunction'
  if (term.has('#Determiner')) return 'Determiner'
  if (term.has('#Interjection')) return 'Interjection'
  return 'Unknown'
}

function getConstellationArea(index: number, total: number) {
  // Divide the circle into areas for each constellation
  if (total === 1) {
    return { centerX: 50, centerY: 50, radius: 40 }
  } else if (total === 2) {
    return index === 0 
      ? { centerX: 35, centerY: 50, radius: 25 }
      : { centerX: 65, centerY: 50, radius: 25 }
  } else if (total === 3) {
    const centers = [
      { centerX: 50, centerY: 30, radius: 20 },
      { centerX: 35, centerY: 65, radius: 20 },
      { centerX: 65, centerY: 65, radius: 20 }
    ]
    return centers[index] || centers[0]
  } else {
    // For more constellations, arrange in a grid-like pattern
    const angle = (index / total) * 2 * Math.PI
    const radius = 25
    const centerX = 50 + radius * Math.cos(angle)
    const centerY = 50 + radius * Math.sin(angle)
    return { centerX, centerY, radius: 15 }
  }
}


function generateDecorativeStars(count: number): Star[] {
  const stars: Star[] = []
  
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * 90 + 5,
      y: Math.random() * 90 + 5,
      size: 'tiny',
      color: '#ffffff'
    })
  }
  
  return stars
}


function toRoman(num: number): string {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  const numerals = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
  
  let result = ''
  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      result += numerals[i]
      num -= values[i]
    }
  }
  return result
}

function createStarPoints(cx: number, cy: number, radius: number): string {
  const points = []
  const spikes = 5
  const outerRadius = radius
  const innerRadius = radius * 0.4
  
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i * Math.PI) / spikes - Math.PI / 2
    const r = i % 2 === 0 ? outerRadius : innerRadius
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    points.push(`${x},${y}`)
  }
  
  return points.join(' ')
}

// Star data for constellation - positions in percentages relative to circle
const starData = [
  // Main chapter stars with Roman numerals
  { x: 50, y: 15, size: 'large', roman: 'I' },
  { x: 75, y: 20, size: 'medium', roman: 'II' },
  { x: 88, y: 35, size: 'small', roman: 'III' },
  { x: 92, y: 55, size: 'medium', roman: 'IV' },
  { x: 88, y: 75, size: 'large', roman: 'V' },
  { x: 75, y: 88, size: 'small', roman: 'VI' },
  { x: 55, y: 92, size: 'medium', roman: 'VII' },
  { x: 35, y: 88, size: 'large', roman: 'VIII' },
  { x: 20, y: 75, size: 'small', roman: 'IX' },
  { x: 12, y: 55, size: 'medium', roman: 'X' },
  { x: 18, y: 35, size: 'large', roman: 'XI' },
  { x: 28, y: 20, size: 'small', roman: 'XII' },
  { x: 65, y: 12, size: 'medium', roman: 'XIII' },
  { x: 82, y: 25, size: 'small', roman: 'XIV' },
  { x: 90, y: 45, size: 'medium', roman: 'XV' },
  { x: 85, y: 65, size: 'small', roman: 'XVI' },
  { x: 25, y: 35, size: 'medium', roman: 'XVII' },
  { x: 15, y: 45, size: 'small', roman: 'XVIII' },
  { x: 40, y: 18, size: 'medium', roman: 'XIX' },
  
  // Many additional scattered stars of various sizes
  { x: 45, y: 30, size: 'tiny' },
  { x: 55, y: 35, size: 'small' },
  { x: 60, y: 42, size: 'tiny' },
  { x: 48, y: 48, size: 'medium' },
  { x: 52, y: 58, size: 'tiny' },
  { x: 40, y: 55, size: 'small' },
  { x: 65, y: 55, size: 'tiny' },
  { x: 35, y: 62, size: 'medium' },
  { x: 58, y: 68, size: 'tiny' },
  { x: 42, y: 75, size: 'small' },
  { x: 68, y: 72, size: 'tiny' },
  { x: 32, y: 48, size: 'small' },
  { x: 72, y: 48, size: 'tiny' },
  { x: 38, y: 38, size: 'medium' },
  { x: 62, y: 32, size: 'tiny' },
  { x: 28, y: 58, size: 'small' },
  { x: 78, y: 62, size: 'tiny' },
  { x: 45, y: 82, size: 'small' },
  { x: 55, y: 78, size: 'tiny' },
  { x: 25, y: 72, size: 'medium' },
  { x: 75, y: 78, size: 'tiny' },
  { x: 22, y: 42, size: 'small' },
  { x: 82, y: 42, size: 'tiny' },
  { x: 48, y: 25, size: 'small' },
  { x: 52, y: 85, size: 'tiny' },
  { x: 35, y: 25, size: 'tiny' },
  { x: 65, y: 85, size: 'small' },
  { x: 58, y: 22, size: 'tiny' },
  { x: 42, y: 88, size: 'tiny' },
  { x: 78, y: 32, size: 'small' },
  { x: 22, y: 68, size: 'tiny' },
  { x: 88, y: 52, size: 'tiny' },
  { x: 12, y: 48, size: 'small' },
  { x: 68, y: 38, size: 'tiny' },
  { x: 32, y: 72, size: 'tiny' },
  { x: 75, y: 58, size: 'small' },
  { x: 25, y: 52, size: 'tiny' },
  { x: 55, y: 45, size: 'tiny' },
  { x: 45, y: 65, size: 'tiny' },
  { x: 65, y: 28, size: 'tiny' },
  { x: 35, y: 82, size: 'small' },
  { x: 85, y: 38, size: 'tiny' },
  { x: 15, y: 62, size: 'tiny' },
  { x: 72, y: 65, size: 'small' },
  { x: 28, y: 28, size: 'tiny' },
  { x: 58, y: 52, size: 'tiny' },
  { x: 42, y: 42, size: 'tiny' },
  { x: 78, y: 78, size: 'small' },
  { x: 22, y: 22, size: 'tiny' },
  { x: 88, y: 68, size: 'tiny' },
  { x: 12, y: 32, size: 'tiny' },
  { x: 65, y: 68, size: 'tiny' },
  { x: 35, y: 32, size: 'small' },
  { x: 52, y: 38, size: 'tiny' },
  { x: 48, y: 72, size: 'tiny' },
  { x: 82, y: 58, size: 'tiny' },
  { x: 18, y: 52, size: 'small' },
  { x: 62, y: 78, size: 'tiny' },
  { x: 38, y: 22, size: 'tiny' },
  { x: 75, y: 42, size: 'tiny' },
  { x: 25, y: 68, size: 'tiny' },
  { x: 55, y: 62, size: 'tiny' },
  { x: 45, y: 38, size: 'tiny' },
  { x: 68, y: 52, size: 'tiny' },
  { x: 32, y: 58, size: 'tiny' },
  { x: 85, y: 72, size: 'tiny' },
  { x: 15, y: 28, size: 'tiny' },
  { x: 58, y: 72, size: 'tiny' },
  { x: 42, y: 28, size: 'tiny' },
  { x: 72, y: 38, size: 'tiny' },
  { x: 28, y: 62, size: 'tiny' },
  { x: 52, y: 48, size: 'tiny' },
  { x: 48, y: 58, size: 'tiny' },
]

const defaultText = `Once on a dark winter's day, when the yellow fog hung so thick and heavy in the streets of London that the lamps were lighted and the shop windows blazed with gas as they do at night, an odd- looking little girl sat in a hansom cab with her father and was driven rather slowly through the big thoroughfares.

When Sara entered the drawing room the next morning everybody looked at her with wide, interested eyes.

One thing was plain, they did not know what to make of her or what to think, and Captain Crewe seemed to understand this perfectly; he saw the wonder in their faces, though they did not seem quite sure about her manners or her ways.

If Sara had been a different kind of child, her life at Miss Minchin's Select Seminary for Young Ladies during the next few years would not have been at all good for her.

Of course the greatest power Sara possessed and the one which gained her even more followers than the beauty, was the fact that she never, under any circumstances whatsoever, lost her temper.

When Sara first left France to go to Miss Minchin's school in London, she spoke French much better than she spoke English; it was her father's native tongue.

The first night she spent in her attic was a thing Sara never forgot.

The next morning Becky was awakened by being gently shaken.

It was the third person in the trio who told her that her father was dead.

After that it was a positive thing for Ermengarde and Lottie to make themselves at home in Sara's attic. It was the only place in which they felt they could speak with real freedom of their woes.`

function InputForm({ inputText, setInputText, onGenerate }: {
  inputText: string
  setInputText: (text: string) => void
  onGenerate: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-4 tracking-wide">
          Night Sky Poetry
        </h1>
        <p className="text-lg md:text-xl text-gray-300 font-light">
          Transform your text into constellations
        </p>
      </div>
      
      {/* Input form */}
      <div className="w-full max-w-2xl">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your text here..."
          className="w-full h-64 p-6 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
        />
        
        <div className="flex justify-center mt-6">
          <button
            onClick={onGenerate}
            disabled={!inputText.trim()}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-950"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  )
}

function GeneratingView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-6 mx-auto"></div>
        <h2 className="text-2xl md:text-3xl font-serif mb-2">Generating Constellations</h2>
        <p className="text-gray-300">Mapping your words to the stars...</p>
      </div>
    </div>
  )
}

function NightSky({ data, selectedParagraph, size = 'large' }: { 
  data?: NightSkyData
  selectedParagraph?: number | null
  size?: 'small' | 'medium' | 'large' 
}) {
  // Filter and transform data based on selected paragraph
  const { stars, connections } = useMemo(() => {
    const allStars = data?.stars || starData
    const allConnections = data?.connections || []
    
    if (selectedParagraph === null || selectedParagraph === undefined) {
      return { stars: allStars, connections: allConnections } // Show all
    }
    
    // Filter stars and connections for selected paragraph
    const filteredStars = allStars.filter(star => 
      star.paragraphIndex === selectedParagraph
    )
    const filteredConnections = allConnections.filter(connection => 
      connection.paragraphIndex === selectedParagraph
    )
    
    // Calculate bounds of the selected constellation
    const constellationStars = filteredStars.filter(star => star.paragraphIndex === selectedParagraph)
    if (constellationStars.length === 0) {
      return { stars: filteredStars, connections: filteredConnections }
    }
    
    // Find the bounding box of the constellation
    const minX = Math.min(...constellationStars.map(s => s.x))
    const maxX = Math.max(...constellationStars.map(s => s.x))
    const minY = Math.min(...constellationStars.map(s => s.y))
    const maxY = Math.max(...constellationStars.map(s => s.y))
    
    // Calculate center and size of constellation
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2
    const width = maxX - minX
    const height = maxY - minY
    const constellationSize = Math.max(width, height)
    
    // Target size (60% of circle to leave more padding)
    const targetSize = 60
    const scale = constellationSize > 0 ? targetSize / constellationSize : 1
    
    // Transform stars to center and scale them
    const transformedStars = filteredStars.map(star => {
      // Scale and center constellation stars
      const scaledX = (star.x - centerX) * scale + 50
      const scaledY = (star.y - centerY) * scale + 50
      return {
        ...star,
        x: Math.max(15, Math.min(85, scaledX)), // More padding from edges
        y: Math.max(15, Math.min(85, scaledY))
      }
    })
    
    return { stars: transformedStars, connections: filteredConnections }
  }, [data?.stars, data?.connections, selectedParagraph])
  
  const circleSize = useMemo(() => {
    // Responsive circle size based on screen size and size prop
    if (typeof window !== 'undefined') {
      const vmin = Math.min(window.innerWidth, window.innerHeight)
      let baseSize
      
      if (size === 'small') {
        baseSize = window.innerWidth < 768 ? 250 : 300
      } else if (size === 'large') {
        baseSize = window.innerWidth < 768 ? 350 : window.innerWidth < 1024 ? 450 : 500
      } else { // medium
        baseSize = window.innerWidth < 768 ? 300 : window.innerWidth < 1024 ? 400 : 450
      }
      
      return Math.min(vmin * 0.8, baseSize)
    }
    return size === 'small' ? 300 : size === 'large' ? 500 : 450
  }, [size])

  return (
    <div className="relative" style={{ width: circleSize, height: circleSize }}>
      {/* Main circle border */}
      <svg 
        width={circleSize} 
        height={circleSize} 
        className="absolute inset-0"
        viewBox={`0 0 ${circleSize} ${circleSize}`}
      >
        {/* Dashed circle border */}
        <circle
          cx={circleSize / 2}
          cy={circleSize / 2}
          r={circleSize / 2 - 20}
          fill="none"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeWidth="1"
          strokeDasharray="5,3"
        />
        
        {/* Connection lines between stars */}
        <g stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" fill="none">
          {connections.map((connection, index) => {
            const fromStar = stars[connection.from]
            const toStar = stars[connection.to]
            if (!fromStar || !toStar) return null
            
            const x1 = (fromStar.x / 100) * (circleSize - 80) + 40
            const y1 = (fromStar.y / 100) * (circleSize - 80) + 40
            const x2 = (toStar.x / 100) * (circleSize - 80) + 40
            const y2 = (toStar.y / 100) * (circleSize - 80) + 40
            
            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className="transition-all duration-1000 ease-in-out"
              />
            )
          })}
        </g>
        
        {/* Stars */}
        {stars.map((star, index) => {
          const x = (star.x / 100) * (circleSize - 80) + 40
          const y = (star.y / 100) * (circleSize - 80) + 40
          const size = star.size === 'large' ? 6 : star.size === 'medium' ? 4 : star.size === 'small' ? 2.5 : 1.5
          
          return (
            <g key={index}>
              {star.shape === 'star' ? (
                <polygon
                  points={createStarPoints(x, y, size)}
                  fill={star.color || "white"}
                  className="drop-shadow-sm transition-all duration-1000 ease-in-out"
                  style={{
                    transformOrigin: `${x}px ${y}px`
                  }}
                />
              ) : (
                <circle
                  cx={x}
                  cy={y}
                  r={size}
                  fill={star.color || "white"}
                  className="drop-shadow-sm transition-all duration-1000 ease-in-out"
                />
              )}
            </g>
          )
        })}
        
        {/* Roman numerals */}
        {stars.filter(star => star.roman).map((star, index) => {
          const x = (star.x / 100) * (circleSize - 80) + 40
          const y = (star.y / 100) * (circleSize - 80) + 40
          
          // Position text to avoid overlapping with stars
          const offsetX = star.x > 50 ? 12 : -12
          const offsetY = star.y < 50 ? -8 : 12
          
          return (
            <text
              key={index}
              x={x + offsetX}
              y={y + offsetY}
              fill="white"
              fontSize="10"
              fontFamily="serif"
              className="text-xs font-light transition-all duration-1000 ease-in-out"
              textAnchor={star.x > 50 ? 'start' : 'end'}
            >
              {star.roman}
            </text>
          )
        })}
      </svg>
      
      {/* Curved text around circle */}
      <svg 
        width={circleSize} 
        height={circleSize} 
        className="absolute inset-0 pointer-events-none"
        viewBox={`0 0 ${circleSize} ${circleSize}`}
      >
        <defs>
          <path 
            id="circle-path" 
            d={`M ${circleSize/2 - (circleSize/2 - 40)}, ${circleSize/2} A ${circleSize/2 - 40}, ${circleSize/2 - 40} 0 1,1 ${circleSize/2 + (circleSize/2 - 40)}, ${circleSize/2}`}
          />
        </defs>
        <text className="text-xs fill-white font-light tracking-[0.15em] opacity-80">
          <textPath href="#circle-path" startOffset="25%">
            CONSTELLATIONS of TEXT VISUALIZED by PARTS of SPEECH
          </textPath>
        </text>
      </svg>
    </div>
  )
}

function ResultsView({ nightSky, selectedParagraph, onReset, onParagraphClick }: {
  nightSky: NightSkyData
  selectedParagraph: number | null
  onReset: () => void
  onParagraphClick: (index: number) => void
}) {
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

      {/* Legend */}
      <Legend />

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
    </div>
  )
}

function Legend() {
  return (
    <div className="flex justify-between items-start w-full max-w-4xl mx-auto mt-8">
      {/* Parts of Speech */}
      <div className="text-white">
        <h3 className="text-sm font-light tracking-wider mb-4">PARTS OF SPEECH</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <polygon points={createStarPoints(8, 8, 3)} fill="#fbbf24" />
            </svg>
            <span className="font-light">Verb</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <polygon points={createStarPoints(8, 8, 3)} fill="#8b5cf6" />
            </svg>
            <span className="font-light">Adverb</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <polygon points={createStarPoints(8, 8, 3)} fill="#ef4444" />
            </svg>
            <span className="font-light">Adjective</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="3" fill="#ffffff" />
            </svg>
            <span className="font-light">Noun</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="3" fill="#10b981" />
            </svg>
            <span className="font-light">Pronoun</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <polygon points={createStarPoints(8, 8, 3)} fill="#3b82f6" />
            </svg>
            <span className="font-light">Preposition</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="3" fill="#f59e0b" />
            </svg>
            <span className="font-light">Conjunction</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <polygon points={createStarPoints(8, 8, 3)} fill="#ec4899" />
            </svg>
            <span className="font-light">Determiner</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="3" fill="#6366f1" />
            </svg>
            <span className="font-light">Interjection</span>
          </div>
        </div>
      </div>
      
      {/* Stars legend */}
      <div className="text-white">
        <h3 className="text-sm font-light tracking-wider mb-4">WORD LENGTH</h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="1.5" fill="white" />
            </svg>
            <span className="font-light">1-3 letters (tiny)</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="2.5" fill="white" />
            </svg>
            <span className="font-light">4-5 letters (small)</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="4" fill="white" />
            </svg>
            <span className="font-light">6-8 letters (medium)</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="6" fill="white" />
            </svg>
            <span className="font-light">9+ letters (large)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Types for constellation data
type Star = {
  x: number
  y: number
  size: 'large' | 'medium' | 'small' | 'tiny'
  roman?: string
  paragraphIndex?: number
  color?: string
  partOfSpeech?: keyof typeof POS_ANGLES
  shape?: 'circle' | 'star'
  word?: string
}

type Connection = {
  from: number
  to: number
  paragraphIndex?: number
}

type NightSkyData = {
  stars: Star[]
  connections: Connection[]
  paragraphs: string[]
}

type ViewState = 'input' | 'generating' | 'results'

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
      // If clicking the already selected paragraph, show all
      setSelectedParagraph(null)
    } else {
      // Otherwise, select this paragraph only
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