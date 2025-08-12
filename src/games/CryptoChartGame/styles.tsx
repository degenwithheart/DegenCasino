import styled from 'styled-components'
import React from 'react'

export const ScreenWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #065f46 0%, #047857 25%, #059669 50%, #10b981 75%, #6ee7b7 100%);
  border-radius: 24px;
  border: 3px solid rgba(5, 150, 105, 0.3);
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.5),
    inset 0 2px 4px rgba(255, 255, 255, 0.1),
    inset 0 -2px 4px rgba(0, 0, 0, 0.3),
    0 0 30px rgba(5, 150, 105, 0.2);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 8%;
    left: 10%;
    font-size: 120px;
    opacity: 0.08;
    transform: rotate(-15deg);
    pointer-events: none;
    color: #059669;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-size='60'%3E📈%3C/text%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    width: 120px;
    height: 120px;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 15%;
    right: 8%;
    font-size: 100px;
    opacity: 0.06;
    transform: rotate(20deg);
    pointer-events: none;
    color: #10b981;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-size='60'%3E💹%3C/text%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    width: 100px;
    height: 100px;
  }
`

export const ChartWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`

export const MultiplierText = styled.div<{ color: string }>`
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 24px;
  color: ${(props) => props.color || 'white'};
`

export const Grid = styled.rect.attrs(() => ({
  width: '100%',
  height: '100%',
  fill: 'none',
  stroke: '#333',
  'stroke-width': 0.5,
}))``

type CandleProps = {
  x: number
  open: number
  close: number
  high: number
  low: number
}

export const Candle: React.FC<CandleProps> = ({ x, open, close, high, low }) => (
  <g transform={`translate(${x * 3},0)`}>
    <line
      x1={0}
      y1={100 - high}
      x2={0}
      y2={100 - low}
      stroke="#ffffff"
      strokeWidth={1}
    />
    <rect
      x={-1.5}
      y={100 - Math.max(open, close)}
      width={3}
      height={Math.max(2, Math.abs(close - open))}
      fill={close > open ? '#00ff00' : '#ff0000'}
    />
  </g>
)
