import React, { useRef, useEffect, useCallback } from 'react'
import styled from 'styled-components'

interface GestureHandlerProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onTap?: () => void;
  threshold?: number;
  className?: string;
}

const GestureContainer = styled.div`
  width: 100%;
  height: 100%;
  touch-action: pan-y; /* Allow vertical scrolling but capture horizontal gestures */
`

const GestureHandler: React.FC<GestureHandlerProps> = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  onTap,
  threshold = 50,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const startPos = useRef<{ x: number; y: number } | null>(null)
  const isDragging = useRef(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0]
    startPos.current = { x: touch.clientX, y: touch.clientY }
    isDragging.current = false
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!startPos.current) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - startPos.current.x
    const deltaY = touch.clientY - startPos.current.y

    // If movement is significant, consider it a drag
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      isDragging.current = true
    }
  }, [])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!startPos.current || !isDragging.current) {
      // If not dragging, it's a tap
      if (onTap && !isDragging.current) {
        onTap()
      }
      startPos.current = null
      isDragging.current = false
      return
    }

    const touch = e.changedTouches[0]
    const deltaX = touch.clientX - startPos.current.x
    const deltaY = touch.clientY - startPos.current.y

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Determine swipe direction based on which delta is larger
    if (absDeltaX > threshold || absDeltaY > threshold) {
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight()
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft()
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown()
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp()
        }
      }
    }

    startPos.current = null
    isDragging.current = false
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onTap, threshold])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: false })

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return (
    <GestureContainer ref={containerRef} className={className}>
      {children}
    </GestureContainer>
  )
}

export default GestureHandler