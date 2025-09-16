import React from 'react'
import styled from 'styled-components'
import { Icon } from './Icon'
import { useColorScheme } from '../../themes/ColorSchemeContext'

const Container = styled.div`
  position: relative;
  & > button {
    opacity: 0;
  }
  &:hover {
    & > button {
      opacity: .5;
    }
  }
`

const SliderButton = styled.button<{ $colorScheme?: any }>`
  all: unset;
  position: absolute;
  font-size: 24px;
  left: 0px;
  top: 0;
  box-sizing: border-box;
  z-index: 1;
  height: 100%;
  padding: 5px;
  cursor: pointer;
  background: ${({ $colorScheme }) => $colorScheme?.colors?.background || 'var(--background-color)'};
  transition: opacity .2s;
  opacity: .5;
  &:hover {
    opacity: 1!important;
    background: ${({ $colorScheme }) => $colorScheme?.colors?.background || 'var(--background-color)'};
  }
`

const StyledContent = styled.div<{ $colorScheme?: any }>`
  display: flex;
  gap: 15px;
  width: 100%;
  overflow: scroll visible;
  scroll-snap-type: x mandatory;
  transition: height .25s ease;

  &::-webkit-scrollbar {
    height: .0em;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ $colorScheme }) => $colorScheme?.colors?.border || '#cccccc'}33;
  }

  & > * {
    scroll-snap-align: start;
    flex-grow: 0;
    flex-shrink: 0;
  }
`

export function SlideSection(props: React.PropsWithChildren) {
  const ref = React.useRef<HTMLDivElement>(null!)
  const leftArrow = React.useRef<HTMLButtonElement>(null!)
  const rightArrow = React.useRef<HTMLButtonElement>(null!)
  const { currentColorScheme } = useColorScheme()

  const scroll = (x: number) => {
    const left = ref.current.clientWidth / 2 * x
    ref.current.scrollBy({ left, behavior: 'smooth' })
  }

  const _scroll = () => {
    const target = ref.current
    leftArrow.current.style.display = target.scrollLeft > 10 ? 'block' : 'none'
    rightArrow.current.style.display = target.scrollLeft + target.clientWidth < target.scrollWidth - 10 ? 'block' : 'none'
  }

  React.useEffect(
    () => _scroll(),
    [],
  )

  return (
    <Container style={{ position: 'relative' }}>
      <SliderButton ref={leftArrow} onClick={() => scroll(-1)} $colorScheme={currentColorScheme}>
        <Icon.ArrowLeft />
      </SliderButton>
      <StyledContent onScroll={_scroll} ref={ref} $colorScheme={currentColorScheme}>
        {props.children}
      </StyledContent>
      <SliderButton ref={rightArrow} style={{ right: '0', left: 'unset' }} onClick={() => scroll(1)} $colorScheme={currentColorScheme}>
        <Icon.ArrowRight />
      </SliderButton>
    </Container>
  )
}
