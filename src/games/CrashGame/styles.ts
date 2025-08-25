import styled, { keyframes, css } from 'styled-components'
import rocketAnimation from './rocket.gif'
import { makeDeterministicRng } from '../../fairness/deterministicRng'

const generateMultipleBoxShadows = (n: number, seed: string) => {
  const maxX = typeof window !== 'undefined' ? window.innerWidth : 1920
  const maxY = 4000
  const rng = makeDeterministicRng(seed)
  let value = `${(rng()*maxX).toFixed(2)}px ${(rng()*maxY).toFixed(2)}px #ffffff`
  for (let i = 2; i <= n; i++) {
    value += `, ${(rng()*maxX).toFixed(2)}px ${(rng()*maxY).toFixed(2)}px #ffffff`
  }
  return value
}

// Fixed seeds so visual field is reproducible across sessions
const shadowsSmall = generateMultipleBoxShadows(700, 'crash:small')
const shadowsMedium = generateMultipleBoxShadows(200, 'crash:medium')
const shadowsBig = generateMultipleBoxShadows(100, 'crash:big')

export const animStar = keyframes`
  from {
    transform: translateY(-100vh);
  }
  to {
    transform: translateY(0);
  }
`

export const StarsLayer = styled.div<{ enableMotion?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  ${props => props.enableMotion !== false && css`
    animation: ${animStar} linear infinite;
  `}
`

export const StarsLayer1 = styled(StarsLayer)`
  width: 1px;
  height: 1px;
  ${props => props.enableMotion !== false && css`
    animation-duration: 150s;
  `}
  opacity: 1;
  transition: ${props => props.enableMotion !== false ? 'opacity 12s' : 'none'};
  box-shadow: ${shadowsSmall};
`

export const LineLayer1 = styled(StarsLayer)`
  width: 1px;
  height: 12px;
  top: -12px;
  ${props => props.enableMotion !== false && css`
    animation-duration: 75s;
  `}
  opacity: 0;
  transition: ${props => props.enableMotion !== false ? 'opacity 2s' : 'none'};
  box-shadow: ${shadowsSmall};
`

export const StarsLayer2 = styled(StarsLayer)`
  width: 2px;
  height: 2px;
  ${props => props.enableMotion !== false && css`
    animation-duration: 100s;
  `}
  box-shadow: ${shadowsMedium};
`

export const LineLayer2 = styled(StarsLayer)`
  width: 2px;
  height: 25px;
  top: -25px;
  ${props => props.enableMotion !== false && css`
    animation-duration: 6s;
  `}
  opacity: 0;
  transition: ${props => props.enableMotion !== false ? 'opacity 1s' : 'none'};
  box-shadow: ${shadowsMedium};
`

export const StarsLayer3 = styled(StarsLayer)`
  width: 3px;
  height: 3px;
  ${props => props.enableMotion !== false && css`
    animation-duration: 50s;
  `}
  box-shadow: ${shadowsBig};
`

export const LineLayer3 = styled(StarsLayer)`
  width: 2px;
  height: 50px;
  top: -50px;
  ${props => props.enableMotion !== false && css`
    animation-duration: 3s;
  `}
  opacity: 0;
  transition: ${props => props.enableMotion !== false ? 'opacity 1s' : 'none'};
  box-shadow: ${shadowsBig};
`

export const ScreenWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
`

export const MultiplierText = styled.div`
  font-size: 48px;
  color: ${props => props.color || '#fff'}; // Use color prop or default to white
  text-shadow: 0 0 20px #fff;
  z-index: 1;
  font-family: monospace;
`

export const Rocket = styled.div`
  position: absolute;
  width: 120px;
  aspect-ratio: 1 / 1;
  background-image: url(${rocketAnimation});
  background-size: contain;
  background-repeat: no-repeat;
  transition: all 0.1s ease-out;
`

