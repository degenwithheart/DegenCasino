import React from 'react'
import styled, { css } from 'styled-components'

interface SliderProps {
  min: number
  max: number
  value: number
  range: [number, number]
  onChange: (value: number) => void
  disabled?: boolean
}

const Container = styled.div`
  position: relative;
  width: 100%;
`

const Wrapper = styled.div`
  position: relative;
  background: transparent;
  border-radius: clamp(8px, 1.25vh, 12px);
  transition: box-shadow .2s ease;
  height: clamp(14px, 2.5vh, 24px);
  opacity: 1;
  cursor: pointer;
`

const Track = styled.div`
  background: transparent;
  height: 100%;
  border-radius: clamp(8px, 1.25vh, 12px) 0 0 clamp(8px, 1.25vh, 12px);
`

const StyledSlider = styled.input`
  position: absolute;
  left: 0;
  top: 0;
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 100%;
  background: transparent;
  outline: none;
  background: none;
  border-radius: 10px;
  margin: 0;
  padding: 0;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: clamp(16px, 3vh, 28px);
    height: clamp(16px, 3vh, 28px);
    background: linear-gradient(135deg, #ffd700, #ff0066);
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid rgba(212, 165, 116, 0.8);
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.3),
      0 0 0 2px rgba(212, 165, 116, 0.2);
  }

  &::-moz-range-thumb {
    width: clamp(16px, 3vh, 28px);
    height: clamp(16px, 3vh, 28px);
    background: linear-gradient(135deg, #ffd700, #ff0066);
    cursor: pointer;
    border-radius: 50%;
    border: 2px solid rgba(212, 165, 116, 0.8);
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.3),
      0 0 0 2px rgba(212, 165, 116, 0.2);
  }
`

const Label = styled.div<{$active: boolean}>`
  margin-top: clamp(12px, 2vh, 20px);
  position: absolute;
  transform: translateX(-50%);
  text-align: center;
  background: rgba(10, 5, 17, 0.7);
  padding: clamp(3px, 0.8vh, 8px) clamp(4px, 1vw, 8px);
  border-radius: clamp(6px, 1vh, 12px);
  min-width: clamp(24px, 4vw, 40px);
  color: rgba(212, 165, 116, 0.7);
  transition: left .2s ease, color .2s ease;
  font-size: clamp(8px, 1.2vw, 12px);
  font-family: 'DM Sans', sans-serif;
  font-weight: 500;
  border: 1px solid rgba(212, 165, 116, 0.2);

  ${(props) => props.$active && css`
    color: var(--love-letter-gold);
    background: rgba(212, 165, 116, 0.15);
    border-color: rgba(212, 165, 116, 0.4);
  `}
`

function Slider ({ min: minValue, max: maxValue, value, onChange, disabled, range: [min, max] }: SliderProps) {
  const labels = Array.from({ length: 5 }).map((_, i, arr) => min + Math.floor(i / (arr.length - 1) * (max - min)))

  const change = (newValue: number) => {
    const fixedValue = Math.max(minValue, Math.min(maxValue, newValue))
    if (fixedValue !== value)
      onChange(fixedValue)
  }

  return (
    <Container>
      <Wrapper>
        <Track style={{ width: `calc(${value / max * 100}%)` }} />
        <StyledSlider
          type="range"
          value={value}
          disabled={disabled}
          min={min}
          max={max}
          onChange={(event) => change(Number(event.target.value))}
        />
      </Wrapper>
      {labels.map((label, i) => (
        <Label
          key={i}
          $active={value >= label}
          style={{ left: (label / max * 100) + '%' }}
        >
          {label}
        </Label>
      ))}
    </Container>
  )
}

export default Slider
