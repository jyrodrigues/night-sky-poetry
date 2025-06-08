import { useState, useCallback } from 'react'
import { easeInOutCubic } from '../utils'

export function useAnimation() {
  const [animationProgress, setAnimationProgress] = useState(0)
  const [isAnimatingBack, setIsAnimatingBack] = useState(false)

  const animateToProgress = useCallback((
    targetProgress: number, 
    duration: number = 1000,
    onComplete?: () => void
  ) => {
    const startTime = Date.now()
    const startProgress = animationProgress
    const deltaProgress = targetProgress - startProgress

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeProgress = easeInOutCubic(progress)
      
      const currentProgress = startProgress + (deltaProgress * easeProgress)
      setAnimationProgress(currentProgress)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        onComplete?.()
      }
    }
    
    requestAnimationFrame(animate)
  }, [animationProgress])

  const animateForward = useCallback((onComplete?: () => void) => {
    setIsAnimatingBack(false)
    animateToProgress(100, 1000, onComplete)
  }, [animateToProgress])

  const animateBackward = useCallback((onComplete?: () => void) => {
    setIsAnimatingBack(true)
    animateToProgress(0, 1000, () => {
      setIsAnimatingBack(false)
      onComplete?.()
    })
  }, [animateToProgress])

  const resetAnimation = useCallback(() => {
    setAnimationProgress(0)
    setIsAnimatingBack(false)
  }, [])

  return {
    animationProgress,
    isAnimatingBack,
    animateForward,
    animateBackward,
    resetAnimation
  }
}