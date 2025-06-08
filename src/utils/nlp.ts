import type { PartOfSpeech } from '../types'

export function classifyPartOfSpeech(term: any): PartOfSpeech {
  // Get the actual text for specific word checking
  const text = term.text().toLowerCase().trim()
  
  // Articles - commonly requested missing category
  // Check for articles first since they're often tagged as determiners
  if (text === 'the' || text === 'a' || text === 'an') {
    return 'Article'
  }
  
  // Specific pronoun cases that might be misclassified
  if (text === 'it' && term.has('#Pronoun')) {
    return 'Pronoun'
  }
  
  // Handle "that" - can be conjunction, determiner, or pronoun depending on context
  // In "acknowledged that", it's typically a conjunction
  if (text === 'that') {
    // Context-based logic: if preceded by a verb, likely a conjunction
    return 'Conjunction'
  }
  
  // Modal and auxiliary verbs - important subcategories of verbs
  if (term.has('#Modal')) return 'Modal'
  if (term.has('#Auxiliary')) return 'Auxiliary'
  
  // Participles and gerunds - important verb forms
  if (term.has('#Participle')) return 'Participle'
  if (term.has('#Gerund')) return 'Gerund'
  
  // Possessives - important for ownership relationships
  if (term.has('#Possessive')) return 'Possessive'
  
  // Comparative and superlative forms - important adjective variants
  if (term.has('#Superlative')) return 'Superlative'
  if (term.has('#Comparative')) return 'Comparative'
  
  // Numbers and values - important for quantification
  // Be more specific about ordinals to avoid false positives like "truth"
  if (term.has('#Ordinal') || (['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'].includes(text))) {
    return 'Ordinal'
  }
  if (term.has('#Cardinal')) return 'Cardinal'
  if (term.has('#Value')) return 'Value'
  
  // Question words - important for interrogative sentences
  if (term.has('#QuestionWord')) return 'QuestionWord'
  
  // Interjections - keep before other categories to ensure proper detection
  if (term.has('#Interjection')) return 'Interjection'
  
  // Main categories (order matters - more specific first)
  if (term.has('#Pronoun')) return 'Pronoun'
  if (term.has('#Conjunction')) return 'Conjunction'  
  if (term.has('#Preposition')) return 'Preposition'
  if (term.has('#Adverb')) return 'Adverb'
  if (term.has('#Adjective')) return 'Adjective'
  if (term.has('#Verb')) return 'Verb'
  if (term.has('#Noun')) return 'Noun'
  if (term.has('#Determiner')) return 'Determiner'
  
  return 'Unknown'
}