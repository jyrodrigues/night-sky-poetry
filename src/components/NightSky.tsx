import { useMemo } from 'react'
import type { NightSkyData, ConstellationTransform } from '../types'
import { starData } from '../constants'
import { createStarPoints } from '../utils'

interface NightSkyProps {
  data?: NightSkyData
  selectedParagraph?: number | null
  size?: 'small' | 'medium' | 'large'
}

export function NightSky({ data, selectedParagraph, size = 'large' }: NightSkyProps) {
  // Get base data
  const allStars = data?.stars || starData
  const allConnections = data?.connections || []
  
  // Calculate constellation bounds and transforms only when selectedParagraph changes
  const constellationTransform = useMemo(() => {
    if (selectedParagraph === null || selectedParagraph === undefined) {
      return null
    }
    
    const constellationStars = allStars.filter(star => star.paragraphIndex === selectedParagraph)
    if (constellationStars.length === 0) {
      return null
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
    
    return { centerX, centerY, scale }
  }, [allStars, selectedParagraph])
  
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
          {allConnections.map((connection, index) => {
            const fromStar = allStars[connection.from]
            const toStar = allStars[connection.to]
            if (!fromStar || !toStar) return null
            
            // Calculate base positions (original positions)
            const x1 = (fromStar.x / 100) * (circleSize - 80) + 40
            const y1 = (fromStar.y / 100) * (circleSize - 80) + 40
            const x2 = (toStar.x / 100) * (circleSize - 80) + 40
            const y2 = (toStar.y / 100) * (circleSize - 80) + 40
            
            const isSelected = selectedParagraph !== null && connection.paragraphIndex === selectedParagraph
            const shouldFade = selectedParagraph !== null && connection.paragraphIndex !== selectedParagraph
            
            // Calculate transform for the line group - but avoid scaling stroke-width
            let transform = ''
            if (isSelected && constellationTransform) {
              const { centerX, centerY, scale } = constellationTransform
              
              // Calculate the center point of the line
              const lineCenterX = (x1 + x2) / 2
              const lineCenterY = (y1 + y2) / 2
              
              // Calculate the original center in percentage coordinates
              const originalCenterX = (fromStar.x + toStar.x) / 2
              const originalCenterY = (fromStar.y + toStar.y) / 2
              
              // Calculate target center after transformation
              const targetCenterX = (originalCenterX - centerX) * scale + 50
              const targetCenterY = (originalCenterY - centerY) * scale + 50
              
              // Convert back to pixel coordinates
              const targetPixelX = (targetCenterX / 100) * (circleSize - 80) + 40
              const targetPixelY = (targetCenterY / 100) * (circleSize - 80) + 40
              
              // Calculate translation
              const deltaX = targetPixelX - lineCenterX
              const deltaY = targetPixelY - lineCenterY
              
              // Use vector-scaling: scale coordinates but keep stroke-width constant
              transform = `translate(${deltaX}px, ${deltaY}px) scale(${scale}) translate(${-deltaX}px, ${-deltaY}px) translate(${deltaX}px, ${deltaY}px)`
            }
            
            return (
              <g key={index}>
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  vectorEffect="non-scaling-stroke"
                  className="constellation-star"
                  style={{
                    transformOrigin: `${(x1 + x2) / 2}px ${(y1 + y2) / 2}px`,
                    transform: transform || 'none',
                    transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: shouldFade ? 0 : 1,
                    transitionDelay: shouldFade ? '0s' : '0.5s'
                  }}
                />
              </g>
            )
          })}
        </g>
        
        {/* Stars */}
        {allStars.map((star, index) => {
          const x = (star.x / 100) * (circleSize - 80) + 40
          const y = (star.y / 100) * (circleSize - 80) + 40
          const size = star.size === 'large' ? 6 : star.size === 'medium' ? 4 : star.size === 'small' ? 2.5 : 1.5
          
          const isSelected = selectedParagraph !== null && star.paragraphIndex === selectedParagraph
          const shouldFade = selectedParagraph !== null && star.paragraphIndex !== selectedParagraph
          
          // Calculate transform for selected constellation stars
          let transform = ''
          if (isSelected && constellationTransform) {
            const { centerX, centerY, scale } = constellationTransform
            const targetX = (star.x - centerX) * scale + 50
            const targetY = (star.y - centerY) * scale + 50
            const deltaX = ((targetX - star.x) / 100) * (circleSize - 80)
            const deltaY = ((targetY - star.y) / 100) * (circleSize - 80)
            transform = `translate(${deltaX}px, ${deltaY}px)`
          }
          
          return (
            <g key={index}>
              {star.shape === 'star' ? (
                <polygon
                  points={createStarPoints(x, y, size)}
                  fill={star.color || "white"}
                  className="drop-shadow-sm constellation-star"
                  style={{
                    transformOrigin: `${x}px ${y}px`,
                    transform: transform || 'none',
                    transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: shouldFade ? 0 : 1,
                    transitionDelay: shouldFade ? '0s' : '0.5s'
                  }}
                />
              ) : (
                <circle
                  cx={x}
                  cy={y}
                  r={size}
                  fill={star.color || "white"}
                  className="drop-shadow-sm constellation-star"
                  style={{
                    transform: transform || 'none',
                    transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: shouldFade ? 0 : 1,
                    transitionDelay: shouldFade ? '0s' : '0.5s'
                  }}
                />
              )}
            </g>
          )
        })}
        
        {/* Roman numerals */}
        {allStars.filter(star => star.roman).map((star, index) => {
          const x = (star.x / 100) * (circleSize - 80) + 40
          const y = (star.y / 100) * (circleSize - 80) + 40
          
          // Position text to avoid overlapping with stars
          const offsetX = star.x > 50 ? 12 : -12
          const offsetY = star.y < 50 ? -8 : 12
          
          const isSelected = selectedParagraph !== null && star.paragraphIndex === selectedParagraph
          const shouldFade = selectedParagraph !== null && star.paragraphIndex !== selectedParagraph
          
          // Calculate transform for selected constellation text
          let transform = ''
          if (isSelected && constellationTransform) {
            const { centerX, centerY, scale } = constellationTransform
            const targetX = (star.x - centerX) * scale + 50
            const targetY = (star.y - centerY) * scale + 50
            const deltaX = ((targetX - star.x) / 100) * (circleSize - 80)
            const deltaY = ((targetY - star.y) / 100) * (circleSize - 80)
            transform = `translate(${deltaX}px, ${deltaY}px)`
          }
          
          return (
            <text
              key={index}
              x={x + offsetX}
              y={y + offsetY}
              fill="white"
              fontSize="10"
              fontFamily="serif"
              className="text-xs font-light constellation-text"
              textAnchor={star.x > 50 ? 'start' : 'end'}
              style={{
                transform: transform || 'none',
                transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: shouldFade ? 0 : 1,
                transitionDelay: shouldFade ? '0s' : '0.5s'
              }}
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