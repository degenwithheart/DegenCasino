import React from 'react'

export const Toggle2DIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="6" y="6" width="4" height="3" fill="currentColor"/>
    <rect x="14" y="6" width="4" height="3" fill="currentColor"/>
    <rect x="6" y="11" width="12" height="2" fill="currentColor"/>
    <text x="12" y="21" textAnchor="middle" fontSize="6" fill="currentColor">2D</text>
  </svg>
)

export const Toggle3DIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
    <path d="M2 7l10 5 10-5" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 12v10" stroke="currentColor" strokeWidth="2"/>
    <text x="12" y="21" textAnchor="middle" fontSize="6" fill="currentColor">3D</text>
  </svg>
)

export const ToggleIcon = ({ mode }: { mode: '2D' | '3D' }) => {
  return mode === '2D' ? <Toggle2DIcon /> : <Toggle3DIcon />
}