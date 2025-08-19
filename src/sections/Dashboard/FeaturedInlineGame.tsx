// src/sections/Dashboard/FeaturedInlineGame.tsx
import React from 'react'
import styled from 'styled-components'
import { GambaUi } from 'gamba-react-ui-v2'

import { GAMES } from '../../games'
import { FEATURED_GAME_ID, FEATURED_GAME_INLINE } from '../../constants'
import {
  Container as GameContainer,
  Screen as GameScreen,
  Controls as GameControls,
} from '../Game/Game.styles'

// exactly the same wrapper width as WelcomeBanner / MainWrapper
const Wrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  padding: 16px 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (min-width: 600px) {
    max-width: 900px;
    padding: 24px 24px;
  }
  @media (min-width: 1000px) {
    max-width: 1100px;
    padding: 32px 32px;
  }
  @media (max-width: 767px) {
    width: 100vw;
    max-width: 100vw;
    padding: 8px 0;
    margin: 0 auto;
    box-sizing: border-box;
    overflow-x: hidden;
  }
`


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
            <GambaUi.PortalTarget target="play" />
          </GameControls>
        </GameContainer>
      </GambaUi.Game>
    </Wrapper>
  )
}
