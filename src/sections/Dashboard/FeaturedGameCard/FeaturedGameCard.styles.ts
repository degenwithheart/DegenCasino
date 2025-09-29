import styled, { css } from 'styled-components'

export const StyledFeaturedGameCard = styled.div<{ $background: string; $colorScheme?: any }>`
  width: 100%;
  aspect-ratio: 1/.9;
  background: ${(props) => props.$background};
  border-radius: 14px;
  color: ${({ $colorScheme }) => $colorScheme?.colors?.text || 'white'};
  font-size: 26px;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${({ $colorScheme }) => $colorScheme?.colors?.primary || '#ffd700'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;

  .image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-size: 100% auto;
    background-position: center;
    background-repeat: no-repeat;
    opacity: 0.95;
    z-index: 0;
  }

  .featured-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: linear-gradient(90deg, #ffd700, #a259ff);
    color: #222;
    font-size: 0.95rem;
    font-weight: bold;
    border-radius: 8px;
    padding: 4px 12px;
    box-shadow: 0 0 12px #ffd70088;
    z-index: 2;
    font-family: 'Luckiest Guy', cursive, sans-serif;
    letter-spacing: 1px;
  }

  .play {
    position: absolute;
    right: 12px;
    bottom: 12px;
    background: linear-gradient(90deg, #ffd700, #a259ff);
    color: #222;
    font-weight: bold;
    border-radius: 8px;
    padding: 8px 18px;
    font-size: 15px;
    font-family: 'Luckiest Guy', cursive, sans-serif;
    letter-spacing: 1px;
    box-shadow: 0 0 16px #ffd70088;
    z-index: 2;
    opacity: 0;
    transition: all 0.2s;
  }

  &:hover .play {
    opacity: 0.95;
    transform: scale(1.05);
    box-shadow: 0 0 24px #ffd700cc;
  }

  .mode-overlay {
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: 10;
    font-size: 1.1rem;
    background: rgba(0,0,0,0.7);
    border-radius: 8px;
    padding: 0.25em 0.7em;
    color: #ffd700;
    font-weight: 700;
    letter-spacing: 1px;
    box-shadow: 0 2px 8px #000a;
    pointer-events: none;
    user-select: none;
    min-width: 48px;
    text-align: center;
  }
`;
