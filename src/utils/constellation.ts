import nlp from 'compromise'
import type { 
  NightSkyData, 
  Star, 
  Connection, 
  ConstellationArea, 
  PartOfSpeech 
} from '../types'
import { POS_ANGLES, POS_COLORS, POS_SHAPES } from '../constants'
import { toRoman } from './math'
import { classifyPartOfSpeech } from './nlp'

export function generateNightSkyFromText(text: string): NightSkyData {
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
  
  return {
    stars: allStars,
    connections: allConnections,
    paragraphs: paragraphs.map(p => p.trim())
  }
}

export function generateConstellationFromSentence(
  sentence: string, 
  area: ConstellationArea, 
  paragraphIndex: number,
  globalStarOffset: number
): { stars: Star[], connections: Connection[] } {
  // Clean and analyze the sentence
  const doc = nlp(sentence)
  const words = doc.terms().out('array')
  const terms = doc.terms()
  
  const stars: Star[] = []
  const connections: Connection[] = []
  
  // Walking path algorithm - start at constellation center
  let currentX = area.centerX
  let currentY = area.centerY
  
  // Edge length multiplier - can be tuned later (smaller values keep paths more contained)
  const EDGE_LENGTH_MULTIPLIER = 1.5
  
  words.forEach((word, index) => {
    if (word.trim().length === 0) return
    
    // Get POS tag using compromise
    const term = terms.eq(index)
    const pos = classifyPartOfSpeech(term)
    
    // For the first word, place it at the starting position
    if (index === 0) {
      // Size based on word length (following Rougeux's approach)
      const wordLength = word.length
      let size: 'large' | 'medium' | 'small' | 'tiny'
      if (wordLength > 8) size = 'large'
      else if (wordLength > 5) size = 'medium'
      else if (wordLength > 3) size = 'small'
      else size = 'tiny'
      
      stars.push({
        x: Math.max(10, Math.min(90, currentX)),
        y: Math.max(10, Math.min(90, currentY)),
        size,
        color: POS_COLORS[pos] || POS_COLORS.Unknown,
        paragraphIndex,
        roman: toRoman(paragraphIndex + 1), // First word gets Roman numeral
        partOfSpeech: pos,
        shape: POS_SHAPES[pos] || 'circle',
        word: word.toLowerCase().replace(/[^a-zA-Z]/g, '')
      })
    } else {
      // Walking algorithm: direction determined by POS, distance by word length
      const posAngle = POS_ANGLES[pos] || POS_ANGLES.Unknown
      const angleInRadians = posAngle * (Math.PI / 180)
      
      // Distance to walk = word length * multiplier
      const wordLength = word.length
      const walkDistance = wordLength * EDGE_LENGTH_MULTIPLIER
      
      // Calculate new position by walking in the POS direction
      const deltaX = walkDistance * Math.cos(angleInRadians)
      const deltaY = walkDistance * Math.sin(angleInRadians)
      
      currentX += deltaX
      currentY += deltaY
      
      // Size based on word length
      let size: 'large' | 'medium' | 'small' | 'tiny'
      if (wordLength > 8) size = 'large'
      else if (wordLength > 5) size = 'medium'
      else if (wordLength > 3) size = 'small'
      else size = 'tiny'
      
      stars.push({
        x: Math.max(10, Math.min(90, currentX)),
        y: Math.max(10, Math.min(90, currentY)),
        size,
        color: POS_COLORS[pos] || POS_COLORS.Unknown,
        paragraphIndex,
        roman: undefined, // Only first word gets Roman numeral
        partOfSpeech: pos,
        shape: POS_SHAPES[pos] || 'circle',
        word: word.toLowerCase().replace(/[^a-zA-Z]/g, '')
      })
      
      // Connect to previous word (creating the walking path)
      connections.push({
        from: globalStarOffset + index - 1,
        to: globalStarOffset + index,
        paragraphIndex
      })
    }
  })
  
  return { stars, connections }
}

export function getConstellationArea(index: number, total: number): ConstellationArea {
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