import type { PartOfSpeech } from '../types'

export function classifyPartOfSpeech(term: any): PartOfSpeech {
  // Get the actual text for specific word checking
  const text = term.text().toLowerCase().trim()
  
  // Articles - specific detection (the, a, an)
  if (text === 'the' || text === 'a' || text === 'an') {
    return 'Article'
  }
  
  // Interjections - emotional expressions (oh, wow, etc.)
  if (term.has('#Interjection') || ['oh', 'wow', 'hey', 'ah', 'uh', 'hmm'].includes(text)) {
    return 'Interjection'
  }
  
  // Conjunctions - connecting words (and, but, or, that, because, etc.)
  if (term.has('#Conjunction') || text === 'that' || ['and', 'but', 'or', 'so', 'because', 'although', 'while', 'if'].includes(text)) {
    return 'Conjunction'
  }
  
  // Prepositions - relationship words (in, on, at, of, to, etc.)
  if (term.has('#Preposition')) {
    return 'Preposition'
  }
  
  // Pronouns - replace nouns (I, you, he, she, it, they, etc.)
  if (term.has('#Pronoun') || ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them'].includes(text)) {
    return 'Pronoun'
  }
  
  // Adverbs - modify verbs, adjectives, other adverbs (quickly, very, etc.)
  // Include comparative/superlative adverbs, modal adverbs, etc.
  if (term.has('#Adverb') || text.endsWith('ly')) {
    return 'Adverb'
  }
  
  // Adjectives - describe nouns (big, red, beautiful, etc.)
  // Include comparative/superlative forms, possessives used as adjectives
  if (term.has('#Adjective') || term.has('#Comparative') || term.has('#Superlative') || 
      text.endsWith('er') || text.endsWith('est')) {
    return 'Adjective'
  }
  
  // Verbs - action words (run, jump, is, have, etc.)
  // Include all verb forms: modal, auxiliary, participles, gerunds
  if (term.has('#Verb') || term.has('#Modal') || term.has('#Auxiliary') || 
      term.has('#Participle') || term.has('#Gerund')) {
    return 'Verb'
  }
  
  // Nouns - people, places, things, ideas (including numbers, values, etc.)
  // This includes proper nouns, possessives, numbers, determiners not already caught
  if (term.has('#Noun') || term.has('#Cardinal') || term.has('#Ordinal') || 
      term.has('#Value') || term.has('#Determiner') || term.has('#Possessive')) {
    return 'Noun'
  }
  
  // Default fallback - if we can't classify, treat as Noun (most common category)
  return 'Noun'
}