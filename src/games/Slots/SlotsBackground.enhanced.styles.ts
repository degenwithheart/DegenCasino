import styled from 'styled-components'

export const StyledSlotsBackground = styled.div`
  perspective: 100px;
  user-select: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #53354a 100%);
  border-radius: 24px;
  border: 3px solid rgba(83, 53, 74, 0.3);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.7),
    inset 0 2px 4px rgba(255, 255, 255, 0.08),
    inset 0 -2px 4px rgba(0, 0, 0, 0.5),
    0 0 35px rgba(83, 53, 74, 0.2);
  overflow: hidden;
  z-index: 0;

  /* Floating slot icon background elements */
  &::before {
    content: '🎰';
    position: absolute;
    top: 12%;
    left: 7%;
    font-size: 120px;
    opacity: 0.07;
    transform: rotate(-15deg);
    pointer-events: none;
    color: #53354a;
    z-index: 0;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
  }

  &::after {
    content: '⭐️';
    position: absolute;
    bottom: 10%;
    right: 8%;
    font-size: 100px;
    opacity: 0.08;
    transform: rotate(18deg);
    pointer-events: none;
    color: #f9d923;
    z-index: 0;
    text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
  }

  /* Override GameScreenFrame's dark background */
  & .absolute.inset-\[2px\].rounded-\[0\.65rem\].bg-\[\#0c0c11\] {
    background: transparent !important;
  }

  /* General override for any dark background in the frame */
  & [class*="bg-[#0c0c11]"] {
    background: transparent !important;
  }
`;
