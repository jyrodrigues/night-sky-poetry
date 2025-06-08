// Debug why "truth" is being classified as Ordinal
import nlp from 'compromise'

// Updated classification function
function classifyPartOfSpeech(term) {
  const text = term.text().toLowerCase().trim()
  
  console.log(`\nAnalyzing "${text}":`)
  console.log(`  has('#Ordinal'): ${term.has('#Ordinal')}`)
  console.log(`  has('#Noun'): ${term.has('#Noun')}`)
  console.log(`  endsWith('th'): ${text.endsWith('th')}`)
  
  // Articles
  if (text === 'the' || text === 'a' || text === 'an') {
    return 'Article'
  }
  
  // Specific pronoun cases
  if (text === 'it' && term.has('#Pronoun')) {
    return 'Pronoun'
  }
  
  // Handle "that"
  if (text === 'that') {
    return 'Conjunction'
  }
  
  // Modal and auxiliary verbs
  if (term.has('#Modal')) return 'Modal'
  if (term.has('#Auxiliary')) return 'Auxiliary'
  
  // Other categories...
  if (term.has('#Participle')) return 'Participle'
  if (term.has('#Gerund')) return 'Gerund'
  if (term.has('#Possessive')) return 'Possessive'
  if (term.has('#Superlative')) return 'Superlative'
  if (term.has('#Comparative')) return 'Comparative'
  
  // Numbers - be more specific about ordinals
  if (term.has('#Ordinal') && (['first', 'second', 'third', 'fourth', 'fifth'].includes(text) || text.endsWith('th'))) {
    console.log(`  → Classified as Ordinal`)
    return 'Ordinal'
  }
  if (term.has('#Cardinal')) return 'Cardinal'
  if (term.has('#Value')) return 'Value'
  
  if (term.has('#QuestionWord')) return 'QuestionWord'
  if (term.has('#Interjection')) return 'Interjection'
  
  // Main categories
  if (term.has('#Pronoun')) return 'Pronoun'
  if (term.has('#Conjunction')) return 'Conjunction'  
  if (term.has('#Preposition')) return 'Preposition'
  if (term.has('#Adverb')) return 'Adverb'
  if (term.has('#Adjective')) return 'Adjective'
  if (term.has('#Verb')) return 'Verb'
  if (term.has('#Noun')) {
    console.log(`  → Classified as Noun`)
    return 'Noun'
  }
  if (term.has('#Determiner')) return 'Determiner'
  
  return 'Unknown'
}

const doc = nlp("truth")
const term = doc.eq(0)
const result = classifyPartOfSpeech(term)
console.log(`Final result: "${term.text()}" → ${result}`)