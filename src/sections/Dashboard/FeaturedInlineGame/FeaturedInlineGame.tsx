// src/sections/Dashboard/FeaturedInlineGame/FeaturedInlineGame.tsx
import React from 'react'
import { GambaUi } from 'gamba-react-ui-v2'

import { GAMES } from '../../../games'
import { FEATURED_GAME_ID, FEATURED_GAME_INLINE } from '../../../constants'
import {
  Container as GameContainer,
  Screen as GameScreen,
  Controls as GameControls,
} from '../../Game/Game.styles'
import { Wrapper } from './FeaturedInlineGame.styles'

export default function FeaturedInlineGame() {
  if (!FEATURED_GAME_INLINE || !FEATURED_GAME_ID) return null
  const game = GAMES().find((g: any) => g.id === FEATURED_GAME_ID)
  if (!game) return null

  return (
    <Wrapper>
      <GambaUi.Game
        game={game}
        errorFallback={
          <p style={{ color: 'white', textAlign: 'center' }}>
            ⚠️ Unable to load game.
          </p>
        }
      >
        <GameContainer style={{ gap: 10, width: '100%' }}>
          {/* force the same 600px height as your regular <Screen> */}
          <GameScreen style={{ width: '100%', height: '600px' }}>
            <GambaUi.PortalTarget target="screen" />
          </GameScreen>
          {/* controls + play button */}
          <GameControls
            style={{
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <GambaUi.PortalTarget target="controls" />
          </GameControls>
        </GameContainer>
      </GambaUi.Game>
    </Wrapper>
  )
}
