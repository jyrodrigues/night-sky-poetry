interface InputFormProps {
  inputText: string
  setInputText: (text: string) => void
  onGenerate: () => void
}

export function InputForm({ inputText, setInputText, onGenerate }: InputFormProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-4 tracking-wide">
          Night Sky Poetry
        </h1>
        <p className="text-lg md:text-xl text-gray-300 font-light">
          Transform your text into constellations
        </p>
      </div>
      
      {/* Input form */}
      <div className="w-full max-w-2xl">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your text here..."
          className="w-full h-64 p-6 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
        />
        
        <div className="flex justify-center mt-6">
          <button
            onClick={onGenerate}
            disabled={!inputText.trim()}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-950"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  )
}