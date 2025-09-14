import React from 'react'

interface GameControlsSectionProps {
  children: React.ReactNode
  height?: number | 'auto'
  gap?: number
  padding?: string
}

export function GameControlsSection({
  children,
  height = 'auto' as const,
  gap = 12,
  padding = '12px 16px'
}: GameControlsSectionProps) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '20px',
      left: '20px',
      right: '20px',
      height: height === 'auto' ? 'auto' : `${height}px`,
      minHeight: '60px',
      maxHeight: '120px',
      background: 'linear-gradient(135deg, rgba(10, 5, 17, 0.95) 0%, rgba(139, 90, 158, 0.15) 50%, rgba(10, 5, 17, 0.95) 100%)',
      borderRadius: '16px',
      border: '2px solid rgba(212, 165, 116, 0.6)',
      boxShadow: '0 6px 24px rgba(10, 5, 17, 0.5), inset 0 1px 0 rgba(212, 165, 116, 0.3)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'center',
      padding,
      gap: `${gap}px`,
      zIndex: 10,
      overflow: 'hidden'
    }}>
      {children}
    </div>
  )
}