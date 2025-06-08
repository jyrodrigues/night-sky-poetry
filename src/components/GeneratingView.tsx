export function GeneratingView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-6 mx-auto"></div>
        <h2 className="text-2xl md:text-3xl font-serif mb-2">Generating Constellations</h2>
        <p className="text-gray-300">Mapping your words to the stars...</p>
      </div>
    </div>
  )
}