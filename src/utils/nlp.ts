import type { PartOfSpeech } from '../types'

export function classifyPartOfSpeech(term: any): PartOfSpeech {
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