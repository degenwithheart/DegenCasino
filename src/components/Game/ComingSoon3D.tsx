import React, { Suspense, ReactNode } from 'react'
import styled from 'styled-components'
import { Canvas } from '@react-three/fiber'
import { GambaUi } from 'gamba-react-ui-v2'
import { GameStatsHeader } from '../Game/GameStatsHeader'
import { MobileControls } from '../Mobile/MobileControls'

interface ComingSoon3DProps {
  // Game identification
  gameName: string
  gameId: string
  
  // Visual customization
  primaryColor?: string
  secondaryColor?: string
  emoji?: string
  
  // Content customization
  title?: string
  subtitle?: string
  hintText?: string
  
  // 3D Scene
  scene3D?: React.ComponentType
  
  // Game integration
  gameStats: any
  onResetStats: () => void
  wager: any
  setWager: (wager: any) => void
  mobile?: boolean
  
  // Background component (optional)
  backgroundComponent?: React.ComponentType<{ children: ReactNode }>
}

// Standardized styled components based on Plinko's design
const Container3D = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(135deg, #0a0511 0%, #1a1a2e 50%, #16213e 100%);
  border-radius: 12px;
  overflow: hidden;
`

const LoadingFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: white;
  font-size: 18px;
  background: linear-gradient(135deg, #0a0511 0%, #1a1a2e 50%, #16213e 100%);
`

const ComingSoonOverlay = styled.div<{ primaryColor?: string }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 40px;
  border-radius: 20px;
  border: 2px solid ${props => props.primaryColor ? `${props.primaryColor}80` : 'rgba(156, 39, 176, 0.5)'};
  text-align: center;
  z-index: 10;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    padding: 30px;
    max-width: 90vw;
  }
  
  @media (max-width: 480px) {
    padding: 20px;
    border-radius: 16px;
  }
`

const ComingSoonTitle = styled.h2<{ primaryColor?: string }>`
  color: ${props => props.primaryColor || '#9c27b0'};
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
  
  @media (max-width: 480px) {
    font-size: 24px;
  }
`

const ComingSoonSubtitle = styled.p<{ secondaryColor?: string }>`
  color: ${props => props.secondaryColor || '#e91e63'};
  font-size: 16px;
  margin: 0 0 24px 0;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 16px;
  }
`

const ToggleHint = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
  font-style: italic;
  
  @media (max-width: 480px) {
    font-size: 13px;
  }
`

// Default 3D scene component for games without custom scenes
const DefaultScene3D: React.FC = () => (
  <>
    <ambientLight intensity={0.4} />
    <pointLight position={[10, 10, 10]} intensity={0.8} />
    <pointLight position={[-10, -10, -10]} intensity={0.5} />
  </>
)

/**
 * Universal 3D Coming Soon component for all games
 * Provides consistent layout and styling across all 3D game modes
 */
export default function ComingSoon3D({
  gameName,
  gameId,
  primaryColor = '#9c27b0',
  secondaryColor = '#e91e63',
  emoji = '🎯',
  title,
  subtitle,
  hintText = 'Toggle back to 2D mode to play the current version',
  scene3D: Scene3D = DefaultScene3D,
  gameStats,
  onResetStats,
  wager,
  setWager,
  mobile = false,
  backgroundComponent: BackgroundComponent
}: ComingSoon3DProps) {
  
  const defaultTitle = title || `${emoji} 3D ${gameName} Coming Soon!`
  const defaultSubtitle = subtitle || `Experience ${gameName} like never before with realistic 3D physics,\ninteractive camera controls, immersive lighting effects,\nand stunning visual effects in full 3D space.`
  
  const ContentWrapper = BackgroundComponent || React.Fragment
  
  return (
    <>
      {/* Stats Portal - positioned above game screen */}
      <GambaUi.Portal target="stats">
        <GameStatsHeader
          gameName={gameName}
          gameMode="3D (Coming Soon)"
          rtp="98"
          stats={gameStats}
          onReset={onResetStats}
          isMobile={mobile}
        />
      </GambaUi.Portal>

      <GambaUi.Portal target="screen">
        <ContentWrapper>
          <Container3D>
            <Suspense fallback={<LoadingFallback>Loading 3D {gameName} Scene...</LoadingFallback>}>
              <Canvas>
                <Scene3D />
              </Canvas>
            </Suspense>
            
            <ComingSoonOverlay primaryColor={primaryColor}>
              <ComingSoonTitle primaryColor={primaryColor}>
                {defaultTitle}
              </ComingSoonTitle>
              <ComingSoonSubtitle secondaryColor={secondaryColor}>
                {defaultSubtitle.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < defaultSubtitle.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </ComingSoonSubtitle>
              <ToggleHint>
                {hintText}
              </ToggleHint>
            </ComingSoonOverlay>
          </Container3D>
        </ContentWrapper>
      </GambaUi.Portal>

      <GambaUi.Portal target="controls">
        <MobileControls
          wager={wager}
          setWager={setWager}
          onPlay={() => {}}
          playDisabled={true}
          playText="3D Mode Coming Soon"
        >
          {/* Mode Toggle - each game can add their specific controls here */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            {/* Games can inject their specific controls as children */}
          </div>
        </MobileControls>
      </GambaUi.Portal>
    </>
  )
}