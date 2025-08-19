import React from 'react'
import { Icon } from './Icon'
import useOutsideClick from '../../hooks/useOutsideClick'
import styled from 'styled-components'

interface Props extends React.PropsWithChildren {
  onClose?: () => void
}

const Container = styled.div`
  display: flex;
  padding: 20px;
  min-height: calc(100vh - 6rem);
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    padding: 8px 0;
    min-height: 100vh;
    align-items: flex-start;
  }
`

const Wrapper = styled.div`
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
  max-width: min(100%, 460px);
  border-radius: 10px;
  flex: 1;
  padding-bottom: 20px;
  animation: wrapper-appear2 0.3s;
  color: white;

  @media (max-width: 600px) {
    max-width: 100vw;
    min-width: 0;
    border-radius: 0;
    padding-left: 0;
    padding-right: 0;
    padding-bottom: 12px;
    box-shadow: none;
    background: rgba(24, 24, 24, 1);
  }
`

const StyledModal = styled.div`
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
    @media (max-width: 600px) {
      padding: 24px 0 12px 0;
      font-size: 20px;
    }
  }

  & p {
    padding: 0 30px;
    text-align: center;
    @media (max-width: 600px) {
      padding: 0 10px;
      font-size: 0.98rem;
    }
  }

  & button.close {
    margin: 0;
    position: absolute;
    cursor: pointer;
    right: 15px;
    top: 25px;
    border: none;
    z-index: 11;
    opacity: 0.75;
    transition: opacity 0.2s, background 0.2s;
    background: transparent;
    border-radius: 50%;
    width: 2em;
    height: 2em;

    &:hover {
      opacity: 1;
      background: #ffffff22;
    }

    & svg {
      color: white;
      vertical-align: middle;
    }

    @media (max-width: 600px) {
      right: 8px;
      top: 8px;
      width: 2.2em;
      height: 2.2em;
      background: rgba(0,0,0,0.1);
    }
  }
`

export function Modal({ children, onClose }: Props) {
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
    <StyledModal>
      <Container>
        <Wrapper ref={ref}>
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
