import React from 'react'
import styled from 'styled-components'
import { GambaUi } from 'gamba-react-ui-v2'
import { Controls, MetaControls, IconButton } from '../../sections/Game/Game.styles'

const FullscreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const FullscreenGameArea = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background: transparent;
`

const FullscreenControlsWrapper = styled.div`
  position: relative;
  z-index: 10;
  padding: 20px;
`

interface FullscreenPortalProps {
  onExit: () => void
  metaControls: React.ReactNode
  modals?: React.ReactNode
}

export const FullscreenPortal: React.FC<FullscreenPortalProps> = ({ onExit, metaControls, modals }) => {
  // Handle ESC key to exit fullscreen
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onExit()
      }
    }
    
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [onExit])
  
  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      // Allow a brief delay for portal cleanup
      setTimeout(() => {}, 10)
    }
  }, [])

  return (
    <FullscreenOverlay>
      <FullscreenGameArea>
        <GambaUi.PortalTarget target="screen" />
      </FullscreenGameArea>
      
      <FullscreenControlsWrapper>
        <Controls>
          <div className="control-buttons">
            <GambaUi.PortalTarget target="controls" />
            <IconButton as="div" className="play-button-portal">
              <GambaUi.PortalTarget target="play" />
            </IconButton>
          </div>
          <MetaControls>
            {metaControls}
          </MetaControls>
        </Controls>
      </FullscreenControlsWrapper>
      {modals}
    </FullscreenOverlay>
  )
}
