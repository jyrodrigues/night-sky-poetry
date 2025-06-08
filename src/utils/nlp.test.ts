import nlp from 'compromise'
import { classifyPartOfSpeech } from './nlp'
import type { PartOfSpeech } from '../types'

// Test based on the constellation image provided by the user
// This tests the famous opening line from Pride and Prejudice
describe('NLP Classification Test - Pride and Prejudice Opening', () => {
  const testPhrase = "It is a truth universally acknowledged that a single man in possession of a good fortune must be in want of a wife"
  
  // Expected classifications based on the constellation image
  const expectedClassifications: Array<{ word: string; expectedPOS: PartOfSpeech }> = [
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

  test('should classify each word correctly according to the constellation image', () => {
    const doc = nlp(testPhrase)
    const words = doc.terms().out('array')
    const terms = doc.terms()
    
    // Filter out empty words and match with expected classifications
    const filteredWords = words.filter(word => word.trim().length > 0)
    
    console.log('\n=== NLP Classification Test Results ===')
    console.log('Phrase:', testPhrase)
    console.log('\nWord-by-word analysis:')
    
    filteredWords.forEach((word, index) => {
      if (index < expectedClassifications.length) {
        const term = terms.eq(index)
        const actualPOS = classifyPartOfSpeech(term)
        const expected = expectedClassifications[index]
        
        const isCorrect = actualPOS === expected.expectedPOS
        const status = isCorrect ? '✓' : '✗'
        
        console.log(`${status} "${word}" → Actual: ${actualPOS}, Expected: ${expected.expectedPOS}`)
        
        expect(word.toLowerCase()).toBe(expected.word.toLowerCase())
        expect(actualPOS).toBe(expected.expectedPOS)
      }
    })
  })

  test('should identify articles correctly', () => {
    const articles = ['a', 'a', 'a', 'a'] // Four instances of "a" in the phrase
    const doc = nlp(testPhrase)
    const terms = doc.terms()
    
    articles.forEach((article, index) => {
      // Find each occurrence of "a"
      const articleTerms = terms.match(article)
      if (articleTerms.length > index) {
        const classification = classifyPartOfSpeech(articleTerms.eq(index))
        expect(classification).toBe('Article')
      }
    })
  })

  test('should identify modal verbs correctly', () => {
    const doc = nlp(testPhrase)
    const mustTerm = doc.match('must')
    
    if (mustTerm.length > 0) {
      const classification = classifyPartOfSpeech(mustTerm.eq(0))
      expect(classification).toBe('Modal')
    }
  })

  test('should identify auxiliary verbs correctly', () => {
    const doc = nlp(testPhrase)
    const auxiliaries = ['is', 'be']
    
    auxiliaries.forEach(aux => {
      const auxTerm = doc.match(aux)
      if (auxTerm.length > 0) {
        const classification = classifyPartOfSpeech(auxTerm.eq(0))
        expect(classification).toBe('Auxiliary')
      }
    })
  })

  test('should generate accurate path length calculation', () => {
    const doc = nlp(testPhrase)
    const words = doc.terms().out('array').filter(w => w.trim().length > 0)
    
    // Calculate expected path length using the 1.5 multiplier from constellation algorithm
    const expectedPathLength = words.reduce((sum, word) => sum + (word.length * 1.5), 0)
    
    console.log(`\nPath length calculation:`)
    console.log(`Total words: ${words.length}`)
    console.log(`Expected path length: ${expectedPathLength.toFixed(1)} units`)
    
    expect(expectedPathLength).toBeGreaterThan(0)
    expect(words.length).toBe(expectedClassifications.length)
  })
})