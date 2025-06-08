import { useState, useMemo } from 'react'

// Utility functions for constellation generation
function generateNightSkyFromText(text: string): NightSkyData {
  const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0)
  
  const allStars: Star[] = []
  const allConnections: Connection[] = []
  const colors = ['#ffffff', '#e0e7ff', '#fef3c7', '#fecaca', '#d1fae5', '#e0e7ff']
  
  paragraphs.forEach((paragraph, paragraphIndex) => {
    const words = paragraph.split(/\s+/).filter(w => w.length > 0)
    
    // Define area for this constellation within the circle
    const constellationArea = getConstellationArea(paragraphIndex, paragraphs.length)
    
    // Generate stars for this constellation within its area
    const constellationStars = generateStarsInArea(words, constellationArea, paragraphIndex, colors[paragraphIndex % colors.length])
    
    // Generate connections within this constellation
    const constellationConnections = generateConnectionsForConstellation(
      constellationStars,
      allStars.length, // offset for global star indices
      paragraphIndex
    )
    
    allStars.push(...constellationStars)
    allConnections.push(...constellationConnections)
  })
  
  // Add some random decorative stars throughout the sky
  const decorativeStars = generateDecorativeStars(paragraphs.length * 10)
  allStars.push(...decorativeStars)
  
  return {
    stars: allStars,
    connections: allConnections,
    paragraphs: paragraphs.map(p => p.trim())
  }
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

function generateStarsInArea(words: string[], area: {centerX: number, centerY: number, radius: number}, paragraphIndex: number, color: string): Star[] {
  const stars: Star[] = []
  
  words.forEach((word, index) => {
    // Position stars within the allocated area
    const angle = (index / words.length) * 2 * Math.PI + (Math.random() - 0.5) * 1
    const radius = Math.random() * area.radius
    
    const x = area.centerX + radius * Math.cos(angle)
    const y = area.centerY + radius * Math.sin(angle)
    
    // Size based on word length
    let size: 'large' | 'medium' | 'small' | 'tiny'
    if (word.length > 8) size = 'large'
    else if (word.length > 5) size = 'medium'
    else if (word.length > 3) size = 'small'
    else size = 'tiny'
    
    stars.push({
      x: Math.max(5, Math.min(95, x)), // Keep within bounds
      y: Math.max(5, Math.min(95, y)),
      size,
      roman: index < 10 ? toRoman(index + 1) : undefined, // First 10 words get Roman numerals
      paragraphIndex,
      color
    })
  })
  
  return stars
}

function generateConnectionsForConstellation(stars: Star[], offset: number, paragraphIndex: number): Connection[] {
  const connections: Connection[] = []
  const maxConnections = Math.min(5, Math.floor(stars.length / 2))
  
  for (let i = 0; i < maxConnections; i++) {
    const from = Math.floor(Math.random() * stars.length)
    let to = Math.floor(Math.random() * stars.length)
    
    // Avoid self-connections and duplicates
    while (to === from || connections.some(c => 
      (c.from === from + offset && c.to === to + offset) || 
      (c.from === to + offset && c.to === from + offset)
    )) {
      to = Math.floor(Math.random() * stars.length)
    }
    
    // Only connect if stars are reasonably close
    const distance = Math.sqrt(
      Math.pow(stars[from].x - stars[to].x, 2) + 
      Math.pow(stars[from].y - stars[to].y, 2)
    )
    
    if (distance < 25) { // Reduced distance threshold for smaller areas
      connections.push({ 
        from: from + offset, 
        to: to + offset,
        paragraphIndex
      })
    }
  }
  
  return connections
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

const textContent = [
  "I. Once on a dark winter's day, when the yellow fog hung so thick and heavy in the streets of London that the lamps were lighted and the shop windows blazed with gas as they do at night, an odd- looking little girl sat in a hansom cab with her father and was driven rather slowly through the big thoroughfares.",
  
  "II. When Sara entered the drawing room the next morning everybody looked at her with wide, interested eyes.",
  
  "III. One thing was plain, they did not know what to make of her or what to think, and Captain Crewe seemed to understand this perfectly; he saw the wonder in their faces, though they did not seem quite sure about her manners or her ways.", 
  
  "IV. If Sara had been a different kind of child, her life at Miss Minchin's Select Seminary for Young Ladies during the next few years would not have been at all good for her.",
  
  "V. Of course the greatest power Sara possessed and the one which gained her even more followers than the beauty, was the fact that she never, under any circumstances whatsoever, lost her temper.",
  
  "VI. When Sara first left France to go to Miss Minchin's school in London, she spoke French much better than she spoke English; it was her father's native tongue.",
  
  "VII. The first night she spent in her attic was a thing Sara never forgot.",
  
  "VIII. The next morning Becky was awakened by being gently shaken.",
  
  "IX. It was the third person in the trio who told her that her father was dead.",
  
  "X. After that it was a positive thing for Ermengarde and Lottie to make themselves at home in Sara's attic. It was the only place in which they felt they could speak with real freedom of their woes.",
  
  "XI. There were four more rooms over in the square sometimes.",
  
  "XII. When she first knew them from heaven, it is interesting to think of the things which set her being very different from different kinds of words that might be. What she always chiefly thought of the things which set her life very different she saw the large paper at the door into the little ones and caught a glimpse of what might be happening beyond them.",
  
  "XIII. If first night she spent in her attic was a thing Sara never forgot.",
  
  "XIV. On this very afternoon, there members of the Large Family sat in their nursery, which was on the second floor, discussing the remarkable the remarkable Miss Carmichael who explained her strange gift.",
  
  "XV. When Sara first passed the house three days she had seen four times the rooms were full and busy and of her mother one day. Here there were five more chairs arranged all about some great affairs. They all had to climb down stairs through the trees.",
  
  "XVI. Imagine if you can, what the rest of the evening was like.",
  
  "XVII. The next afternoon three members of the Large Family sat in their nursery, which was on the second floor, discussing the remarkable Miss Carmichael who explained that she also had a large old-fashioned home.",
  
  "XVIII. It was pretty uncomfortable, Miss Carmichael who explained that she also had to sit at her table and work.",
  
  "XIX. Never had such joy reigned in the nursery of the Large Family."
]

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

function NightSky({ data, size = 'large' }: { 
  data?: NightSkyData
  size?: 'small' | 'medium' | 'large' 
}) {
  // Use provided data or fallback to static data
  const stars = data?.stars || starData
  const connections = data?.connections || []
  
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
              <circle
                cx={x}
                cy={y}
                r={size}
                fill={star.color || "white"}
                className="drop-shadow-sm"
              />
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
              className="text-xs font-light"
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
            CONSTELLATIONS of FIRST SENTENCES from EACH CHAPTER
          </textPath>
        </text>
      </svg>
    </div>
  )
}

function ResultsView({ nightSky, onReset }: {
  nightSky: NightSkyData
  onReset: () => void
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
          <NightSky data={nightSky} size="large" />
        </div>
        
        {/* Curved text around circle */}
        <p className="text-sm text-gray-400 mb-8">
          {nightSky.paragraphs.length} constellation{nightSky.paragraphs.length !== 1 ? 's' : ''} from your text
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
            <div key={index} className="text-center">
              <h3 className="text-lg font-serif mb-3 text-gray-400">
                Paragraph {index + 1}
              </h3>
              <p className="text-sm md:text-base text-gray-300 leading-relaxed text-justify">
                {paragraph}
              </p>
            </div>
          ))}
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
              <polygon points="8,1 9.5,6 14,6 10.5,9 12,14 8,11 4,14 5.5,9 2,6 6.5,6" fill="white" />
            </svg>
            <span className="font-light">Verb, Adverb, Adjective</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="2.5" fill="white" />
            </svg>
            <span className="font-light">Pronoun</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <polygon points="8,1 9.5,6 14,6 10.5,9 12,14 8,11 4,14 5.5,9 2,6 6.5,6" fill="white" />
            </svg>
            <span className="font-light">Preposition</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="1.8" fill="white" />
            </svg>
            <span className="font-light">Noun, Conjunction</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <polygon points="8,1 9.5,6 14,6 10.5,9 12,14 8,11 4,14 5.5,9 2,6 6.5,6" fill="white" />
            </svg>
            <span className="font-light">Determiner</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="1.2" fill="white" />
            </svg>
            <span className="font-light">Interjection</span>
          </div>
        </div>
      </div>
      
      {/* Stars legend */}
      <div className="text-white">
        <h3 className="text-sm font-light tracking-wider mb-4">STARS</h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <polygon points="8,1 9.5,6 14,6 10.5,9 12,14 8,11 4,14 5.5,9 2,6 6.5,6" fill="white" />
            </svg>
            <span className="font-light">First word</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="2.5" fill="white" />
            </svg>
            <span className="font-light">Shorter word</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="4" fill="white" />
            </svg>
            <span className="font-light">Longer word</span>
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
  const [inputText, setInputText] = useState('')
  const [nightSky, setNightSky] = useState<NightSkyData | null>(null)

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
    setInputText('')
    setNightSky(null)
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
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  )
}

export default App