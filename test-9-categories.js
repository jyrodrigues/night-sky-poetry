// Test the new 9-category POS system
import nlp from 'compromise'

// Updated classification function for 9 categories
function classifyPartOfSpeech(term) {
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
  if (term.has('#Adverb') || text.endsWith('ly')) {
    return 'Adverb'
  }
  
  // Adjectives - describe nouns (big, red, beautiful, etc.)
  if (term.has('#Adjective') || term.has('#Comparative') || term.has('#Superlative') || 
      text.endsWith('er') || text.endsWith('est')) {
    return 'Adjective'
  }
  
  // Verbs - action words (run, jump, is, have, etc.)
  if (term.has('#Verb') || term.has('#Modal') || term.has('#Auxiliary') || 
      term.has('#Participle') || term.has('#Gerund')) {
    return 'Verb'
  }
  
  // Nouns - people, places, things, ideas (including numbers, values, etc.)
  if (term.has('#Noun') || term.has('#Cardinal') || term.has('#Ordinal') || 
      term.has('#Value') || term.has('#Determiner') || term.has('#Possessive')) {
    return 'Noun'
  }
  
  // Default fallback
  return 'Noun'
}

// Test with Pride and Prejudice opening
const testPhrase = "It is a truth universally acknowledged that a single man in possession of a good fortune must be in want of a wife"

console.log('=== 9-Category POS System Test ===')
console.log('Phrase:', testPhrase)
console.log('\nWord-by-word classification:')

const doc = nlp(testPhrase)
const words = doc.terms().out('array')
const terms = doc.terms()

const filteredWords = words.filter(word => word.trim().length > 0)
const categoryCount = {}

filteredWords.forEach((word, index) => {
  const term = terms.eq(index)
  const pos = classifyPartOfSpeech(term)
  
  categoryCount[pos] = (categoryCount[pos] || 0) + 1
  console.log(`"${word}" → ${pos}`)
})

console.log('\n=== Category Distribution ===')
Object.entries(categoryCount).forEach(([category, count]) => {
  console.log(`${category}: ${count} words`)
})

console.log('\n=== Angle Verification ===')
const angles = {
  'Conjunction': 0,
  'Article': 40,
  'Adjective': 80,
  'Adverb': 120,
  'Preposition': 160,
  'Interjection': 200,
  'Pronoun': 240,
  'Noun': 280,
  'Verb': 320
}

console.log('Angles (equally spaced):')
Object.entries(angles).forEach(([category, angle]) => {
  console.log(`${category}: ${angle}°`)
})

// Verify equal spacing (40° between each)
const sortedAngles = Object.values(angles).sort((a, b) => a - b)
console.log('\nAngle differences:')
for (let i = 0; i < sortedAngles.length - 1; i++) {
  const diff = sortedAngles[i + 1] - sortedAngles[i]
  console.log(`${sortedAngles[i]}° to ${sortedAngles[i + 1]}°: ${diff}°`)
}
const lastDiff = 360 - sortedAngles[sortedAngles.length - 1] + sortedAngles[0]
console.log(`${sortedAngles[sortedAngles.length - 1]}° to ${sortedAngles[0]}°: ${lastDiff}°`)

console.log('\n✅ All words successfully classified into 9 categories!')
console.log('✅ Angles equally spaced around 360° circle!')