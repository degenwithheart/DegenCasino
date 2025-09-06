import styled from 'styled-components'

export const DebugPanel = styled.div`
  position: fixed
  bottom: 20px
  right: 20px
  width: 400px
  max-height: 600px
  background: rgba(24, 24, 24, 0.95)
  border: 2px solid #ffd700
  border-radius: 12px
  padding: 1rem
  font-family: 'Courier New', monospace
  font-size: 12px
  color: #fff
  backdrop-filter: blur(10px)
  z-index: 9999
  overflow-y: auto
  
  @media (max-width: 768px) {
    width: calc(100vw - 40px)
    bottom: 10px
    right: 10px
  }
`

export const DebugTitle = styled.h3`
  color: #ffd700
  margin: 0 0 1rem 0
  font-size: 14px
  text-align: center
`

export const StatRow = styled.div`
  display: flex
  justify-content: space-between
  margin-bottom: 0.5rem
  padding: 0.25rem
  border-bottom: 1px solid rgba(255, 215, 0, 0.2)
`

export const StatLabel = styled.span`
  color: #ccc
`

export const StatValue = styled.span`
  color: #ffd700
  font-weight: bold
`

export const Button = styled.button`
  background: rgba(255, 215, 0, 0.1)
  border: 1px solid #ffd700
  color: #ffd700
  padding: 0.5rem 1rem
  border-radius: 6px
  cursor: pointer
  font-size: 11px
  margin: 0.25rem
  transition: all 0.2s ease
  
  &:hover {
    background: rgba(255, 215, 0, 0.2)
    transform: translateY(-1px)
  }
  
  &:disabled {
    opacity: 0.5
    cursor: not-allowed
  }
`

export const ActivityList = styled.div`
  max-height: 150px
  overflow-y: auto
  margin-top: 1rem
  border-top: 1px solid rgba(255, 215, 0, 0.2)
  padding-top: 0.5rem
`

export const ActivityItem = styled.div<{ $hit: boolean }>`
  font-size: 10px
  padding: 0.25rem
  margin-bottom: 0.25rem
  background: rgba(\${props => props.$hit ? '34, 197, 94' : '239, 68, 68'}, 0.1)
  border-left: 3px solid \${props => props.$hit ? '#22c55e' : '#ef4444'}
  border-radius: 2px
`

export const ToggleButton = styled.button`
  position: fixed
  bottom: 20px
  right: 20px
  width: 50px
  height: 50px
  border-radius: 50%
  background: rgba(255, 215, 0, 0.9)
  border: none
  color: #000
  font-size: 20px
  cursor: pointer
  z-index: 10000
  transition: all 0.2s ease
  
  &:hover {
    transform: scale(1.1)
    background: #ffd700
  }
`
