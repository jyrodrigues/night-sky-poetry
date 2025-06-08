import { createStarPoints } from '../utils'

export function Legend() {
  return (
    <div className="flex justify-between items-start w-full max-w-4xl mx-auto mt-8">
      {/* Parts of Speech */}
      <div className="text-white">
        <h3 className="text-sm font-light tracking-wider mb-4">PARTS OF SPEECH</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <polygon points={createStarPoints(8, 8, 3)} fill="#fbbf24" />
            </svg>
            <span className="font-light">Verb</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <polygon points={createStarPoints(8, 8, 3)} fill="#8b5cf6" />
            </svg>
            <span className="font-light">Adverb</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <polygon points={createStarPoints(8, 8, 3)} fill="#ef4444" />
            </svg>
            <span className="font-light">Adjective</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="3" fill="#ffffff" />
            </svg>
            <span className="font-light">Noun</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="3" fill="#10b981" />
            </svg>
            <span className="font-light">Pronoun</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <polygon points={createStarPoints(8, 8, 3)} fill="#3b82f6" />
            </svg>
            <span className="font-light">Preposition</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="3" fill="#f59e0b" />
            </svg>
            <span className="font-light">Conjunction</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <polygon points={createStarPoints(8, 8, 3)} fill="#ec4899" />
            </svg>
            <span className="font-light">Determiner</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="3" fill="#6366f1" />
            </svg>
            <span className="font-light">Interjection</span>
          </div>
        </div>
      </div>
      
      {/* Stars legend */}
      <div className="text-white">
        <h3 className="text-sm font-light tracking-wider mb-4">WORD LENGTH</h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="1.5" fill="white" />
            </svg>
            <span className="font-light">1-3 letters (tiny)</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="2.5" fill="white" />
            </svg>
            <span className="font-light">4-5 letters (small)</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="4" fill="white" />
            </svg>
            <span className="font-light">6-8 letters (medium)</span>
          </div>
          <div className="flex items-center gap-3">
            <svg width="16" height="16">
              <circle cx="8" cy="8" r="6" fill="white" />
            </svg>
            <span className="font-light">9+ letters (large)</span>
          </div>
        </div>
      </div>
    </div>
  )
}