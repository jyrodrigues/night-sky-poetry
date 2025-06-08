export interface Star {
  x: number
  y: number
  size: 'large' | 'medium' | 'small' | 'tiny'
  roman?: string
  paragraphIndex?: number
  color?: string
  partOfSpeech?: PartOfSpeech
  shape?: 'circle' | 'star'
  word?: string
  visible?: boolean
  opacity?: number
}

export interface Connection {
  from: number
  to: number
  paragraphIndex?: number
  visible?: boolean
  opacity?: number
}

export interface NightSkyData {
  stars: Star[]
  connections: Connection[]
  paragraphs: string[]
}

export type ViewState = 'input' | 'generating' | 'results'

export type PartOfSpeech = 
  | 'Noun'
  | 'Verb'
  | 'Adjective'
  | 'Adverb'
  | 'Pronoun'
  | 'Preposition'
  | 'Conjunction'
  | 'Article'
  | 'Interjection'

export interface ConstellationArea {
  centerX: number
  centerY: number
  radius: number
}

export interface ConstellationTransform {
  centerX: number
  centerY: number
  scale: number
}