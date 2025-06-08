export function createStarPoints(cx: number, cy: number, radius: number): string {
  const points = []
  const spikes = 5
  const outerRadius = radius
  const innerRadius = radius * 0.4
  
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i * Math.PI) / spikes - Math.PI / 2
    const r = i % 2 === 0 ? outerRadius : innerRadius
    const x = cx + Math.cos(angle) * r
    const y = cy + Math.sin(angle) * r
    points.push(`${x},${y}`)
  }
  
  return points.join(' ')
}