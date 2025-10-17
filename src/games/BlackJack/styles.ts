import styled, { css, keyframes } from 'styled-components';

const appear = keyframes`
  0% { transform: scale(.0) translateY(100px) rotateY(90deg); }
  100% { transform: scale(1) translateY(0) rotateY(0deg) }
`;

export const Container = styled.div<{ $disabled?: boolean; }>`
  user-select: none;
  transition: opacity .2s;
  ${({ $disabled }) => $disabled && css`
    pointer-events: none;
    opacity: .7;
  `}
`;

export const CardArea = styled.div`
  border: 2px solid rgba(255,255,255,0.12);
  border-radius: 10px;
  padding: 12px 14px;
  margin: 8px;
  width: 360px;
  min-height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255,255,255,0.02);
  backdrop-filter: blur(12px)
`;

export const Table = styled.div<{ $logo?: string; }>`
  /* felt background with optional centered logo image on top */
  background: ${props => props.$logo
    ? `url('${props.$logo}') center/contain no-repeat, radial-gradient(circle at 50% 10%, #2f8a3a, #1f6b2b 60%, #154b1b 100%)`
    : `radial-gradient(circle at 50% 10%, #2f8a3a, #1f6b2b 60%, #154b1b 100%)`} ;
  border-radius: 18px;
  padding: 24px;
  border: 3px solid rgba(0,0,0,0.45);
  box-shadow: 0 8px 30px rgba(0,0,0,0.6) inset, 0 10px 30px rgba(0,0,0,0.5);
  width: 760px;
  max-width: 96%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const TableInner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

/* TableLogo removed; logo is applied as background via the Table.$logo prop */

export const CardsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CardContainer = styled.div`
  margin: 0 5px;
  animation: ${appear} .25s cubic-bezier(0.5, 0.9, 0.35, 1.05);
`;

export const Card = styled.div<{ color: string; faceDown?: boolean; }>`
  height: 120px;
  font-size: 20px;
  border-radius: 8px;
  box-shadow: -5px 5px 10px 1px #0000003d;
  border: 1px solid #000;
  background: ${props => props.faceDown ? `url('/png/images/card.png') center/contain no-repeat` : 'white'};
  aspect-ratio: 4/6;
  position: relative;
  color: ${props => props.faceDown ? 'white' : (props.color || '#333')};
  .suit {
    position: absolute;
    font-size: 14px;
    &.top-left {
      top: 4px;
      left: 6px;
    }
    &.top-right {
      top: 4px;
      right: 6px;
      transform: rotate(180deg);
    }
    &.bottom-left {
      bottom: 4px;
      left: 6px;
    }
    &.bottom-right {
      bottom: 4px;
      right: 6px;
      transform: rotate(180deg);
    }
  }
  .rank {
    position: absolute;
    font-weight: bold;
    font-size: 34px;
    &.center {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;