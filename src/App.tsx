import { useMemo } from 'react'

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

function Constellation() {
  const circleSize = useMemo(() => {
    // Responsive circle size based on screen size
    if (typeof window !== 'undefined') {
      const vmin = Math.min(window.innerWidth, window.innerHeight)
      if (window.innerWidth < 768) {
        return Math.min(vmin * 0.8, 350) // Mobile
      } else if (window.innerWidth < 1024) {
        return Math.min(vmin * 0.6, 450) // Tablet
      } else {
        return Math.min(vmin * 0.5, 500) // Desktop
      }
    }
    return 500
  }, [])

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
        
        {/* Connection lines between some stars */}
        <g stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.5" fill="none">
          {/* Sample constellation lines */}
          <line x1={(50/100) * (circleSize - 80) + 40} y1={(15/100) * (circleSize - 80) + 40} 
                x2={(75/100) * (circleSize - 80) + 40} y2={(20/100) * (circleSize - 80) + 40} />
          <line x1={(75/100) * (circleSize - 80) + 40} y1={(20/100) * (circleSize - 80) + 40} 
                x2={(88/100) * (circleSize - 80) + 40} y2={(35/100) * (circleSize - 80) + 40} />
          <line x1={(92/100) * (circleSize - 80) + 40} y1={(55/100) * (circleSize - 80) + 40} 
                x2={(88/100) * (circleSize - 80) + 40} y2={(75/100) * (circleSize - 80) + 40} />
          <line x1={(35/100) * (circleSize - 80) + 40} y1={(88/100) * (circleSize - 80) + 40} 
                x2={(20/100) * (circleSize - 80) + 40} y2={(75/100) * (circleSize - 80) + 40} />
          <line x1={(18/100) * (circleSize - 80) + 40} y1={(35/100) * (circleSize - 80) + 40} 
                x2={(28/100) * (circleSize - 80) + 40} y2={(20/100) * (circleSize - 80) + 40} />
        </g>
        
        {/* Stars */}
        {starData.map((star, index) => {
          const x = (star.x / 100) * (circleSize - 80) + 40
          const y = (star.y / 100) * (circleSize - 80) + 40
          const size = star.size === 'large' ? 6 : star.size === 'medium' ? 4 : star.size === 'small' ? 2.5 : 1.5
          
          return (
            <g key={index}>
              <circle
                cx={x}
                cy={y}
                r={size}
                fill="white"
                className="drop-shadow-sm"
              />
            </g>
          )
        })}
        
        {/* Roman numerals */}
        {starData.filter(star => star.roman).map((star, index) => {
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

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-950 via-blue-900 to-blue-950 text-white overflow-x-auto">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {/* Title section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-2 tracking-wide">
            A Little Princess
          </h1>
          <p className="text-base md:text-lg lg:text-xl font-serif italic text-gray-300">
            by Frances Hodgson Burnett
          </p>
        </div>
        
        {/* Constellation */}
        <div className="flex justify-center mb-6 md:mb-8">
          <Constellation />
        </div>
        
        {/* Legend */}
        <Legend />
        
        {/* Content text */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs leading-relaxed max-w-5xl mx-auto">
          {textContent.map((text, index) => (
            <div key={index} className="text-gray-300 text-justify">
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App