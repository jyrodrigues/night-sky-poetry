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
  Article: 300,      // 300 degrees (distinct from determiner)
  Modal: 15,         // 15 degrees (close to verb)
  Auxiliary: 30,     // 30 degrees (close to verb)
  Participle: 60,    // 60 degrees (verb-related)
  Gerund: 75,        // 75 degrees (verb-related)
  Possessive: 195,   // 195 degrees (close to pronoun)
  Comparative: 105,  // 105 degrees (close to adjective)
  Superlative: 120,  // 120 degrees (close to adjective)
  Cardinal: 150,     // 150 degrees (number category)
  Ordinal: 165,      // 165 degrees (number category)
  Value: 210,        // 210 degrees (number category)
  QuestionWord: 240, // 240 degrees (interrogative)
  Interjection: 255, // 255 degrees (emotional)
  Unknown: 285       // 285 degrees
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
  Article: '#f472b6',       // Hot pink - distinct from determiner
  Modal: '#facc15',         // Amber - verb variant
  Auxiliary: '#eab308',     // Yellow - verb helper
  Participle: '#fde047',    // Light yellow - verb form
  Gerund: '#fef3c7',        // Very light yellow - verb form
  Possessive: '#34d399',    // Light green - ownership
  Comparative: '#f87171',   // Light red - comparison
  Superlative: '#dc2626',   // Dark red - extreme comparison
  Cardinal: '#60a5fa',      // Light blue - counting
  Ordinal: '#3b82f6',       // Blue - ordering
  Value: '#1d4ed8',         // Dark blue - numeric value
  QuestionWord: '#a78bfa',  // Light purple - inquiry
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
  Article: 'circle',       // Articles as circles (fundamental words)
  Modal: 'star',           // Modal verbs as stars (action-related)
  Auxiliary: 'star',       // Auxiliary verbs as stars (action-related)
  Participle: 'star',      // Participles as stars (verb forms)
  Gerund: 'star',          // Gerunds as stars (verb forms)
  Possessive: 'circle',    // Possessives as circles (relationship)
  Comparative: 'star',     // Comparatives as stars (descriptive)
  Superlative: 'star',     // Superlatives as stars (descriptive)
  Cardinal: 'circle',      // Numbers as circles (fundamental)
  Ordinal: 'circle',       // Ordinals as circles (fundamental)
  Value: 'circle',         // Values as circles (fundamental)
  QuestionWord: 'star',    // Question words as stars (active inquiry)
  Interjection: 'circle',  // Interjections as circles (emotional)
  Unknown: 'circle'
} as const