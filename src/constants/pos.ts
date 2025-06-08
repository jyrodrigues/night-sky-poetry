import type { PartOfSpeech } from '../types'

// Parts of speech angle mapping (following Nicholas Rougeux's approach)
export const POS_ANGLES: Record<PartOfSpeech, number> = {
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
export const POS_COLORS: Record<PartOfSpeech, string> = {
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
export const POS_SHAPES: Record<PartOfSpeech, 'circle' | 'star'> = {
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