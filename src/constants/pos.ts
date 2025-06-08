import type { PartOfSpeech } from '../types'

// Parts of speech angle mapping - 9 categories equally spaced across 360 degrees (40° apart)
export const POS_ANGLES: Record<PartOfSpeech, number> = {
  Conjunction: 0,    // 0 degrees (top)
  Article: 40,       // 40 degrees
  Adjective: 80,     // 80 degrees  
  Adverb: 120,       // 120 degrees
  Preposition: 160,  // 160 degrees
  Interjection: 200, // 200 degrees
  Pronoun: 240,      // 240 degrees
  Noun: 280,         // 280 degrees
  Verb: 320          // 320 degrees
} as const

// Colors for each part of speech (matching the reference image)
export const POS_COLORS: Record<PartOfSpeech, string> = {
  Noun: '#F4C842',          // Yellow/Gold
  Verb: '#DC3545',          // Red
  Adjective: '#FF8C42',     // Orange/Coral
  Adverb: '#7DB9DE',        // Light Blue
  Pronoun: '#8FBC8F',       // Light Green
  Preposition: '#6B8E23',   // Olive Green
  Conjunction: '#708090',   // Slate Gray
  Article: '#4A4A4A',       // Dark Gray
  Interjection: '#E6E6FA'   // Lavender/Light Purple
} as const

// Star shapes for different POS (simplified to 9 categories)
export const POS_SHAPES: Record<PartOfSpeech, 'circle' | 'star'> = {
  Noun: 'circle',
  Verb: 'circle',
  Adjective: 'circle',
  Adverb: 'circle',
  Pronoun: 'circle',
  Preposition: 'circle',
  Conjunction: 'circle',
  Article: 'circle',
  Interjection: 'circle'
} as const