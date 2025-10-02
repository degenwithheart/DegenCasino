import React, { useEffect } from 'react'
import styled from 'styled-components'
import { BPS_PER_WHOLE } from 'gamba-core-v2'

// Helper: determine color palette for a bucket multiplier
function getBucketColor(multiplier: number) {
  if (multiplier <= 0.99) {
    return {
      primary: 'rgba(239, 68, 68, 0.9)',
      secondary: 'rgba(220, 38, 38, 0.85)',
      tertiary: 'rgba(185, 28, 28, 0.9)'
    }
  } else if (multiplier >= 1.0 && multiplier <= 3.99) {
    return {
      primary: 'rgba(245, 158, 11, 0.9)',
      secondary: 'rgba(217, 119, 6, 0.85)',
      tertiary: 'rgba(180, 83, 9, 0.9)'
    }
  } else if (multiplier >= 4.0 && multiplier <= 6.99) {
    return {
      primary: 'rgba(34, 197, 94, 0.9)',
      secondary: 'rgba(22, 163, 74, 0.85)',
      tertiary: 'rgba(21, 128, 61, 0.9)'
    }
  } else {
    return {
      primary: 'rgba(59, 130, 246, 0.9)',
      secondary: 'rgba(37, 99, 235, 0.85)',
      tertiary: 'rgba(29, 78, 216, 0.9)'
    }
  }
}

const ScoreboardContainer = styled.div`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
  pointer-events: auto; /* allow hover interactions inside */
  max-height: 68vh; /* cap height and allow scrolling */
  width: 125px;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.06));
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.06);

  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    right: 8px;
    top: 16px;
    transform: none;
    max-height: 40vh;
    width: 64px;
    gap: 6px;
    padding: 8px;
  }

  /* Hide on very small screens */
  @media (max-width: 480px) {
    display: none;
  }
`

const TileGrid = styled.div`
  display: flex;
  flex-direction: column-reverse; /* newest at top visually */
  gap: 10px;
  width: 100%;
  overflow-y: hidden;
  padding-right: 4px; /* avoid touching scrollbar */

  @media (max-width: 768px) {
    gap: 6px;
  }
`

const TileSlot = styled.div<{ isTransitioning?: boolean }>`
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.28s ease;
  transform: translateY(0);
  opacity: 1;

  ${({ isTransitioning }) => isTransitioning && `
    z-index: 10;
    transform: translateY(-4px);
  `}
`

const BucketItem = styled.div<{ 
  multiplier: number;
  isActive?: boolean;
  index: number;
  isPlaceholder?: boolean;
}>`
  position: relative;
  width: 64px;
  height: 44px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  /* Mobile responsive adjustments */
  @media (max-width: 768px) {
    width: 52px;
    height: 36px;
    font-size: 12px;
    border-radius: 6px;
  }
  
  ${({ multiplier, isPlaceholder }) => {
    if (isPlaceholder) {
      return `
        /* Enhanced 3D placeholder styling */
        background: linear-gradient(135deg, 
          rgba(100, 100, 100, 0.3), 
          rgba(80, 80, 80, 0.3) 50%, 
          rgba(60, 60, 60, 0.3)
        );
        border: 2px dashed rgba(255, 255, 255, 0.2);
        
        /* Multiple shadow layers for 3D depth */
        box-shadow: 
          0 6px 12px rgba(5, 5, 15, 0.4),
          0 4px 8px rgba(8, 8, 20, 0.3),
          0 2px 4px rgba(15, 15, 30, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      `;
    }
    const colors = getBucketColor(multiplier);
    return `
      /* Enhanced 3D gradient backgrounds like Mines */
      background: linear-gradient(135deg, 
        ${colors.primary}, 
        ${colors.secondary} 50%, 
        ${colors.tertiary}
      );
      
      /* Multiple shadow layers for 3D depth */
      box-shadow: 
        0 6px 12px rgba(5, 5, 15, 0.4),
        0 4px 8px rgba(8, 8, 20, 0.3),
        0 2px 4px rgba(15, 15, 30, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
        
      /* Enhanced 3D border effects */
      border: 3px solid ${colors.primary.replace('0.9)', '0.8)')};
    `;
  }}
  
  /* Enhanced 3D highlight overlay */
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 10px;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  ${({ isActive }) => isActive && `
    &::before {
      opacity: 1;
    }
  `}
  
  /* Enhanced 3D animation with more dramatic effects */
  @keyframes bucketPulse {
    0% {
      transform: scale(1.15);
    }
    50% {
      transform: scale(1.25);
      box-shadow: 
        0 12px 30px rgba(255, 215, 0, 0.8),
        0 8px 20px rgba(5, 5, 15, 0.4),
        0 6px 12px rgba(8, 8, 20, 0.3),
        0 4px 8px rgba(15, 15, 30, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }
    100% {
      transform: scale(1.15);
    }
  }
  
  @media (max-width: 768px) {
    @keyframes bucketPulse {
      0% {
        transform: scale(1.1);
      }
      50% {
        transform: scale(1.2);
      }
      100% {
        transform: scale(1.1);
      }
    }
  }
`

const BucketIndex = styled.div`
  position: absolute;
  top: -8px;
  left: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.3);
  
  /* Enhanced 3D styling for index badge */
  box-shadow: 
    0 3px 6px rgba(5, 5, 15, 0.6),
    0 2px 4px rgba(8, 8, 20, 0.4),
    0 1px 2px rgba(15, 15, 30, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
    
  /* 3D border effect */
  border: 2px solid rgba(255, 255, 255, 0.4);
  
  /* Text shadow for depth */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  
  @media (max-width: 768px) {
    width: 14px;
    height: 14px;
    font-size: 8px;
    top: -6px;
    left: -6px;
  }
`

const ScoreboardTitle = styled.div`
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  letter-spacing: 0.5px;
  
  /* Enhanced 3D text styling */
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.8),
    0 1px 2px rgba(0, 0, 0, 0.6),
    1px 1px 0 rgba(255, 255, 255, 0.3);
    
  /* Subtle background for depth */
  background: linear-gradient(135deg, 
    rgba(0, 0, 0, 0.4), 
    rgba(20, 20, 30, 0.3)
  );
  padding: 4px 8px;
  border-radius: 6px;
  
  /* 3D border effect */
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 2px 4px rgba(5, 5, 15, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
`

interface BucketScoreboardProps {
  multipliers: number[];
  activeBuckets?: Set<number>;
  bucketHits?: Map<number, number>; // bucket index -> hit count
  recentHits?: number[]; // Array of recent bucket indices in order
}

interface TileData {
  bucketIndex: number;
  isPlaceholder: boolean;
  id: string; // Unique identifier for tracking
}

export const BucketScoreboard: React.FC<BucketScoreboardProps> = ({
  multipliers,
  activeBuckets = new Set(),
  bucketHits = new Map(),
  recentHits = []
}) => {
  const [isMobile, setIsMobile] = React.useState(false)
  const [tiles, setTiles] = React.useState<TileData[]>([])
  const [transitioning, setTransitioning] = React.useState(false)
  
  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const maxTiles = isMobile ? 4 : 6
  
  // Initialize with placeholder tiles
  useEffect(() => {
    const initialTiles: TileData[] = Array.from({ length: maxTiles }, (_, i) => ({
      bucketIndex: -1,
      isPlaceholder: true,
      id: `placeholder-${i}-${maxTiles}` // Include maxTiles in ID to force re-render on resize
    }))
    setTiles(initialTiles)
  }, [maxTiles])
  
  // Handle new bucket hits
  useEffect(() => {
    if (recentHits.length === 0) return
    
    const latestHit = recentHits[recentHits.length - 1]
    
    // Always add new hits, even if they're duplicates (remove the duplicate check)
    setTransitioning(true)
    
    // Create new tile for the bottom position
    const newTile: TileData = {
      bucketIndex: latestHit,
      isPlaceholder: false,
      id: `bucket-${latestHit}-${Date.now()}`
    }
    
    // Shift all tiles up and add new one at bottom
    setTiles(prevTiles => {
      const newTiles = [...prevTiles.slice(1), newTile]
      return newTiles
    })
    
    // Clear transitioning state after animation
    setTimeout(() => setTransitioning(false), 500)
    
  }, [recentHits])

  return (
    <ScoreboardContainer>
      <ScoreboardTitle>RECENT HITS</ScoreboardTitle>
      <TileGrid>
        {tiles.map((tile, index) => (
          <TileSlot 
            key={tile.id}
            isTransitioning={transitioning}
          >
            <BucketItem
              multiplier={tile.isPlaceholder ? 0 : (multipliers[tile.bucketIndex] || 0)}
              isActive={!tile.isPlaceholder && activeBuckets.has(tile.bucketIndex)}
              index={tile.bucketIndex}
              isPlaceholder={tile.isPlaceholder}
            >
              {!tile.isPlaceholder && (
                <>
                  {(multipliers[tile.bucketIndex] || 0).toFixed(2)}×
                </>
              )}
              {tile.isPlaceholder && (
                <div style={{ 
                  opacity: 0.4, 
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.5)'
                }}>
                  --
                </div>
              )}
            </BucketItem>
          </TileSlot>
        ))}
      </TileGrid>
    </ScoreboardContainer>
  )
}
