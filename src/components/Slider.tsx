import React from 'react'
import styled from 'styled-components'
import { Icon } from './Icon'

// Container that shows arrows on hover
const Container = styled.div`
  position: relative;

  &:hover > button {
    opacity: 1;
  }

  @media (max-width: 600px) {
    margin-bottom: 4px;
  }
`

// Sticky side buttons with hover effect
const SliderButton = styled.button`
  all: unset;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(24, 24, 24, 0.4);
  transition: opacity 0.2s ease, background 0.2s ease;
  opacity: 0;
  cursor: pointer;

  &:hover {
    background: rgba(24, 24, 24, 0.8);
  }

  svg {
    font-size: 24px;
  }

  @media (max-width: 600px) {
    width: 48px;
    min-height: 48px;
    opacity: 1;
    background: rgba(24, 24, 24, 0.7);
    svg {
      font-size: 28px;
    }
    border-radius: 8px;
    top: 2px;
    bottom: 2px;
  }
`

// Horizontal scroll container with touch momentum
const StyledContent = styled.div`
  display: flex;
  gap: 15px;
  width: 100%;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;

  /* OPTIONAL: Add scrollbar styling */
  &::-webkit-scrollbar {
    height: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    background-color: var(--gamba-ui-primary-color);
    border-radius: 4px;
  }

  & > * {
    scroll-snap-align: start;
    flex-shrink: 0;
  }

  @media (max-width: 600px) {
    gap: 8px;
    padding-bottom: 8px;
    min-height: 60px;
    padding-left: 2px;
    padding-right: 2px;
  }
`

export function SlideSection({ children }: React.PropsWithChildren) {
  const ref = React.useRef<HTMLDivElement>(null)

  // Manual scroll via buttons
  const scrollBy = (direction: 'left' | 'right') => {
    const el = ref.current
    if (!el) return
    const offset = el.clientWidth / 2
    el.scrollBy({ left: direction === 'left' ? -offset : offset, behavior: 'smooth' })
  }

  return (
    <Container>
      <SliderButton style={{ left: 0 }} onClick={() => scrollBy('left')}>
        <Icon.ArrowLeft />
      </SliderButton>

      <StyledContent ref={ref}>
        {React.Children.map(children, (child, index) => (
          <div key={index}>{child}</div>
        ))}
      </StyledContent>

      <SliderButton style={{ right: 0 }} onClick={() => scrollBy('right')}>
        <Icon.ArrowRight />
      </SliderButton>
    </Container>
  )
}
