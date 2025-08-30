import React from 'react'
import { Icon } from './Icon'
import useOutsideClick from '../hooks/useOnClickOutside'
import styled from 'styled-components'
import { useTheme } from '../themes/ThemeContext'

interface Props extends React.PropsWithChildren {
  onClose?: () => void
}

const Container = styled.div`
  display: flex;
  padding: 10vh 20px 10vh 20px; /* 10% from top and bottom */
  min-height: calc(80vh); /* 100vh - 20vh (10% top + 10% bottom) */
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  @media (max-width: 600px) {
    /* Center modal on small screens with consistent insets */
    padding: 10vh 16px 10vh 16px; /* 10% from top and bottom on mobile */
    padding-left: max(16px, env(safe-area-inset-left));
    padding-right: max(16px, env(safe-area-inset-right));
    padding-bottom: max(calc(10vh + 24px), calc(10vh + env(safe-area-inset-bottom) + 72px)); /* leave space above mobile nav */
    min-height: 80vh; /* 100vh - 20vh (10% top + 10% bottom) */
    align-items: center;
    justify-content: center;
    height: 80vh;
    overflow-y: auto;
  }
`

const Wrapper = styled.div<{ $theme?: any }>`
  @keyframes wrapper-appear2 {
    0% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }

  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: column;
  z-index: 100;
  max-height: 80vh;
  max-width: 780px;
  width: 100%;
  border-radius: 10px;
  padding-bottom: 20px;
  animation: wrapper-appear2 0.3s;
  color: ${({ $theme }) => $theme?.colors?.text || 'white'};
  
  /* Desktop styles - more transparent/light */
  background: transparent;
  border: 0px solid rgba(255, 215, 0, 0.1);
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0.1);
  
  /* Mobile/Tablet styles - solid background with defined colors */
  @media (max-width: 1024px) {
    background: ${({ $theme }) => $theme?.colors?.surface || '#1a1a2e'};
    border: 1px solid ${({ $theme }) => $theme?.colors?.border || '#2a2a4a'};
    box-shadow: ${({ $theme }) => $theme?.effects?.shadow || '0 4px 24px rgba(0, 0, 0, 0.2)'};
  }
  
  overflow-y: auto; /* Enable scrolling if content exceeds max-height */
`

const StyledModal = styled.div<{ $theme?: any }>`
  @keyframes appear {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: opacity linear 150ms;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
  overflow-y: auto;
  height: 100vh;
  animation: appear 0.3s;

  & h1 {
    text-align: center;
    padding: 40px 0 20px 0;
    font-size: 24px;
    color: ${({ $theme }) => $theme?.colors?.text || 'white'};
    @media (max-width: 600px) {
      padding: 24px 0 12px 0;
      font-size: 20px;
    }
  }

  & p {
    padding: 0 30px;
    text-align: center;
    color: ${({ $theme }) => $theme?.colors?.textSecondary || '#ccc'};
    @media (max-width: 600px) {
      padding: 0 10px;
      font-size: 0.98rem;
    }
  }

  & button.close {
    display: none;

    &:hover {
      opacity: 1;
      background: ${({ $theme }) => $theme?.colors?.modal?.background || '#ffffff22'};
    }

    & svg {
      color: white;
      width: 1em;
      height: 1em;
    }

    @media (max-width: 600px) {
      margin: 0;
      border: none;
      z-index: 11;
      opacity: 0.75;
      transition: opacity 0.2s, background 0.2s;
      background: transparent;
      border-radius: 50%;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      right: 35px;
      top: 15px;
      width: 2.2em;
      height: 2.2em;
      background: rgba(0,0,0,0.1);
    }
  }
`

export function Modal({ children, onClose }: Props) {
  const { currentTheme } = useTheme();

  React.useEffect(() => {
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = oldOverflow
    }
  }, [])

  const ref = React.useRef<HTMLDivElement>(null!)

  useOutsideClick(ref, () => {
    if (onClose) onClose()
  })

  return (
    <StyledModal $theme={currentTheme}>
      <Container>
        <Wrapper $theme={currentTheme} ref={ref}>
          {onClose && (
            <button className="close" onClick={onClose} aria-label="Close modal">
              <Icon.Close2 />
            </button>
          )}
          {children}
        </Wrapper>
      </Container>
    </StyledModal>
  )
}
