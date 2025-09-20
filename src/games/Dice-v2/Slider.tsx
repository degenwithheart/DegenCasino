import React from 'react'
import styled from 'styled-components'

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  padding: 10px 0;
`

const Slider = styled.input.attrs({ type: 'range' })`
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  -webkit-transition: .2s;
  transition: opacity .2s;

  &:hover {
    opacity: 1;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #000;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #000;
    cursor: pointer;
  }
`

interface CustomSliderProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
}

const CustomSlider: React.FC<CustomSliderProps> = ({ value, onChange, min, max, step = 1 }) => {
  return (
    <SliderContainer>
      <Slider
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
      />
    </SliderContainer>
  )
}

export default CustomSlider
