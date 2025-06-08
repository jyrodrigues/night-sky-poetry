// Debug NLP classification to see what tags Compromise is giving us
import nlp from 'compromise'

const testPhrase = "It is a truth universally acknowledged that a single man in possession of a good fortune must be in want of a wife"

console.log('=== Debugging Compromise.js Tags ===')
console.log('Phrase:', testPhrase)

const doc = nlp(testPhrase)
const terms = doc.terms()

console.log('\nDetailed tag analysis for problematic words:')

// Check specific problematic words
const problematicWords = ['It', 'truth', 'that']

problematicWords.forEach(word => {
  const wordTerms = doc.match(word)
  if (wordTerms.length > 0) {
    const term = wordTerms.eq(0)
    const tags = term.json()[0]?.tags || []
    console.log(`\n"${word}":`)
    console.log(`  Tags: [${tags.join(', ')}]`)
    console.log(`  has('#Pronoun'): ${term.has('#Pronoun')}`)
    console.log(`  has('#Noun'): ${term.has('#Noun')}`)
    console.log(`  has('#Conjunction'): ${term.has('#Conjunction')}`)
    console.log(`  has('#Determiner'): ${term.has('#Determiner')}`)
    console.log(`  has('#Ordinal'): ${term.has('#Ordinal')}`)
    console.log(`  has('#Subordinating'): ${term.has('#Subordinating')}`)
  }
})

// Show all words with their tags
console.log('\n=== All Words and Their Tags ===')
terms.forEach((term, index) => {
  const text = term.text()
  const tags = term.json()[0]?.tags || []
  console.log(`"${text}" → [${tags.join(', ')}]`)
})