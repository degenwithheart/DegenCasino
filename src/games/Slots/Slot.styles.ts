import styled from 'styled-components'

export const StyledSpinner = styled.div`
  @keyframes spinning {
    0% {
      top: 0;
      filter: blur(0px);
    }
    50% {
      filter: blur(2px);
    }
    100% {
      top: calc(var(--num-items) * -100%);
      filter: blur(0px);
    }
  }

  --num-items: 5;
  --spin-speed: .8s;

  position: absolute;
  width: 100%;
  height: 100%;

  transition: opacity .2s .1s ease;
  animation: spinning var(--spin-speed) .1s linear infinite;
  opacity: 0;

  &[data-spinning="true"] {
    opacity: 1;
    animation: spinning var(--spin-speed) .1s linear infinite,
               spinnerGlow 1.6s ease-in-out infinite alternate;
  }

  @keyframes spinnerGlow {
    0% { 
      filter: brightness(0.8) saturate(0.9); 
    }
    100% { 
      filter: brightness(1.1) saturate(1.1); 
    }
  }

  & > div {
    color: white;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 25px;
    background: 
      radial-gradient(
        circle at center,
        rgba(255, 255, 255, 0.12) 0%,
        transparent 70%
      );
  }

  & img {
    transition: all 0.3s ease;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
    max-width: 100%;
    max-height: 100%;
  }
`
