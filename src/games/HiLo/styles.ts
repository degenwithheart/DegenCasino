import styled, { css, keyframes } from 'styled-components'

// Card flip animation
export const cardFlip = keyframes`
  0% { transform: rotateY(90deg) scale(0.7); opacity: 0.2; }
  60% { transform: rotateY(-10deg) scale(1.05); opacity: 1; }
  80% { transform: rotateY(5deg) scale(0.98); }
  100% { transform: rotateY(0deg) scale(1); opacity: 1; }
`;

export const payoutPanelAppear = keyframes`
  0% { opacity: 0; transform: translateY(30px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;

const appear = keyframes`
  0% { transform: scale(.0) translateY(100px) rotateY(90deg); }
  100% { transform: scale(1) translateY(0) rotateY(0deg) }
`

export const Container = styled.div<{ $disabled?: boolean }>`
  user-select: none;
  background: linear-gradient(135deg, #23234a 60%, #18182a 100%);
  border-radius: 24px;
  box-shadow: 0 8px 32px #0008;
  padding: 24px 18px 32px 18px;
  position: relative;
  min-height: 340px;
  transition: opacity .2s, box-shadow .3s;
  ${({ $disabled }) => $disabled && css`
    pointer-events: none;
    opacity: .7;
    filter: grayscale(0.2);
  `}
`

export const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  margin-top: 8px;
`

export const Option = styled.button<{ selected?: boolean }>`
  background: ${({ selected }) => selected ? 'linear-gradient(90deg, #ffe06655 0%, #ffe06622 100%)' : '#23234a'};
  border: ${({ selected }) => selected ? '2px solid #ffe066' : '2px solid transparent'};
  margin: 0;
  padding: 10px 18px;
  transition: all .2s cubic-bezier(.4,2,.6,1);
  display: flex;
  align-items: center;
  border-radius: 14px;
  cursor: pointer;
  font-size: 20px;
  color: ${({ selected }) => selected ? '#ffe066' : 'white'};
  font-weight: ${({ selected }) => selected ? 700 : 500};
  box-shadow: ${({ selected }) => selected ? '0 0 12px #ffe06688' : 'none'};
  filter: ${({ selected }) => selected ? 'drop-shadow(0 0 8px #ffe066)' : 'none'};
  position: relative;
  outline: none;
  & > div:first-child {
    font-size: 38px;
    filter: drop-shadow(-4px 4px 2px #00000066);
    margin-right: 10px;
    transition: filter 0.2s;
  }
  &:hover, &:focus {
    background: linear-gradient(90deg, #ffe06688 0%, #ffe06644 100%);
    color: #ffe066;
    box-shadow: 0 0 18px #ffe066cc;
    transform: scale(1.06);
    z-index: 2;
  }
`

export const Profit = styled.div`
  font-size: 20px;
  color: #23234a;
  position: absolute;
  right: 24px;
  bottom: -60px;
  border-radius: 12px;
  background: linear-gradient(90deg, #ffe066 0%, #fffbe6 100%);
  padding: 10px 24px;
  font-weight: 900;
  box-shadow: 0 0 16px #ffe06688;
  animation: ${appear} .25s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s, color 0.2s;
`

export const CardPreview = styled.div`
  display: flex;
  border-radius: 8px;
  gap: 8px;
  padding: 8px;
  margin-top: 30px;
  justify-content: center;
  background: rgba(255,255,255,0.03);
  & > div {
    transition: opacity .2s, box-shadow .2s, border .2s;
    cursor: pointer;
    border: 2px solid transparent;
    &:hover {
      border: 2px solid #ffe066;
      box-shadow: 0 0 8px #ffe06688;
      z-index: 2;
    }
  }
`

export const CardsContainer = styled.div`
  transition: transform .2s ease;
  perspective: 900px;
  display: flex;
  position: relative;
  justify-content: flex-end;
  align-items: center;
  min-height: 180px;
  margin-bottom: 8px;
`

export const CardContainer = styled.div<{ $isFlipped?: boolean; $isWinner?: boolean }>`
  position: absolute;
  bottom: 0;
  transition: transform .25s cubic-bezier(0.18, 0.89, 0.32, 1.28), opacity .25s ease;
  filter: drop-shadow(-10px 10px 0px #00000011);
  transform-origin: bottom;
  perspective: 900px;
  z-index: ${({ $isWinner }) => $isWinner ? 3 : 1};
  & > div {
    animation: ${cardFlip} .5s cubic-bezier(.4,2,.6,1);
    ${({ $isWinner }) => $isWinner && css`
      box-shadow: 0 0 32px 8px #ffe066cc, 0 0 0 4px #ffe06699;
      border: 2px solid #ffe066;
    `}
  }
`

export const Card = styled.div<{$small?: boolean}>`
  ${(props) => props.$small ? css`
    height: 35px;
    font-size: 15px;
    padding: 5px;
    border-radius: 4px;
  ` : css`
    height: 160px;
    font-size: 70px;
    padding: 10px;
    border-radius: 12px;
  `}
  box-shadow: -5px 5px 10px 1px #0000003d;
  background: white;
  aspect-ratio: 4/5.5;
  position: relative;
  color: #333;
  overflow: hidden;
  border: 2px solid transparent;
  transition: box-shadow 0.2s, border 0.2s;
  .rank {
    font-weight: bold;
    line-height: 1em;
    text-shadow: 0 2px 8px #ffe06644;
  }
  .suit {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 50%;
    height: 50%;
    background-size: cover;
    background-repeat: none;
    transform: translate(0%, 0%);
    font-size: 128px;
    opacity: .9;
    filter: drop-shadow(0 0 8px #ffe06644);
  }
`
const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`

export const PayoutPanel = styled.div<{ $option?: 'hi' | 'lo' }>`
  min-width: 220px;
  max-width: 260px;
  margin-left: 0;
  background: linear-gradient(135deg, #ffe06622 0%, #23234a 100%);
  border-radius: 18px;
  padding: 18px 12px;
  box-shadow: 0 2px 18px #0004;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #ffe06644;
  animation: ${payoutPanelAppear} 0.5s cubic-bezier(.4,2,.6,1);
  transition: background 0.2s;
  .payout-title {
    text-align: center;
    margin-bottom: 12px;
    font-weight: 900;
    color: #ffe066;
    font-size: 1.2rem;
    letter-spacing: 1px;
    text-shadow: 0 2px 8px #23234a;
  }
  .payout-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 6px;
    padding: 8px 14px;
    font-size: 16px;
    margin-bottom: 8px;
    font-weight: 500;
    background: ${({ $option }) => $option === 'hi' ? '#ffe06633' : '#23234a'};
    box-shadow: ${({ $option }) => $option === 'hi' ? '0 0 8px #ffe06688' : 'none'};
    border: ${({ $option }) => $option === 'hi' ? '2px solid #ffe066' : '2px solid transparent'};
    color: ${({ $option }) => $option === 'hi' ? '#ffe066' : '#fff'};
    transition: all 0.2s;
    &:last-child {
      background: ${({ $option }) => $option === 'lo' ? '#ffe06633' : '#23234a'};
      box-shadow: ${({ $option }) => $option === 'lo' ? '0 0 8px #ffe06688' : 'none'};
      border: ${({ $option }) => $option === 'lo' ? '2px solid #ffe066' : '2px solid transparent'};
      color: ${({ $option }) => $option === 'lo' ? '#ffe066' : '#fff'};
    }
  }
  .payout-desc {
    font-size: 13px;
    color: #bbb;
    text-align: center;
    margin-top: 12px;
    font-weight: 500;
  }
`

export const WarningMessage = styled.div`
  animation: ${float} 2s ease-in-out infinite;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateX(100%) translateY(-50%);
  background-color: rgba(255, 204, 0, 0.8);
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  color: black;
  white-space: nowrap;
  pointer-events: none;
`
