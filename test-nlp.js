// Simple test runner for NLP classification
import nlp from 'compromise'

// Import our classification function (we'll need to adapt for Node.js)
function classifyPartOfSpeech(term) {
  // Get the actual text for specific word checking
  const text = term.text().toLowerCase().trim()
  
  // Check for articles specifically (most common determiners)
  if (text === 'the' || text === 'a' || text === 'an') {
    return 'Article'
  }
  
  // Check for modal verbs
  if (term.has('#Modal') || ['can', 'could', 'should', 'would', 'will', 'shall', 'may', 'might', 'must'].includes(text)) {
    return 'Modal'
  }
  
  // Check for auxiliary verbs
  if (term.has('#Auxiliary') || ['is', 'are', 'was', 'were', 'be', 'being', 'been', 'have', 'has', 'had', 'do', 'does', 'did'].includes(text)) {
    return 'Auxiliary'
  }
  
  // Check for participles and gerunds
  if (term.has('#Participle') || term.has('#PastParticiple') || term.has('#PresentParticiple')) {
    return 'Participle'
  }
  if (term.has('#Gerund')) {
    return 'Gerund'
  }
  
  // Check for possessives
  if (term.has('#Possessive') || text.endsWith("'s") || ['my', 'your', 'his', 'her', 'its', 'our', 'their'].includes(text)) {
    return 'Possessive'
  }
  
  // Check for comparative and superlative forms
  if (term.has('#Comparative') || text.endsWith('er')) {
    return 'Comparative'
  }
  if (term.has('#Superlative') || text.endsWith('est')) {
    return 'Superlative'
  }
  
  // Check for numbers
  if (term.has('#Cardinal') || term.has('#NumericValue') || /^\d+$/.test(text)) {
    return 'Cardinal'
  }
  if (term.has('#Ordinal') || ['first', 'second', 'third', 'fourth', 'fifth'].includes(text) || text.endsWith('th')) {
    return 'Ordinal'
  }
  if (term.has('#Value') || term.has('#Money') || term.has('#Percent')) {
    return 'Value'
  }
  
  // Check for question words
  if (term.has('#QuestionWord') || ['who', 'what', 'when', 'where', 'why', 'how', 'which'].includes(text)) {
    return 'QuestionWord'
  }
  
  // Main part-of-speech categories (order matters - more specific first)
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

// Test the Pride and Prejudice opening line
const testPhrase = "It is a truth universally acknowledged that a single man in possession of a good fortune must be in want of a wife"

// Expected classifications based on the constellation image
const expectedClassifications = [
  { word: "It", expectedPOS: "Pronoun" },
  { word: "is", expectedPOS: "Auxiliary" },
  { word: "a", expectedPOS: "Article" },
  { word: "truth", expectedPOS: "Noun" },
  { word: "universally", expectedPOS: "Adverb" },
  { word: "acknowledged", expectedPOS: "Verb" },
  { word: "that", expectedPOS: "Conjunction" },
  { word: "a", expectedPOS: "Article" },
  { word: "single", expectedPOS: "Adjective" },
  { word: "man", expectedPOS: "Noun" },
  { word: "in", expectedPOS: "Preposition" },
  { word: "possession", expectedPOS: "Noun" },
  { word: "of", expectedPOS: "Preposition" },
  { word: "a", expectedPOS: "Article" },
  { word: "good", expectedPOS: "Adjective" },
  { word: "fortune", expectedPOS: "Noun" },
  { word: "must", expectedPOS: "Modal" },
  { word: "be", expectedPOS: "Auxiliary" },
  { word: "in", expectedPOS: "Preposition" },
  { word: "want", expectedPOS: "Noun" },
  { word: "of", expectedPOS: "Preposition" },
  { word: "a", expectedPOS: "Article" },
  { word: "wife", expectedPOS: "Noun" }
]

console.log('=== NLP Classification Test: Pride and Prejudice Opening ===')
console.log('Phrase:', testPhrase)
console.log('\nWord-by-word analysis:')

const doc = nlp(testPhrase)
const words = doc.terms().out('array')
const terms = doc.terms()

let correctCount = 0
let totalCount = 0

const filteredWords = words.filter(word => word.trim().length > 0)

filteredWords.forEach((word, index) => {
  if (index < expectedClassifications.length) {
    const term = terms.eq(index)
    const actualPOS = classifyPartOfSpeech(term)
    const expected = expectedClassifications[index]
    
    const isCorrect = actualPOS === expected.expectedPOS
    const status = isCorrect ? '✓' : '✗'
    
    if (isCorrect) correctCount++
    totalCount++
    
    console.log(`${status} "${word}" → Actual: ${actualPOS}, Expected: ${expected.expectedPOS}`)
  }
})

console.log(`\n=== Test Results ===`)
console.log(`Correct: ${correctCount}/${totalCount} (${((correctCount/totalCount)*100).toFixed(1)}%)`)
console.log(`Total words: ${filteredWords.length}`)

// Calculate path length
const pathLength = filteredWords.reduce((sum, word) => sum + (word.length * 1.5), 0)
console.log(`Expected path length: ${pathLength.toFixed(1)} units`)

// Test specific categories
console.log(`\n=== Category-specific Tests ===`)

// Articles
const articleCount = filteredWords.filter(word => word.toLowerCase() === 'a').length
console.log(`Articles found: ${articleCount} instances of "a"`)

// Modal verbs
const modalWords = filteredWords.filter(word => word.toLowerCase() === 'must')
console.log(`Modal verbs: Found "${modalWords.join(', ')}"`)

// Auxiliary verbs  
const auxWords = filteredWords.filter(word => ['is', 'be'].includes(word.toLowerCase()))
console.log(`Auxiliary verbs: Found "${auxWords.join(', ')}"`)